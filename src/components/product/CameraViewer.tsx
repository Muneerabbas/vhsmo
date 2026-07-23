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
import type { ProductImage } from "@/lib/products";

// Meshopt-compressed build of vhsmo.glb (4.88 MB -> 783 KB), generated with:
//   npx @gltf-transform/cli optimize public/models/vhsmo.glb \
//     public/models/vhsmo-opt.glb --compress meshopt --no-palette \
//     --no-join --no-simplify
// The three opt-outs keep every material and draw call exactly as authored;
// re-run this whenever vhsmo.glb is re-exported. useGLTF decodes meshopt itself.
const MODEL_URL = "/models/vhsmo-opt.glb";

/**
 * The one material that carries the shell colour, and the only thing that
 * differs between the Pink, Black and Red exports - see the note on
 * ColorVariant.body. The name is a CAD appearance-library label carried
 * through the CAD -> Blender -> glTF conversion, so it is stable across
 * re-exports of the same part but would not survive the part being rebuilt
 * from scratch; hence the dev warning if it ever goes missing.
 */
const BODY_MATERIAL_NAME = "Opaque(191,126,171).001";

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

/**
 * Framing, derived rather than dialled in by eye. CameraModel normalises the
 * GLB so its longest axis is exactly 3 units; after the -90° X stand-up that
 * axis is the body's width, and the height works out at 2.27 units.
 *
 * At fov 32 the frame is 2·r·tan(16°) tall, so radius picks the fill directly:
 *   r 6.4 -> 4.89 x 3.67 units visible -> body fills 61% wide, 62% tall
 *   r 5.0 -> 3.82 x 2.87 units visible -> body fills 78% wide, 79% tall
 * 6.4 left a ~19% empty band on every side, which read as dead white space
 * around a small object rather than as a product shot.
 *
 * 5.0 is as tight as it goes safely: orbiting swings the widest silhouette to
 * the width/depth diagonal, 3.26 units, and that still only spans 85% of the
 * frame - so the body never touches the edge at any angle. Going below ~4.6
 * starts clipping mid-spin.
 */
export const DEFAULT_VIEW: ModelView = { azimuth: 0, polar: 1.35, radius: 5 };

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
function StudioEnvironment({ intensity }: { intensity: number }) {
  return (
    // environmentIntensity is scene.environmentIntensity - a shade-time
    // multiplier, so per-finish dimming works even though the cubemap itself
    // is baked once (frames={1}).
    <Environment resolution={256} frames={1} environmentIntensity={intensity}>
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

/**
 * Repaint the shell. Deliberately separate from conditionMaterials, which
 * self-guards against re-running: useGLTF caches the parsed scene, so these
 * material instances outlive the component and the colour has to be re-applied
 * on every change rather than once per mount.
 *
 * `Color.set` reads the hex as sRGB and converts into three's linear working
 * space, which is the same space glTF's baseColorFactor is authored in - so
 * the value that lands here is the one the exporter wrote.
 */
function paintBody(root: THREE.Object3D, hex: string) {
  let found = false;

  root.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      if (material?.name !== BODY_MATERIAL_NAME) continue;
      found = true;
      const std = material as THREE.MeshStandardMaterial;
      // No needsUpdate: colour is a uniform, not a shader-recompile trigger.
      std.color.set(hex);
    }
  });

  if (!found && process.env.NODE_ENV !== "production") {
    console.warn(
      `[CameraViewer] No material named "${BODY_MATERIAL_NAME}" in ${MODEL_URL} - ` +
        "the model renders in its as-exported colour and the swatches no longer " +
        "drive it. The GLB was probably re-exported with renamed materials.",
    );
  }
}

/** Normalisation computed from the GLB's own bounds - see CameraModel. */
interface Fit {
  scale: number;
  offset: THREE.Vector3;
}

/** The GLB, normalised to a ~3-unit box centred on the origin so camera
 *  distances and shadow placement don't depend on the export's raw scale. */
function CameraModel({ bodyColor }: { bodyColor: string }) {
  const { scene } = useGLTF(MODEL_URL);
  const { invalidate } = useThree();

  const { scale, offset } = useMemo(() => {
    // useGLTF caches the parsed scene, and <primitive scale={...}> writes that
    // scale onto the cached object - so on a remount (switching the gallery
    // back to 3D) we would be measuring an already-normalised model and
    // dividing 3 by 3, dropping the scale to 1 and rendering the raw CAD size.
    // Measure once, from a pristine transform, and keep the result with the
    // object so every later mount reuses it.
    const cached = scene.userData.__fit as Fit | undefined;
    if (cached) return cached;

    // Local space: the primitive's ancestors supply the stand-up rotations, and
    // on a remount `scene` may still be parented to the outgoing group.
    scene.position.set(0, 0, 0);
    scene.scale.set(1, 1, 1);

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3 / Math.max(size.x, size.y, size.z);
    const fit: Fit = { scale: s, offset: center.multiplyScalar(-s) };
    scene.userData.__fit = fit;
    return fit;
  }, [scene]);

  // Before first paint, so the model is never shown with the raw materials -
  // and, on a swatch change, never for a frame in the outgoing colour.
  useLayoutEffect(() => {
    conditionMaterials(scene);
    paintBody(scene, bodyColor);
    invalidate();
  }, [scene, bodyColor, invalidate]);

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
 * Drives the on-demand frameloop. The canvas renders zero frames unless the
 * user is orbiting (drei's controls invalidate on change) or auto-rotate is on
 * (only while the section is actually on screen).
 */
function Rig({
  autoRotate,
  controlsRef,
}: {
  autoRotate: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (autoRotate) invalidate();
  }, [autoRotate, invalidate]);

  useFrame(() => {
    const controls = controlsRef.current;
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

/** Static fallback for devices without WebGL - the selected finish's own hero
 *  shot, so a device that can't render the model still can't show you the
 *  wrong colour. */
function NoWebGLFallback({ hero }: { hero: ProductImage }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image src={hero.src} alt={hero.alt} fill className="object-cover" />
    </div>
  );
}

export interface CameraViewerProps {
  /** sRGB hex for the shell - the selected colourway's `body`. */
  bodyColor: string;
  /** Multiplier on the whole lighting rig - the colourway's `lightScale`.
   *  1 is the studio default; dark finishes pass less to avoid reading
   *  over-lit. */
  lightScale?: number;
  /** Shown instead of the canvas when WebGL is unavailable. */
  poster: ProductImage;
  /** Slow idle spin - pass false when the section is off screen. */
  autoRotate: boolean;
  /** Fired on first pointer interaction with the model. */
  onInteract?: () => void;
}

export default function CameraViewer({
  bodyColor,
  lightScale = 1,
  poster,
  autoRotate,
  onInteract,
}: CameraViewerProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
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
          toneMappingExposure: 1.2,
        }}
        fallback={<NoWebGLFallback hero={poster} />}
        aria-label="Interactive 3D model of the VHSMO camera. Drag to rotate, scroll to zoom."
        role="img"
      >
        <StudioEnvironment intensity={lightScale} />

        {/* The environment carries the lighting. These are shaping only.
            Ambient is deliberately tiny: it is flat, directionless white and
            is the single most desaturating light in any rig. */}
        <ambientLight intensity={0.05 * lightScale} />
        {/* Key - the only light doing real modelling on the body. */}
        <directionalLight position={[5, 7, 4]} intensity={0.5 * lightScale} />
        {/* Cool rim, slightly up: separates the silhouette and makes the warm
            pink read warmer by contrast rather than by adding more light. */}
        <directionalLight
          position={[-6, 3, -5]}
          intensity={0.3 * lightScale}
          color="#dfe8ff"
        />

        <Suspense fallback={null}>
          <CameraModel bodyColor={bodyColor} />
          {/* The body is centred on the origin and 2.27 units tall, so its
              base sits at -1.14; the plane goes just under that. It used to be
              at -1.35, which both floated the camera above its own shadow and,
              at the new radius, would have pushed the shadow into the bottom
              edge of the frame. Scale down with it - 9 units of plane baked
              into a 512 map spent two thirds of the texture on empty floor. */}
          <ContactShadows
            position={[0, -1.16, 0]}
            opacity={0.4}
            scale={5}
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
          onStart={() => onInteract?.()}
          makeDefault
        />
        <Rig autoRotate={autoRotate} controlsRef={controlsRef} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(MODEL_URL);
