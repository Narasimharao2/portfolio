from flask import Blueprint, request
from api.utils import api_response, log_api_call
import time

customer_bp = Blueprint('customer', __name__)

@customer_bp.route('/predict', methods=['POST'])
@log_api_call
def predict_segment():
    data = request.json
    if not data:
        return api_response(status="error", message="Missing request data", code=400)

    try:
        income = int(data.get('income', 50))
        score = int(data.get('score', 50))
    except (ValueError, TypeError):
        return api_response(status="error", message="Income and Score must be integers", code=400)
    
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
        
    data = {
        "segment": cluster,
        "description": description,
        "coordinates": {"x": score, "y": income}
    }

    return api_response(data=data)
