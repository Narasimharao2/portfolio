"""API blueprint for handling portfolio contact form submissions via email."""
import datetime
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from flask import Blueprint, jsonify, request

contact_bp = Blueprint('contact', __name__)

# CONFIGURATION
# To enable real emails, set these environment variables:
# Windows PowerShell: $env:EMAIL_USER="your@gmail.com"; $env:EMAIL_PASS="your_app_password"
EMAIL_USER = os.environ.get('EMAIL_USER')
EMAIL_PASS = os.environ.get('EMAIL_PASS')
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


@contact_bp.route('/submit', methods=['POST'])
def submit_contact_form():
    """Handle a contact form submission and send emails via Gmail SMTP."""
    data = request.json

    # 1. Validation
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not all([name, email, subject, message]):
        return jsonify({"error": "Missing required fields"}), 400

    # 2. Email Content Construction
    sender = EMAIL_USER if EMAIL_USER else "simulation@portfolio.com"

    # Email to Owner
    owner_msg = MIMEMultipart()
    owner_msg['From'] = sender
    owner_msg['To'] = EMAIL_USER if EMAIL_USER else "teeganarasimharao@gmail.com"
    owner_msg['Subject'] = f"Portfolio Contact: {subject}"
    body_owner = (
        f"New Message Received from Portfolio Website:\n\n"
        f"Name: {name}\nEmail: {email}\nSubject: {subject}\n\n"
        f"Message:\n{message}\n\nReceived at: {datetime.datetime.now()}"
    )
    owner_msg.attach(MIMEText(body_owner, 'plain'))

    # Auto-Reply to Sender
    user_msg = MIMEMultipart()
    user_msg['From'] = sender
    user_msg['To'] = email
    user_msg['Subject'] = f"Re: {subject} - Thanks for connecting!"
    body_user = (
        f"Hi {name},\n\n"
        f"Thank you for reaching out! I have received your message regarding \"{subject}\".\n"
        f"I will review it and get back to you as soon as possible.\n\n"
        f"Best regards,\nTeega Narasimharao\nData Scientist & AI Developer"
    )
    user_msg.attach(MIMEText(body_user, 'plain'))

    # 3. Sending Logic (Real vs Simulation)
    if EMAIL_USER and EMAIL_PASS:
        return _send_real_email(owner_msg, user_msg, email, subject, message)

    return _simulate_email(email, subject, message)


def _send_real_email(owner_msg, user_msg, email, subject, message):  # pylint: disable=unused-argument
    """Attempt to send email via Gmail SMTP and return a JSON response."""
    try:
        print(f"[SMTP] Connecting to {SMTP_SERVER}...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(owner_msg)
        print("[SMTP] Notification sent to owner.")
        server.send_message(user_msg)
        print("[SMTP] Auto-reply sent to user.")
        server.quit()
        return jsonify({"status": "success", "mode": "real", "message": "Email sent successfully!"})
    except smtplib.SMTPAuthenticationError as exc:
        error_str = str(exc)
        print(f"[SMTP AUTH ERROR] {error_str}")
        if "Application-specific password required" in error_str:
            return jsonify({
                "error": (
                    "Google Blocked Login: Use an App Password. "
                    "Create one at myaccount.google.com/apppasswords"
                )
            }), 401
        return jsonify({"error": "Login Failed: Check your Gmail address and App Password."}), 401
    except smtplib.SMTPException as exc:
        print(f"[SMTP ERROR] {exc}")
        return jsonify({"error": f"Failed to send email: {exc}"}), 500


def _simulate_email(email, subject, message):
    """Log a simulated email to stdout and return a success response."""
    print("\n" + "=" * 40)
    print(" [SIMULATION MODE] EMAIL SENDING TRIGGERED")
    print("=" * 40)
    print(" FROM: simulation@portfolio.com")
    print(" TO: teeganarasimharao@gmail.com")
    print(f" SUBJECT: Portfolio Contact: {subject}")
    print("-" * 20)
    print(f" MESSAGE: \n {message}")
    print("=" * 40)
    print(f" [AUTO-REPLY SENT] To: {email}")
    print("=" * 40 + "\n")
    return jsonify({
        "status": "success",
        "mode": "simulation",
        "message": "Message simulated (Backend received it!)"
    })
