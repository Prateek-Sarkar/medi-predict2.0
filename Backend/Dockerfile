FROM python:3.11-slim

# Hugging Face Spaces expects the app on port 7860
ENV PORT=7860
ENV UPLOAD_FOLDER=/tmp/uploads

WORKDIR /app

# Install dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code + models
COPY main.py .
COPY predict.py .
COPY models/ models/

# Create uploads directory
RUN mkdir -p /tmp/uploads

EXPOSE 7860

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
