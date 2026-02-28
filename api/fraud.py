from flask import Blueprint, request
from api.utils import api_response, log_api_call
import time
import random

fraud_bp = Blueprint('fraud', __name__)

@fraud_bp.route('/analyze', methods=['POST'])
@log_api_call
def analyze_transaction():
    data = request.json
    if not data or 'amount' not in data:
         return api_response(status="error", message="Missing 'amount' in request", code=400)

    try:
        amount = float(data.get('amount'))
    except (ValueError, TypeError):
        return api_response(status="error", message="Invalid 'amount' format. Must be a number.", code=400)

    location = data.get('location', 'Unknown')
    
    time.sleep(1.2) # Simulate processing
    
    risk_score = 0
    factors = []
    
    # Deterministic Logic
    if amount > 10000:
        risk_score += 40
        factors.append("High Transaction Amount")
    
    if location.lower() in ['russia', 'north korea', 'nigeria']:
        risk_score += 50
        factors.append("High-Risk Geo-Location")
        
    # Add some randomness for smaller factors
    if random.random() > 0.8:
        risk_score += 15
        factors.append("Unusual Device Fingerprint")
        
    risk_score = min(risk_score, 99)
    is_fraud = risk_score > 70
    
    response_data = {
        "is_fraud": is_fraud,
        "risk_score": risk_score,
        "risk_factors": factors,
        "action": "BLOCK" if is_fraud else "APPROVE"
    }

    return api_response(data=response_data)
