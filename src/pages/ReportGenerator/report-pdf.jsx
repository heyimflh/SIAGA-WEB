import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, pdf, Font } from '@react-pdf/renderer';
import { getProjectImages, getInspectionData } from './report-data.js';

Font.register({
 family: 'Inter',
 fonts: [
 { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
 { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf', fontWeight: 600 },
 { src: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 },
 ],
});

const styles = StyleSheet.create({
 page: { padding: 40, fontFamily: 'Inter', fontSize: 9, color: '#0A2540' },

 coverPage: { padding: 0, position: 'relative' },
 coverOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,37,64,0.7)' },
 coverImage: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 },
 coverContent: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, padding: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
 coverBrand: { fontSize: 14, fontWeight: 700, color: '#00B4D8', letterSpacing: 2 },
 coverTitle: { fontSize: 28, fontWeight: 700, color: '#FFFFFF', marginTop: 20 },
 coverSubtitle: { fontSize: 14, color: '#B0D4E8', marginTop: 8 },
 coverMeta: { marginTop: 'auto' },
 coverMetaRow: { flexDirection: 'row', marginBottom: 6 },
 coverMetaLabel: { width: 120, fontSize: 9, color: '#8BA3BE' },
 coverMetaValue: { fontSize: 9, fontWeight: 600, color: '#FFFFFF' },

 header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #00B4D8', paddingBottom: 8, marginBottom: 20 },
 headerBrand: { fontSize: 12, fontWeight: 700, color: '#00B4D8' },
 headerProject: { fontSize: 8, color: '#4A6885', textAlign: 'right' },

 sectionTitle: { fontSize: 16, fontWeight: 700, color: '#0A2540', marginBottom: 12, borderLeft: '3px solid #00B4D8', paddingLeft: 10 },
 sectionSubtitle: { fontSize: 11, fontWeight: 600, color: '#0A2540', marginBottom: 8, marginTop: 12 },

 bodyText: { fontSize: 9, lineHeight: 1.6, color: '#4A6885', marginBottom: 8 },

 infoGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
 infoItem: { width: '50%', marginBottom: 8 },
 infoLabel: { fontSize: 7, color: '#8BA3BE', textTransform: 'uppercase', letterSpacing: 0.5 },
 infoValue: { fontSize: 9, fontWeight: 600, color: '#0A2540', marginTop: 2 },

 table: { marginTop: 8, marginBottom: 12 },
 tableHeader: { flexDirection: 'row', backgroundColor: '#0A2540', padding: 6, borderRadius: 3 },
 tableHeaderCell: { fontSize: 7, fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase' },
 tableRow: { flexDirection: 'row', padding: 6, borderBottom: '1px solid #E8F4FD' },
 tableRowAlt: { flexDirection: 'row', padding: 6, borderBottom: '1px solid #E8F4FD', backgroundColor: '#F8FCFF' },
 tableCell: { fontSize: 8, color: '#0A2540' },

 severityHigh: { backgroundColor: '#FEE2E2', color: '#DC2626', padding: '2 6', borderRadius: 3, fontSize: 7, fontWeight: 600 },
 severityMedium: { backgroundColor: '#FEF3C7', color: '#D97706', padding: '2 6', borderRadius: 3, fontSize: 7, fontWeight: 600 },
 severityLow: { backgroundColor: '#DBEAFE', color: '#2563EB', padding: '2 6', borderRadius: 3, fontSize: 7, fontWeight: 600 },
 severitySafe: { backgroundColor: '#D1FAE5', color: '#059669', padding: '2 6', borderRadius: 3, fontSize: 7, fontWeight: 600 },

 statsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
 statBox: { flex: 1, backgroundColor: '#F8FCFF', border: '1px solid #E8F4FD', borderRadius: 6, padding: 10, alignItems: 'center' },
 statValue: { fontSize: 18, fontWeight: 700, color: '#0A2540' },
 statLabel: { fontSize: 7, color: '#8BA3BE', marginTop: 3, textTransform: 'uppercase' },

 galleryImage: { width: '48%', height: 140, objectFit: 'cover', borderRadius: 4, marginBottom: 8 },
 mapImage: { width: '100%', height: 200, objectFit: 'cover', borderRadius: 6, marginBottom: 12 },

 footer: { position: 'absolute', bottom: 20, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid #E8F4FD', paddingTop: 8 },
 footerText: { fontSize: 7, color: '#8BA3BE' },

 signatureBox: { marginTop: 20, padding: 16, border: '1px solid #E8F4FD', borderRadius: 6 },
 signatureLine: { borderBottom: '1px solid #0A2540', width: 200, marginTop: 30, marginBottom: 6 },

 recItem: { flexDirection: 'row', marginBottom: 6, paddingLeft: 8 },
 recBullet: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00B4D8', marginRight: 8, marginTop: 3 },
 recText: { flex: 1, fontSize: 9, color: '#4A6885', lineHeight: 1.5 },
});

function getSeverityStyle(severity) {
 switch (severity?.toLowerCase()) {
 case 'high': return styles.severityHigh;
 case 'medium': return styles.severityMedium;
 case 'low': return styles.severityLow;
 case 'safe': return styles.severitySafe;
 default: return styles.severityLow;
 }
}

function PageHeader({ projectName }) {
 return (
 <View style={styles.header} fixed>
 <Text style={styles.headerBrand}>SIAGA</Text>
 <Text style={styles.headerProject}>{projectName}</Text>
 </View>
 );
}


function PageFooter({ reportId }) {
 return (
 <View style={styles.footer} fixed>
 <Text style={styles.footerText}>SIAGA — Sistem Inspeksi Aerial Geospasial Andalan</Text>
 <Text style={styles.footerText}>{reportId}</Text>
 <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
 </View>
 );
}


function CoverPage({ project, inspection, images, reportId, timestamp }) {
 return (
 <Page size="A4" style={styles.coverPage}>
 {images.coverImage && (
 <Image src={images.coverImage} style={styles.coverImage} />
 )}
 <View style={styles.coverOverlay} />
 <View style={styles.coverContent}>
 <View>
 <Text style={styles.coverBrand}>SIAGA REPORT</Text>
 <Text style={styles.coverTitle}>Laporan Inspeksi{'\n'}Infrastruktur</Text>
 <Text style={styles.coverSubtitle}>{project.nama}</Text>
 </View>
 <View style={styles.coverMeta}>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Jenis Infrastruktur</Text>
 <Text style={styles.coverMetaValue}>{project.jenis_infrastruktur}</Text>
 </View>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Lokasi</Text>
 <Text style={styles.coverMetaValue}>{project.lokasi?.kota}, {project.lokasi?.provinsi}</Text>
 </View>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Tanggal Inspeksi</Text>
 <Text style={styles.coverMetaValue}>{inspection.inspectionDate}</Text>
 </View>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Report ID</Text>
 <Text style={styles.coverMetaValue}>{reportId}</Text>
 </View>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Generated</Text>
 <Text style={styles.coverMetaValue}>{new Date(timestamp).toLocaleString('id-ID')}</Text>
 </View>
 <View style={styles.coverMetaRow}>
 <Text style={styles.coverMetaLabel}>Asset Health Index</Text>
 <Text style={styles.coverMetaValue}>{inspection.assetHealthIndex} — {inspection.riskLevel} Risk</Text>
 </View>
 </View>
 </View>
 </Page>
 );
}


function ExecutiveSummaryPage({ project, inspection, reportId }) {
 return (
 <Page size="A4" style={styles.page}>
 <PageHeader projectName={project.nama} />
 <Text style={styles.sectionTitle}>Executive Summary</Text>
 <Text style={styles.bodyText}>
 Laporan ini merupakan hasil inspeksi aerial menggunakan drone pada proyek {project.nama} yang berlokasi di {project.lokasi?.kota}, {project.lokasi?.provinsi}. Inspeksi dilakukan pada tanggal {inspection.inspectionDate} dengan cakupan area {inspection.inspectionArea} menggunakan {inspection.droneModel}.
 </Text>

 <View style={styles.statsRow}>
 <View style={styles.statBox}>
 <Text style={styles.statValue}>{inspection.assetHealthIndex}</Text>
 <Text style={styles.statLabel}>Health Index</Text>
 </View>
 <View style={styles.statBox}>
 <Text style={styles.statValue}>{inspection.riskLevel}</Text>
 <Text style={styles.statLabel}>Risk Level</Text>
 </View>
 <View style={styles.statBox}>
 <Text style={styles.statValue}>{inspection.criticalFindings + inspection.moderateFindings + inspection.safePoints}</Text>
 <Text style={styles.statLabel}>Total Findings</Text>
 </View>
 <View style={styles.statBox}>
 <Text style={styles.statValue}>{inspection.coveragePercentage}%</Text>
 <Text style={styles.statLabel}>Coverage</Text>
 </View>
 </View>

 <Text style={styles.sectionSubtitle}>Informasi Proyek</Text>
 <View style={styles.infoGrid}>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Asset Owner</Text><Text style={styles.infoValue}>{inspection.assetOwner}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Asset Type</Text><Text style={styles.infoValue}>{inspection.assetType}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Asset Code</Text><Text style={styles.infoValue}>{inspection.assetCode}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Risk Score</Text><Text style={styles.infoValue}>{inspection.overallRiskScore}/100</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Critical Findings</Text><Text style={styles.infoValue}>{inspection.criticalFindings}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Safe Points</Text><Text style={styles.infoValue}>{inspection.safePoints}</Text></View>
 </View>

 <Text style={styles.sectionSubtitle}>Rekomendasi Utama</Text>
 {inspection.recommendations.map((rec, i) => (
 <View key={i} style={styles.recItem}>
 <View style={styles.recBullet} />
 <Text style={styles.recText}>{rec}</Text>
 </View>
 ))}
 <PageFooter reportId={reportId} />
 </Page>
 );
}


function MapGpsPage({ project, inspection, images, reportId }) {
 return (
 <Page size="A4" style={styles.page}>
 <PageHeader projectName={project.nama} />
 <Text style={styles.sectionTitle}>GIS Map & GPS Coordinates</Text>

 {images.mapPreviewImage && (
 <Image src={images.mapPreviewImage} style={styles.mapImage} />
 )}

 <View style={styles.infoGrid}>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Area Inspeksi</Text><Text style={styles.infoValue}>{inspection.inspectionArea}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Coverage</Text><Text style={styles.infoValue}>{inspection.coveragePercentage}%</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>GPS Points</Text><Text style={styles.infoValue}>{inspection.gpsPoints} titik</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Drone Route</Text><Text style={styles.infoValue}>Grid Pattern + POI</Text></View>
 </View>

 <Text style={styles.sectionSubtitle}>Koordinat Utama</Text>
 <View style={styles.table}>
 <View style={styles.tableHeader}>
 <Text style={[styles.tableHeaderCell, { width: '15%' }]}>No</Text>
 <Text style={[styles.tableHeaderCell, { width: '45%' }]}>Label</Text>
 <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Latitude</Text>
 <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Longitude</Text>
 </View>
 {(inspection.mainCoordinates || []).map((coord, i) => (
 <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
 <Text style={[styles.tableCell, { width: '15%' }]}>{i + 1}</Text>
 <Text style={[styles.tableCell, { width: '45%' }]}>{coord.label}</Text>
 <Text style={[styles.tableCell, { width: '20%' }]}>{coord.lat?.toFixed(4)}</Text>
 <Text style={[styles.tableCell, { width: '20%' }]}>{coord.lng?.toFixed(4)}</Text>
 </View>
 ))}
 </View>
 <PageFooter reportId={reportId} />
 </Page>
 );
}


function GalleryPage({ project, inspection, images, reportId }) {
 const findingsWithImages = (inspection.findings || []).filter(f => f.image).slice(0, 6);
 return (
 <Page size="A4" style={styles.page}>
 <PageHeader projectName={project.nama} />
 <Text style={styles.sectionTitle}>Findings Gallery</Text>
 <Text style={styles.bodyText}>
 Dokumentasi visual temuan inspeksi drone. Total {inspection.photosCaptured} foto diambil selama {inspection.flightDuration} penerbangan.
 </Text>

 <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
 {findingsWithImages.map((finding, i) => (
 <View key={i} style={{ width: '48%', marginBottom: 12 }}>
 <Image src={finding.image} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }} />
 <View style={{ marginTop: 4 }}>
 <Text style={{ fontSize: 7, fontWeight: 600, color: '#0A2540' }}>{finding.id} — {finding.location}</Text>
 <Text style={getSeverityStyle(finding.severity)}>{finding.severity}</Text>
 <Text style={{ fontSize: 7, color: '#4A6885', marginTop: 2 }}>{finding.type}</Text>
 </View>
 </View>
 ))}
 </View>
 <PageFooter reportId={reportId} />
 </Page>
 );
}


function ConditionTablePage({ project, inspection, reportId }) {
 return (
 <Page size="A4" style={styles.page}>
 <PageHeader projectName={project.nama} />
 <Text style={styles.sectionTitle}>Asset Condition Table</Text>

 <View style={styles.table}>
 <View style={styles.tableHeader}>
 <Text style={[styles.tableHeaderCell, { width: '12%' }]}>ID</Text>
 <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Location</Text>
 <Text style={[styles.tableHeaderCell, { width: '22%' }]}>Finding</Text>
 <Text style={[styles.tableHeaderCell, { width: '12%' }]}>Severity</Text>
 <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Priority</Text>
 <Text style={[styles.tableHeaderCell, { width: '24%' }]}>Recommendation</Text>
 </View>
 {(inspection.findings || []).map((f, i) => (
 <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
 <Text style={[styles.tableCell, { width: '12%', fontSize: 7 }]}>{f.id}</Text>
 <Text style={[styles.tableCell, { width: '20%', fontSize: 7 }]}>{f.location}</Text>
 <Text style={[styles.tableCell, { width: '22%', fontSize: 7 }]}>{f.type}</Text>
 <Text style={[getSeverityStyle(f.severity), { width: '12%' }]}>{f.severity}</Text>
 <Text style={[styles.tableCell, { width: '10%', fontSize: 7, fontWeight: 600 }]}>{f.priority}</Text>
 <Text style={[styles.tableCell, { width: '24%', fontSize: 7 }]}>{f.recommendation}</Text>
 </View>
 ))}
 </View>

 <Text style={styles.sectionSubtitle}>Risk Distribution</Text>
 <View style={styles.statsRow}>
 <View style={[styles.statBox, { borderColor: '#FEE2E2' }]}>
 <Text style={[styles.statValue, { color: '#DC2626' }]}>{inspection.criticalFindings}</Text>
 <Text style={styles.statLabel}>Critical</Text>
 </View>
 <View style={[styles.statBox, { borderColor: '#FEF3C7' }]}>
 <Text style={[styles.statValue, { color: '#D97706' }]}>{inspection.moderateFindings}</Text>
 <Text style={styles.statLabel}>Moderate</Text>
 </View>
 <View style={[styles.statBox, { borderColor: '#D1FAE5' }]}>
 <Text style={[styles.statValue, { color: '#059669' }]}>{inspection.safePoints}</Text>
 <Text style={styles.statLabel}>Safe</Text>
 </View>
 </View>

 <Text style={styles.sectionSubtitle}>Maintenance Recommendations</Text>
 {inspection.recommendations.map((rec, i) => (
 <View key={i} style={styles.recItem}>
 <View style={styles.recBullet} />
 <Text style={styles.recText}>{rec}</Text>
 </View>
 ))}
 <PageFooter reportId={reportId} />
 </Page>
 );
}


function SignaturePage({ project, inspection, reportId, timestamp }) {
 return (
 <Page size="A4" style={styles.page}>
 <PageHeader projectName={project.nama} />
 <Text style={styles.sectionTitle}>Verification & Digital Signature</Text>

 <Text style={styles.bodyText}>
 Laporan ini telah diverifikasi dan ditandatangani secara digital oleh pilot inspeksi dan sistem SIAGA Report Engine.
 </Text>

 <View style={styles.infoGrid}>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Report Status</Text><Text style={styles.infoValue}>Verified ✓</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Generated By</Text><Text style={styles.infoValue}>SIAGA Report Engine v2.0</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Report ID</Text><Text style={styles.infoValue}>{reportId}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Timestamp</Text><Text style={styles.infoValue}>{new Date(timestamp).toLocaleString('id-ID')}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Asset Owner</Text><Text style={styles.infoValue}>{inspection.assetOwner}</Text></View>
 <View style={styles.infoItem}><Text style={styles.infoLabel}>Inspection Coverage</Text><Text style={styles.infoValue}>{inspection.coveragePercentage}%</Text></View>
 </View>

 <View style={styles.signatureBox}>
 <Text style={styles.sectionSubtitle}>Pilot Inspeksi</Text>
 <Text style={styles.bodyText}>{inspection.pilotSignature}</Text>
 <View style={styles.signatureLine} />
 <Text style={{ fontSize: 7, color: '#8BA3BE' }}>Tanda tangan digital</Text>
 </View>

 <View style={[styles.signatureBox, { marginTop: 16 }]}>
 <Text style={styles.sectionSubtitle}>Asset Owner / Client</Text>
 <Text style={styles.bodyText}>{inspection.assetOwner}</Text>
 <View style={styles.signatureLine} />
 <Text style={{ fontSize: 7, color: '#8BA3BE' }}>Tanda tangan digital</Text>
 </View>

 <View style={{ marginTop: 20, padding: 12, backgroundColor: '#F0FDF4', borderRadius: 6, border: '1px solid #D1FAE5' }}>
 <Text style={{ fontSize: 8, fontWeight: 600, color: '#059669' }}>✓ Report Verified by SIAGA System</Text>
 <Text style={{ fontSize: 7, color: '#4A6885', marginTop: 4 }}>
 Dokumen ini dihasilkan secara otomatis oleh SIAGA Report Engine dan telah melalui proses verifikasi data inspeksi.
 </Text>
 </View>
 <PageFooter reportId={reportId} />
 </Page>
 );
}


function InspectionReportDocument({ project, inspection, images, checkboxState, reportId, timestamp }) {
 return (
 <Document title={`SIAGA Report - ${project.nama}`} author="SIAGA Report Engine" subject="Inspection Report">
 {checkboxState.cover && (
 <>
 <CoverPage project={project} inspection={inspection} images={images} reportId={reportId} timestamp={timestamp} />
 <ExecutiveSummaryPage project={project} inspection={inspection} reportId={reportId} />
 </>
 )}
 {checkboxState.map && (
 <MapGpsPage project={project} inspection={inspection} images={images} reportId={reportId} />
 )}
 {checkboxState.gallery && (
 <GalleryPage project={project} inspection={inspection} images={images} reportId={reportId} />
 )}
 {checkboxState.table && (
 <ConditionTablePage project={project} inspection={inspection} reportId={reportId} />
 )}
 {checkboxState.signature && (
 <SignaturePage project={project} inspection={inspection} reportId={reportId} timestamp={timestamp} />
 )}
 </Document>
 );
}


export async function generateReportPdf({ project, checkboxState, reportId, timestamp }) {
 const images = getProjectImages(project);
 const inspection = getInspectionData(project);

 const doc = React.createElement(InspectionReportDocument, {
 project,
 inspection,
 images,
 checkboxState,
 reportId,
 timestamp,
 });

 const blob = await pdf(doc).toBlob();


 const projectSlug = (project.nama || 'project')
 .replace(/[^a-zA-Z0-9\s]/g, '')
 .replace(/\s+/g, '-')
 .substring(0, 40);
 const filename = `SIAGA-Report-${projectSlug}-${reportId}.pdf`;

 return { blob, filename };
}

export default generateReportPdf;
