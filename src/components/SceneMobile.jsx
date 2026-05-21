import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ── Drone model — auto-rotate version untuk mobile (tanpa cursor follow) ── */
function DroneModelMobile() {
 const { scene } = useGLTF('/models/drone.glb');
 const groupRef = useRef();
 const entryProgress = useRef(0);

 const propellers = useMemo(() => {
 const props = [];
 scene.traverse((child) => {
 if (child.isMesh) {
 child.frustumCulled = false;
 if (child.material) {
 child.material.envMapIntensity = 0.5;
 }
 if (child.name.toLowerCase().includes('prop')) {
 props.push(child);
 }
 }
 });
 return props;
 }, [scene]);

 useFrame(({ clock }) => {
 if (!groupRef.current) return;
 const t = clock.elapsedTime;

 /* Entry animation — scale up smoothly */
 if (entryProgress.current < 1) {
 const raw = Math.max(0, (t - 0.6) / 1.2);
 entryProgress.current = Math.min(1, raw);
 const e = 1 - Math.pow(1 - entryProgress.current, 3);
 const s = e * 5.0;
 groupRef.current.scale.set(s, s, s);
 groupRef.current.position.y = 1.2 * (1 - e);
 return;
 }

 /* Floating bob */
 groupRef.current.position.y = Math.sin(t * 0.6) * 0.12;

 /* Auto-rotate gentle untuk mobile (no cursor) */
 groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.5 + t * 0.15;
 groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.08;
 groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.05;

 /* Propeller spin */
 for (let i = 0; i < propellers.length; i++) {
 propellers[i].rotation.y += 0.4;
 }
 });

 return (
 <group ref={groupRef} scale={[0.01, 0.01, 0.01]} position={[0, 1.2, 0]}>
 <primitive object={scene} />
 </group>
 );
}

/* ── Shadow ellipse ── */
function ShadowPlane() {
 return (
 <mesh position={[0, -1.4, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2, 1, 1]}>
 <circleGeometry args={[1, 24]} />
 <meshBasicMaterial color="#0A2540" transparent opacity={0.06} />
 </mesh>
 );
}

useGLTF.preload('/models/drone.glb');

/* ── Mobile Canvas — touch-friendly, no cursor follow ── */
export default function SceneMobile() {
 const wrapperRef = useRef(null);
 const [isVisible, setIsVisible] = useState(true);

 useEffect(() => {
 const el = wrapperRef.current;
 if (!el) return;

 const observer = new IntersectionObserver(
 ([entry]) => {
 setIsVisible(entry.isIntersecting);
 },
 { threshold: 0, rootMargin: '100px' }
 );

 observer.observe(el);
 return () => observer.disconnect();
 }, []);

 return (
 <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
 <Canvas
 camera={{ position: [0, 0.2, 4.5], fov: 32 }}
 style={{ background: 'transparent' }}
 gl={{
 antialias: false,
 alpha: true,
 powerPreference: 'high-performance',
 stencil: false,
 depth: true,
 }}
 dpr={[1, 1.5]}
 flat
 frameloop={isVisible ? 'always' : 'never'}
 >
 <ambientLight intensity={1.2} />
 <directionalLight position={[5, 10, 5]} intensity={2.5} />
 <pointLight position={[0, -2, 3]} intensity={0.8} color="#00B4D8" />

 <Suspense fallback={null}>
 <DroneModelMobile />
 <ShadowPlane />
 </Suspense>
 </Canvas>
 </div>
 );
}
