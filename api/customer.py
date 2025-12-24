from flask import Blueprint, jsonify, request
import time

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/predict', methods=['POST'])
def predict_segment():
    data = request.json
    income = int(data.get('income', 50))
    score = int(data.get('score', 50))
    
    time.sleep(0.5)
    
    cluster = "New Customer"
    description = "Average spending and income."
    
    if income > 60 and score > 60:
        cluster = "VIP (High Value)"
        description = "High income and high spending score. Target for luxury offers."
    elif income > 60 and score < 40:
        cluster = "At Risk (High Income)"
        description = "High income but low spending. needs re-engagement."
    elif income < 40 and score > 60:
        cluster = "Loyal Saver"
        description = "Low income but high engagement. Target with discounts."
        
    return jsonify({
        "segment": cluster,
        "description": description,
        "coordinates": {"x": score, "y": income}
    })
