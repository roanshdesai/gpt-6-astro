"use client";

import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

import { BOX_CENTER_Y, BOX_HALF, flameFragment, flameVertex } from "@/components/scene/flame-shaders";

// The same chamber as Home, modelled in Blender for this project.
const MODEL = "/models/combustion-chamber.glb";

function Chamber({ still }: { still: boolean }) {
  const { scene } = useGLTF(MODEL);
  const body = useRef<THREE.Group>(null);
  const flame = useRef<THREE.ShaderMaterial>(null);

  const parts = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (!mesh.isMesh) return;
      if (mesh.name === "Glass") {
        // A light, clear glass: this small view has nothing behind it to bend.
        mesh.material = new THREE.MeshPhysicalMaterial({
          color: "#c9d8ff",
          transparent: true,
          opacity: 0.1,
          roughness: 0.04,
          metalness: 0,
          envMapIntensity: 1.8,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        return;
      }
      const material = (mesh.material as THREE.MeshStandardMaterial).clone();
      material.envMapIntensity = 1.3;
      mesh.material = material;
    });
    return clone;
  }, [scene]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uGravity: { value: 0 },
      uBoxHalf: { value: new THREE.Vector3(...BOX_HALF) },
      uBoxCenterY: { value: BOX_CENTER_Y },
    }),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (flame.current) flame.current.uniforms.uTime.value = t;
    const group = body.current;
    if (!group || still) return;
    // It drifts and turns slowly, the way it does in freefall on Home.
    group.rotation.y += delta * 0.28;
    group.rotation.z = 0.26 + 0.05 * Math.sin(t * 0.31);
    group.rotation.x = -0.16 + 0.04 * Math.sin(t * 0.23);
    group.position.y = 0.06 * Math.sin(t * 0.5);
  });

  return (
    <group ref={body} rotation={[-0.16, 0.7, 0.26]} scale={0.9}>
      <primitive object={parts} />
      <pointLight color="#4f7dff" intensity={5} distance={7} decay={2} />
      {/* The flame: a box the shader ray-marches through */}
      <mesh position={[0, BOX_CENTER_Y, 0]}>
        <boxGeometry args={[BOX_HALF[0] * 2, BOX_HALF[1] * 2, BOX_HALF[2] * 2]} />
        <shaderMaterial
          ref={flame}
          vertexShader={flameVertex}
          fragmentShader={flameFragment}
          uniforms={uniforms}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL);

/**
 * A small live view of the combustion chamber with a freefall flame, for the
 * centre of the dashboard's ring. It is a simulation and is labelled as one
 * where it is used. It sits inside a gauge, never behind a chart.
 */
export default function ChamberCanvas() {
  const still = useReducedMotion() ?? false;
  return (
    <Canvas
      flat
      camera={{ position: [0, 0, 9.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Environment resolution={128}>
        <color attach="background" args={["#020203"]} />
        <Lightformer form="rect" intensity={14} position={[-7, 6, 5]} rotation={[0, Math.PI / 3, 0]} scale={[3, 3, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[6, 1, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[0.6, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} position={[0, -6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[12, 12, 1]} color="#8fa6e8" />
      </Environment>
      <directionalLight position={[-6, 6, 7]} intensity={3} />
      <Suspense fallback={null}>
        <Chamber still={still} />
      </Suspense>
    </Canvas>
  );
}
