from flask import Blueprint, jsonify
import time

sales_bp = Blueprint('sales', __name__)

@sales_bp.route('/data', methods=['GET'])
def get_sales_data():
    time.sleep(0.8)
    
    return jsonify({
        "total_revenue": 1245000,
        "growth": 15.4,
        "top_product": "Premium Plan",
        "region_breakdown": {
            "North America": 45,
            "Europe": 30,
            "Asia": 25
        }
    })
