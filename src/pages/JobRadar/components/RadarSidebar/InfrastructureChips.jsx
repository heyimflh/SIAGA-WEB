const INFRA_OPTIONS = ['SUTET', 'Jembatan', 'Kilang', 'Solar Panel', 'Bendungan', 'Tower'];

export default function InfrastructureChips({ activeChips, onChange }) {
 const handleToggle = (chip) => {
 if (activeChips.includes(chip)) {
 onChange(activeChips.filter(c => c !== chip));
 } else {
 onChange([...activeChips, chip]);
 }
 };

 return (
 <div className="infra-chips" role="group" aria-label="Filter jenis infrastruktur">
 {INFRA_OPTIONS.map(chip => (
 <button
 key={chip}
 className={`infra-chip ${activeChips.includes(chip) ? 'infra-chip--active' : ''}`}
 onClick={() => handleToggle(chip)}
 role="checkbox"
 aria-checked={activeChips.includes(chip)}
 aria-label={`Filter ${chip}`}
 >
 {chip}
 </button>
 ))}
 </div>
 );
}
