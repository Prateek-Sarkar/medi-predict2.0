import { useParams, NavLink } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { ChevronRight, AlertTriangle, Upload, Cpu, FileCheck, ExternalLink } from 'lucide-react';
import './ConditionDetail.css';

type Severity = 'low' | 'mid' | 'high' | 'info';

interface ConditionData {
  name: string;
  slug: string;
  icon: string;
  severity: Severity;
  label: string;
  summary: string;
  prevalence: string;
  ageOfOnset: string;
  treatability: string;
  earlySymptoms: string[];
  advancedSymptoms: string[];
  detectionSteps: string[];
  riskFactors: string[];
  whenToSeeDoctor: string;
  relatedConditions: string[];
}

/* ─── full condition database ─── */
const allConditions: ConditionData[] = [
  {
    name: "Cataract",
    slug: "cataract",
    icon: "🔵",
    severity: "mid",
    label: "Moderate",
    summary: "A cataract is a clouding of the eye's natural crystalline lens that sits behind the iris and pupil. It is the most common cause of vision loss in people over age 40, and the leading cause of blindness worldwide. Cataracts develop gradually, scattering or blocking light as it passes through the lens, resulting in blurry, dimmed, or yellowed vision.",
    prevalence: "~25 million Indians age 40+",
    ageOfOnset: "Usually 55+",
    treatability: "Highly treatable with surgery",
    earlySymptoms: ["Slightly blurred vision", "Increased glare sensitivity", "Colors appear faded", "Frequent prescription changes"],
    advancedSymptoms: ["Significant vision loss", "Double vision in one eye", "Halos around lights", "Difficulty reading or driving at night"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI analyzes lens clarity and opacity patterns", "Receive graded assessment with confidence score"],
    riskFactors: ["Age (55+)", "Diabetes", "Prolonged UV exposure", "Smoking", "Corticosteroid use", "Eye trauma history"],
    whenToSeeDoctor: "See an ophthalmologist if you notice persistent blurriness, increasing glare at night, or if colors appear unusually yellow or faded. Annual eye exams are recommended for anyone over 60.",
    relatedConditions: ["Glaucoma", "Diabetic Retinopathy", "Age-Related Macular Degeneration"]
  },
  {
    name: "Central Serous Chorioretinopathy",
    slug: "central-serous-chorioretinopathy",
    icon: "💧",
    severity: "mid",
    label: "Moderate",
    summary: "Central Serous Chorioretinopathy (CSC) occurs when fluid accumulates beneath the retina due to leakage from the choroidal layer. This buildup causes localized retinal detachment at the macula, leading to distorted or dimmed central vision. CSC predominantly affects young to middle-aged men and is often associated with stress and corticosteroid use.",
    prevalence: "~1 in 10,000 people",
    ageOfOnset: "20–50 years",
    treatability: "Often self-resolving; laser in chronic cases",
    earlySymptoms: ["Blurred central vision", "Objects appear smaller than normal", "Mild color desaturation", "A gray or dark spot in central vision"],
    advancedSymptoms: ["Persistent metamorphopsia", "Significant vision reduction", "Chronic subretinal fluid", "Retinal pigment changes"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI detects subretinal fluid accumulation patterns", "Receive assessment with macular profile analysis"],
    riskFactors: ["Type A personality / chronic stress", "Corticosteroid use", "Male sex", "Hypertension", "H. pylori infection", "Sleep apnea"],
    whenToSeeDoctor: "Consult an ophthalmologist promptly if you experience sudden blurring of central vision or visual distortion, especially if you're a young male under stress. Most acute cases resolve in 3–4 months, but chronic CSC may need photodynamic therapy.",
    relatedConditions: ["Age-Related Macular Degeneration", "Macular Scar", "Hypertensive Retinopathy"]
  },
  {
    name: "Conjunctivitis",
    slug: "conjunctivitis",
    icon: "🟢",
    severity: "low",
    label: "Low",
    summary: "Conjunctivitis, commonly known as 'pink eye', is inflammation of the conjunctiva — the thin transparent membrane that lines the eyelid and covers the white part of the eyeball. It can be caused by bacterial or viral infections, allergens, or irritants. While usually not serious, it is highly contagious in its infectious forms.",
    prevalence: "~13 million cases/year in India",
    ageOfOnset: "Any age",
    treatability: "Very treatable; often self-limiting",
    earlySymptoms: ["Redness in the white of the eye", "Itchiness or burning sensation", "Increased tearing", "Gritty feeling"],
    advancedSymptoms: ["Thick yellow-green discharge", "Crusting of eyelids overnight", "Sensitivity to light", "Swollen eyelids"],
    detectionSteps: ["Upload a high-resolution image of the eye surface", "AI identifies redness patterns and inflammation markers", "Receive classification of likely conjunctivitis type"],
    riskFactors: ["Contact lens use", "Exposure to infected individuals", "Allergies", "Poor hand hygiene", "Shared cosmetics or towels", "Swimming pools"],
    whenToSeeDoctor: "See a doctor if symptoms worsen after 3–4 days, if there is significant pain, vision changes, or intense sensitivity to light. Newborns with eye redness or discharge need immediate medical attention.",
    relatedConditions: ["Eyelid Disorder", "Pterygium"]
  },
  {
    name: "Diabetic Retinopathy",
    slug: "diabetic-retinopathy",
    icon: "🔴",
    severity: "high",
    label: "High",
    summary: "Diabetic Retinopathy is a serious complication of diabetes that damages the blood vessels in the retina. High blood sugar levels cause the vessels to swell, leak, or close off entirely, and in advanced stages, abnormal new blood vessels grow on the retinal surface. It is the leading cause of blindness in working-age adults globally.",
    prevalence: "~93 million Indians with diabetes at risk",
    ageOfOnset: "Diabetes-dependent; often 30+",
    treatability: "Manageable if caught early; irreversible damage in late stages",
    earlySymptoms: ["Often asymptomatic initially", "Mild floaters", "Slight blurriness", "Difficulty with color perception"],
    advancedSymptoms: ["Dark or empty areas in vision", "Sudden vision loss", "Vitreous hemorrhage", "Retinal detachment"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI detects microaneurysms, hemorrhages, and neovascularization", "Receive severity grading (mild/moderate/severe/proliferative)"],
    riskFactors: ["Poorly controlled diabetes (Type 1 or 2)", "Long duration of diabetes", "High blood pressure", "High cholesterol", "Pregnancy", "Smoking"],
    whenToSeeDoctor: "All diabetics should have annual dilated eye exams. Seek immediate care for sudden floaters, flashes of light, or any rapid vision change. Early laser treatment can reduce severe vision loss by 90%.",
    relatedConditions: ["Hypertensive Retinopathy", "Glaucoma", "Retinal Detachment", "Macular Scar"]
  },
  {
    name: "Disc Edema",
    slug: "disc-edema",
    icon: "🟠",
    severity: "high",
    label: "High",
    summary: "Disc Edema refers to swelling of the optic disc, the point where the optic nerve enters the eye. When caused by raised intracranial pressure, it is specifically termed papilledema. The swelling can indicate serious underlying conditions such as brain tumors, meningitis, or idiopathic intracranial hypertension, making prompt diagnosis critical.",
    prevalence: "Varies by underlying cause",
    ageOfOnset: "Any age; IIH peaks in women 20–45",
    treatability: "Depends on underlying cause; urgent evaluation needed",
    earlySymptoms: ["Transient visual obscurations", "Headaches (often worse in morning)", "Mild blurring", "Enlarged blind spot"],
    advancedSymptoms: ["Sustained vision loss", "Double vision (6th nerve palsy)", "Nausea and vomiting", "Pulsatile tinnitus"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI analyzes optic disc margins and elevation", "Receive disc swelling assessment with urgency flag"],
    riskFactors: ["Raised intracranial pressure", "Brain tumors or lesions", "Meningitis / encephalitis", "Obesity (for IIH)", "Cerebral venous thrombosis", "Certain medications (tetracyclines, vitamin A)"],
    whenToSeeDoctor: "Disc edema is a medical urgency. If detected, see a neurologist or neuro-ophthalmologist immediately for brain imaging (MRI/MRV) and lumbar puncture to rule out life-threatening causes.",
    relatedConditions: ["Glaucoma", "Ocular Hypertension", "Hypertensive Retinopathy"]
  },
  {
    name: "Eyelid Disorder",
    slug: "eyelid-disorder",
    icon: "🟡",
    severity: "low",
    label: "Low",
    summary: "Eyelid disorders encompass a range of conditions affecting the structure and function of the eyelids, including ptosis (drooping), ectropion (outward turning), entropion (inward turning), blepharitis (inflammation), and chalazion. While often benign, persistent eyelid issues can impair vision and cause chronic discomfort if untreated.",
    prevalence: "Very common; blepharitis affects ~47% of ophthalmology patients",
    ageOfOnset: "Any age; ptosis more common with aging",
    treatability: "Highly treatable; medical or surgical",
    earlySymptoms: ["Mild swelling or puffiness", "Crusting at lash line", "Itching or irritation", "Sensation of heaviness"],
    advancedSymptoms: ["Visual field obstruction (ptosis)", "Corneal exposure/damage", "Chronic red, inflamed lid margins", "Recurrent styes or chalazia"],
    detectionSteps: ["Upload a high-resolution facial/ocular image", "AI identifies lid margin irregularities and asymmetry", "Receive classification of likely eyelid condition"],
    riskFactors: ["Aging", "Seborrheic dermatitis", "Rosacea", "Contact lens wear", "Poor eyelid hygiene", "Autoimmune conditions"],
    whenToSeeDoctor: "See an ophthalmologist if you experience drooping that blocks vision, persistent lid swelling lasting more than a week, a lump that doesn't resolve, or signs of infection such as fever with lid redness.",
    relatedConditions: ["Conjunctivitis", "Pterygium"]
  },
  {
    name: "Glaucoma",
    slug: "glaucoma",
    icon: "🔴",
    severity: "high",
    label: "High",
    summary: "Glaucoma is a group of eye diseases that damage the optic nerve, usually due to abnormally high intraocular pressure. Known as the 'silent thief of sight,' it often progresses without symptoms until significant, irreversible peripheral vision loss has occurred. Open-angle glaucoma is the most common form, accounting for about 90% of cases.",
    prevalence: "~12 million Indians; 80 million worldwide",
    ageOfOnset: "Usually 40+; risk increases with age",
    treatability: "Not curable, but progression can be slowed or halted",
    earlySymptoms: ["Usually no symptoms (open-angle)", "Gradual peripheral vision loss", "Slightly elevated eye pressure", "Subtle optic disc changes"],
    advancedSymptoms: ["Tunnel vision", "Severe vision loss", "Eye pain and redness (acute angle-closure)", "Halos around lights", "Nausea (acute attack)"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI evaluates cup-to-disc ratio and neuroretinal rim", "Receive glaucoma risk assessment with confidence score"],
    riskFactors: ["Elevated intraocular pressure", "Family history", "Age over 60", "African or Hispanic descent", "Myopia", "Thin central cornea", "Diabetes"],
    whenToSeeDoctor: "Get regular comprehensive eye exams (every 1–2 years after 40). Seek emergency care for sudden eye pain, headache, nausea, halos around lights, or suddenly blurred vision — these signal an acute angle-closure attack.",
    relatedConditions: ["Ocular Hypertension", "Disc Edema", "Diabetic Retinopathy", "Myopia"]
  },
  {
    name: "Healthy Eye",
    slug: "healthy-eye",
    icon: "✅",
    severity: "info",
    label: "Normal",
    summary: "A healthy eye classification indicates that no pathological findings were detected during AI-powered fundus analysis. The retinal vasculature, optic disc, macula, and peripheral retina all appear within normal limits. This is the ideal screening outcome, though regular check-ups are still recommended to maintain eye health.",
    prevalence: "Majority of screened individuals",
    ageOfOnset: "N/A",
    treatability: "No treatment needed",
    earlySymptoms: ["No symptoms — this is a healthy result"],
    advancedSymptoms: ["N/A for healthy eyes"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI analyzes all retinal structures for abnormalities", "Receive confirmation of healthy eye status"],
    riskFactors: ["Maintain regular screening even with healthy results", "Monitor if family history of eye disease", "Manage systemic conditions (diabetes, hypertension)"],
    whenToSeeDoctor: "Continue routine eye examinations every 1–2 years, or annually if you're over 60, diabetic, or have a family history of eye disease. A healthy result today doesn't guarantee future health — regular monitoring is key.",
    relatedConditions: ["Healthy Eye (Variant)", "Myopia"]
  },
  {
    name: "Healthy Eye (Variant)",
    slug: "healthy-eye-variant",
    icon: "✅",
    severity: "info",
    label: "Normal",
    summary: "This classification represents a healthy eye with minor anatomical variations that fall within the normal range. These variants — such as slightly tilted discs, peripapillary atrophy, or myelinated nerve fibers — are benign findings that do not indicate disease. They are distinguished from pathology by the AI to reduce false positives.",
    prevalence: "Common anatomical variants",
    ageOfOnset: "N/A — congenital or age-related normal variants",
    treatability: "No treatment needed",
    earlySymptoms: ["No symptoms — normal findings"],
    advancedSymptoms: ["N/A — these are not pathological"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI distinguishes benign variants from true pathology", "Receive reassurance with details on the variant observed"],
    riskFactors: ["Tilted discs may mimic glaucoma on imaging", "Large cups may be physiologically normal", "Follow up if uncertain about variant significance"],
    whenToSeeDoctor: "If the AI flags your eye as a healthy variant, it means the finding is likely benign. However, if you have risk factors for glaucoma or other conditions, a follow-up with an ophthalmologist can provide additional reassurance.",
    relatedConditions: ["Healthy Eye", "Myopia", "Glaucoma"]
  },
  {
    name: "Macular Scar",
    slug: "macular-scar",
    icon: "🟠",
    severity: "high",
    label: "High",
    summary: "A macular scar is fibrotic tissue that forms at the macula, the central part of the retina responsible for sharp, detailed vision. Scarring typically results from prior inflammation, infection (e.g., toxoplasmosis), neovascularization, or trauma. Once formed, macular scars cause permanent central vision loss that cannot be reversed.",
    prevalence: "Varies; common sequela of multiple conditions",
    ageOfOnset: "Any age; depends on underlying cause",
    treatability: "Scar itself is irreversible; underlying cause may be treatable",
    earlySymptoms: ["Central vision distortion", "Dark or gray area in center of vision", "Difficulty reading fine print", "Reduced contrast sensitivity"],
    advancedSymptoms: ["Dense central scotoma (blind spot)", "Inability to recognize faces", "Complete loss of reading vision", "Permanent central vision deficit"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI identifies fibrotic tissue and lesion boundaries at the macula", "Receive scar assessment with probable etiology"],
    riskFactors: ["History of macular degeneration (wet)", "Ocular toxoplasmosis", "Ocular histoplasmosis", "High myopia", "Choroidal neovascularization", "Eye trauma or surgery"],
    whenToSeeDoctor: "If you notice central vision distortion or a new blind spot, see a retina specialist urgently. While existing scars cannot be removed, treating the underlying cause (e.g., anti-VEGF for wet AMD) can prevent further scarring.",
    relatedConditions: ["Age-Related Macular Degeneration", "Diabetic Retinopathy", "Central Serous Chorioretinopathy"]
  },
  {
    name: "Myopia",
    slug: "myopia",
    icon: "🔵",
    severity: "low",
    label: "Low",
    summary: "Myopia (nearsightedness) is a refractive error where the eye is longer than normal or the cornea curves too steeply, causing distant objects to appear blurry while near objects remain clear. High myopia (>-6D) significantly increases the risk of retinal detachment, glaucoma, and macular degeneration later in life.",
    prevalence: "~30% of the global population; rising",
    ageOfOnset: "Typically develops in childhood (6–14 years)",
    treatability: "Correctable with lenses; progression manageable",
    earlySymptoms: ["Squinting to see distant objects", "Eyestrain and headaches", "Need to sit closer to screens", "Difficulty seeing the board at school"],
    advancedSymptoms: ["Very blurry distance vision", "Frequent prescription changes", "Floaters (with high myopia)", "Retinal thinning visible on imaging"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI detects myopic disc morphology and peripapillary changes", "Receive myopia classification with severity indicator"],
    riskFactors: ["Family history of myopia", "Excessive near work / screen time", "Limited outdoor time in childhood", "East Asian descent", "Higher education levels", "Urban environments"],
    whenToSeeDoctor: "Children should have their first eye exam at 6 months, at 3 years, and before first grade. Adults with myopia should have annual exams. High myopes should be monitored closely for retinal complications.",
    relatedConditions: ["Retinal Detachment", "Glaucoma", "Macular Scar"]
  },
  {
    name: "Pterygium",
    slug: "pterygium",
    icon: "🟡",
    severity: "low",
    label: "Low",
    summary: "A pterygium is a benign, wing-shaped growth of fibrovascular tissue that extends from the conjunctiva onto the cornea. It is strongly associated with UV radiation exposure and is most common in people who spend significant time outdoors ('surfer's eye'). While usually harmless, large pterygia can distort vision by altering corneal curvature.",
    prevalence: "Up to 12% in tropical regions",
    ageOfOnset: "20–50 years; higher in outdoor workers",
    treatability: "Easily treatable; surgical removal if needed",
    earlySymptoms: ["Painless fleshy growth on the white of the eye", "Mild irritation or redness", "Foreign body sensation", "Cosmetic concern"],
    advancedSymptoms: ["Astigmatism from corneal distortion", "Visual axis obstruction", "Recurrent inflammation", "Restricted eye movement (rare)"],
    detectionSteps: ["Upload a high-resolution image of the eye surface", "AI identifies pterygium growth pattern and corneal involvement", "Receive size assessment and intervention recommendation"],
    riskFactors: ["Chronic UV exposure", "Dry, dusty, windy environments", "Outdoor occupation", "Living near the equator", "Male sex", "Not wearing sunglasses"],
    whenToSeeDoctor: "See an ophthalmologist if the growth is expanding toward the center of your cornea, causing persistent irritation, or affecting your vision. Surgical removal with conjunctival autograft has low recurrence rates.",
    relatedConditions: ["Conjunctivitis", "Eyelid Disorder"]
  },
  {
    name: "Retinal Detachment",
    slug: "retinal-detachment",
    icon: "🔴",
    severity: "high",
    label: "High",
    summary: "Retinal detachment is a medical emergency in which the retina separates from the underlying retinal pigment epithelium, cutting off its blood supply. Without prompt treatment, the photoreceptors begin to die, leading to permanent vision loss. The three types are rhegmatogenous (most common, caused by a retinal tear), tractional, and exudative.",
    prevalence: "~1 in 10,000 people per year",
    ageOfOnset: "Peak at 60–70; also in high myopes at any age",
    treatability: "Surgical emergency; excellent outcomes if treated early",
    earlySymptoms: ["Sudden increase in floaters", "Flashes of light (photopsia)", "Shadow or curtain across vision", "Sensation of a 'veil' descending"],
    advancedSymptoms: ["Rapid, severe vision loss", "Complete visual field defect", "Central vision destruction if macula detaches", "Permanent blindness if untreated"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI detects retinal elevation, tears, and fluid patterns", "Receive emergency-flagged assessment with urgency rating"],
    riskFactors: ["High myopia (-6D or more)", "Previous retinal detachment", "Prior cataract surgery", "Eye trauma", "Family history", "Lattice degeneration", "Age over 50"],
    whenToSeeDoctor: "THIS IS AN EMERGENCY. If you experience a sudden shower of floaters, flashes of light, or a shadow/curtain in your peripheral vision, seek immediate emergency eye care. Hours matter — early surgery can save your sight.",
    relatedConditions: ["Myopia", "Diabetic Retinopathy", "Macular Scar"]
  },
  {
    name: "Hypertensive Retinopathy",
    slug: "hypertensive-retinopathy",
    icon: "🟠",
    severity: "mid",
    label: "Moderate",
    summary: "Hypertensive Retinopathy is damage to the retinal blood vessels caused by chronically elevated blood pressure. The retinal vasculature mirrors the state of blood vessels throughout the body, making the eye a window into systemic cardiovascular health. Signs include arteriovenous nicking, copper/silver wiring, flame hemorrhages, and cotton-wool spots.",
    prevalence: "Present in ~10–18% of hypertensive Indians",
    ageOfOnset: "Typically 40+; correlates with hypertension duration",
    treatability: "Reversible in early stages with blood pressure control",
    earlySymptoms: ["Usually asymptomatic", "Mild arteriolar narrowing on exam", "Subtle visual changes", "Headaches (from underlying hypertension)"],
    advancedSymptoms: ["Flame-shaped hemorrhages visible", "Cotton-wool spots", "Optic disc swelling (malignant phase)", "Sudden vision loss"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI identifies vascular changes, hemorrhages, and exudates", "Receive Keith-Wagener-Barker grade classification"],
    riskFactors: ["Uncontrolled hypertension", "Long duration of high blood pressure", "Smoking", "Diabetes (coexisting)", "High cholesterol", "Obesity", "African descent"],
    whenToSeeDoctor: "All hypertensive patients should have regular fundus examinations. Seek urgent care if you experience sudden vision changes, severe headache, or if your blood pressure is consistently above 180/120 mmHg.",
    relatedConditions: ["Diabetic Retinopathy", "Disc Edema", "Retinal Detachment"]
  },
  {
    name: "Age-Related Macular Degeneration",
    slug: "age-related-macular-degeneration",
    icon: "🟠",
    severity: "high",
    label: "High",
    summary: "Age-Related Macular Degeneration (AMD) is the progressive deterioration of the macula, leading to loss of sharp central vision. It is the leading cause of irreversible vision loss in developed countries for people over 50. AMD has two forms: dry (atrophic) which progresses slowly, and wet (neovascular) which can cause rapid, severe vision loss.",
    prevalence: "~4.7 million Indians; 196 million worldwide",
    ageOfOnset: "Usually 50+; risk doubles every decade after 50",
    treatability: "Wet AMD treatable with anti-VEGF; dry AMD has limited treatment",
    earlySymptoms: ["Drusen deposits visible on exam", "Mild central blur", "Need for brighter light when reading", "Difficulty adapting to low light"],
    advancedSymptoms: ["Straight lines appear wavy (metamorphopsia)", "Dark or empty area in central vision", "Rapid central vision loss (wet AMD)", "Difficulty recognizing faces"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI detects drusen, pigment changes, and neovascularization", "Receive AMD classification (early/intermediate/advanced) with type"],
    riskFactors: ["Age over 50", "Smoking (doubles risk)", "Family history / genetics", "Caucasian descent", "Obesity", "Cardiovascular disease", "High-fat diet"],
    whenToSeeDoctor: "If you notice wavy or distorted lines (check with an Amsler grid), a dark spot in your central vision, or rapid vision changes, see a retina specialist urgently. Early anti-VEGF treatment for wet AMD can preserve vision.",
    relatedConditions: ["Macular Scar", "Central Serous Chorioretinopathy", "Diabetic Retinopathy"]
  },
  {
    name: "Ocular Hypertension",
    slug: "ocular-hypertension",
    icon: "🟡",
    severity: "mid",
    label: "Moderate",
    summary: "Ocular Hypertension is a condition where the intraocular pressure (IOP) is consistently elevated above the normal range (>21 mmHg) but without detectable optic nerve damage or visual field loss. It is considered the most significant risk factor for developing open-angle glaucoma, making regular monitoring essential for affected individuals.",
    prevalence: "~4.5–9.4% of adults over 40",
    ageOfOnset: "Usually 40+",
    treatability: "Manageable with drops; may prevent glaucoma progression",
    earlySymptoms: ["Typically no symptoms", "Elevated IOP found incidentally on exam", "Normal vision and visual fields", "No optic disc damage visible"],
    advancedSymptoms: ["May convert to open-angle glaucoma", "Gradual peripheral vision loss (if progresses)", "Increased cup-to-disc ratio (if progresses)", "Remains asymptomatic until damage occurs"],
    detectionSteps: ["Upload a high-resolution fundus image", "AI evaluates optic disc structure and cup-to-disc ratio", "Receive risk stratification for glaucoma conversion"],
    riskFactors: ["Age over 40", "Family history of glaucoma", "African descent", "High myopia", "Thin central cornea", "Diabetes", "Hypertension"],
    whenToSeeDoctor: "If you have been diagnosed with ocular hypertension, follow your ophthalmologist's monitoring schedule (typically every 6–12 months). The Ocular Hypertension Treatment Study showed that topical treatment reduces glaucoma risk by ~50%.",
    relatedConditions: ["Glaucoma", "Disc Edema", "Myopia"]
  }
];

/* ─── severity color helpers ─── */
function severityColor(sev: Severity) {
  switch (sev) {
    case 'low': return 'var(--c-low)';
    case 'mid': return 'var(--c-mid)';
    case 'high': return 'var(--c-high)';
    case 'info': return 'var(--c-info)';
  }
}

function severityBg(sev: Severity) {
  switch (sev) {
    case 'low': return 'var(--c-low-bg)';
    case 'mid': return 'var(--c-mid-bg)';
    case 'high': return 'var(--c-high-bg)';
    case 'info': return 'var(--c-info-bg)';
  }
}

const stepIcons = [Upload, Cpu, FileCheck];

export function ConditionDetail() {
  const { slug } = useParams<{ slug: string }>();
  const stepsRef = useRef<HTMLDivElement>(null);

  const condition = allConditions.find(c => c.slug === slug);

  /* Intersection Observer for step animation */
  useEffect(() => {
    if (!stepsRef.current) return;
    const cards = stepsRef.current.querySelectorAll('.cd-step-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    cards.forEach(c => observer.observe(c));
    return () => observer.disconnect();
  }, [condition]);

  /* scroll to top on slug change */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!condition) {
    return (
      <div className="cd-not-found">
        <h2>Condition Not Found</h2>
        <p>The condition you're looking for doesn't exist in our database.</p>
        <NavLink to="/diseases" className="cd-back-btn">← Back to All Conditions</NavLink>
      </div>
    );
  }

  const c = condition;
  const related = c.relatedConditions
    .map(name => allConditions.find(a => a.name === name))
    .filter(Boolean) as ConditionData[];

  return (
    <div className="cd-page">
      {/* ─── Breadcrumb ─── */}
      <nav className="cd-breadcrumb">
        <NavLink to="/diseases">Eye Conditions</NavLink>
        <ChevronRight size={14} />
        <span>{c.name}</span>
      </nav>

      {/* ─── Hero ─── */}
      <section className="cd-hero" style={{ '--sev-color': severityColor(c.severity), '--sev-bg': severityBg(c.severity) } as React.CSSProperties}>
        <div className="cd-hero-text">
          <div className="cd-hero-icon">{c.icon}</div>
          <h1>{c.name}</h1>
          <div className="cd-severity-badge" style={{ background: severityBg(c.severity), color: severityColor(c.severity) }}>
            <span className="cd-sev-dot" style={{ background: severityColor(c.severity) }} />
            {c.label} Severity
          </div>
          <p className="cd-summary">{c.summary}</p>
        </div>
        <div className="cd-hero-visual">
          <div className="cd-retina-graphic">
            <div className="cd-retina-ring ring-1" />
            <div className="cd-retina-ring ring-2" />
            <div className="cd-retina-ring ring-3" />
            <div className="cd-retina-center">{c.icon}</div>
          </div>
        </div>
      </section>

      {/* ─── Overview Cards ─── */}
      <section className="cd-overview-row">
        <div className="cd-overview-card">
          <div className="cd-overview-label">Prevalence</div>
          <div className="cd-overview-value">{c.prevalence}</div>
        </div>
        <div className="cd-overview-card">
          <div className="cd-overview-label">Age of Onset</div>
          <div className="cd-overview-value">{c.ageOfOnset}</div>
        </div>
        <div className="cd-overview-card">
          <div className="cd-overview-label">Treatability</div>
          <div className="cd-overview-value">{c.treatability}</div>
        </div>
      </section>

      {/* ─── Symptoms ─── */}
      <section className="cd-section">
        <h2 className="cd-section-title">Symptoms</h2>
        <div className="cd-symptoms-grid">
          <div className="cd-symptom-col">
            <h3 className="cd-symptom-heading early">Early Signs</h3>
            <div className="cd-chips">
              {c.earlySymptoms.map((s, i) => (
                <span key={i} className="cd-chip early" style={{ animationDelay: `${i * 0.06}s` }}>{s}</span>
              ))}
            </div>
          </div>
          <div className="cd-symptom-col">
            <h3 className="cd-symptom-heading advanced">Advanced Signs</h3>
            <div className="cd-chips">
              {c.advancedSymptoms.map((s, i) => (
                <span key={i} className="cd-chip advanced" style={{ animationDelay: `${i * 0.06}s` }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How AI Detects This ─── */}
      <section className="cd-section">
        <h2 className="cd-section-title">How Our AI Detects This</h2>
        <div className="cd-steps-row" ref={stepsRef}>
          {c.detectionSteps.map((step, i) => {
            const Icon = stepIcons[i] || FileCheck;
            return (
              <div key={i} className="cd-step-card" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="cd-step-number">{i + 1}</div>
                <div className="cd-step-icon"><Icon size={24} /></div>
                <p className="cd-step-text">{step}</p>
                {i < c.detectionSteps.length - 1 && <div className="cd-step-connector" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Risk Factors ─── */}
      <section className="cd-section">
        <h2 className="cd-section-title">Risk Factors</h2>
        <div className="cd-risk-tags">
          {c.riskFactors.map((r, i) => (
            <span key={i} className="cd-risk-tag" style={{ animationDelay: `${i * 0.05}s` }}>{r}</span>
          ))}
        </div>
      </section>

      {/* ─── When to See a Doctor ─── */}
      <section className="cd-doctor-callout" style={{ borderColor: severityColor(c.severity) }}>
        <div className="cd-doctor-icon">
          <AlertTriangle size={28} color={severityColor(c.severity)} />
        </div>
        <div className="cd-doctor-content">
          <h3>When to See a Doctor</h3>
          <p>{c.whenToSeeDoctor}</p>
          <NavLink to="/detect" className="cd-cta-btn" style={{ background: severityColor(c.severity) }}>
            Get AI Screening Now →
          </NavLink>
        </div>
      </section>

      {/* ─── Related Conditions ─── */}
      {related.length > 0 && (
        <section className="cd-section">
          <h2 className="cd-section-title">Related Conditions</h2>
          <div className="cd-related-grid">
            {related.map(r => (
              <NavLink key={r.slug} to={`/diseases/${r.slug}`} className={`cd-related-card ${r.severity}`}>
                <span className="cd-related-icon">{r.icon}</span>
                <div>
                  <div className="cd-related-name">{r.name}</div>
                  <div className="cd-related-label">{r.label} Severity</div>
                </div>
                <ExternalLink size={14} className="cd-related-arrow" />
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* ─── Bottom nav ─── */}
      <div className="cd-bottom-nav">
        <NavLink to="/diseases" className="cd-back-link">← All Eye Conditions</NavLink>
        <NavLink to="/detect" className="cd-scan-link">Start AI Scan →</NavLink>
      </div>
    </div>
  );
}
