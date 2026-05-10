import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';
import './index.css';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        {/* Placeholder for future sections */}
        <div style={{ height: '200vh', background: 'var(--bg-secondary)' }}></div>
      </main>
    </>
  );
}

export default App;
