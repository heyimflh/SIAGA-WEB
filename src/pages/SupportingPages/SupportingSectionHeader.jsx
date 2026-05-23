import './SupportingSectionHeader.css';

export default function SupportingSectionHeader({
 eyebrow,
 title,
 subtitle,
 align = 'center',
 dark = false,
 headingLevel = 'h2',
}) {
 const Heading = headingLevel;
 const className = [
 'supporting-section-header',
 align === 'left' ? 'supporting-section-header--left' : '',
 dark ? 'supporting-section-header--dark' : '',
 ]
 .filter(Boolean)
 .join(' ');

 return (
 <div className={className}>
 {eyebrow && (
 <span className="supporting-section-header__eyebrow">{eyebrow}</span>
 )}
 <span className="supporting-section-header__accent" aria-hidden="true" />
 <Heading className="supporting-section-header__title">{title}</Heading>
 {subtitle && (
 <p className="supporting-section-header__subtitle">{subtitle}</p>
 )}
 </div>
 );
}
