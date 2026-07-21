"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Image from "next/image";
import { cameraProduct } from "@/lib/products";

// Meshopt-compressed build of vhsmo.glb (4.88 MB -> 783 KB), generated with:
//   npx @gltf-transform/cli optimize public/models/vhsmo.glb \
//     public/models/vhsmo-opt.glb --compress meshopt --no-palette \
//     --no-join --no-simplify
// The three opt-outs keep every material and draw call exactly as authored;
// re-run this whenever vhsmo.glb is re-exported. useGLTF decodes meshopt itself.
const MODEL_URL = "/models/vhsmo-opt.glb";

/**
 * Environment sampling is split by material class, because a single global
 * value can't satisfy both halves of the brief.
 *
 * A metal shows nothing but reflections, so it wants a strong envMap. A
 * dielectric (the pink body, the plastics) reflects the environment as a broad
 * achromatic sheen on top of its albedo - that white veil is what drains the
 * pink toward grey. Dropping it only on the dielectrics restores body
 * saturation while leaving the metals exactly as reflective as they are now.
 */
const ENV_MAP_INTENSITY_METAL = 1.25;
const ENV_MAP_INTENSITY_DIELECTRIC = 0.42;

/** metalness above this counts as a metal for the split above. */
const METAL_CUTOFF = 0.5;

/** The exporter wrote KHR_materials_specular.specularFactor = 0 onto nearly
 *  every material (a CAD -> Blender -> glTF conversion artifact, see the note
 *  in conditionMaterials). Set false to trust the file as-authored. */
const REPAIR_ZERO_SPECULAR = true;

/** Spherical camera position around the model, radians. */
export interface ModelView {
  azimuth: number;
  polar: number;
  radius: number;
}

export const DEFAULT_VIEW: ModelView = { azimuth: 0, polar: 1.35, radius: 6.4 };

function viewToVec3(view: ModelView) {
  return new THREE.Vector3().setFromSpherical(
    new THREE.Spherical(view.radius, view.polar, view.azimuth),
  );
}

/**
 * Softbox rig rendered into an off-screen cubemap and used as scene.environment.
 *
 * This is what makes the metals show up at all: "Aluminum_-_Polished",
 * "Steel_-_Satin" and friends omit metallicFactor in the GLB, so glTF's default
 * of 1.0 applies. A full metal has no diffuse term - three computes
 * `diffuseColor * (1 - metalness)` = 0 - so every photon it shows you is a
 * reflection. With no scene.environment there is nothing to reflect and the
 * part renders black, which is exactly the symptom. Blender never shows this
 * because its world always supplies an IBL, even the default grey one.
 *
 * Lightformers rather than an HDRI file because it costs no network request
 * (drei's `preset` pulls a few MB off a CDN at runtime), renders once into a
 * 256px cube, and lets the reflections be art-directed: the two tall vertical
 * strips are what draw the crisp parallel highlights down a cylindrical lens
 * barrel that read as "product shot" rather than "3D model".
 */
function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={1}>
      {/* Dark surround. Metal is a mirror: against a white world it flattens
          into light grey plastic. The contrast between this and the softboxes
          is the entire read of the material. */}
      <color attach="background" args={["#141417"]} />

      {/* The rebalance below is not a uniform dim. Emitter area, not just
          intensity, decides where the energy lands: a broad softbox subtends a
          huge solid angle so it dominates the diffuse irradiance that washes
          the body out, while a thin strip contributes almost no diffuse but
          produces the sharp specular streak that sells polished metal. So the
          broad emitters come down hard and the strips stay where they were -
          the body desaturates far less than the metal dims. */}

      {/* Key - broad overhead softbox. 4 -> 2.2, the largest single source of
          the achromatic wash across the pink. */}
      <Lightformer
        form="rect"
        intensity={2.8}
        color="#ffffff"
        position={[0, 5, 2]}
        scale={[10, 10, 1]}
      />

      {/* Signature vertical strips - unchanged. These ARE the metal. */}
      <Lightformer
        form="rect"
        intensity={6}
        color="#ffffff"
        position={[-5, 1, 1]}
        scale={[0.6, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={4.5}
        color="#eaf2ff"
        position={[5, 1, 1]}
        scale={[0.4, 8, 1]}
      />

      {/* Fill - 1.1 -> 0.5. Large and frontal, so it was flattening the body's
          shading gradient as well as desaturating it. */}
      <Lightformer
        form="rect"
        intensity={0.5}
        color="#cfd8e6"
        position={[-4, 0, 5]}
        scale={[8, 6, 1]}
      />

      {/* Rim / kicker - 3.5 -> 2.0. Still defines the silhouette edge. */}
      <Lightformer
        form="rect"
        intensity={2}
        color="#fff4e6"
        position={[0, 2, -6]}
        scale={[8, 4, 1]}
      />

      {/* Floor bounce - 0.7 -> 0.35, enough that the underside is dark
          rather than dead. */}
      <Lightformer
        form="rect"
        intensity={0.35}
        color="#ffffff"
        position={[0, -4, 1]}
        scale={[8, 8, 1]}
      />
    </Environment>
  );
}

/**
 * In-place repair of the loaded GLB materials. Nothing is replaced or
 * re-instantiated - we only correct properties the export got wrong and opt
 * every material into the environment map.
 */
function conditionMaterials(root: THREE.Object3D) {
  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

    for (const material of materials) {
      // useGLTF caches the parsed scene, so this runs again on every remount
      // against the same material instances. Guard it.
      if (!material || material.userData.__conditioned) continue;
      material.userData.__conditioned = true;

      const std = material as THREE.MeshStandardMaterial;
      if (!std.isMeshStandardMaterial) continue;

      // Reflection strength, split by material class - see the constants.
      std.envMapIntensity =
        std.metalness > METAL_CUTOFF
          ? ENV_MAP_INTENSITY_METAL
          : ENV_MAP_INTENSITY_DIELECTRIC;

      // KHR_materials_specular -> MeshPhysicalMaterial.specularIntensity.
      // The file carries specularFactor: 0 on nine of ten materials. In
      // three's physical shader that computes to
      //   specularColor = F0 * specularIntensity   -> 0
      //   specularF90   = mix(specularIntensity, 1, metalness)
      // so for the dielectrics (metalness 0) it deletes the specular lobe
      // outright: the plastics and the body get no highlight and no reflection
      // and render as flat Lambertian. The metals survive it because the
      // metalness mix restores F90 and F0 comes from baseColor.
      //
      // The material names ("Tough_2000_(with_Formlabs_SLA_3D_Printers)",
      // "Aluminum_-_Polished") are CAD appearance-library names, so this went
      // CAD -> Blender -> glTF and the zero is a mapping artifact, not intent -
      // consistent with it looking right to you in Blender.
      const phys = material as THREE.MeshPhysicalMaterial;
      if (
        REPAIR_ZERO_SPECULAR &&
        phys.isMeshPhysicalMaterial &&
        phys.specularIntensity === 0
      ) {
        phys.specularIntensity = 1;
      }

      // Keep PBR output inside the tone mapper (default, asserted because a
      // stray toneMapped=false is a common cause of blown-out metal).
      std.toneMapped = true;

      std.needsUpdate = true;
    }
  });
}

/** The GLB, normalised to a ~3-unit box centred on the origin so camera
 *  distances and shadow placement don't depend on the export's raw scale. */
function CameraModel() {
  const { scene } = useGLTF(MODEL_URL);
  const { invalidate } = useThree();

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3 / Math.max(size.x, size.y, size.z);
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

  // Before first paint, so the model is never shown with the raw materials.
  useLayoutEffect(() => {
    conditionMaterials(scene);
    invalidate();
  }, [scene, invalidate]);

  return (
    // The GLB is exported lying down - stand it up (-90° X), then yaw 180°
    // so azimuth 0 faces the lens, not the viewfinder. Centering is computed
    // from the bbox rather than drei's <Center>, which re-measures on
    // remount and can race the loader.
    <group rotation={[0, Math.PI, 0]}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group position={offset}>
          <primitive object={scene} scale={scale} />
        </group>
      </group>
    </group>
  );
}

/**
 * Drives the on-demand frameloop. The canvas renders zero frames unless:
 *  - the user is orbiting (drei's controls invalidate on change),
 *  - we're gliding to a selected feature view, or
 *  - auto-rotate is on (only while the section is actually on screen).
 */
interface GlideTarget {
  position: THREE.Vector3;
  startedAt: number;
}

function Rig({
  view,
  autoRotate,
  glideRef,
  controlsRef,
}: {
  view: ModelView | null;
  autoRotate: boolean;
  glideRef: React.RefObject<GlideTarget | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { camera, invalidate } = useThree();

  useEffect(() => {
    if (!view) return;
    glideRef.current = {
      position: viewToVec3(view),
      startedAt: performance.now(),
    };
    invalidate();
  }, [view, glideRef, invalidate]);

  useEffect(() => {
    if (autoRotate) invalidate();
  }, [autoRotate, invalidate]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    const glide = glideRef.current;

    if (glide) {
      // Pause the idle spin while gliding - otherwise auto-rotate pushes the
      // camera away from the target every frame and the glide never lands,
      // which reads as the controls being locked.
      if (controls) controls.autoRotate = false;
      camera.position.lerp(glide.position, Math.min(1, delta * 5));
      controls?.update();
      // Done when we've arrived - or bail after 2s so a target the controls'
      // constraints won't allow can never hold the camera hostage.
      if (
        camera.position.distanceTo(glide.position) < 0.02 ||
        performance.now() - glide.startedAt > 2000
      ) {
        glideRef.current = null;
      }
      invalidate();
      return;
    }

    if (controls) controls.autoRotate = autoRotate;
    if (autoRotate) {
      controls?.update();
      invalidate();
    }
  });

  return null;
}

/** Load progress overlay, rendered in plain DOM above the canvas. */
function LoadingVeil() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      <p className="font-marker -rotate-2 bg-kodak px-3 py-1 text-sm text-darkroom">
        developing… {Math.round(progress)}%
      </p>
    </div>
  );
}

/** Static fallback for devices without WebGL. */
function NoWebGLFallback() {
  const hero = cameraProduct.images[0]!;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
    </div>
  );
}

export interface CameraViewerProps {
  /** Glide the camera here when it changes (feature selection). */
  view: ModelView | null;
  /** Slow idle spin - pass false when the section is off screen. */
  autoRotate: boolean;
  /** Fired on first pointer interaction with the model. */
  onInteract?: () => void;
}

export default function CameraViewer({ view, autoRotate, onInteract }: CameraViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const glideRef = useRef<GlideTarget | null>(null);
  const initial = useMemo(() => viewToVec3(DEFAULT_VIEW), []);

  return (
    <div className="relative h-full w-full">
      <LoadingVeil />
      <Canvas
        frameloop="demand"
        dpr={[1, 1.75]}
        camera={{ position: initial, fov: 32, near: 0.1, far: 60 }}
        gl={{
          antialias: true,
          preserveDrawingBuffer: true, // TEMP: pixel measurement
          // Transparent by default - no <color attach="background"> on the
          // root scene, so the page shows through. The dark surround above
          // lives only inside the environment cubemap.
          alpha: true,
          powerPreference: "high-performance",
          // R3F already applies both of these (SRGBColorSpace unless `linear`,
          // ACESFilmic unless `flat`) - stated explicitly so a future `flat`
          // or `linear` prop can't silently strip the PBR pipeline.
          outputColorSpace: THREE.SRGBColorSpace,
          // Khronos PBR Neutral, not ACES. ACES has a strong "path to white":
          // as a colour brightens it is pulled toward neutral, which is what
          // was bleaching the pink body even though nothing was clipping.
          // Neutral was designed for product/e-commerce viewers - it rolls
          // highlights off without touching the hue or chroma of the albedo,
          // so the body renders the pink that's actually in the GLB.
          // Swap back to THREE.ACESFilmicToneMapping for a filmic look.
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.0,
        }}
        fallback={<NoWebGLFallback />}
        aria-label="Interactive 3D model of the VHSMO camera. Drag to rotate, scroll to zoom."
        role="img"
      >
        <StudioEnvironment />

        {/* The environment carries the lighting. These are shaping only.
            Ambient is deliberately tiny: it is flat, directionless white and
            is the single most desaturating light in any rig. */}
        <ambientLight intensity={0.05} />
        {/* Key - the only light doing real modelling on the body. */}
        <directionalLight position={[5, 7, 4]} intensity={0.5} />
        {/* Cool rim, slightly up: separates the silhouette and makes the warm
            pink read warmer by contrast rather than by adding more light. */}
        <directionalLight position={[-6, 3, -5]} intensity={0.3} color="#dfe8ff" />

        <Suspense fallback={null}>
          <CameraModel />
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.4}
            scale={9}
            blur={2.4}
            far={3}
            resolution={512}
            color="#0a0a0c"
            frames={1}
          />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={4}
          maxDistance={9}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotateSpeed={0.8}
          onStart={() => {
            // The user grabbed the model - any in-flight glide yields
            // immediately instead of fighting the drag.
            glideRef.current = null;
            onInteract?.();
          }}
          makeDefault
        />
        <Rig
          view={view}
          autoRotate={autoRotate}
          glideRef={glideRef}
          controlsRef={controlsRef}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
