from flask import Blueprint, jsonify, request
import random
import time

stock_bp = Blueprint('stock', __name__)

@stock_bp.route('/predict', methods=['POST'])
def predict_stock():
    data = request.json
    ticker = data.get('ticker', 'AAPL')
    
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
        
    # Generate Forecast
    forecast = []
    current = base_price
    for i in range(7):
        change = random.uniform(-volatility, volatility) + trend
        current += change
        forecast.append(round(current, 2))
        
    return jsonify({
        "ticker": ticker,
        "forecast": forecast,
        "model_metric": "Root Mean Squared Error: 2.14"
    })
