import { Mountain } from 'lucide-react';

/**
 * TerrainToggle — Glass button to enable/disable 3D terrain.
 */
export default function TerrainToggle({ enabled, onToggle }) {
 return (
 <button
 className="terrain-toggle"
 onClick={onToggle}
 aria-label={enabled ? 'Matikan terrain 3D' : 'Aktifkan terrain 3D'}
 aria-pressed={enabled}
 title={enabled ? 'Terrain 3D: Aktif' : 'Terrain 3D: Nonaktif'}
 >
 <Mountain size={16} />

 <style>{`
 .terrain-toggle {
 position: absolute;
 bottom: 100px;
 right: 10px;
 z-index: 50;
 width: 36px;
 height: 36px;
 display: flex;
 align-items: center;
 justify-content: center;
 background: ${enabled ? 'rgba(0, 210, 255, 0.15)' : 'rgba(6, 26, 51, 0.8)'};
 backdrop-filter: blur(12px);
 border: 1px solid ${enabled ? 'rgba(0, 210, 255, 0.35)' : 'rgba(255, 255, 255, 0.1)'};
 border-radius: 10px;
 color: ${enabled ? '#00D2FF' : 'rgba(220, 240, 255, 0.5)'};
 cursor: none;
 transition: all 0.2s ease;
 box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
 }
 .terrain-toggle:hover {
 background: rgba(0, 210, 255, 0.2);
 border-color: rgba(0, 210, 255, 0.4);
 color: #00D2FF;
 }
 .terrain-toggle:focus-visible {
 outline: 2px solid #00D2FF;
 outline-offset: 2px;
 }
 `}</style>
 </button>
 );
}
