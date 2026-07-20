"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ContactShadows,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Image from "next/image";
import { cameraProduct } from "@/lib/products";

const MODEL_URL = "/models/camera-opt.glb";

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

/** The GLB, normalised to a ~3-unit box centred on the origin so camera
 *  distances and shadow placement don't depend on the export's raw scale. */
function CameraModel() {
  const { scene } = useGLTF(MODEL_URL);

  const { scale, offset } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const s = 3 / Math.max(size.x, size.y, size.z);
    return { scale: s, offset: center.multiplyScalar(-s) };
  }, [scene]);

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
          alpha: true,
          powerPreference: "high-performance",
        }}
        fallback={<NoWebGLFallback />}
        aria-label="Interactive 3D model of the VHSMO camera. Drag to rotate, scroll to zoom."
        role="img"
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[5, 7, 4]} intensity={1.6} />
        <directionalLight position={[-6, 3, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <CameraModel />
          <ContactShadows
            position={[0, -1.35, 0]}
            opacity={0.35}
            scale={9}
            blur={2.6}
            far={3}
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
