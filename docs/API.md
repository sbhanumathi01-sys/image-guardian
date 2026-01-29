# Flask Backend API Documentation

This document describes the API endpoints required for the Flask backend to integrate with the ForgeGuard frontend.

## Base URL

```
http://localhost:5000
```

Set via environment variable: `VITE_API_URL`

---

## Endpoints

### 1. Upload Image

**POST** `/upload`

Upload an image for forgery analysis.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image` (file)

**Response:**
```json
{
  "success": true,
  "image_id": "uuid-string",
  "filename": "original.jpg",
  "size": 1024567
}
```

---

### 2. Generate ELA

**POST** `/generate-ela`

Generate Error Level Analysis image from the uploaded image.

**Request:**
```json
{
  "image_id": "uuid-string"
}
```

**Response:**
```json
{
  "success": true,
  "ela_image_url": "/static/ela/uuid.png",
  "processing_time": 0.234
}
```

---

### 3. Predict Forgery

**POST** `/predict`

Run CNN model inference on the ELA image.

**Request:**
```json
{
  "image_id": "uuid-string"
}
```

**Response:**
```json
{
  "success": true,
  "is_forged": true,
  "confidence": 0.9523,
  "original_image_url": "/static/uploads/uuid.jpg",
  "ela_image_url": "/static/ela/uuid.png",
  "heatmap_url": "/static/heatmap/uuid.png",
  "processing_time": 1.234
}
```

---

### 4. Get Metrics

**GET** `/metrics`

Retrieve model training metrics and evaluation results.

**Response:**
```json
{
  "final_accuracy": 0.9647,
  "final_loss": 0.0823,
  "precision": 0.9512,
  "recall": 0.9734,
  "f1_score": 0.9622,
  "total_epochs": 50,
  "training_history": [
    {
      "epoch": 1,
      "train_accuracy": 0.5234,
      "val_accuracy": 0.5012,
      "train_loss": 0.7823,
      "val_loss": 0.8234
    }
  ],
  "confusion_matrix": {
    "true_positive": 487,
    "false_positive": 24,
    "true_negative": 476,
    "false_negative": 13
  }
}
```

---

## CORS Configuration

The Flask backend must enable CORS for the frontend origin:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "https://your-domain.com"])
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `INVALID_IMAGE` - Unsupported image format
- `FILE_TOO_LARGE` - File exceeds 10MB limit
- `MODEL_ERROR` - CNN inference failed
- `NOT_FOUND` - Image ID not found
