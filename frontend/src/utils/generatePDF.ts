import jsPDF from 'jspdf';
import type { ApiResponse } from '../api/predictAPI';

/* ─── colour constants ─── */
const GREEN = [13, 124, 95] as const;   // #0d7c5f
const AMBER = [217, 119, 6] as const;   // #d97706
const BLACK = [30, 30, 30] as const;
const GRAY = [100, 100, 100] as const;
const LIGHT_GRAY = [245, 245, 245] as const;
const WHITE = [255, 255, 255] as const;

/* ─── severity map ─── */
const severityMap: Record<string, { label: string }> = {
  'Cataract': { label: 'Moderate' },
  'Central Serous Chorioretinopathy': { label: 'Moderate' },
  'Conjunctivitis': { label: 'Low' },
  'Diabetic Retinopathy': { label: 'High' },
  'Disc Edema': { label: 'High' },
  'Eyelid': { label: 'Low' },
  'Glaucoma': { label: 'High' },
  'Healthy Eye': { label: 'Normal' },
  'Healthy_Eye': { label: 'Normal' },
  'Healthy_Eye1': { label: 'Normal' },
  'Macular Scar': { label: 'High' },
  'Myopia': { label: 'Low' },
  'Pterygium': { label: 'Low' },
  'Retinal Detachment': { label: 'High' },
  'Retinitis Pigmentosa': { label: 'High' },
  'Strabismus': { label: 'Low' },
  'Uveitis': { label: 'Moderate' },
  'Hypertensive Retinopathy': { label: 'Moderate' },
  'Age-Related Macular Degeneration': { label: 'High' },
  'Ocular Hypertension': { label: 'Moderate' },
};

function getSeverityLabel(disease: string): string {
  const clean = disease.replace(/_/g, ' ');
  for (const [k, v] of Object.entries(severityMap)) {
    if (clean.toLowerCase() === k.toLowerCase() || clean.toLowerCase().includes(k.toLowerCase())) {
      return v.label;
    }
  }
  return 'Unknown';
}

/* ─── clinical descriptions (patient-friendly) ─── */
const clinicalDescriptions: Record<string, string> = {
  'Uveitis': 'Uveitis is inflammation of the uvea, the middle layer of the eye. It can cause redness, pain, and light sensitivity. If untreated, it may lead to permanent vision loss. Treatment typically involves anti-inflammatory medications prescribed by an ophthalmologist.',
  'Cataract': 'A cataract is a clouding of the eye\'s natural lens, which sits behind the iris and pupil. It usually develops gradually and can make your vision appear foggy or dim. Cataracts are very treatable — surgery to replace the clouded lens is one of the most common and successful procedures worldwide.',
  'Conjunctivitis': 'Conjunctivitis, commonly known as "pink eye," is an inflammation of the thin transparent membrane covering the white of the eye. It can be caused by infections, allergies, or irritants. Most cases resolve on their own or with simple treatment, but a doctor should evaluate persistent symptoms.',
  'Diabetic Retinopathy': 'Diabetic retinopathy is a complication of diabetes that damages blood vessels in the retina at the back of the eye. It can cause blurred vision, floaters, and in severe cases, blindness. Early detection through regular screening is essential for people with diabetes to prevent irreversible damage.',
  'Disc Edema': 'Disc edema refers to swelling of the optic disc, the point where the optic nerve enters the eye. It can be a sign of elevated pressure inside the skull or local inflammation. This finding warrants prompt medical evaluation to identify and treat the underlying cause.',
  'Eyelid': 'An eyelid disorder encompasses structural or functional abnormalities of the eyelid, including drooping (ptosis), inflammation (blepharitis), or outward/inward turning. While often not vision-threatening, persistent eyelid problems should be evaluated by an eye care specialist.',
  'Glaucoma': 'Glaucoma is a group of conditions that damage the optic nerve, often associated with elevated eye pressure. It is sometimes called the "silent thief of sight" because it can progress without noticeable symptoms until significant vision is lost. Early detection and treatment can slow or prevent further damage.',
  'Healthy Eye': 'No pathological findings were detected. The analysis suggests your eye appears healthy with normal features. Continue with regular eye check-ups as recommended by your eye care provider to maintain good eye health.',
  'Macular Scar': 'A macular scar is fibrotic tissue at the macula, the central part of the retina responsible for sharp vision. It typically results from previous inflammation, injury, or infection. Macular scarring can cause permanent central vision loss, though peripheral vision usually remains intact.',
  'Myopia': 'Myopia, or nearsightedness, is a refractive error where close objects appear clear but distant objects look blurry. It occurs when the eyeball is too long or the cornea curves too steeply. Myopia is very common and easily corrected with glasses, contact lenses, or refractive surgery.',
  'Pterygium': 'A pterygium is a benign, wedge-shaped growth of tissue on the white of the eye that can extend onto the cornea. It is often associated with prolonged sun and wind exposure. Small pterygiums may not need treatment, but larger ones that affect vision can be removed surgically.',
  'Retinal Detachment': 'Retinal detachment occurs when the retina — the thin layer of light-sensitive tissue at the back of the eye — pulls away from its normal position. This is a medical emergency. Symptoms include sudden flashes of light, a shower of floaters, or a shadow across your vision. Seek immediate medical attention.',
  'Retinitis Pigmentosa': 'Retinitis pigmentosa is a group of inherited disorders that cause gradual breakdown of cells in the retina. Symptoms typically begin with difficulty seeing at night and a gradual loss of peripheral (side) vision. While there is currently no cure, ongoing research and supportive treatments can help manage the condition.',
  'Strabismus': 'Strabismus is a condition where the eyes do not align properly — one eye may turn inward, outward, upward, or downward while the other looks straight ahead. It can affect depth perception and may lead to amblyopia (lazy eye) if untreated. Treatment options include glasses, exercises, or surgery.',
  'Central Serous Chorioretinopathy': 'Central serous chorioretinopathy occurs when fluid builds up under the retina, causing a small detachment that distorts central vision. It is often linked to stress and typically resolves on its own within a few months. If symptoms persist, your doctor may recommend treatment to prevent permanent vision changes.',
  'Hypertensive Retinopathy': 'Hypertensive retinopathy is damage to the retinal blood vessels caused by chronically high blood pressure. It can lead to blurred vision and, in severe cases, vision loss. Managing blood pressure through medication and lifestyle changes is key to preventing progression.',
  'Age-Related Macular Degeneration': 'Age-related macular degeneration (AMD) is a progressive condition that affects the central part of the retina, leading to loss of central vision. It is the most common cause of vision loss in people over 50. Early detection allows for treatments that can slow progression and preserve remaining vision.',
  'Ocular Hypertension': 'Ocular hypertension means the pressure inside your eye is higher than normal, but there is no detectable damage to the optic nerve yet. It is considered a risk factor for developing glaucoma. Regular monitoring by an ophthalmologist is important to catch any changes early.',
};

function getDescription(disease: string): string {
  const clean = disease.replace(/_/g, ' ');
  for (const [k, v] of Object.entries(clinicalDescriptions)) {
    if (clean.toLowerCase() === k.toLowerCase()) return v;
  }
  // partial match
  for (const [k, v] of Object.entries(clinicalDescriptions)) {
    if (clean.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(clean.toLowerCase())) return v;
  }
  return `${clean} was identified by the AI screening model. Please consult an ophthalmologist for a detailed evaluation and diagnosis.`;
}

/* ─── helpers ─── */
function generateReportId(): string {
  const year = new Date().getFullYear();
  const num = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `RPT-${year}-${num}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(d: Date): string {
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/* ─── main export ─── */
export function generatePDF(
  resultData: ApiResponse,
  imageType: 'fundus' | 'facial' = 'fundus',
  analysisDuration?: number,
): void {
  if (!resultData.top_predictions || resultData.top_predictions.length === 0) return;

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();   // 210
  const pageH = doc.internal.pageSize.getHeight();   // 297
  const mL = 20;   // left margin
  const mR = 20;   // right margin
  const contentW = pageW - mL - mR;  // 170
  const now = new Date();
  const reportId = generateReportId();

  let y = 0; // current y-cursor

  /* ─── reusable drawing helpers ─── */
  const setFont = (family: string, style: string, size: number) => {
    doc.setFont(family, style);
    doc.setFontSize(size);
  };

  const textColor = (r: number, g: number, b: number) => doc.setTextColor(r, g, b);
  const drawColor = (r: number, g: number, b: number) => doc.setDrawColor(r, g, b);
  const fillColor = (r: number, g: number, b: number) => doc.setFillColor(r, g, b);

  const drawRule = (yPos: number, color = GREEN) => {
    drawColor(...color);
    doc.setLineWidth(0.6);
    doc.line(mL, yPos, pageW - mR, yPos);
  };

  const sectionHeading = (title: string): number => {
    y = checkPageBreak(y, 20);
    setFont('helvetica', 'bold', 12);
    textColor(...GREEN);
    doc.text(title.toUpperCase(), mL, y);
    y += 1.5;
    drawRule(y, GREEN);
    y += 6;
    return y;
  };

  /** Wrap text and return lines */
  const wrapText = (text: string, maxWidth: number, fontSize: number, fontStyle = 'normal'): string[] => {
    setFont('helvetica', fontStyle, fontSize);
    return doc.splitTextToSize(text, maxWidth) as string[];
  };

  /** Check if we need a new page; if so, add one and draw footer on old page */
  const checkPageBreak = (currentY: number, needed: number): number => {
    if (currentY + needed > pageH - 25) {
      drawFooter(reportId);
      doc.addPage();
      drawHeaderRule();
      return 25; // top of new page content area
    }
    return currentY;
  };

  /** Draw page footer */
  const drawFooter = (id: string) => {
    const fy = pageH - 12;
    drawColor(...GREEN);
    doc.setLineWidth(0.4);
    doc.line(mL, fy - 3, pageW - mR, fy - 3);

    setFont('helvetica', 'normal', 7);
    textColor(...GRAY);
    doc.text('MediPredict AI  ·  medipredict.com', mL, fy);
    doc.text(id, pageW / 2, fy, { align: 'center' });
    const pageNum = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1;
    doc.text(`Page ${pageNum}`, pageW - mR, fy, { align: 'right' });
  };

  /** Thin green rule at top of continuation pages */
  const drawHeaderRule = () => {
    drawColor(...GREEN);
    doc.setLineWidth(0.4);
    doc.line(mL, 15, pageW - mR, 15);
  };

  /* ═══════════════════════════════════════════════
     HEADER
     ═══════════════════════════════════════════════ */
  y = 20;
  setFont('helvetica', 'bold', 20);
  textColor(...GREEN);
  doc.text('MediPredict', mL, y);

  setFont('helvetica', 'normal', 9);
  textColor(...GRAY);
  doc.text('AI-Assisted Eye Screening Report', mL, y + 5.5);

  // Right-aligned report meta
  setFont('helvetica', 'normal', 8);
  textColor(...BLACK);
  doc.text(`Report ID: ${reportId}`, pageW - mR, y - 2, { align: 'right' });
  doc.text(`Generated: ${formatDate(now)}`, pageW - mR, y + 2.5, { align: 'right' });
  doc.text(`Time: ${formatTime(now)}`, pageW - mR, y + 7, { align: 'right' });

  y += 12;
  drawRule(y);
  y += 10;

  /* ═══════════════════════════════════════════════
     SECTION 1 — Patient & Scan Info
     ═══════════════════════════════════════════════ */
  y = sectionHeading('Patient & Scan Information');

  const col1X = mL;
  const col2X = mL + contentW / 2 + 5;
  const rowH = 6.5;

  const infoLeft = [
    ['Patient ID', 'Guest User'],
    ['Scan Date', formatDate(now)],
    ['Scan Time', formatTime(now)],
    ['Image Type', imageType === 'fundus' ? 'Fundus Image' : 'Facial Image'],
    ['Device', 'Browser-based Upload'],
  ];

  const infoRight = [
    ['Model Used', 'DenseNet121'],
    ['Analysis Duration', analysisDuration ? `${(analysisDuration / 1000).toFixed(1)}s` : '< 2s'],
    ['Report Version', 'v2.1'],
    ['Conditions Screened', '16'],
    ['Classification', 'Multi-class Probability'],
  ];

  for (let i = 0; i < Math.max(infoLeft.length, infoRight.length); i++) {
    y = checkPageBreak(y, rowH + 2);

    // alternating row background across full width
    if (i % 2 === 0) {
      fillColor(...LIGHT_GRAY);
      doc.rect(mL, y - 4, contentW, rowH, 'F');
    }

    if (infoLeft[i]) {
      setFont('helvetica', 'bold', 8);
      textColor(...GRAY);
      doc.text(infoLeft[i][0] + ':', col1X + 2, y);
      setFont('helvetica', 'normal', 8);
      textColor(...BLACK);
      doc.text(infoLeft[i][1], col1X + 38, y);
    }

    if (infoRight[i]) {
      setFont('helvetica', 'bold', 8);
      textColor(...GRAY);
      doc.text(infoRight[i][0] + ':', col2X, y);
      setFont('helvetica', 'normal', 8);
      textColor(...BLACK);
      doc.text(infoRight[i][1], col2X + 38, y);
    }
    y += rowH;
  }

  y += 6;

  /* ═══════════════════════════════════════════════
     SECTION 2 — Primary Finding
     ═══════════════════════════════════════════════ */
  const primary = resultData.top_predictions[0];
  const primaryName = primary.disease.replace(/_/g, ' ');
  const primarySeverity = getSeverityLabel(primary.disease);
  const primaryConf = primary.confidence;

  y = sectionHeading('Primary Finding');

  // Condition name + severity badge
  y = checkPageBreak(y, 12);
  setFont('helvetica', 'bold', 18);
  textColor(...BLACK);
  doc.text(primaryName, mL, y);

  // badge
  const badgeX = mL + doc.getTextWidth(primaryName) + 4;
  const badgeW = doc.setFont('helvetica', 'bold').setFontSize(8).getTextWidth(primarySeverity) + 8;
  const badgeColor: [number, number, number] =
    primarySeverity === 'High' ? [220, 38, 38] :
    primarySeverity === 'Moderate' ? [217, 119, 6] :
    primarySeverity === 'Low' ? [22, 163, 74] :
    primarySeverity === 'Normal' ? [59, 130, 246] :
    [...GRAY];

  fillColor(...badgeColor);
  doc.roundedRect(badgeX, y - 4.5, badgeW, 6, 1.5, 1.5, 'F');
  setFont('helvetica', 'bold', 7);
  textColor(...WHITE);
  doc.text(primarySeverity.toUpperCase(), badgeX + badgeW / 2, y - 0.8, { align: 'center' });

  y += 8;

  // Confidence
  y = checkPageBreak(y, 14);
  setFont('helvetica', 'normal', 9);
  textColor(...GRAY);
  doc.text('Confidence Score:', mL, y);
  setFont('helvetica', 'bold', 14);
  textColor(...BLACK);
  doc.text(`${primaryConf.toFixed(1)}%`, mL + 32, y);

  y += 5;

  // Confidence bar
  const barW = contentW;
  const barH = 5;
  fillColor(230, 230, 230);
  doc.roundedRect(mL, y, barW, barH, 2, 2, 'F');
  fillColor(...GREEN);
  const fillW = Math.max(4, (primaryConf / 100) * barW);
  doc.roundedRect(mL, y, fillW, barH, 2, 2, 'F');

  y += barH + 8;

  // Clinical description
  y = checkPageBreak(y, 25);
  setFont('helvetica', 'bold', 10);
  textColor(...BLACK);
  doc.text('Clinical Description', mL, y);
  y += 5;

  const descLines = wrapText(getDescription(primaryName), contentW, 9);
  y = checkPageBreak(y, descLines.length * 4.5 + 5);
  setFont('helvetica', 'normal', 9);
  textColor(...BLACK);
  for (const line of descLines) {
    y = checkPageBreak(y, 5);
    doc.text(line, mL, y);
    y += 4.5;
  }

  y += 4;

  // "What this means" paragraph
  y = checkPageBreak(y, 20);
  setFont('helvetica', 'bold', 10);
  textColor(...BLACK);
  doc.text('What This Means', mL, y);
  y += 5;

  const whatMeans = `A confidence score of ${primaryConf.toFixed(1)}% means the AI model considers ${primaryName} to be the most probable match among the 16 conditions it was trained to identify. This is not a confirmed diagnosis — it is a statistical likelihood based on visual patterns in your image. Other conditions were also considered (see below). A qualified ophthalmologist should interpret these results in the context of a full clinical examination.`;
  const wmLines = wrapText(whatMeans, contentW, 9);
  y = checkPageBreak(y, wmLines.length * 4.5 + 5);
  setFont('helvetica', 'normal', 9);
  textColor(...BLACK);
  for (const line of wmLines) {
    y = checkPageBreak(y, 5);
    doc.text(line, mL, y);
    y += 4.5;
  }

  y += 8;

  /* ═══════════════════════════════════════════════
     SECTION 3 — Other Predictions Considered
     ═══════════════════════════════════════════════ */
  y = sectionHeading('Other Predictions Considered');

  // Table header
  const tblColX = [mL, mL + 90, mL + 130];
  y = checkPageBreak(y, 8);
  fillColor(...GREEN);
  doc.rect(mL, y - 4.5, contentW, 7, 'F');
  setFont('helvetica', 'bold', 8);
  textColor(...WHITE);
  doc.text('Condition Name', tblColX[0] + 3, y - 0.5);
  doc.text('Confidence %', tblColX[1] + 3, y - 0.5);
  doc.text('Severity', tblColX[2] + 3, y - 0.5);
  y += 4;

  // Rows: show all predictions ≥ 1% (skip primary since it's shown above)
  const otherPreds = resultData.top_predictions.slice(1).filter(p => p.confidence >= 1);
  for (let i = 0; i < otherPreds.length; i++) {
    y = checkPageBreak(y, 8);
    if (i % 2 === 0) {
      fillColor(...LIGHT_GRAY);
      doc.rect(mL, y - 4, contentW, 7, 'F');
    }
    const pred = otherPreds[i];
    const name = pred.disease.replace(/_/g, ' ');
    setFont('helvetica', 'normal', 8.5);
    textColor(...BLACK);
    doc.text(name, tblColX[0] + 3, y);
    doc.text(`${pred.confidence.toFixed(1)}%`, tblColX[1] + 3, y);
    const sevLabel = getSeverityLabel(pred.disease);
    textColor(...GRAY);
    doc.text(sevLabel, tblColX[2] + 3, y);
    y += 7;
  }

  // footnote
  y += 2;
  setFont('helvetica', 'italic', 7);
  textColor(...GRAY);
  doc.text('* Conditions below 1% confidence are not shown in this report.', mL, y);
  y += 8;

  /* ═══════════════════════════════════════════════
     SECTION 4 — Recommended Next Steps
     ═══════════════════════════════════════════════ */
  y = sectionHeading('Recommended Next Steps');

  const steps = [
    `Schedule an appointment with a licensed ophthalmologist within 1–2 weeks for a comprehensive eye examination.`,
    `Mention this AI screening result during your visit and bring a copy of this report for reference.`,
    `Do not self-medicate or self-diagnose based on this result alone — it is a screening tool, not a clinical diagnosis.`,
    `If you experience sudden vision loss, severe eye pain, or flashes of light — seek emergency medical care immediately.`,
    `Learn more about ${primaryName} and other eye conditions at the MediPredict Eye Disease Info page.`,
  ];

  for (let i = 0; i < steps.length; i++) {
    const lines = wrapText(steps[i], contentW - 10, 9);
    y = checkPageBreak(y, lines.length * 4.5 + 4);
    setFont('helvetica', 'bold', 9);
    textColor(...GREEN);
    doc.text(`${i + 1}.`, mL, y);
    setFont('helvetica', 'normal', 9);
    textColor(...BLACK);
    for (let j = 0; j < lines.length; j++) {
      doc.text(lines[j], mL + 8, y);
      if (j < lines.length - 1) y += 4.5;
    }
    y += 6;
  }

  y += 4;

  /* ═══════════════════════════════════════════════
     SECTION 5 — About This Analysis
     ═══════════════════════════════════════════════ */
  y = sectionHeading('About This Analysis');

  const aboutText = `This report was generated by MediPredict, an AI-powered eye screening platform. The analysis uses a DenseNet121 deep learning model trained on a curated dataset covering 16 common eye conditions. The model processes your uploaded image and outputs ranked probability predictions for each condition. While the model achieves strong accuracy on its training and validation data, real-world performance may vary. AI screening is intended to supplement — not replace — professional medical evaluation.`;
  const aboutLines = wrapText(aboutText, contentW, 9);
  y = checkPageBreak(y, aboutLines.length * 4.5 + 5);
  setFont('helvetica', 'normal', 9);
  textColor(...BLACK);
  for (const line of aboutLines) {
    y = checkPageBreak(y, 5);
    doc.text(line, mL, y);
    y += 4.5;
  }

  y += 8;

  /* ═══════════════════════════════════════════════
     SECTION 6 — Disclaimer Box
     ═══════════════════════════════════════════════ */
  const disclaimerText = `This report is generated by an AI model for educational and screening purposes only. It does not constitute a medical diagnosis. MediPredict is not a licensed medical provider. Always consult a qualified ophthalmologist or eye care professional before making any health decisions.`;
  const discLines = wrapText(disclaimerText, contentW - 14, 8.5);
  const boxH = discLines.length * 4.2 + 16;

  y = checkPageBreak(y, boxH + 8);

  // Amber background box
  fillColor(254, 243, 199); // light amber
  doc.roundedRect(mL, y - 2, contentW, boxH, 2, 2, 'F');

  // left accent bar
  fillColor(...AMBER);
  doc.rect(mL, y - 2, 3, boxH, 'F');

  // header
  setFont('helvetica', 'bold', 10);
  textColor(...AMBER);
  doc.text('\u26A0  Medical Disclaimer', mL + 7, y + 5);

  // body
  setFont('helvetica', 'normal', 8.5);
  textColor(120, 53, 0);
  let dy = y + 12;
  for (const line of discLines) {
    doc.text(line, mL + 7, dy);
    dy += 4.2;
  }

  y = dy + 6;

  /* ═══════════════════════════════════════════════
     FOOTER (last page)
     ═══════════════════════════════════════════════ */
  // Draw footer on ALL pages
  const totalPages = (doc as unknown as { internal: { pages: unknown[] } }).internal.pages.length - 1;
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const fy = pageH - 12;
    drawColor(...GREEN);
    doc.setLineWidth(0.4);
    doc.line(mL, fy - 3, pageW - mR, fy - 3);
    setFont('helvetica', 'normal', 7);
    textColor(...GRAY);
    doc.text('MediPredict AI  \u00B7  medipredict.com', mL, fy);
    doc.text(reportId, pageW / 2, fy, { align: 'center' });
    doc.text(`Page ${p} of ${totalPages}`, pageW - mR, fy, { align: 'right' });
  }

  /* ─── Save ─── */
  const dateStr = now.toISOString().slice(0, 10);
  doc.save(`MediPredict-Report-${dateStr}.pdf`);
}
