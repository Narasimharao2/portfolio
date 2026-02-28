"""Integration tests for the Portfolio API endpoints."""
# pylint: disable=import-error
import time

import requests

BASE_URL = "http://localhost:5000/api"


def test_endpoint(name, path, method="GET", json_data=None, files=None, data=None):
    """Test a single API endpoint and print the result."""
    url = f"{BASE_URL}{path}"
    print(f"Testing {name} ({url})...", end=" ")
    try:
        if method == "GET":
            response = requests.get(url, timeout=10)
        else:
            response = requests.post(
                url, json=json_data, files=files, data=data, timeout=10
            )
        if response.status_code == 200:
            res_json = response.json()
            if res_json.get("status") == "success" and "timestamp" in res_json:
                print("PASSED")
                return True
            print(f"FAILED (Invalid Format: {res_json})")
        else:
            print(
                f"FAILED (Status Code: {response.status_code}, "
                f"Response: {response.text})"
            )
    except requests.exceptions.RequestException as exc:
        print(f"ERROR ({exc})")
    return False


def run_tests():
    """Run all API endpoint integration tests."""
    print("=== API Verification Tests ===\n")

    # 1. SER Predict
    test_endpoint("SER Predict", "/ser/predict", "POST", data={"simulate": "true"})

    # 2. Stock Predict
    test_endpoint("Stock Predict", "/stock/predict", "POST", json_data={"ticker": "AAPL"})

    # 3. Fraud Analyze
    test_endpoint(
        "Fraud Analyze", "/fraud/analyze", "POST",
        json_data={"amount": 5000, "location": "USA"}
    )

    # 4. Customer Predict
    test_endpoint(
        "Customer Predict", "/customer/predict", "POST",
        json_data={"income": 70, "score": 80}
    )

    # 5. Sales Data
    test_endpoint("Sales Data", "/sales/data")

    # 6. Webscrape Start
    test_endpoint("Webscrape Start", "/webscrape/start", "POST")

    # 7. Contact Submit
    test_endpoint("Contact Submit", "/contact/submit", "POST", json_data={
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a verification test."
    })


if __name__ == "__main__":
    # Wait a bit for server if it was just started (manual step usually)
    print("Ensure the Flask server is running on http://localhost:5000 before running this test.")
    time.sleep(0)
    run_tests()
