"use client";

import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  Stars,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { BOX_CENTER_Y, BOX_HALF, flameFragment, flameVertex } from "./flame-shaders";
import { useGravity } from "./gravity";

// Modelled in Blender for this project: a glass combustion chamber of the kind
// NASA burns fuel droplets in, with flanges, tie rods, gas fittings, fuel
// needles, igniters and a droplet held on crossed fibres.
const MODEL = "/models/combustion-chamber.glb";
// NASA photograph iss074e0521637: the Milky Way rising above Earth's
// atmospheric glow, taken from the space station (NASA/Chris Williams).
const SKY = "/nasa/milky-way-over-earth.jpg";
const SKY_ASPECT = 1920 / 1280;
const SKY_Z = -22;
const HALF_HEIGHT = 1.6;

/*
 * Where the chamber sits for each screen of the page, top to bottom: x as a
 * share of the view width (negative is left), y in scene units, and a size
 * multiplier. It always moves to the side the text is not on.
 */
const WAYPOINTS = [
  { x: 0.24, y: 0.2, size: 1.12 }, // hero
  { x: -0.23, y: 0, size: 1.5 }, // 01 shape: close on the flame
  { x: 0.25, y: 0.15, size: 1.0 }, // 02 detection
  { x: -0.25, y: 0, size: 1.2 }, // 03 airflow
  { x: 0.24, y: 0.1, size: 1.35 }, // 04 oxygen
  { x: -0.26, y: 0.1, size: 1.1 }, // 05 suppression
  { x: 0.27, y: 0.2, size: 0.9 }, // 06 record
  { x: 0.3, y: 0.1, size: 1.0 }, // 07 investigations
  { x: 0.3, y: 1.15, size: 0.7 }, // 08 the board
];

function waypointAt(screens: number) {
  const last = WAYPOINTS.length - 1;
  const f = THREE.MathUtils.clamp(screens, 0, last);
  const i = Math.min(Math.floor(f), last - 1);
  const k = THREE.MathUtils.smootherstep(f - i, 0, 1);
  const a = WAYPOINTS[i];
  const b = WAYPOINTS[i + 1];
  return {
    x: THREE.MathUtils.lerp(a.x, b.x, k),
    y: THREE.MathUtils.lerp(a.y, b.y, k),
    size: THREE.MathUtils.lerp(a.size, b.size, k),
  };
}

function scrollScreens() {
  return typeof window === "undefined" ? 0 : window.scrollY / window.innerHeight;
}

const EARTH_LIGHT = new THREE.Color("#ffb060");
const FREEFALL_LIGHT = new THREE.Color("#4f7dff");

/** Shared eased gravity value: 0 in freefall, 1 on Earth. */
function useEasedGravity() {
  const { target, consumeSnap } = useGravity();
  const current = useRef(0);
  useFrame((_, delta) => {
    if (consumeSnap()) {
      current.current = target.current ?? 0;
    } else {
      current.current = THREE.MathUtils.damp(current.current, target.current ?? 0, 2.4, delta);
    }
  }, -1);
  return current;
}

function Sky({ gravity }: { gravity: React.RefObject<number> }) {
  const texture = useTexture(SKY);
  const mesh = useRef<THREE.Mesh>(null);
  const { camera, viewport } = useThree();

  const sky = useMemo(() => {
    const map = texture.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.needsUpdate = true;
    return map;
  }, [texture]);

  useFrame((state, delta) => {
    const plane = mesh.current;
    if (!plane) return;
    // Size the photograph to cover the view at its depth, with room to pan.
    const distance = camera.position.z - SKY_Z;
    const viewH = (viewport.height / camera.position.z) * distance;
    const viewW = (viewport.width / camera.position.z) * distance;
    const height = Math.max(viewH, viewW / SKY_ASPECT) * 1.45;
    plane.scale.set(height * SKY_ASPECT, height, 1);
    // Freefall looks up into the galaxy. Earth brings the horizon up into view.
    const pan = (height - viewH) / 2;
    const g = gravity.current ?? 0;
    // Scrolling the page slowly carries the view from the galaxy down toward the planet.
    const travel = THREE.MathUtils.clamp(scrollScreens() / (WAYPOINTS.length - 1), 0, 1);
    const freefallY = THREE.MathUtils.lerp(-pan * 0.9, pan * 0.35, travel);
    const y = THREE.MathUtils.lerp(freefallY, pan * 0.9, g);
    plane.position.y = THREE.MathUtils.damp(plane.position.y, y - state.pointer.y * 0.25, 2.5, delta);
    plane.position.x = THREE.MathUtils.damp(
      plane.position.x,
      -state.pointer.x * 0.4 + (travel - 0.5) * 1.2,
      2.5,
      delta,
    );
    // The sky turns a little as you travel, the way it does from orbit.
    plane.rotation.z = THREE.MathUtils.damp(plane.rotation.z, (travel - 0.5) * 0.12, 2, delta);
  });

  return (
    <mesh ref={mesh} position={[0, 0, SKY_Z]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={sky} toneMapped={false} color="#d8d8d8" />
    </mesh>
  );
}

function Chamber({ gravity }: { gravity: React.RefObject<number> }) {
  const { scene } = useGLTF(MODEL);
  const { viewport, size } = useThree();
  const rig = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const flameMaterial = useRef<THREE.ShaderMaterial>(null);
  const flameLight = useRef<THREE.PointLight>(null);
  const placed = useRef(false);
  const spin = useRef(0.7);

  const { parts, glassGeometry } = useMemo(() => {
    const clone = scene.clone(true);
    let glass: THREE.BufferGeometry | undefined;
    clone.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.name === "Glass") {
        // The glass is redrawn below with a refracting material.
        glass = mesh.geometry;
        mesh.visible = false;
        return;
      }
      const material = (mesh.material as THREE.MeshStandardMaterial).clone();
      material.envMapIntensity = 1.35;
      mesh.material = material;
    });
    return { parts: clone, glassGeometry: glass };
  }, [scene]);

  const flameUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGravity: { value: 0 },
      uBoxHalf: { value: new THREE.Vector3(...BOX_HALF) },
      uBoxCenterY: { value: BOX_CENTER_Y },
    }),
    [],
  );

  const wide = size.width >= 1024;

  useFrame((state, delta) => {
    const g = gravity.current ?? 0;
    const floating = 1 - g;
    const t = state.clock.elapsedTime;

    const flame = flameMaterial.current;
    if (flame) {
      flame.uniforms.uTime.value = t;
      flame.uniforms.uGravity.value = g;
    }

    const flicker = 1 + g * (0.06 * Math.sin(t * 9.7) + 0.035 * Math.sin(t * 23.1));
    const light = flameLight.current;
    if (light) {
      light.color.copy(FREEFALL_LIGHT).lerp(EARTH_LIGHT, g);
      light.intensity = THREE.MathUtils.lerp(5, 22, g) * flicker;
      light.position.y = THREE.MathUtils.lerp(0, 0.4, g);
    }

    const root = rig.current;
    const tumble = body.current;
    if (!root || !tumble) return;

    // The chamber travels with the reader: one waypoint per screen of the page.
    const way = waypointAt(scrollScreens());
    const scale = (wide ? way.size : 0.62) * (viewport.height / 6.43);
    const x = wide ? viewport.width * way.x : 0;
    // In freefall the chamber drifts. On Earth it drops and stands on the floor
    // of the page, where the headline letters land too.
    const floatY = (wide ? way.y : viewport.height * 0.2) + 0.1 * Math.sin(t * 0.5);
    const restY = -viewport.height / 2 + HALF_HEIGHT * scale + viewport.height * 0.1;
    const y = THREE.MathUtils.lerp(floatY, restY, g);

    if (!placed.current) {
      root.position.set(x, y, 0);
      root.scale.setScalar(scale);
      placed.current = true;
    }
    root.position.x = THREE.MathUtils.damp(root.position.x, x, 3, delta);
    root.position.y = THREE.MathUtils.damp(root.position.y, y, 4, delta);
    root.scale.setScalar(THREE.MathUtils.damp(root.scale.x, scale, 3, delta));

    // It turns as it travels, so every section shows a different side of it.
    spin.current += delta * (0.1 + 0.12 * floating);
    const turn = scrollScreens() * 0.9;
    tumble.rotation.y = spin.current + turn + state.pointer.x * 0.25;
    tumble.rotation.z = THREE.MathUtils.damp(
      tumble.rotation.z,
      floating * (0.3 + 0.06 * Math.sin(t * 0.31)),
      3,
      delta,
    );
    tumble.rotation.x = THREE.MathUtils.damp(
      tumble.rotation.x,
      floating * (-0.2 + 0.05 * Math.sin(t * 0.23)) - state.pointer.y * 0.08,
      3,
      delta,
    );
  });

  return (
    <group ref={rig}>
      <group ref={body}>
        <primitive object={parts} />
        <pointLight ref={flameLight} distance={7} decay={2} />

        {/* The flame: a box the shader ray-marches through */}
        <mesh position={[0, BOX_CENTER_Y, 0]}>
          <boxGeometry args={[BOX_HALF[0] * 2, BOX_HALF[1] * 2, BOX_HALF[2] * 2]} />
          <shaderMaterial
            key={flameFragment}
            ref={flameMaterial}
            vertexShader={flameVertex}
            fragmentShader={flameFragment}
            uniforms={flameUniforms}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Real glass: it bends the flame, the stars and the galaxy behind it */}
        {glassGeometry && (
          <mesh geometry={glassGeometry}>
            <MeshTransmissionMaterial
              samples={6}
              resolution={768}
              transmission={1}
              thickness={0.28}
              roughness={0.015}
              ior={1.47}
              chromaticAberration={0.045}
              anisotropicBlur={0.08}
              distortion={0}
              temporalDistortion={0}
              backside
              backsideThickness={0.28}
              color="#ffffff"
              envMapIntensity={1.6}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

function Scene() {
  const gravity = useEasedGravity();
  return (
    <>
      <Sky gravity={gravity} />
      <Stars radius={16} depth={8} count={900} factor={1.6} saturation={0} fade speed={0.5} />
      <Chamber gravity={gravity} />
    </>
  );
}

useGLTF.preload(MODEL);
useTexture.preload(SKY);

export default function FlameCanvas() {
  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 12], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      eventSource={typeof document === "undefined" ? undefined : document.body}
      eventPrefix="client"
    >
      <color attach="background" args={["#030304"]} />
      {/*
        Lit the way hardware is lit in orbit: one hard, white sun, a faint
        green-gold glow from the planet below, and black everywhere else.
      */}
      <Environment resolution={256}>
        <color attach="background" args={["#020203"]} />
        <Lightformer form="rect" intensity={14} position={[-7, 6, 5]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[6, 1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[0.6, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[0, -6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} color="#c9cf9a" />
      </Environment>
      <directionalLight position={[-6, 6, 7]} intensity={3.2} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      {/* Photographic finish: highlights bloom like a lens, then a filmic curve, vignette and grain. */}
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={0.55} luminanceThreshold={1} luminanceSmoothing={0.05} radius={0.8} levels={8} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.32} darkness={0.55} />
        <Noise blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.22} />
      </EffectComposer>
    </Canvas>
  );
}
