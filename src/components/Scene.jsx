import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

/* ── Lightweight particle field ── */
function Particles() {
  const count = 80; // Reduced from 100
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.3) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: '#00B4D8',
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
    depthWrite: false,
  }), []);

  const ref = useRef();

  useFrame(({ clock, mouse }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.012;
    ref.current.rotation.x = clock.elapsedTime * 0.006;
    ref.current.position.x += (mouse.x * -0.5 - ref.current.position.x) * 0.02;
    ref.current.position.y += (mouse.y * -0.3 - ref.current.position.y) * 0.02;
  });

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

/* ── Drone model with cursor tracking ── */
function DroneModel() {
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

  useFrame(({ clock, mouse }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;

    /* Entry animation */
    if (entryProgress.current < 1) {
      const raw = Math.max(0, (t - 1.8) / 1.2);
      entryProgress.current = Math.min(1, raw);
      const e = 1 - Math.pow(1 - entryProgress.current, 3);
      const s = e * 5.0;
      groupRef.current.scale.set(s, s, s);
      groupRef.current.position.y = 2 * (1 - e);
      return;
    }

    /* Floating bob */
    groupRef.current.position.y = Math.sin(t * 0.6) * 0.15;

    /* Cursor tracking */
    const g = groupRef.current;
    g.rotation.y += (mouse.x * 0.7 - g.rotation.y) * 0.12;
    g.rotation.x += (-mouse.y * 0.35 - g.rotation.x) * 0.12;
    g.rotation.z += (Math.sin(t * 0.4) * 0.04 + mouse.x * 0.08 - g.rotation.z) * 0.06;

    /* Lateral drift */
    g.position.x += (mouse.x * 0.6 - g.position.x) * 0.04;

    /* Propeller spin */
    for (let i = 0; i < propellers.length; i++) {
      propellers[i].rotation.y += 0.4;
    }
  });

  return (
    <group ref={groupRef} scale={[0.01, 0.01, 0.01]} position={[0, 2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Shadow ellipse ── */
function ShadowPlane() {
  return (
    <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[2.5, 1.2, 1]}>
      <circleGeometry args={[1, 24]} />
      <meshBasicMaterial color="#0A2540" transparent opacity={0.05} />
    </mesh>
  );
}

/* ── Frame limiter — pauses rendering when canvas is off-screen ── */
function FrameLimiter({ isVisible }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    if (!isVisible) {
      // When not visible, stop the render loop to save GPU
      gl.setAnimationLoop(null);
    } else {
      // Resume rendering when visible
      gl.setAnimationLoop(() => {
        invalidate();
      });
    }
    return () => {
      gl.setAnimationLoop(null);
    };
  }, [isVisible, gl, invalidate]);

  return null;
}

useGLTF.preload('/models/drone.glb');

/* ── Canvas wrapper — optimized for performance ── */
export default function Scene() {
  const wrapperRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Use IntersectionObserver to detect when canvas is off-screen
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
        camera={{ position: [0, 0.3, 4], fov: 35 }}
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
        {/* Simplified lighting */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 10, 5]} intensity={2.5} />
        <pointLight position={[0, -2, 3]} intensity={0.8} color="#00B4D8" />

        <Suspense fallback={null}>
          <DroneModel />
          <ShadowPlane />
        </Suspense>

        <Particles />
      </Canvas>
    </div>
  );
}
