import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Trash2, Activity, Clock, FileText, Eye, ScanLine } from 'lucide-react';
import { generatePDF } from '../utils/generatePDF';
import type { ApiResponse } from '../api/predictAPI';
import './Profile.css';

interface Prediction {
    disease: string;
    confidence: number;
}

interface HistoryEntry {
    id: number;
    date: string;
    predictions: Prediction[];
    image: string;
    imageType?: 'fundus' | 'facial';
}

const severityMap: Record<string, { level: string; label: string }> = {
    'Cataract': { level: 'mid', label: 'Moderate' },
    'Central Serous Chorioretinopathy': { level: 'mid', label: 'Moderate' },
    'Diabetic Retinopathy': { level: 'high', label: 'High' },
    'Glaucoma': { level: 'high', label: 'High' },
    'Healthy Eye': { level: 'info', label: 'Normal' },
    'Healthy Eye1': { level: 'info', label: 'Normal' },
    'Healthy_Eye': { level: 'info', label: 'Normal' },
    'Healthy_Eye1': { level: 'info', label: 'Normal' },
    'Conjunctivitis': { level: 'low', label: 'Low' },
    'Myopia': { level: 'low', label: 'Low' },
    'Retinal Detachment': { level: 'high', label: 'High' },
    'Retinitis Pigmentosa': { level: 'high', label: 'High' },
    'Macular Scar': { level: 'high', label: 'High' },
    'Disc Edema': { level: 'high', label: 'High' },
    'Eyelid': { level: 'low', label: 'Low' },
    'Pterygium': { level: 'low', label: 'Low' },
    'Strabismus': { level: 'low', label: 'Low' },
    'Uveitis': { level: 'mid', label: 'Moderate' },
    'Hypertensive Retinopathy': { level: 'mid', label: 'Moderate' },
    'Age-Related Macular Degeneration': { level: 'high', label: 'High' },
    'Ocular Hypertension': { level: 'mid', label: 'Moderate' },
};

function getSev(disease: string) {
    const key = disease.replace(/_/g, ' ');
    for (const [k, v] of Object.entries(severityMap)) {
        if (key.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(key.toLowerCase())) return v;
    }
    return { level: 'info', label: 'Unknown' };
}

function handleViewReport(entry: HistoryEntry) {
    const apiResult: ApiResponse = {
        status: 'success',
        top_predictions: entry.predictions,
    };
    generatePDF(apiResult, entry.imageType ?? 'fundus');
}

export function Profile() {
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem('medipredict_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setHistory(parsed);
                }
            } catch (e) {
                console.error('Failed to parse history.', e);
            }
        }
    }, []);

    const clearHistory = () => {
        if (confirm('Are you sure you want to clear your prediction history?')) {
            localStorage.removeItem('medipredict_history');
            setHistory([]);
        }
    };

    const totalScans = history.length;
    const lastScanDate = history.length > 0
        ? new Date(history[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : '—';
    const mostRecent = history.length > 0
        ? history[0].predictions[0]?.disease.replace(/_/g, ' ') ?? '—'
        : '—';

    return (
        <div className="prof-page page-enter">
            <div className="prof-layout">
                {/* User Header */}
                <div className="prof-user-header">
                    <div className="prof-avatar">
                        <User size={36} />
                    </div>
                    <div className="prof-user-info">
                        <h1>Patient</h1>
                        <p className="prof-since">Member since January 2026</p>
                    </div>
                    {history.length > 0 && (
                        <button className="btn btn-outline prof-clear-btn" onClick={clearHistory}>
                            <Trash2 size={15} /> Clear History
                        </button>
                    )}
                </div>

                {/* Stats Summary */}
                <div className="prof-stats-row">
                    <div className="prof-stat-card">
                        <div className="prof-stat-icon"><Activity size={18} /></div>
                        <div>
                            <div className="prof-stat-val">{totalScans}</div>
                            <div className="prof-stat-lbl">Total Scans</div>
                        </div>
                    </div>
                    <div className="prof-stat-card">
                        <div className="prof-stat-icon"><Clock size={18} /></div>
                        <div>
                            <div className="prof-stat-val">{lastScanDate}</div>
                            <div className="prof-stat-lbl">Last Scan Date</div>
                        </div>
                    </div>
                    <div className="prof-stat-card">
                        <div className="prof-stat-icon"><Eye size={18} /></div>
                        <div>
                            <div className="prof-stat-val">{mostRecent}</div>
                            <div className="prof-stat-lbl">Most Recent Finding</div>
                        </div>
                    </div>
                </div>

                {/* History */}
                <div className="prof-history-header">
                    <h2>Screening History</h2>
                </div>

                {history.length === 0 ? (
                    <div className="prof-empty-state">
                        <div className="prof-empty-icon"><ScanLine size={40} /></div>
                        <h3>No scans yet</h3>
                        <p>Run an AI analysis on the Detection page and click "Save to Profile" to see your screening history here.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/detection')}>
                            Go to AI Detection
                        </button>
                    </div>
                ) : (
                    <div className="prof-history-grid">
                        {history.map((entry) => {
                            const topPred = entry.predictions[0];
                            const sev = topPred ? getSev(topPred.disease) : { level: 'info', label: 'Unknown' };
                            return (
                                <div key={entry.id} className={`prof-history-card sev-accent-${sev.level}`}>
                                    <div className="prof-card-top">
                                        <div className="prof-card-date">
                                            <Calendar size={14} />
                                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <span className={`severity-badge severity-${sev.level}`}>
                                            <span className="dot" />{sev.label}
                                        </span>
                                    </div>

                                    {entry.image && (
                                        <div className="prof-card-img-wrap">
                                            <img src={entry.image} alt="Scan" />
                                        </div>
                                    )}

                                    <div className="prof-card-findings">
                                        <h4>
                                            <FileText size={14} />
                                            Findings
                                        </h4>
                                        {entry.predictions.slice(0, 3).map((pred, i) => (
                                            <div key={i} className="prof-finding-row">
                                                <span className="prof-finding-name">{pred.disease.replace(/_/g, ' ')}</span>
                                                <span className="prof-finding-conf">{pred.confidence.toFixed(1)}%</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="prof-view-report btn btn-outline" onClick={() => handleViewReport(entry)}>
                                        View Report
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
