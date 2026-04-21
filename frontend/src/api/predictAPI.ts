export interface Prediction {
    disease: string;
    confidence: number;
}

export interface ApiResponse {
    status: string;
    top_predictions?: Prediction[];
    warning?: string;
    message?: string;
}

// In dev the Vite proxy rewrites /api → localhost:8000, so the relative
// path works.  In production VITE_API_URL points to the Render backend.
const API_BASE = (import.meta.env.VITE_API_URL || 'https://medi-predict2-0-1.onrender.com').replace(/\/$/, '');

export const predictImage = async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    return response.json();
};
