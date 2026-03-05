import React, { useRef } from 'react';
import { UploadCloud, Loader2, AlertCircle } from 'lucide-react';

interface UploadBoxProps {
    onFileSelect: (file: File) => void;
    preview: string | null;
    loading: boolean;
    onClear: () => void;
    onPredict: () => void;
    error: string | null;
}

export function UploadBox({ onFileSelect, preview, loading, onClear, onPredict, error }: UploadBoxProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <div className="card upload-card">
            {!preview ? (
                <div
                    className="upload-dropzone"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="upload-content text-center">
                        <UploadCloud className="upload-icon" />
                        <h3>Click or drag to upload</h3>
                        <p className="text-muted">PNG, JPG or JPEG (max. 10MB)</p>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden-input"
                    />
                </div>
            ) : (
                <div className="preview-container">
                    <img src={preview} alt="Upload preview" className="image-preview" />
                    <div className="preview-actions">
                        <button className="btn btn-outline" onClick={onClear}>Change Image</button>
                        <button
                            className="btn btn-primary"
                            onClick={onPredict}
                            disabled={loading}
                        >
                            {loading ? (
                                <><Loader2 className="spinner" /> Analyzing...</>
                            ) : (
                                'Run AI Analysis'
                            )}
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-alert">
                    <AlertCircle className="icon-sm" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
