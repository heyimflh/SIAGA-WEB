import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = {
 used: 'var(--color-accent, #00D2FF)',
 remaining: 'rgba(255, 255, 255, 0.15)',
};

function BudgetDonut({ used, total }) {
 const remaining = Math.max(total - used, 0);
 const percentage = total > 0 ? Math.round((used / total) * 100) : 0;

 const data = [
 { name: 'Terpakai', value: used },
 { name: 'Sisa', value: remaining },
 ];

 return (
 <div
 className="budget-donut"
 role="img"
 aria-label={`Budget terpakai ${percentage}% dari total`}
 style={{ width: 80, height: 80, position: 'relative' }}
 >
 <ResponsiveContainer width="100%" height="100%">
 <PieChart>
 <Pie
 data={data}
 cx="50%"
 cy="50%"
 innerRadius={26}
 outerRadius={37}
 startAngle={90}
 endAngle={-270}
 dataKey="value"
 stroke="none"
 animationDuration={800}
 >
 <Cell fill={COLORS.used} />
 <Cell fill={COLORS.remaining} />
 </Pie>
 </PieChart>
 </ResponsiveContainer>
 <span
 className="budget-donut__percentage"
 style={{
 position: 'absolute',
 top: '50%',
 left: '50%',
 transform: 'translate(-50%, -50%)',
 fontSize: '0.875rem',
 fontWeight: 700,
 color: '#00BFEA',
 }}
 aria-hidden="true"
 >
 {percentage}%
 </span>
 </div>
 );
}

export default BudgetDonut;
