from flask import Blueprint, jsonify
import time
import random

webscrape_bp = Blueprint('webscrape', __name__)

@webscrape_bp.route('/start', methods=['POST'])
def start_scrape():
    # Simulate job initiation
    time.sleep(0.5) 
    job_id = f"job_{random.randint(1000, 9999)}"
    
    return jsonify({
        "status": "started",
        "job_id": job_id,
        "message": "Scraping process initialized on server cluster."
    })
