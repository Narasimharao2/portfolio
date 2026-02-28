"""API blueprint for customer segmentation prediction."""
import time

from flask import Blueprint, request

from api.utils import api_response, log_api_call

customer_bp = Blueprint('customer', __name__)


@customer_bp.route('/predict', methods=['POST'])
@log_api_call
def predict_segment():
    """Predict the customer segment based on income and spending score."""
    req_data = request.json
    if not req_data:
        return api_response(status="error", message="Missing request data", code=400)

    try:
        income = int(req_data.get('income', 50))
        score = int(req_data.get('score', 50))
    except (ValueError, TypeError):
        return api_response(
            status="error",
            message="Income and Score must be integers",
            code=400
        )

    time.sleep(0.5)

    cluster = "New Customer"
    description = "Average spending and income."

    if income > 60 and score > 60:
        cluster = "VIP (High Value)"
        description = "High income and high spending score. Target for luxury offers."
    elif income > 60 and score < 40:
        cluster = "At Risk (High Income)"
        description = "High income but low spending. Needs re-engagement."
    elif income < 40 and score > 60:
        cluster = "Loyal Saver"
        description = "Low income but high engagement. Target with discounts."

    result = {
        "segment": cluster,
        "description": description,
        "coordinates": {"x": score, "y": income}
    }

    return api_response(data=result)
