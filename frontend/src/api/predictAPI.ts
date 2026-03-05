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

export const predictImage = async (file: File): Promise<ApiResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    return response.json();
};
