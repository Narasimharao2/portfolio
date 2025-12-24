from flask import Blueprint, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
import datetime

contact_bp = Blueprint('contact', __name__)

# CONFIGURATION
# To enable real emails, set these environment variables in your system
# Windows Powershell: $env:EMAIL_USER="your@gmail.com"; $env:EMAIL_PASS="your_app_password"
EMAIL_USER = os.environ.get('EMAIL_USER')
EMAIL_PASS = os.environ.get('EMAIL_PASS')
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

@contact_bp.route('/submit', methods=['POST'])
def submit_contact_form():
    data = request.json
    
    # 1. Validation
    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not all([name, email, subject, message]):
        return jsonify({"error": "Missing required fields"}), 400

    # 2. Email Content Construction
    # Email to Owner (Teega)
    owner_msg = MIMEMultipart()
    owner_msg['From'] = EMAIL_USER if EMAIL_USER else "simulation@portfolio.com"
    owner_msg['To'] = EMAIL_USER if EMAIL_USER else "teeganarasimharao@gmail.com"
    owner_msg['Subject'] = f"Portfolio Contact: {subject}"
    
    body_owner = f"""
    New Message Received from Portfolio Website:
    
    Name: {name}
    Email: {email}
    Subject: {subject}
    
    Message:
    {message}
    
    Received at: {datetime.datetime.now()}
    """
    owner_msg.attach(MIMEText(body_owner, 'plain'))

    # Auto-Reply to Sender
    user_msg = MIMEMultipart()
    user_msg['From'] = EMAIL_USER if EMAIL_USER else "simulation@portfolio.com"
    user_msg['To'] = email
    user_msg['Subject'] = f"Re: {subject} - Thanks for connecting!"
    
    body_user = f"""
    Hi {name},

    Thank you for reaching out! I have received your message regarding "{subject}".
    
    I will review it and get back to you as soon as possible.

    Best regards,
    Teega Narasimharao
    Data Scientist & AI Developer
    """
    user_msg.attach(MIMEText(body_user, 'plain'))

    # 3. Sending Logic (Real vs Simulation)
    if EMAIL_USER and EMAIL_PASS:
        try:
            print(f"[SMTP] Connecting to {SMTP_SERVER}...")
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            
            # Send to Owner
            server.send_message(owner_msg)
            print("[SMTP] Notification sent to owner.")
            
            # Send Auto-Reply
            server.send_message(user_msg)
            print("[SMTP] Auto-reply sent to user.")
            
            server.quit()
            return jsonify({"status": "success", "mode": "real", "message": "Email sent successfully!"})
            
        except Exception as e:
            print(f"[SMTP ERROR] {str(e)}")
            error_str = str(e)
            if "Application-specific password required" in error_str:
                return jsonify({"error": "Google Blocked Login: You MUST use an 'App Password' because 2-Step Verification is on. Create one at myaccount.google.com/apppasswords"}), 401
            if "Username and Password not accepted" in error_str:
                return jsonify({"error": "Login Failed: Check your Gmail address and App Password."}), 401
                
            return jsonify({"error": f"Failed to send email: {str(e)}"}), 500
    else:
        # Simulation Mode
        print("\n" + "="*40)
        print(" [SIMULATION MODE] EMAIL SENDING TRIGGERED")
        print("="*40)
        print(f" FROM: simulation@portfolio.com")
        print(f" TO: teeganarasimharao@gmail.com")
        print(f" SUBJECT: Portfolio Contact: {subject}")
        print("-" * 20)
        print(f" MESSAGE: \n {message}")
        print("="*40)
        print(f" [AUTO-REPLY SENT] To: {email}")
        print("="*40 + "\n")
        
        return jsonify({
            "status": "success", 
            "mode": "simulation", 
            "message": "Message simulated (Backend received it!)"
        })
