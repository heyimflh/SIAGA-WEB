import './PricingTrustStrip.css';

const trustItems = [
  { icon: '✓', text: 'Tanpa biaya tersembunyi' },
  { icon: '🔒', text: 'Pembayaran dilindungi escrow' },
  { icon: '💰', text: 'Pilot menerima 93%' },
  { icon: '↑', text: 'Upgrade sesuai kebutuhan proyek' },
];

export default function PricingTrustStrip() {
  return (
    <div className="pts">
      <div className="pts__container">
        {trustItems.map((item) => (
          <div key={item.text} className="pts__item">
            <span className="pts__icon">{item.icon}</span>
            <span className="pts__text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
