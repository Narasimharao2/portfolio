"""Shared utility functions for API blueprints."""
import logging
import time
from functools import wraps

from flask import jsonify

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def api_response(status="success", data=None, message=None, code=200):
    """Return a standardised JSON API response."""
    response = {
        "status": status,
        "timestamp": time.time()
    }
    if data is not None:
        response["data"] = data
    if message is not None:
        response["message"] = message

    return jsonify(response), code


def log_api_call(func):
    """Decorator that logs the name and duration of an API call."""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        logger.info("API Call: %s called.", func.__name__)
        start_time = time.time()
        result = func(*args, **kwargs)
        duration = time.time() - start_time
        logger.info("API Call: %s completed in %.4fs.", func.__name__, duration)
        return result
    return decorated_function
