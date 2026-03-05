from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
from predict import predict_image

app = FastAPI()

# ── CORS ──
# Explicit allowed origins for local dev + Vercel production + HF Spaces.
allowed_origins = [
    "http://localhost:5173",           # Vite dev server
    "http://localhost:5174",           # Vite alternate port
    "https://medi-predict2-0.vercel.app",  # ← replace with your real Vercel URL
    "https://prateek-sarkar-medipredict-api.hf.space",  # HF Spaces direct
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "Welcome to MediPredict AI API"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_image(file_path)

    return result