/**
 * Commission data for SIAGA Escrow Flow Console.
 * Invariant: platformPercent + pilotPercent === 100
 */
export const COMMISSION = Object.freeze({
 platformPercent: 7,
 pilotPercent: 93,
});

export const commissionFlow = [
 {
 id: 'client',
 label: 'Client Payment',
 description: 'Client membayar nilai proyek sesuai kesepakatan.',
 icon: 'Building2',
 },
 {
 id: 'escrow',
 label: 'SIAGA Escrow',
 description: 'Dana diamankan sampai hasil inspeksi diverifikasi.',
 icon: 'Lock',
 },
 {
 id: 'split',
 label: 'Split Settlement',
 description: 'Dana dibagi transparan setelah proyek selesai.',
 parts: [
 { recipient: 'SIAGA', percent: 7, label: 'Platform Fee' },
 { recipient: 'Pilot', percent: 93, label: 'Pilot Payout' },
 ],
 },
];
