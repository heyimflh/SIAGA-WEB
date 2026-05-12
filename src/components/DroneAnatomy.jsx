import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './DroneAnatomy.css';
gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 240;
const frameSrc = (i) => `/images/drone-anatomy/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;

export default function DroneAnatomy() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);        // Cache canvas 2D context
  const frames = useRef([]);
  const proxy = useRef({ frame: 0 });
  const lastFrame = useRef(-1);        // Skip redundant draws
  const hudRefs = useRef({});          // DOM refs for HUD — avoid React re-renders
  const [pct, setPct] = useState(0);
  const [ready, setReady] = useState(false);

  // Preload frames in priority batches: first/last/keyframes first
  useEffect(() => {
    let loaded = 0;
    const arr = new Array(TOTAL_FRAMES);
    const load = (i) => {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameSrc(i + 1);
      const done = () => {
        loaded++;
        if (loaded % 20 === 0 || loaded === TOTAL_FRAMES) setPct(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) setReady(true);
      };
      img.onload = done;
      img.onerror = done;
      arr[i] = img;
    };
    // Priority: frame 0, then every 10th, then fill gaps
    const priority = [0];
    for (let i = 10; i < TOTAL_FRAMES; i += 10) priority.push(i);
    priority.push(TOTAL_FRAMES - 1);
    const rest = [];
    for (let i = 0; i < TOTAL_FRAMES; i++) { if (!priority.includes(i)) rest.push(i); }
    [...priority, ...rest].forEach(load);
    frames.current = arr;
  }, []);

  // Optimized draw: cached context, skip duplicate frames
  const draw = useCallback((fi) => {
    const c = canvasRef.current;
    if (!c) return;
    const idx = Math.min(Math.max(Math.round(fi), 0), TOTAL_FRAMES - 1);
    if (idx === lastFrame.current) return; // Skip if same frame
    lastFrame.current = idx;
    const img = frames.current[idx];
    if (!img?.complete || !img.naturalWidth) return;
    let ctx = ctxRef.current;
    if (!ctx) { ctx = c.getContext('2d'); ctxRef.current = ctx; }
    const dpr = parseFloat(c.dataset.dpr) || 1;
    const cw = c.width / dpr, ch = c.height / dpr;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth * scale, sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw * dpr, ch * dpr);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }, []);

  // Canvas resize — debounced
  useEffect(() => {
    const c = canvasRef.current;
    if (!c || !ready) return;
    let rafId;
    const resize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap at 1.5x
        c.width = window.innerWidth * dpr;
        c.height = window.innerHeight * dpr;
        c.style.width = '100%'; c.style.height = '100%';
        c.dataset.dpr = dpr;
        const ctx = c.getContext('2d');
        ctx.scale(dpr, dpr);
        ctxRef.current = ctx;
        lastFrame.current = -1; // Force redraw
        draw(proxy.current.frame);
      });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafId); };
  }, [ready, draw]);

  // GSAP ScrollTrigger — optimized
  useEffect(() => {
    if (!ready) return;
    draw(0);

    // Cache HUD DOM refs — mutate directly, no React re-render
    hudRefs.current = {
      fn: document.querySelector('.da-fn'),
      fill: document.querySelector('.da-hud-fill'),
      alt: document.querySelector('.da-hud-alt'),
      lat: document.querySelector('.da-hud-lat'),
      lng: document.querySelector('.da-hud-lng'),
    };

    const ctx = gsap.context(() => {
      const T = { trigger: wrapRef.current, start: 'top top', end: '+=600%', scrub: 1 };
      const S = (p) => `${p * 6}% top`;

      // Master frame scrub — the ONLY high-frequency update
      gsap.to(proxy.current, {
        frame: TOTAL_FRAMES - 1, snap: 'frame', ease: 'none',
        scrollTrigger: { ...T, pin: true, anticipatePin: 1, scrub: 0.8 },
        onUpdate: () => {
          draw(proxy.current.frame);
          // Direct DOM mutation — zero React overhead
          const h = hudRefs.current;
          const f = Math.round(proxy.current.frame);
          if (h.fn) h.fn.textContent = String(f + 1).padStart(3, '0');
        },
      });

      // Timeline helper to guarantee perfect in/hold/out states without conflicts
      const fadeInOut = (sel, s1, e1, s2, e2) => {
        const tl = gsap.timeline({ scrollTrigger: { ...T, start: S(s1), end: S(e2) } });
        tl.fromTo(sel, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: e1 - s1, ease: 'power2.out' })
          .to(sel, { opacity: 1, duration: s2 - e1 }) // hold
          .to(sel, { opacity: 0, y: -20, duration: e2 - s2, ease: 'power2.in' });
      };

      // ═══ FASE 0: INTRO (out by 7%) ═══
      gsap.to('.da-intro', { opacity: 0, y: -40, scrollTrigger: { ...T, start: S(0), end: S(7) } });

      // ═══ FASE 1A: Disruption heading (5%→10% in, hold till 17%, out by 21%) ═══
      fadeInOut('.da-p1', 5, 10, 17, 21);

      // ═══ FASE 1B: Tags staggered (8%→26%) ═══
      ['.da-t1','.da-t2','.da-t3','.da-t4'].forEach((s,i) => {
        const tl = gsap.timeline({ scrollTrigger: { ...T, start: S(8+i*2), end: S(27) } });
        tl.fromTo(s, {opacity:0, x: i%2===0 ? -20 : 20}, {opacity:1, x:0, duration: 4, ease:'power2.out'})
          .to(s, {opacity:1, duration: 12 - i*2}) // hold
          .to(s, {opacity:0, duration: 3});
      });

      // ═══ FASE 1C: Why SIAGA ═══
      fadeInOut('.da-why', 16, 21, 28, 32);

      // ═══ FASE 1D: Ticker ═══
      fadeInOut('.da-ticker', 20, 25, 29, 33);

      // ═══ FASE 2A: Under The Shell ═══
      fadeInOut('.da-p2', 33, 38, 43, 47);

      // ═══ FASE 2B: Darken overlay ═══
      const dkTl = gsap.timeline({ scrollTrigger:{...T, start:S(31), end:S(70)} });
      dkTl.to('.da-dk', {opacity:1, duration: 7})
          .to('.da-dk', {opacity:1, duration: 27})
          .to('.da-dk', {opacity:0, duration: 5});

      // ═══ FASE 2C: Spec cards ═══
      ['.da-c1','.da-c2','.da-c3','.da-c4'].forEach((s,i) => {
        const tl = gsap.timeline({ scrollTrigger:{...T, start:S(36+i*3), end:S(64)} });
        tl.fromTo(s, {opacity:0, x: i%2===0 ? -40 : 40}, {opacity:1, x:0, duration: 5, ease:'power2.out'})
          .to(s, {opacity:1, duration: 19 - i*3})
          .to(s, {opacity:0, duration: 4});
      });

      // ═══ FASE 2D: Killer Feature ═══
      fadeInOut('.da-killer', 48, 53, 60, 64);

      // ═══ FASE 2E: Trust badges ═══
      ['.da-b1','.da-b2','.da-b3'].forEach((s,i) => {
        const tl = gsap.timeline({ scrollTrigger:{...T, start:S(54+i*2), end:S(70)} });
        tl.fromTo(s, {opacity:0, y:20}, {opacity:1, y:0, duration: 4})
          .to(s, {opacity:1, duration: 9 - i*2})
          .to(s, {opacity:0, duration: 3});
      });

      // ═══ FASE 3A: Platform heading ═══
      fadeInOut('.da-p3', 71, 76, 80, 84);

      // ═══ FASE 3B: Platform stats ═══
      fadeInOut('.da-pstats', 73, 78, 81, 85);

      // ═══ FASE 3C: Ecosystem cards ═══
      ['.da-eco1','.da-eco2','.da-eco3'].forEach((s,i) => {
        const tl = gsap.timeline({ scrollTrigger:{...T, start:S(75+i*2), end:S(88)} });
        tl.fromTo(s, {opacity:0, x: i%2===0?-30:30}, {opacity:1, x:0, duration: 4})
          .to(s, {opacity:1, duration: 5 - i*2})
          .to(s, {opacity:0, duration: 4});
      });

      // ═══ LED glow ═══
      gsap.fromTo('.da-led', {opacity:0}, {opacity:1, scrollTrigger:{...T, start:S(82), end:S(86)}});

      // ═══ FINALE ═══
      gsap.fromTo('.da-finale', {opacity:0, y:30}, {opacity:1, y:0,
        scrollTrigger:{...T, start:S(80), end:S(88)}});

      // Progress bar only
      gsap.to('.da-hud-fill', {scaleY:1, scrollTrigger:{...T, end:'+=600%'}});

    }, wrapRef);
    return () => ctx.revert();
  }, [ready, draw]);

  return (
    <section className="da-wrap" ref={wrapRef} id="drone-anatomy">
      {!ready && (
        <div className="da-load"><div className="da-load-inner">
          <div className="da-load-ring"><svg viewBox="0 0 60 60"><defs><linearGradient id="lgr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#00FFFF"/><stop offset="100%" stopColor="#FF007F"/></linearGradient></defs><circle cx="30" cy="30" r="26" className="da-lbg"/><circle cx="30" cy="30" r="26" className="da-lfg" strokeDasharray="163.36" strokeDashoffset={163.36-(163.36*pct/100)}/></svg><span className="da-lpct">{pct}</span></div>
          <span className="da-llbl">LOADING COMPONENTS</span>
          <div className="da-ltrack"><div className="da-lfill" style={{width:`${pct}%`}}/></div>
        </div></div>
      )}

      <canvas ref={canvasRef} className="da-canvas"/>
      <div className="da-dk"/><div className="da-led"/>

      {/* HUD — static text, no re-renders */}
      <div className="da-hud da-hud-tl">SYS_ON // VER 2.0</div>
      <div className="da-hud da-hud-tr">REC <span className="da-rec">●</span></div>
      <div className="da-hud da-hud-bl">ALT: <span className="da-hud-alt">120.4</span>M</div>
      <div className="da-hud da-hud-br">GPS: LOCKED</div>

      {/* ══ FASE 0: INTRO ══ */}
      <div className="da-intro">
        <div className="da-intro-l">
          <span className="da-badge"><span className="da-bdot"/> MODULE_03</span>
          <h2 className="da-ht">Precision<br/><span className="da-grad">Reimagined.</span></h2>
          <p className="da-hs">Scroll to dissect the future of flight. Setiap komponen dirancang untuk misi inspeksi infrastruktur kritis Indonesia.</p>
          <div className="da-cue"><div className="da-cue-bar"><div className="da-cue-dot"/></div><span>INITIATE SEQUENCE</span></div>
        </div>
        <div className="da-intro-r">
          <div className="da-ist"><span className="da-iv">240<sup>+</sup></span><span className="da-il">KOMPONEN PRESISI</span></div>
          <div className="da-ist"><span className="da-iv">55<sup>min</sup></span><span className="da-il">WAKTU TERBANG</span></div>
          <div className="da-ist"><span className="da-iv">±1<sup>cm</sup></span><span className="da-il">AKURASI RTK</span></div>
        </div>
      </div>

      {/* ══ FASE 1A ══ */}
      <div className="da-ptxt da-p1">
        <span className="da-pn">TARGET_01</span>
        <h3 className="da-ph">The Great<br/><span className="da-grad">Disruption</span></h3>
        <p className="da-pp">Struktur aerodinamis yang dirancang terbang stabil di ketinggian 120m — bahkan dalam angin kencang area menara SUTET.</p>
      </div>

      {/* Tags */}
      <div className="da-ft da-t1" style={{left:'8%',top:'28%'}}><div className="da-ftd"/><div><span className="da-ftn">CARBON FIBER SHELL</span><span className="da-ftv">340g // IP45</span></div></div>
      <div className="da-ft da-t2" style={{right:'8%',top:'48%'}}><div className="da-ftd da-ftd--g"/><div><span className="da-ftn">BRUSHLESS MOTORS</span><span className="da-ftv">KV920 // HI-TORQUE</span></div></div>
      <div className="da-ft da-t3" style={{left:'50%',top:'12%',transform:'translateX(-50%)'}}><div className="da-ftd da-ftd--r"/><div><span className="da-ftn">PROPELLER SYSTEM</span><span className="da-ftv">LOW NOISE // Q-RELEASE</span></div></div>
      <div className="da-ft da-t4" style={{left:'10%',bottom:'20%'}}><div className="da-ftd"/><div><span className="da-ftn">LANDING GEAR</span><span className="da-ftv">RETRACTABLE</span></div></div>

      {/* ══ FASE 1C: WHY SIAGA ══ */}
      <div className="da-why">
        <span className="da-why-tag">SYS_ERR: MANUAL_INSPECT</span>
        <h4 className="da-why-h">Inspeksi Manual = Risiko Nyawa</h4>
        <p className="da-why-p">Pekerja memanjat menara SUTET setinggi 50m. SIAGA mengubah ini dengan drone presisi dari udara.</p>
        <div className="da-why-stats">
          <div className="da-ws"><span className="da-wsv">3 HARI</span><span className="da-wsl">→ 30 DTK</span></div>
          <div className="da-ws"><span className="da-wsv">70%</span><span className="da-wsl">HEMAT BIAYA</span></div>
        </div>
      </div>

      {/* ══ FASE 1D: Ticker ══ */}
      <div className="da-ticker">
        <div className="da-tick"><span className="da-tickv">SDG 9</span><span className="da-tickl">INFRASTRUCTURE</span></div><div className="da-tick-sep"/>
        <div className="da-tick"><span className="da-tickv">B2B</span><span className="da-tickl">MARKETPLACE</span></div><div className="da-tick-sep"/>
        <div className="da-tick"><span className="da-tickv">E2E</span><span className="da-tickl">DIGITAL INSPECT</span></div>
      </div>

      {/* ══ FASE 2A ══ */}
      <div className="da-ptxt da-ptxt--r da-p2">
        <span className="da-pn">TARGET_02</span>
        <h3 className="da-ph">Under The<br/><span className="da-grad">Shell</span></h3>
        <p className="da-pp">Teknologi inspeksi enterprise. Sensor dipilih untuk mendeteksi kerusakan tak terlihat mata.</p>
      </div>

      {/* Spec cards */}
      <div className="da-card da-c1"><div className="da-ci">IMG</div><div className="da-cb"><span className="da-ct">IMAGING</span><h4 className="da-ch">45MP Full-Frame</h4><p className="da-cp">Sensor CMOS 1" — retakan sentimeter dari udara.</p></div></div>
      <div className="da-card da-c2"><div className="da-ci da-ci--c">POS</div><div className="da-cb"><span className="da-ct">POSITIONING</span><h4 className="da-ch">Dual-Antenna RTK</h4><p className="da-cp">Akurasi ±1cm — peta survey-grade presisi.</p></div></div>
      <div className="da-card da-c3"><div className="da-ci da-ci--r">CPU</div><div className="da-cb"><span className="da-ct">COMPUTE</span><h4 className="da-ch">Flight Controller</h4><p className="da-cp">Triple-redundant IMU + AI avoidance 200ms.</p></div></div>
      <div className="da-card da-c4"><div className="da-ci da-ci--a">PWR</div><div className="da-cb"><span className="da-ct">POWER</span><h4 className="da-ch">Smart Battery 6S</h4><p className="da-cp">55 menit terbang hot-swap per tower.</p></div></div>

      {/* ══ FASE 2D: KILLER FEATURE ══ */}
      <div className="da-killer">
        <div className="da-killer-badge">★ KILLER FEATURE</div>
        <h4 className="da-killer-h">One-Click Report</h4>
        <p className="da-killer-p">Upload → klik → PDF profesional 30 detik. Cover, peta GPS, galeri kerusakan, tabel aset.</p>
        <div className="da-killer-stat">
          <span className="da-ksv">2–3 HARI</span><span className="da-ksa">→</span><span className="da-ksv da-ksv--h">30 DTK</span>
        </div>
      </div>

      {/* ══ FASE 2E: Trust ══ */}
      <div className="da-tbadge da-b1"><span className="da-tbi">🔐</span><div><span className="da-tbn">AES-256</span><span className="da-tbd">End-to-end encryption</span></div></div>
      <div className="da-tbadge da-b2"><span className="da-tbi">✓</span><div><span className="da-tbn">SIDOPI VERIFIED</span><span className="da-tbd">Licensed pilots only</span></div></div>
      <div className="da-tbadge da-b3"><span className="da-tbi">💰</span><div><span className="da-tbn">ESCROW</span><span className="da-tbd">Secured payment</span></div></div>

      {/* ══ FASE 3A ══ */}
      <div className="da-ptxt da-p3">
        <span className="da-pn">TARGET_03</span>
        <h3 className="da-ph">The<br/><span className="da-grad">Platform</span></h3>
        <p className="da-pp">Ekosistem inspeksi digital end-to-end pertama di Indonesia.</p>
      </div>

      {/* Platform stats */}
      <div className="da-pstats">
        <div className="da-ps"><span className="da-psv">30DTK</span><span className="da-psl">REPORT</span></div>
        <div className="da-ps"><span className="da-psv">7%</span><span className="da-psl">COMMISSION</span></div>
        <div className="da-ps"><span className="da-psv">24/7</span><span className="da-psl">MONITORING</span></div>
      </div>

      {/* Ecosystem */}
      <div className="da-eco da-eco1"><span className="da-eco-i">B2B</span><div><span className="da-eco-h">PERUSAHAAN & BUMN</span><span className="da-eco-p">Posting & pantau inspeksi real-time</span></div></div>
      <div className="da-eco da-eco2"><span className="da-eco-i">UAV</span><div><span className="da-eco-h">PILOT GEN-Z</span><span className="da-eco-p">Job Radar & bidding transparan</span></div></div>
      <div className="da-eco da-eco3"><span className="da-eco-i">AI</span><div><span className="da-eco-h">ANALYTICS</span><span className="da-eco-p">Prediksi kerusakan infrastruktur</span></div></div>

      {/* ══ FINALE ══ */}
      <div className="da-finale">
        <span className="da-fb"><span className="da-fbd"/>SYS_READY // 240 ONLINE</span>
        <h3 className="da-fh">Setiap Baut.<br/>Setiap Sirkuit.<br/><span className="da-grad">Siap Bertugas.</span></h3>
        <p className="da-fp">Solusi inspeksi 3 hari kerja → 30 detik melalui platform SIAGA.</p>
        <a href="#features" className="da-btn"><span>EXPLORE FEATURES</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
      </div>

      {/* Sidebar */}
      <div className="da-hud-side">
        <div className="da-hud-bar"><div className="da-hud-fill"/></div>
        <div className="da-fc"><span className="da-fn">001</span><span className="da-fs">/</span><span className="da-ft2">240</span></div>
      </div>
    </section>
  );
}
