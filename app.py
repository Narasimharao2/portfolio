from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_compress import Compress
import os

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for all routes
Compress(app) # Enable Gzip Compression

from api.ser import ser_bp
from api.stock import stock_bp
from api.fraud import fraud_bp
from api.sales import sales_bp
from api.customer import customer_bp
from api.webscrape import webscrape_bp

# Register blueprints
app.register_blueprint(ser_bp, url_prefix='/api/ser')
app.register_blueprint(stock_bp, url_prefix='/api/stock')
app.register_blueprint(fraud_bp, url_prefix='/api/fraud')
app.register_blueprint(sales_bp, url_prefix='/api/sales')
app.register_blueprint(customer_bp, url_prefix='/api/customer')
app.register_blueprint(webscrape_bp, url_prefix='/api/webscrape')

from api.contact import contact_bp
app.register_blueprint(contact_bp, url_prefix='/api/contact')

@app.route('/')
def home():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
