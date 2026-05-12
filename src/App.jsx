import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import DroneAnatomy from './components/DroneAnatomy';
import ProblemSolution from './components/ProblemSolution';
import CustomCursor from './components/CustomCursor';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.6,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Sync Lenis ↔ GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const lenisRaf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(lenisRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenisRaf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <DroneAnatomy />
        <ProblemSolution />
        {/* Placeholder for future sections */}
        <div style={{ height: '200vh', background: 'var(--bg-primary)' }}></div>
      </main>
    </>
  );
}

export default App;
