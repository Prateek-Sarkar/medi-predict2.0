import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { generatePDF } from '../utils/generatePDF';
import {
    Upload, Image, Clock, FileText, Sparkles,
    Loader2, AlertCircle, CheckCircle, Download, Save, ShieldAlert, ArrowRight
} from 'lucide-react';
import type { ApiResponse } from '../api/predictAPI';
import './Detection.css';

/** Map confidence % → a severity label that matches the result */
function getSeverity(confidence: number): { level: string; label: string } {
    if (confidence >= 80) return { level: 'high', label: 'High' };
    if (confidence >= 50) return { level: 'mid', label: 'Moderate' };
    if (confidence >= 20) return { level: 'low', label: 'Low' };
    return { level: 'info', label: 'Minimal' };
}

export function Detection() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ApiResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [analysisTime, setAnalysisTime] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    const handleFile = (selectedFile: File) => {
        if (!selectedFile.type.startsWith('image/')) {
            setError('Please upload an image file.');
            return;
        }
        setFile(selectedFile);
        setError(null);
        setResult(null);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
    };

    const clearSelection = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError(null);
    };

    const handlePredict = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        const startTime = performance.now();
        try {
            const { predictImage } = await import('../api/predictAPI');
            const data = await predictImage(file);
            setAnalysisTime(performance.now() - startTime);
            if (data.status === 'error') {
                setError(data.message || 'The image could not be classified. Please upload a valid eye image.');
            } else {
                setResult(data);
            }
        } catch (err: unknown) {
            console.error(err);
            setError('Failed to connect to the prediction server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const saveToProfile = () => {
        if (!result || !preview || !result.top_predictions) return;
        const history = JSON.parse(localStorage.getItem('medipredict_history') || '[]');
        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            predictions: result.top_predictions,
            image: preview,
        };
        localStorage.setItem('medipredict_history', JSON.stringify([newEntry, ...history]));
        alert('Result saved to profile successfully!');
    };

    const downloadReport = () => {
        if (!result || !result.top_predictions || result.top_predictions.length === 0) return;
        generatePDF(result, 'fundus', analysisTime ?? undefined);
    };

    const topPrediction = result?.top_predictions?.[0];
    const topSeverity = topPrediction ? getSeverity(topPrediction.confidence) : null;

    return (
        <div className="det-page page-enter">
            {/* Header */}
            <section className="det-hero">
                <div className="det-hero-label"><span className="dot" />AI-Powered Analysis</div>
                <h1>Eye disease <em>detection</em></h1>
                <p className="det-hero-sub">Upload an eye image and our AI will automatically detect and classify across 16 conditions.</p>
            </section>

            <div className={`det-layout ${result && result.top_predictions && result.top_predictions.length > 0 ? 'has-result' : ''}`}>
                {/* LEFT: Upload area */}
                <div className="det-upload-col">
                    {/* Upload card */}
                    <div className="det-upload-card">
                        {!preview ? (
                            <div
                                className={`det-dropzone ${dragActive ? 'drag-active' : ''}`}
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                onDragLeave={() => setDragActive(false)}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    setDragActive(false);
                                    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                                }}
                            >
                                <div className="det-drop-icon"><Upload size={28} /></div>
                                <h3>Click or drag to upload</h3>
                                <p>PNG, JPG or JPEG — max 10MB</p>
                                <span className="det-drop-hint">Fundus or facial eye image — the AI detects the type automatically</span>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        ) : (
                            <div className="det-preview-wrap-inner">
                                <img src={preview} alt="Upload preview" className="det-preview-img" />
                                <div className="det-preview-actions">
                                    <button className="btn btn-outline" onClick={clearSelection}>Change Image</button>
                                    <button className="btn btn-primary" onClick={handlePredict} disabled={loading}>
                                        {loading ? <><Loader2 size={16} className="det-spin" /> Analyzing...</> : <><Sparkles size={16} /> Run AI Analysis</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="det-error">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                </div>

                {/* RIGHT: Results */}
                {result && result.top_predictions && result.top_predictions.length > 0 && (
                    <div className="det-result-col" ref={reportRef}>
                        <div className="det-result-card">
                            <div className="det-result-header">
                                <div className="det-result-status">
                                    <CheckCircle size={18} />
                                    <span>Analysis Complete</span>
                                </div>
                                <span className="det-result-time">{new Date().toLocaleTimeString()}</span>
                            </div>

                            {(result.warning || result.message) && (
                                <div className="det-warning">
                                    <AlertCircle size={14} />
                                    <span>{result.warning || result.message}</span>
                                </div>
                            )}

                            {/* Primary finding */}
                            {topPrediction && topSeverity && (
                                <div className={`det-primary-finding sev-${topSeverity.level}`}>
                                    <div className="det-finding-top">
                                        <span className="det-finding-name">{topPrediction.disease.replace(/_/g, ' ')}</span>
                                        <span className={`severity-badge severity-${topSeverity.level}`}>
                                            <span className="dot" />{topSeverity.label}
                                        </span>
                                    </div>
                                    <div className="det-finding-conf">
                                        <span>Confidence</span>
                                        <span className="det-finding-pct">{topPrediction.confidence.toFixed(1)}%</span>
                                    </div>
                                    <div className="det-prog-bg">
                                        <div className={`det-prog-fill sev-fill-${topSeverity.level}`} style={{ width: `${topPrediction.confidence}%` }} />
                                    </div>
                                    <p className="det-clinical-note">
                                        This condition was identified as the most probable finding. Please consult an ophthalmologist for a comprehensive evaluation.
                                    </p>
                                    <NavLink to="/diseases" className="det-learn-link">
                                        Learn more about this condition <ArrowRight size={14} />
                                    </NavLink>
                                </div>
                            )}

                            {/* Other predictions */}
                            {result.top_predictions.length > 1 && (
                                <div className="det-other-preds">
                                    <h4>Other Predictions</h4>
                                    {result.top_predictions.slice(1).map((pred, i) => {
                                        const sev = getSeverity(pred.confidence);
                                        return (
                                            <div key={i} className="det-other-item">
                                                <div className="det-other-info">
                                                    <span className="det-other-name">{pred.disease.replace(/_/g, ' ')}</span>
                                                    <span className={`severity-badge severity-${sev.level}`} style={{ fontSize: 10 }}>
                                                        <span className="dot" />{sev.label}
                                                    </span>
                                                </div>
                                                <div className="det-other-bar-row">
                                                    <div className="det-prog-bg small">
                                                        <div className={`det-prog-fill sev-fill-${sev.level}`} style={{ width: `${pred.confidence}%` }} />
                                                    </div>
                                                    <span className="det-other-pct">{pred.confidence.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Inline disclaimer */}
                            <div className="det-disclaimer">
                                <ShieldAlert size={14} />
                                <span>This AI analysis is for screening purposes only. It does not constitute a medical diagnosis. Always consult a qualified eye care professional.</span>
                            </div>

                            {/* Actions */}
                            <div className="det-result-actions">
                                <button className="btn btn-outline" onClick={saveToProfile}>
                                    <Save size={15} /> Save to Profile
                                </button>
                                <button className="btn btn-primary" onClick={downloadReport}>
                                    <Download size={15} /> Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* What to expect — always full-width below */}
            <div className="det-expect-section">
                <div className="det-expect-row">
                    <div className="det-expect-card">
                        <Image size={18} />
                        <h4>Image Quality Tips</h4>
                        <p>Use well-lit, focused images. Avoid blurry or heavily filtered photos for best results.</p>
                    </div>
                    <div className="det-expect-card">
                        <Clock size={18} />
                        <h4>Processing Time</h4>
                        <p>Analysis typically completes in under 2 seconds using our DenseNet121 model.</p>
                    </div>
                    <div className="det-expect-card">
                        <FileText size={18} />
                        <h4>Result Format</h4>
                        <p>You'll receive top predictions with confidence scores, severity, and a downloadable PDF report.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
