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
    "https://medi-predict2-0.vercel.app",
    "https://medi-predict20-main.vercel.app",
    "https://frontend-mu-one-24.vercel.app",
    "https://medi-predict2-0-git-main-prateeks-projects-7e7a82b3.vercel.app",
    "https://medi-predict2-0-kljeeq2rw-prateeks-projects-7e7a82b3.vercel.app",
    "https://prats0007-medipredict-api.hf.space",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Allow all Vercel preview and production subdomains for this frontend.
    allow_origin_regex=r"https://.*\.vercel\.app",
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