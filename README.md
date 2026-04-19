# TomatoSCAN - Tomato Leaf Disease Detection 🍅

TomatoSCAN is an AI-powered web application that detects diseases in tomato leaves. Powered by a deep learning model, it helps identify 9 common tomato leaf diseases and provides detailed information about causes and solutions. It also successfully identifies healthy leaves.

## 🌟 Features

- **Upload & Scan**: Simply upload an image of a tomato leaf to get instant results.
- **High Accuracy Model**: Uses a Keras-based deep learning model (`tomato_disease_model.h5`) for predictions.
- **Detailed Diagnosis**: Get comprehensive information on the detected disease, what causes it, and how to solve it.
- **FastAPI Backend**: A highly performant and robust Python backend for handling image processing and model inference.
- **React + Vite Frontend**: A modern, responsive, and beautiful user interface built thoughtfully with React, Tailwind CSS, and Framer Motion.

## 🗂️ Supported Classifications
- Bacterial Spot
- Early Blight
- Late Blight
- Leaf Mold
- Septoria Leaf Spot
- Spider Mites
- Target Spot
- Yellow Leaf Curl Virus
- Mosaic Virus
- Healthy

## 🛠️ Technology Stack

**Frontend:**
- React (v18)
- Vite
- Tailwind CSS
- Framer Motion

**Backend:**
- Python 3
- FastAPI
- Keras & TensorFlow
- Pillow (Image Processing)
- NumPy

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repo-url>
cd Tomato
```

### 2. Backend Setup
Make sure you have Python 3.8+ installed.

```bash
cd backend

# Install requirements
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload
```
*Note: Make sure `tomato_disease_model.h5` is in the `backend` directory before running the server.*

### 3. Frontend Setup
Make sure you have Node.js and npm installed.

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will start at `http://localhost:5173` and the backend will be running at `http://localhost:8000`. 

## 🌍 API Endpoints

- `GET /health` : Verifies if the backend server is running correctly.
- `POST /predict` : Expects an image file and returns the predicted disease class along with `confidence`, `cause`, and `solution`.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
