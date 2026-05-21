import { formatCompactRupiah } from '../../filters.js';

const MIN = 0;
const MAX = 2500000000;
const STEP = 50000000;

/**
 * ValueRangeSlider — Dual-value range slider for contract value filter.
 * Uses two native range inputs for min/max.
 */
export default function ValueRangeSlider({ value, onChange }) {
 const [minVal, maxVal] = value;

 const handleMinChange = (e) => {
 const newMin = Number(e.target.value);
 if (newMin <= maxVal) {
 onChange([newMin, maxVal]);
 }
 };

 const handleMaxChange = (e) => {
 const newMax = Number(e.target.value);
 if (newMax >= minVal) {
 onChange([minVal, newMax]);
 }
 };

 return (
 <div className="value-range">
 <div className="value-range__label">
 <span className="value-range__title">Nilai Proyek</span>
 <span className="value-range__display">
 {formatCompactRupiah(minVal)} – {formatCompactRupiah(maxVal)}
 </span>
 </div>
 <div className="value-range__slider-container">
 <input
 type="range"
 className="value-range__slider"
 min={MIN}
 max={MAX}
 step={STEP}
 value={minVal}
 onChange={handleMinChange}
 aria-label="Nilai minimum proyek"
 aria-valuemin={MIN}
 aria-valuemax={MAX}
 aria-valuenow={minVal}
 role="slider"
 />
 </div>
 <div className="value-range__slider-container">
 <input
 type="range"
 className="value-range__slider"
 min={MIN}
 max={MAX}
 step={STEP}
 value={maxVal}
 onChange={handleMaxChange}
 aria-label="Nilai maksimum proyek"
 aria-valuemin={MIN}
 aria-valuemax={MAX}
 aria-valuenow={maxVal}
 role="slider"
 />
 </div>
 </div>
 );
}
