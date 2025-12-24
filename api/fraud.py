from flask import Blueprint, jsonify, request
import time
import random

fraud_bp = Blueprint('fraud', __name__)

@fraud_bp.route('/analyze', methods=['POST'])
def analyze_transaction():
    data = request.json
    amount = float(data.get('amount', 0))
    location = data.get('location', 'High-Risk Country')
    
    time.sleep(1.2) # Simulate processing
    
    risk_score = 0
    factors = []
    
    # Deterministic Logic
    if amount > 10000:
        risk_score += 40
        factors.append("High Transaction Amount")
    
    if location in ['Russia', 'North Korea', 'Nigeria']:
        risk_score += 50
        factors.append("High-Risk Geo-Location")
        
    # Add some randomness for smaller factors
    if random.random() > 0.8:
        risk_score += 15
        factors.append("Unusual Device Fingerprint")
        
    risk_score = min(risk_score, 99)
    is_fraud = risk_score > 70
    
    return jsonify({
        "is_fraud": is_fraud,
        "risk_score": risk_score,
        "risk_factors": factors,
        "action": "BLOCK" if is_fraud else "APPROVE"
    })
