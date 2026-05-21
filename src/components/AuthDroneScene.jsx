import { Suspense, useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Re-export for backward compatibility with test mocks
export { AuthDroneErrorBoundary } from './AuthDroneErrorBoundary';

/* ──────────────────────────────────────────────────────────────
 * AuthDroneScene — Premium Interactive 3D Drone Stage
 * 
 * Features:
 * - Loads drone2.glb from /models/drone2.glb
 * - Desktop: drone follows cursor smoothly (parallax)
 * - Mobile/Tablet: auto-rotate with optional touch drag
 * - Floating bob animation
 * - Propeller spin
 * - Soft glow lighting
 *
 * Validates: Requirements 2.5, 2.6, 10.1, 10.2, 10.3
 * ────────────────────────────────────────────────────────────── */

/* ── Detect touch device ──────────────────────────────────────── */
function isTouchDevice() {
 if (typeof window === 'undefined') return false;
 return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function isCompactViewport() {
 if (typeof window === 'undefined') return false;
 return window.matchMedia('(max-width: 767px)').matches;
}

/* ── Mouse tracker component ──────────────────────────────────── */
function MouseTracker({ mouseRef }) {
 const { gl } = useThree();

 useEffect(() => {
 if (isTouchDevice()) return;

 const canvas = gl.domElement;
 const parent = canvas.parentElement;

 const handleMouseMove = (e) => {
 if (!parent) return;
 const rect = parent.getBoundingClientRect();
 // Normalize to -1 to 1
 mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
 mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
 };

 // Listen on window for smoother tracking
 window.addEventListener('mousemove', handleMouseMove);
 return () => window.removeEventListener('mousemove', handleMouseMove);
 }, [gl, mouseRef]);

 return null;
}

/* ── Drone model with interactive behavior ────────────────────── */
function DroneModel({ mouseRef }) {
 const { scene } = useGLTF('/models/drone2.glb');
 const groupRef = useRef();
 const isTouch = useMemo(() => isTouchDevice(), []);
 const compact = useMemo(() => isCompactViewport(), []);
 const modelScale = compact ? 0.48 : 0.48;
 const propellersRef = useRef([]);

 // Smooth target values
 const targetRotation = useRef({ x: 0, y: 0 });
 const currentRotation = useRef({ x: 0, y: 0 });

 // Collect propeller meshes once
 useEffect(() => {
 const props = [];
 scene.traverse((child) => {
 if (child.isMesh) {
 child.frustumCulled = false;
 if (child.material) {
 child.material.envMapIntensity = 0.6;
 if (child.material.metalness !== undefined) {
 child.material.metalness = Math.min(child.material.metalness + 0.1, 1);
 }
 }
 if (child.name && child.name.toLowerCase().includes('prop')) {
 props.push(child);
 }
 }
 });
 propellersRef.current = props;
 }, [scene]);

 useFrame(({ clock }) => {
 if (!groupRef.current) return;
 const t = clock.elapsedTime;

 // Floating bob
 groupRef.current.position.y = Math.sin(t * 0.8) * 0.12;

 if (!isTouch) {
 // Desktop: follow cursor
 targetRotation.current.y = mouseRef.current.x * 0.35;
 targetRotation.current.x = mouseRef.current.y * 0.15;

 // Smooth lerp
 currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.04;
 currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.04;

 groupRef.current.rotation.x = currentRotation.current.x;
 groupRef.current.rotation.y = currentRotation.current.y + Math.sin(t * 0.2) * 0.05;
 } else {
 // Mobile/Tablet: auto-rotate
 groupRef.current.rotation.y = t * 0.3;
 groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
 }

 // Propeller spin
 const propellers = propellersRef.current;
 for (let i = 0; i < propellers.length; i++) {
 propellers[i].rotation.y += 0.5;
 }
 });

 return (
 <group ref={groupRef} scale={[modelScale, modelScale, modelScale]} position={[0, 0, 0]}>
 <primitive object={scene} />
 </group>
 );
}

/* ── Glow ring beneath drone ──────────────────────────────────── */
function GlowRing() {
 const ringRef = useRef();

 useFrame(({ clock }) => {
 if (!ringRef.current) return;
 const t = clock.elapsedTime;
 ringRef.current.material.opacity = 0.12 + Math.sin(t * 1.2) * 0.04;
 ringRef.current.scale.setScalar(1 + Math.sin(t * 0.8) * 0.05);
 });

 return (
 <mesh
 ref={ringRef}
 position={[0, -1.4, 0]}
 rotation={[-Math.PI / 2, 0, 0]}
 >
 <ringGeometry args={[0.6, 1.4, 48]} />
 <meshBasicMaterial
 color="#106DFF"
 transparent
 opacity={0.12}
 side={THREE.DoubleSide}
 />
 </mesh>
 );
}

/* ── Shadow plane ─────────────────────────────────────────────── */
function ShadowPlane() {
 return (
 <mesh
 position={[0, -1.5, 0]}
 rotation={[-Math.PI / 2, 0, 0]}
 scale={[2.2, 1.2, 1]}
 >
 <circleGeometry args={[1, 32]} />
 <meshBasicMaterial color="#071A34" transparent opacity={0.08} />
 </mesh>
 );
}

// Preload model
useGLTF.preload('/models/drone2.glb');

/* ── Default export: the scene ────────────────────────────────── */
export default function AuthDroneScene() {
 const mouseRef = useRef({ x: 0, y: 0 });
 const compact = isCompactViewport();

 return (
 <Canvas
 camera={{ position: compact ? [0, 0.2, 3.4] : [0, 0.3, 3.2], fov: compact ? 40 : 45 }}
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
 <MouseTracker mouseRef={mouseRef} />

 {/* Lighting setup for premium look */}
 <ambientLight intensity={0.8} />
 <directionalLight position={[5, 8, 5]} intensity={2.0} color="#ffffff" />
 <directionalLight position={[-3, 4, -2]} intensity={0.6} color="#106DFF" />
 <pointLight position={[0, -2, 3]} intensity={1.0} color="#33BFFF" distance={8} />
 <pointLight position={[2, 3, -1]} intensity={0.5} color="#8FE8FF" distance={6} />

 <Suspense fallback={null}>
 <DroneModel mouseRef={mouseRef} />
 <GlowRing />
 <ShadowPlane />
 </Suspense>
 </Canvas>
 );
}
