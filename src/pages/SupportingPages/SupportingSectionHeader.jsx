import './SupportingSectionHeader.css';

/**
 * SupportingSectionHeader — reusable section header for Supporting Pages.
 * Provides consistent eyebrow, title, subtitle, and cyan accent line.
 *
 * @param {object} props
 * @param {string} [props.eyebrow] - Uppercase small label above title
 * @param {string} props.title - Section title (Montserrat bold)
 * @param {string} [props.subtitle] - Subtitle text (max-width 680px)
 * @param {'center'|'left'} [props.align='center'] - Text alignment
 * @param {boolean} [props.dark=false] - Dark background variant
 * @param {'h2'|'h3'} [props.headingLevel='h2'] - Heading element level
 */
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
