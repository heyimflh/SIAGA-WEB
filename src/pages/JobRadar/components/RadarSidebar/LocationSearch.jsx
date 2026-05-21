import { useState, useRef } from 'react';
import { MapPin } from 'lucide-react';

/**
 * LocationSearch — Autocomplete location filter from mock data.
 */
export default function LocationSearch({ value, onChange, suggestions }) {
 const [inputValue, setInputValue] = useState(value || '');
 const [showSuggestions, setShowSuggestions] = useState(false);
 const inputRef = useRef(null);

 const filteredSuggestions = suggestions.filter(s =>
 s.toLowerCase().includes(inputValue.toLowerCase())
 );

 const handleInputChange = (e) => {
 const val = e.target.value;
 setInputValue(val);
 setShowSuggestions(val.length > 0);
 if (val === '') {
 onChange(null);
 }
 };

 const handleSelect = (suggestion) => {
 setInputValue(suggestion);
 setShowSuggestions(false);
 onChange(suggestion);
 };

 const handleBlur = () => {
 // Delay to allow click on suggestion
 setTimeout(() => setShowSuggestions(false), 200);
 };

 const handleClear = () => {
 setInputValue('');
 onChange(null);
 setShowSuggestions(false);
 inputRef.current?.focus();
 };

 return (
 <div className="location-search">
 <div style={{ position: 'relative' }}>
 <input
 ref={inputRef}
 type="text"
 className="location-search__input"
 placeholder="Cari kota atau provinsi..."
 value={inputValue}
 onChange={handleInputChange}
 onFocus={() => inputValue && setShowSuggestions(true)}
 onBlur={handleBlur}
 aria-label="Cari lokasi proyek"
 autoComplete="off"
 />
 {inputValue && (
 <button
 onClick={handleClear}
 style={{
 position: 'absolute',
 right: 8,
 top: '50%',
 transform: 'translateY(-50%)',
 background: 'none',
 border: 'none',
 color: 'rgba(220, 240, 255, 0.5)',
 fontSize: '14px',
 cursor: 'none',
 padding: '2px 4px',
 }}
 aria-label="Hapus pencarian lokasi"
 >
 ×
 </button>
 )}
 </div>
 {showSuggestions && filteredSuggestions.length > 0 && (
 <div className="location-search__suggestions" role="listbox">
 {filteredSuggestions.slice(0, 8).map(suggestion => (
 <div
 key={suggestion}
 className="location-search__option"
 onClick={() => handleSelect(suggestion)}
 role="option"
 aria-selected={value === suggestion}
 >
 <MapPin size={10} style={{ marginRight: 6, opacity: 0.6 }} />
 {suggestion}
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
