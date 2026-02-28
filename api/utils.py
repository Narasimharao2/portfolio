from flask import jsonify
import logging
from functools import wraps
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def api_response(status="success", data=None, message=None, code=200):
    """Standardized API response structure."""
    response = {
        "status": status,
        "timestamp": time.time()
    }
    if data is not None:
        response["data"] = data
    if message is not None:
        response["message"] = message
        
    return jsonify(response), code

def log_api_call(f):
    """Decorator to log API calls."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"API Call: {f.__name__} called.")
        start_time = time.time()
        result = f(*args, **kwargs)
        duration = time.time() - start_time
        logger.info(f"API Call: {f.__name__} completed in {duration:.4f}s.")
        return result
    return decorated_function
