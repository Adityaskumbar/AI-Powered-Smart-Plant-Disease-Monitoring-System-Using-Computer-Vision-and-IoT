import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Suppresses TensorFlow INFO and WARNING logs
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from keras.preprocessing import image
import numpy as np
import io
import json
import requests
from PIL import Image

app = Flask(__name__)
CORS(app) # Allow React Native & ESP32 to hit API

# Load Model
MODEL_PATH = 'plant_disease_model.h5'
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    # Load class mapping
    with open('class_indices.json', 'r') as f:
        class_indices = json.load(f)
        classes = {v: k for k, v in class_indices.items()}
except Exception as e:
    print(f"Warning: Model not found. Did you run train_cnn.py? Error: {e}")
    model = None
    classes = {}

# Load Mock suggestions database map based on Kaggle class names
try:
    with open('backend/disease_db.json', 'r') as f:
        DISEASE_DB = json.load(f)
except Exception as e:
    print("Warning: disease_db.json not found.", e)
    DISEASE_DB = {}

def prepare_image(img_bytes):
    img = Image.open(io.BytesIO(img_bytes))
    if img.mode != 'RGB':
        img = img.convert('RGB')
    img = img.resize((224, 224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0 # Normalize same as training
    return img_array

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        # RETURN MOCK DATA FOR TESTING INSTEAD OF CRASHING
        print("Model not loaded - returning mock data for testing your app connection!")
        return jsonify({
            "success": True,
            "disease": "Tomato Early blight (MOCK TEST)",
            "confidence": "99.9%",
            "description": "Fungal disease causing 'bullseye' spots. (This is a mock response because the AI model isn't trained yet)",
            "suggestions": ["Prune affected leaves", "Apply copper fungicide", "Water at base"]
        })

    if 'file' not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    file = request.files['file']
    img_bytes = file.read()

    try:
        processed_image = prepare_image(img_bytes)
        predictions = model.predict(processed_image)
        
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        
        if confidence < 0.70:
            return jsonify({
                "success": True,
                "disease": "No clear plant leaf detected",
                "confidence": f"{confidence * 100:.1f}",
                "description": "The AI is not confident this is a plant. It may be looking at the background, or the image is too blurry.",
                "suggestions": ["Hold the leaf clearly in front of the lens.", "Ensure good lighting and focus in the frame."]
            })
            
        disease_key = classes.get(predicted_class_index, "Unknown")
        details = DISEASE_DB.get(disease_key, {
            "description": "Information not available.",
            "suggestions": ["Consult a local agricultural expert."]
        })

        disease_name = disease_key.replace("___", " ").replace("_", " ")
        plant_name_extracted = disease_name.split(" ")[0] if " " in disease_name else disease_name

        return jsonify({
            "success": True,
            "plant_name": plant_name_extracted,
            "disease": disease_name,
            "confidence": f"{confidence * 100:.1f}",
            "description": details["description"],
            "solution": "\\n".join(details["suggestions"]) if isinstance(details["suggestions"], list) else details["suggestions"],
        })
        
    except Exception as e:
        print("Error during predict:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/predict_esp32', methods=['POST'])
def predict_esp32():
    if model is None:
        return jsonify({"error": "Model not loaded"}), 500
        
    data = request.get_json()
    esp_ip = data.get('esp_ip') if data else None
    if not esp_ip:
        return jsonify({"error": "No esp_ip provided"}), 400

    try:
        # Fetch image directly from ESP32
        esp_url = f"http://{esp_ip}/capture"
        image_bytes = None
        
        # The ESP32 camera is often busy streaming on port 81, making /capture on port 80 time out.
        # We will try to capture, and if it fails, we fetch a single frame from the live stream.
        try:
            response = requests.get(esp_url, timeout=2)
            if response.status_code == 200:
                image_bytes = response.content
        except Exception as e:
            print("Capture endpoint timeout, falling back to stream frame extraction.")

        if not image_bytes:
            stream_url = f"http://{esp_ip}:81/stream"
            stream_res = requests.get(stream_url, stream=True, timeout=5)
            byte_buffer = b''
            for chunk in stream_res.iter_content(chunk_size=1024):
                byte_buffer += chunk
                a = byte_buffer.find(b'\xff\xd8') # JPEG start
                b = byte_buffer.find(b'\xff\xd9') # JPEG end
                if a != -1 and b != -1:
                    image_bytes = byte_buffer[a:b+2]
                    stream_res.close()
                    break

        if not image_bytes:
            return jsonify({"error": "Failed to fetch image from ESP32"}), 400
        
        processed_image = prepare_image(image_bytes)
        predictions = model.predict(processed_image)
        
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        
        if confidence < 0.70:
            return jsonify({
                "success": True,
                "disease": "No clear plant leaf detected",
                "confidence": f"{confidence * 100:.1f}",
                "description": "The AI is not confident this is a plant. It may be looking at the background, or the image is too blurry.",
                "suggestions": ["Hold the leaf clearly in front of the lens.", "Ensure good lighting and focus in the frame."]
            })
            
        disease_key = classes.get(predicted_class_index, "Unknown")
        details = DISEASE_DB.get(disease_key, {
            "description": "Information not available.",
            "suggestions": ["Consult a local agricultural expert."]
        })

        disease_name = disease_key.replace("___", " ").replace("_", " ")
        plant_name_extracted = disease_name.split(" ")[0] if " " in disease_name else disease_name

        return jsonify({
            "success": True,
            "plant_name": plant_name_extracted,
            "disease": disease_name,
            "confidence": f"{confidence * 100:.1f}",
            "description": details["description"],
            "solution": "\\n".join(details["suggestions"]) if isinstance(details["suggestions"], list) else details["suggestions"],
        })
        
    except Exception as e:
        print("Error during ESP predict:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Listen on ALL interfaces so ESP32 and phone can reach it
    app.run(host='0.0.0.0', port=5000, debug=True)