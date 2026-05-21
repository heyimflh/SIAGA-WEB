/**
 * ProjectImage — Premium visual image for project context.
 * Displays a relevant infrastructure image with overlay and caption.
 *
 * Feature: project-detail-page
 */
import { getProjectImage } from '../../project-images.js';
import './ProjectImage.css';

export default function ProjectImage({ jenisInfrastruktur, projectName }) {
 const image = getProjectImage(jenisInfrastruktur);

 return (
 <div className="pd-project-image">
 <div className="pd-project-image__container">
 <img
 src={image.src}
 alt={image.alt}
 className="pd-project-image__img"
 loading="lazy"
 />
 <div className="pd-project-image__overlay" aria-hidden="true" />
 <div className="pd-project-image__caption">
 <span className="pd-project-image__caption-tag">{image.caption}</span>
 <span className="pd-project-image__caption-name">{projectName}</span>
 </div>
 </div>
 </div>
 );
}
