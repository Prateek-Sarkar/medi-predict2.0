import { forwardRef } from 'react';
import { CheckCircle, AlertCircle, Download, Save } from 'lucide-react';
import type { ApiResponse } from '../api/predictAPI';

interface ResultCardProps {
    result: ApiResponse;
    onSave: () => void;
    onDownload: () => void;
}

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(({ result, onSave, onDownload }, ref) => {
    return (
        <div className="result-section">
            <div className="card result-card" ref={ref}>
                <div className="result-header">
                    <h2>Analysis Report</h2>
                    <div className="badge success-badge">
                        <CheckCircle className="icon-sm" /> Processing Complete
                    </div>
                </div>

                {(result.warning || result.message) && (
                    <div className="warning-alert">
                        <AlertCircle className="icon-sm" />
                        <span>{result.warning || result.message}</span>
                    </div>
                )}

                {result.top_predictions && result.top_predictions.length > 0 && (
                    <div className="predictions-list">
                        <h3 className="predictions-title">Top Predicted Conditions</h3>
                        {result.top_predictions.map((pred, idx) => (
                            <div key={idx} className="prediction-item">
                                <div className="prediction-info">
                                    <span className="disease-name">{pred.disease.replace(/_/g, ' ')}</span>
                                    <span className="confidence-value">{pred.confidence.toFixed(2)}%</span>
                                </div>
                                <div className="progress-bar-bg">
                                    <div
                                        className={`progress-bar-fill ${idx === 0 ? 'primary-fill' : 'secondary-fill'}`}
                                        style={{ width: `${pred.confidence}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="report-disclaimer">
                    <p><strong>Disclaimer:</strong> This AI analysis is for informational purposes only and does not constitute a medical diagnosis. Always consult with a qualified eye care professional for medical advice.</p>
                </div>
            </div>

            <div className="result-actions">
                <button className="btn btn-outline" onClick={onSave}>
                    <Save className="icon-sm" /> Save to Profile
                </button>
                <button className="btn btn-primary" onClick={onDownload}>
                    <Download className="icon-sm" /> Download PDF Report
                </button>
            </div>
        </div>
    );
});

ResultCard.displayName = 'ResultCard';
