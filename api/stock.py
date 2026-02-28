from flask import Blueprint, request
from api.utils import api_response, log_api_call
import random
import time

stock_bp = Blueprint('stock', __name__)

@stock_bp.route('/predict', methods=['POST'])
@log_api_call
def predict_stock():
    data = request.json
    if not data or 'ticker' not in data:
        return api_response(status="error", message="Missing 'ticker' in request", code=400)
        
    ticker = data.get('ticker')
    
    # Simulate Model Inference
    time.sleep(1)
    
    # Define patterns based on ticker
    base_price = 150
    volatility = 5
    trend = 1
    
    if ticker == 'TSLA':
        base_price = 250; volatility = 15; trend = 2
    elif ticker == 'GOOGL':
        base_price = 130; volatility = 3; trend = 0.5
    elif ticker == 'BTC':
        base_price = 45000; volatility = 1000; trend = 50
    else:
        # Default for unknown tickers
        base_price = random.uniform(50, 500)
        volatility = random.uniform(1, 10)
        trend = random.uniform(-1, 1)
        
    # Generate Forecast
    forecast = []
    current = base_price
    for i in range(7):
        change = random.uniform(-volatility, volatility) + trend
        current += change
        forecast.append(round(current, 2))
        
    response_data = {
        "ticker": ticker,
        "forecast": forecast,
        "model_metric": "Root Mean Squared Error: 2.14",
        "currency": "USD" if ticker != 'BTC' else "USD/BTC"
    }

    return api_response(data=response_data)
