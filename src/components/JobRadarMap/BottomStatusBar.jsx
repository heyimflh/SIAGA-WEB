import { useState, useEffect } from 'react';

export default function BottomStatusBar({ pins }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalBudget = pins.reduce((sum, p) => {
    const num = parseInt(p.budget.replace(/[^\d]/g, ''));
    return sum + num;
  }, 0);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bottom-status-bar">
      <div className="bottom-status-bar__left">
        <div className="bottom-status-bar__item">
          <span className="bottom-status-bar__dot bottom-status-bar__dot--green"></span>
          <span className="bottom-status-bar__label">System Online</span>
        </div>
        <div className="bottom-status-bar__sep"></div>
        <div className="bottom-status-bar__item">
          <span className="bottom-status-bar__label">Latency:</span>
          <span className="bottom-status-bar__value bottom-status-bar__value--green">12ms</span>
        </div>
        <div className="bottom-status-bar__sep"></div>
        <div className="bottom-status-bar__item">
          <span className="bottom-status-bar__label">Uptime:</span>
          <span className="bottom-status-bar__value">99.8%</span>
        </div>
      </div>
      <div className="bottom-status-bar__center">
        <span className="bottom-status-bar__label">Total Nilai Proyek:</span>
        <span className="bottom-status-bar__value bottom-status-bar__value--blue">
          Rp {(totalBudget / 1000000).toFixed(0)} Juta
        </span>
      </div>
      <div className="bottom-status-bar__right">
        <div className="bottom-status-bar__item">
          <span className="bottom-status-bar__label">Region:</span>
          <span className="bottom-status-bar__value">Indonesia</span>
        </div>
        <div className="bottom-status-bar__sep"></div>
        <div className="bottom-status-bar__item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12,6 12,12 16,14"/>
          </svg>
          <span className="bottom-status-bar__value bottom-status-bar__value--mono">
            {formatTime(currentTime)} WIB
          </span>
        </div>
      </div>
    </div>
  );
}
