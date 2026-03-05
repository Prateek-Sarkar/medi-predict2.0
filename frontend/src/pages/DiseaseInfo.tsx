import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './DiseaseInfo.css';

interface Condition {
  name: string;
  icon: string;
  severity: 'low' | 'mid' | 'high' | 'info';
  label: string;
  desc: string;
}

const conditions: Condition[] = [
  { name: "Cataract", icon: "🔵", severity: "mid", label: "Moderate",
    desc: "Clouding of the eye's natural lens, affecting vision clarity. Detected via lens opacity analysis in fundus scans." },
  { name: "Central Serous Chorioretinopathy", icon: "💧", severity: "mid", label: "Moderate",
    desc: "Fluid buildup beneath the retina causing central vision distortion. Often stress-related and reversible." },
  { name: "Conjunctivitis", icon: "🟢", severity: "low", label: "Low",
    desc: "Inflammation of the conjunctiva. Common, usually infectious or allergic in origin." },
  { name: "Diabetic Retinopathy", icon: "🔴", severity: "high", label: "High",
    desc: "Diabetes-induced damage to retinal blood vessels. A leading cause of preventable blindness worldwide." },
  { name: "Disc Edema", icon: "🟠", severity: "high", label: "High",
    desc: "Swelling of the optic disc, indicating elevated intracranial pressure or local inflammation." },
  { name: "Eyelid Disorder", icon: "🟡", severity: "low", label: "Low",
    desc: "Structural or functional abnormalities of the eyelid, including ptosis, ectropion, and blepharitis." },
  { name: "Glaucoma", icon: "🔴", severity: "high", label: "High",
    desc: "Progressive optic nerve damage typically caused by elevated intraocular pressure. Early detection is critical." },
  { name: "Healthy Eye", icon: "✅", severity: "info", label: "Normal",
    desc: "No pathological findings detected. The fundus shows normal vasculature, disc, and macula." },
  { name: "Healthy Eye (Variant)", icon: "✅", severity: "info", label: "Normal",
    desc: "A secondary healthy class representing minor anatomical variations within the normal range." },
  { name: "Macular Scar", icon: "🟠", severity: "high", label: "High",
    desc: "Fibrotic scarring at the macula resulting in permanent central vision loss. Often post-inflammatory." },
  { name: "Myopia", icon: "🔵", severity: "low", label: "Low",
    desc: "Refractive error where close objects are clear but distant objects appear blurry. Identified via disc morphology." },
  { name: "Pterygium", icon: "🟡", severity: "low", label: "Low",
    desc: "Benign fibrovascular growth extending from the conjunctiva onto the cornea, often UV-related." },
  { name: "Retinal Detachment", icon: "🔴", severity: "high", label: "High",
    desc: "The retinal layer separates from underlying tissue — a medical emergency requiring immediate intervention." },
  { name: "Hypertensive Retinopathy", icon: "🟠", severity: "mid", label: "Moderate",
    desc: "Retinal damage caused by sustained high blood pressure, visible as arteriovenous nicking and flame hemorrhages." },
  { name: "Age-Related Macular Degeneration", icon: "🟠", severity: "high", label: "High",
    desc: "Progressive deterioration of the macula, the most common cause of vision loss in people over 50." },
  { name: "Ocular Hypertension", icon: "🟡", severity: "mid", label: "Moderate",
    desc: "Elevated pressure within the eye without detectable optic nerve damage — a key glaucoma precursor." },
];

type Filter = 'all' | 'low' | 'mid' | 'high';

export function DiseaseInfo() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return conditions.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(search.toLowerCase().trim());
      const matchFilter = activeFilter === 'all' || c.severity === activeFilter;
      return matchSearch && matchFilter;
    });
  }, [search, activeFilter]);

  const filters: { key: Filter; label: string; className?: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low', label: 'Low Severity', className: 'low' },
    { key: 'mid', label: 'Moderate', className: 'mid' },
    { key: 'high', label: 'High Severity', className: 'high' },
  ];

  return (
    <div className="di-page">
      {/* HERO */}
      <section className="di-hero">
        <div className="di-hero-label"><span className="dot" />AI-Powered Screening</div>
        <h1>
          16 conditions our AI<br />is trained to <em>detect</em>
        </h1>
        <p className="di-hero-sub">
          Each condition is screened using fundus imagery analysis. Browse by severity or search to learn more about what our model identifies.
        </p>
        <div className="di-stats-bar">
          <div className="di-stat"><div className="di-stat-val">16</div><div className="di-stat-lbl">Conditions</div></div>
          <div className="di-stat-divider" />
          <div className="di-stat"><div className="di-stat-val">94.2%</div><div className="di-stat-lbl">Accuracy</div></div>
          <div className="di-stat-divider" />
          <div className="di-stat"><div className="di-stat-val">&lt;2s</div><div className="di-stat-lbl">Analysis Time</div></div>
          <div className="di-stat-divider" />
          <div className="di-stat"><div className="di-stat-val">Fundus</div><div className="di-stat-lbl">Imaging Type</div></div>
        </div>
      </section>

      {/* CONTROLS */}
      <div className="di-controls">
        <div className="di-search-wrap">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search conditions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="di-filter-pills">
          {filters.map(f => (
            <button
              key={f.key}
              className={`di-pill ${f.className ?? ''} ${activeFilter === f.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="di-results-count">
          {filtered.length} condition{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* GRID */}
      <div className="di-grid">
        {filtered.length > 0 ? (
          filtered.map((c, i) => (
            <div
              key={c.name}
              className={`di-card ${c.severity}`}
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <div className="di-card-icon">{c.icon}</div>
              <div className="di-card-title">{c.name}</div>
              <div className="di-card-desc">{c.desc}</div>
              <div className="di-card-footer">
                <div className="di-severity-badge">
                  <span className="dot" />
                  {c.label} Severity
                </div>
                <NavLink to={`/diseases/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`} className="di-card-link">Learn more →</NavLink>
              </div>
            </div>
          ))
        ) : (
          <div className="di-empty">
            <Search size={40} strokeWidth={1.5} />
            <p>No conditions match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
