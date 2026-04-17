from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import tensorflow as tf
from keras.models import load_model

app = FastAPI(title="Tomato Leaf Disease Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    model = load_model("tomato_disease_model.h5", compile=False)
    print("✅ Model loaded successfully")
except Exception as e:
    print("❌ Model loading failed:", e)
    model = None


CLASS_INFO = {
    "Bacterial Spot": {
        "cause": "Caused by bacteria spreading through rain and infected seeds.",
        "solution": "Use copper-based bactericides and disease-free seeds."
    },
    "Early Blight": {
        "cause": "Fungal disease caused by Alternaria solani.",
        "solution": "Apply fungicides and remove infected leaves."
    },
    "Late Blight": {
        "cause": "Caused by Phytophthora infestans in cool wet weather.",
        "solution": "Apply fungicides and destroy infected plants."
    },
    "Leaf Mold": {
        "cause": "Caused by fungus in humid greenhouse environments.",
        "solution": "Reduce humidity and improve ventilation."
    },
    "Septoria Leaf Spot": {
        "cause": "Fungal infection spread through rain splash.",
        "solution": "Remove infected leaves and apply fungicide."
    },
    "Spider Mites": {
        "cause": "Tiny pests feeding on plant leaves.",
        "solution": "Use neem oil or insecticidal soap."
    },
    "Target Spot": {
        "cause": "Fungal disease spreading in humid conditions.",
        "solution": "Apply fungicides and improve airflow."
    },
    "Yellow Leaf Curl Virus": {
        "cause": "Virus transmitted by whiteflies.",
        "solution": "Control whiteflies and remove infected plants."
    },
    "Mosaic Virus": {
        "cause": "Highly contagious virus spread by tools or hands.",
        "solution": "Destroy infected plants and disinfect tools."
    },
    "Healthy": {
        "cause": "No disease detected.",
        "solution": "Maintain proper watering and monitoring."
    }
}

CLASS_NAMES = list(CLASS_INFO.keys())
IMG_SIZE = (224, 224)


def preprocess_image(image_bytes: bytes):

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)

    arr = np.array(image).astype("float32") / 255.0
    arr = np.expand_dims(arr, axis=0)

    return arr


@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    contents = await file.read()

    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 10MB")

    try:
        img = preprocess_image(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")

    preds = model.predict(img)

    top_index = int(np.argmax(preds[0]))
    confidence = float(preds[0][top_index]) * 100
    disease = CLASS_NAMES[top_index]

    info = CLASS_INFO[disease]

    return JSONResponse({
        "disease": disease,
        "confidence": round(confidence, 2),
        "cause": info["cause"],
        "solution": info["solution"],
        "is_healthy": disease == "Healthy"
    })


@app.get("/")
def root():
    return {"message": "Tomato Disease Detection API Running"}


@app.get("/health")
def health():
    return {"status": "ok"}
