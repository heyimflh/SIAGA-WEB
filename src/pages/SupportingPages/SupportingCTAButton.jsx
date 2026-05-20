/**
 * SupportingCTAButton — reusable CTA button for Supporting Pages.
 * Variants: primary, secondary, outline
 */
export default function SupportingCTAButton({
  variant = 'primary',
  href,
  onClick,
  children,
  className: extraClass = '',
}) {
  const baseClass = 'supporting-cta-btn';
  const variantClass = `${baseClass}--${variant}`;
  const fullClass = [baseClass, variantClass, extraClass].filter(Boolean).join(' ');

  if (href) {
    return (
      <a href={href} className={fullClass}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={fullClass} onClick={onClick}>
      {children}
    </button>
  );
}
