from flask import Blueprint
from api.utils import api_response, log_api_call
import time

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/data', methods=['GET'])
@log_api_call
def get_sales_data():
    time.sleep(0.8)
    
    data = {
        "total_revenue": 1245000,
        "growth": 15.4,
        "top_product": "Premium Plan",
        "region_breakdown": {
            "North America": 45,
            "Europe": 30,
            "Asia": 25
        }
    }
    
    return api_response(data=data)
