from flask import Blueprint, jsonify, request
import random
import time

ser_bp = Blueprint('ser', __name__)

@ser_bp.route('/predict', methods=['POST'])
def predict_emotion():
    # Simulate processing delay for realism
    time.sleep(1.5)
    
    # In a real app, we would process 'request.files['audio']' here
    # For now, we simulate the output
    
    emotions = ['Happy', 'Sad', 'Angry', 'Neutral', 'Surprise', 'Fear']
    predicted = random.choice(emotions)
    
    return jsonify({
        "emotion": predicted,
        "confidence": round(random.uniform(85.0, 98.0), 2),
        "details": {
            "model_version": "CNN-LSTM-v2.1",
            "latency_ms": 1450
        }
    })
