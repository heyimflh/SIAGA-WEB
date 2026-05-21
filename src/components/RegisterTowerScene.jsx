import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Re-export error boundary for convenience
export { AuthDroneErrorBoundary as TowerErrorBoundary } from './AuthDroneErrorBoundary';

/* ──────────────────────────────────────────────────────────────
 * RegisterTowerScene — 3D Tower SUTET for Register Page
 * 
 * Features:
 * - Loads tower.glb from /models/tower.glb
 * - Luxury museum showcase animation (slow turntable + float)
 * - No cursor tracking — pure elegant auto-animation
 * - Soft glow lighting with green-cyan tones
 * ────────────────────────────────────────────────────────────── */

/* ── Tower model — Luxury museum showcase animation ───────────── */
function TowerModel() {
 const { scene } = useGLTF('/models/tower.glb');
 const groupRef = useRef();
 const outerRef = useRef();

 useEffect(() => {
 // Compute bounding box to auto-center and scale the model
 const box = new THREE.Box3().setFromObject(scene);
 const size = box.getSize(new THREE.Vector3());
 const center = box.getCenter(new THREE.Vector3());

 // Normalize: fit the model into a ~3 unit tall space
 const maxDim = Math.max(size.x, size.y, size.z);
 const scale = maxDim > 0 ? 3 / maxDim : 1;

 if (groupRef.current) {
 groupRef.current.scale.setScalar(scale);
 groupRef.current.position.set(
 -center.x * scale,
 -center.y * scale,
 -center.z * scale
 );
 }

 scene.traverse((child) => {
 if (child.isMesh) {
 child.frustumCulled = false;
 if (child.material) {
 child.material.envMapIntensity = 0.6;
 if (child.material.metalness !== undefined) {
 child.material.metalness = Math.min(child.material.metalness + 0.2, 1);
 }
 if (child.material.roughness !== undefined) {
 child.material.roughness = Math.max(child.material.roughness - 0.1, 0);
 }
 }
 }
 });
 }, [scene]);

 useFrame(({ clock }) => {
 if (!outerRef.current) return;
 const t = clock.elapsedTime;

 // Luxury museum turntable: very slow, elegant rotation
 outerRef.current.rotation.y = t * 0.12;

 // Gentle floating bob — like hovering on a pedestal
 outerRef.current.position.y = Math.sin(t * 0.4) * 0.06;

 // Subtle tilt oscillation for depth
 outerRef.current.rotation.x = Math.sin(t * 0.25) * 0.02;
 outerRef.current.rotation.z = Math.cos(t * 0.3) * 0.01;
 });

 return (
 <group ref={outerRef}>
 <group ref={groupRef}>
 <primitive object={scene} />
 </group>
 </group>
 );
}

/* ── Ground glow ring ─────────────────────────────────────────── */
function GroundGlow() {
 const ringRef = useRef();

 useFrame(({ clock }) => {
 if (!ringRef.current) return;
 const t = clock.elapsedTime;
 ringRef.current.material.opacity = 0.1 + Math.sin(t * 1.0) * 0.03;
 ringRef.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.04);
 });

 return (
 <mesh ref={ringRef} position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
 <ringGeometry args={[0.4, 1.8, 48]} />
 <meshBasicMaterial color="#10B981" transparent opacity={0.1} side={THREE.DoubleSide} />
 </mesh>
 );
}

// Preload
useGLTF.preload('/models/tower.glb');

/* ── Default export ───────────────────────────────────────────── */
export default function RegisterTowerScene() {
 return (
 <Canvas
 camera={{ position: [0, 0.5, 6], fov: 40 }}
 style={{ background: 'transparent', width: '100%', height: '100%' }}
 gl={{
 antialias: true,
 alpha: true,
 powerPreference: 'high-performance',
 stencil: false,
 depth: true,
 }}
 dpr={[1, 1.5]}
 >
 {/* Premium museum lighting setup */}
 <ambientLight intensity={0.7} />
 <directionalLight position={[5, 10, 5]} intensity={2.0} color="#ffffff" />
 <directionalLight position={[-4, 6, -3]} intensity={0.6} color="#10B981" />
 <spotLight
 position={[0, 8, 2]}
 angle={0.4}
 penumbra={0.8}
 intensity={1.2}
 color="#ffffff"
 castShadow={false}
 />
 <pointLight position={[0, -3, 3]} intensity={0.6} color="#22D3EE" distance={10} />
 <pointLight position={[3, 2, -2]} intensity={0.3} color="#67E8F9" distance={8} />

 <Suspense fallback={null}>
 <TowerModel />
 <GroundGlow />
 </Suspense>
 </Canvas>
 );
}
