"""
Flask Backend for Image Forgery Detection
==========================================

This is a sample Flask backend implementation.
Deploy this separately and configure VITE_API_URL to connect.

Requirements:
- Python 3.8+
- flask
- flask-cors
- tensorflow
- keras
- pillow
- opencv-python
- numpy

Installation:
    pip install flask flask-cors tensorflow pillow opencv-python numpy
"""

import os
import uuid
import numpy as np
from io import BytesIO
from PIL import Image
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# TensorFlow/Keras imports (uncomment when model is ready)
# from tensorflow import keras
# import cv2

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:8080"])

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ELA_FOLDER = 'static/ela'
HEATMAP_FOLDER = 'static/heatmap'
MODEL_PATH = 'models/forgery_cnn.h5'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Create directories
for folder in [UPLOAD_FOLDER, ELA_FOLDER, HEATMAP_FOLDER]:
    os.makedirs(folder, exist_ok=True)

# Load model (uncomment when trained model is available)
# model = keras.models.load_model(MODEL_PATH)

# Mock model metrics (replace with actual training results)
MODEL_METRICS = {
    "final_accuracy": 0.9647,
    "final_loss": 0.0823,
    "precision": 0.9512,
    "recall": 0.9734,
    "f1_score": 0.9622,
    "total_epochs": 50,
    "training_history": [],  # Populated during training
    "confusion_matrix": {
        "true_positive": 487,
        "false_positive": 24,
        "true_negative": 476,
        "false_negative": 13
    }
}


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def generate_ela(image_path, quality=90):
    """
    Generate Error Level Analysis image.
    
    ELA works by resaving the image at a known quality level
    and comparing the difference with the original.
    """
    original = Image.open(image_path)
    
    # Resave at specified quality
    buffer = BytesIO()
    original.save(buffer, 'JPEG', quality=quality)
    buffer.seek(0)
    resaved = Image.open(buffer)
    
    # Calculate ELA
    ela_image = Image.new('RGB', original.size)
    original_pixels = np.array(original)
    resaved_pixels = np.array(resaved)
    
    # Compute difference and amplify
    diff = np.abs(original_pixels.astype(float) - resaved_pixels.astype(float))
    diff = (diff * 10).clip(0, 255).astype(np.uint8)
    
    ela_image = Image.fromarray(diff)
    return ela_image


def preprocess_for_cnn(image_path, target_size=(128, 128)):
    """
    Preprocess image for CNN input.
    """
    img = Image.open(image_path).convert('RGB')
    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    return np.expand_dims(img_array, axis=0)


def generate_heatmap(image_path, ela_path):
    """
    Generate tampering heatmap based on ELA analysis.
    This is a simplified version - real implementation would use
    Grad-CAM or similar techniques with the CNN model.
    """
    ela = Image.open(ela_path)
    ela_array = np.array(ela)
    
    # Simple thresholding for demo
    intensity = np.mean(ela_array, axis=2)
    heatmap = np.zeros_like(ela_array)
    
    # Create color-coded heatmap
    threshold = np.mean(intensity) + np.std(intensity)
    heatmap[:, :, 0] = np.where(intensity > threshold, 255, 0)
    heatmap[:, :, 1] = np.where(intensity > threshold * 0.7, intensity, 0)
    
    return Image.fromarray(heatmap.astype(np.uint8))


@app.route('/upload', methods=['POST'])
def upload_image():
    """Handle image upload."""
    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image provided', 'code': 'NO_IMAGE'}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No file selected', 'code': 'NO_FILE'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Invalid file type', 'code': 'INVALID_IMAGE'}), 400
    
    # Check file size
    file.seek(0, 2)
    size = file.tell()
    file.seek(0)
    
    if size > MAX_FILE_SIZE:
        return jsonify({'success': False, 'error': 'File too large', 'code': 'FILE_TOO_LARGE'}), 400
    
    # Save file
    image_id = str(uuid.uuid4())
    ext = file.filename.rsplit('.', 1)[1].lower()
    filename = f"{image_id}.{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    return jsonify({
        'success': True,
        'image_id': image_id,
        'filename': file.filename,
        'size': size
    })


@app.route('/generate-ela', methods=['POST'])
def create_ela():
    """Generate ELA image."""
    data = request.json
    image_id = data.get('image_id')
    
    if not image_id:
        return jsonify({'success': False, 'error': 'No image_id provided'}), 400
    
    # Find uploaded image
    for ext in ALLOWED_EXTENSIONS:
        filepath = os.path.join(UPLOAD_FOLDER, f"{image_id}.{ext}")
        if os.path.exists(filepath):
            break
    else:
        return jsonify({'success': False, 'error': 'Image not found', 'code': 'NOT_FOUND'}), 404
    
    # Generate ELA
    import time
    start = time.time()
    
    ela_image = generate_ela(filepath)
    ela_filename = f"{image_id}.png"
    ela_path = os.path.join(ELA_FOLDER, ela_filename)
    ela_image.save(ela_path)
    
    processing_time = time.time() - start
    
    return jsonify({
        'success': True,
        'ela_image_url': f"/static/ela/{ela_filename}",
        'processing_time': round(processing_time, 3)
    })


@app.route('/predict', methods=['POST'])
def predict_forgery():
    """Run CNN prediction."""
    data = request.json
    image_id = data.get('image_id')
    
    if not image_id:
        return jsonify({'success': False, 'error': 'No image_id provided'}), 400
    
    # Find ELA image
    ela_path = os.path.join(ELA_FOLDER, f"{image_id}.png")
    if not os.path.exists(ela_path):
        return jsonify({'success': False, 'error': 'ELA not generated', 'code': 'ELA_MISSING'}), 400
    
    import time
    start = time.time()
    
    # Preprocess and predict
    # processed = preprocess_for_cnn(ela_path)
    # prediction = model.predict(processed)[0][0]
    
    # Mock prediction for demo
    import random
    prediction = random.uniform(0, 1)
    is_forged = prediction > 0.5
    confidence = prediction if is_forged else 1 - prediction
    
    # Generate heatmap
    original_path = None
    for ext in ALLOWED_EXTENSIONS:
        path = os.path.join(UPLOAD_FOLDER, f"{image_id}.{ext}")
        if os.path.exists(path):
            original_path = path
            break
    
    heatmap = generate_heatmap(original_path, ela_path)
    heatmap_filename = f"{image_id}.png"
    heatmap_path = os.path.join(HEATMAP_FOLDER, heatmap_filename)
    heatmap.save(heatmap_path)
    
    processing_time = time.time() - start
    
    return jsonify({
        'success': True,
        'is_forged': is_forged,
        'confidence': round(confidence, 4),
        'original_image_url': f"/static/uploads/{image_id}.{original_path.split('.')[-1]}",
        'ela_image_url': f"/static/ela/{image_id}.png",
        'heatmap_url': f"/static/heatmap/{heatmap_filename}",
        'processing_time': round(processing_time, 3)
    })


@app.route('/metrics', methods=['GET'])
def get_metrics():
    """Return model training metrics."""
    return jsonify(MODEL_METRICS)


@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files."""
    return send_from_directory('static', path)


if __name__ == '__main__':
    print("=" * 50)
    print("ForgeGuard Flask Backend")
    print("=" * 50)
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"ELA folder: {ELA_FOLDER}")
    print(f"Heatmap folder: {HEATMAP_FOLDER}")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
