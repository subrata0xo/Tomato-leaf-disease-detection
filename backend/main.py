import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import numpy as np
from PIL import Image
import io
import keras

app = FastAPI(title="Tomato Leaf Disease Detector API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model once at startup
model = keras.models.load_model("tomato_disease_model.h5", compile=False)

CLASS_INFO = {
    "Bacterial Spot": {
        "cause": "Caused by the bacterium Xanthomonas campestris pv. vesicatoria. Spreads through infected seeds, rain splashes, and wind. Thrives in warm, wet conditions (24–30°C).",
        "solution": "Remove and destroy infected plant parts. Apply copper-based bactericides (e.g., Kocide). Use disease-free seeds. Avoid overhead irrigation. Rotate crops for at least 2 years."
    },
    "Early Blight": {
        "cause": "Caused by the fungus Alternaria solani. Survives in infected plant debris and soil. Spreads through wind, rain, and tools. Favors warm, humid conditions.",
        "solution": "Apply fungicides containing chlorothalonil or mancozeb. Remove infected lower leaves. Ensure good air circulation. Mulch around plants. Avoid wetting foliage when watering."
    },
    "Late Blight": {
        "cause": "Caused by the water mold Phytophthora infestans. Spreads rapidly in cool, moist weather (10–25°C). Spores travel by wind and water splash.",
        "solution": "Apply fungicides like metalaxyl or chlorothalonil immediately. Destroy infected plants (do not compost). Improve drainage. Plant resistant varieties. Monitor forecasts for high-risk weather."
    },
    "Leaf Mold": {
        "cause": "Caused by the fungus Passalora fulva (formerly Fulvia fulva). Common in greenhouses with high humidity (above 85%). Spreads via airborne spores.",
        "solution": "Reduce humidity with ventilation. Apply fungicides (chlorothalonil, mancozeb). Remove infected leaves. Avoid overhead watering. Space plants to improve air circulation."
    },
    "Septoria Leaf Spot": {
        "cause": "Caused by the fungus Septoria lycopersici. Overwinters in soil and plant debris. Spreads by rain splash, wind, and equipment. Favors wet, warm weather (20–25°C).",
        "solution": "Apply copper-based or chlorothalonil fungicides. Remove affected lower leaves. Avoid working with plants when wet. Mulch to reduce soil splash. Practice 2-year crop rotation."
    },
    "Spider Mites": {
        "cause": "Caused by the two-spotted spider mite (Tetranychus urticae). Thrives in hot, dry conditions. Spreads by wind, tools, and contaminated plants. Populations explode quickly.",
        "solution": "Spray plants with water to dislodge mites. Apply insecticidal soap, neem oil, or miticides. Introduce natural predators like Phytoseiulus persimilis. Maintain adequate soil moisture."
    },
    "Target Spot": {
        "cause": "Caused by the fungus Corynespora cassiicola. Favors warm (25°C+), humid conditions. Spreads through airborne spores and infected plant debris.",
        "solution": "Apply fungicides (azoxystrobin, chlorothalonil). Remove infected leaves and plant material. Improve air circulation. Avoid leaf wetness. Rotate crops annually."
    },
    "Yellow Leaf Curl Virus": {
        "cause": "Caused by Tomato Yellow Leaf Curl Virus (TYLCV), transmitted by whiteflies (Bemisia tabaci). Whiteflies spread the virus rapidly between plants.",
        "solution": "Control whitefly populations with insecticides (imidacloprid) or yellow sticky traps. Remove and destroy infected plants. Use reflective mulch. Plant resistant tomato varieties. Use insect-proof nets."
    },
    "Mosaic Virus": {
        "cause": "Caused by Tomato Mosaic Virus (ToMV) or Tobacco Mosaic Virus (TMV). Highly contagious — spreads by contact, infected tools, hands, and sometimes seeds.",
        "solution": "Remove and destroy infected plants immediately. Disinfect tools with 10% bleach solution. Wash hands before handling plants. Do not smoke near tomato plants. Plant resistant varieties."
    },
    "Healthy": {
        "cause": "No disease detected. Your tomato plant appears to be in good health.",
        "solution": "Continue good practices: regular watering at the base, balanced fertilization, proper spacing for airflow, and routine monitoring for early signs of disease or pests."
    }
}

CLASS_NAMES = list(CLASS_INFO.keys())
IMG_SIZE = (224, 224)


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize(IMG_SIZE)
    arr = np.array(image) / 255.0
    return np.expand_dims(arr, axis=0)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 10MB.")

    try:
        img = preprocess_image(contents)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image. Please upload a valid image file.")

    preds = model.predict(img)[0]
    top_idx = int(np.argmax(preds))
    confidence = float(preds[top_idx]) * 100
    disease = CLASS_NAMES[top_idx]
    info = CLASS_INFO[disease]

    return JSONResponse({
        "disease": disease,
        "confidence": round(confidence, 2),
        "cause": info["cause"],
        "solution": info["solution"],
        "is_healthy": disease == "Healthy"
    })


@app.get("/health")
def health():
    return {"status": "ok"}