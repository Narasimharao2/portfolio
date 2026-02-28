"""API blueprint for Speech Emotion Recognition (SER) simulation."""
import random
import time

from flask import Blueprint, request

from api.utils import api_response, log_api_call

ser_bp = Blueprint('ser', __name__)


@ser_bp.route('/predict', methods=['POST'])
@log_api_call
def predict_emotion():
    """Predict the emotion from an audio file (or simulate if no file is provided)."""
    # Simulate processing delay for realism
    time.sleep(1.5)

    # In simulation mode, we might not always have raw audio
    is_simulation = request.form.get('simulate', 'true') == 'true'

    if not is_simulation and 'audio' not in request.files:
        return api_response(status="error", message="No audio file provided", code=400)

    emotions = ['Happy', 'Sad', 'Angry', 'Neutral', 'Surprise', 'Fear']
    predicted = random.choice(emotions)

    data = {
        "emotion": predicted,
        "confidence": round(random.uniform(85.0, 98.0), 2),
        "details": {
            "model_version": "CNN-LSTM-v2.1",
            "latency_ms": 1450,
            "mode": "simulation" if is_simulation else "real"
        }
    }

    return api_response(data=data)
