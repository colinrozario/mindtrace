import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

def send_password_reset_email(to_email: str, reset_token: str) -> bool:
    """
    Send password reset email with reset link via Gmail SMTP.
    
    Args:
        to_email: Recipient email address
        reset_token: Password reset token
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    smtp_from_email = os.getenv("SMTP_FROM_EMAIL", smtp_username)
    
    print(f"DEBUG: SMTP Config - Server: {smtp_server}, Port: {smtp_port}, Username: {smtp_username}, From: {smtp_from_email}")
    
    # Validate SMTP configuration
    if not smtp_username or not smtp_password:
        print("ERROR: SMTP credentials not configured in environment variables")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "MindTrace - Password Recovery"
        msg["From"] = smtp_from_email
        msg["To"] = to_email
        
        # Get client URL from environment
        client_url = os.getenv("CLIENT_URL", "http://localhost:5173")
        reset_link = f"{client_url}/reset-password?token={reset_token}"
        
        # Create email body
        text_content = f"""
Hello,

You requested to reset your password for MindTrace.

Click the link below to reset your password:
{reset_link}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
MindTrace Team
"""
        
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }}
        .content {{ background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }}
        .button-box {{ text-align: center; margin: 30px 0; }}
        .reset-button {{ display: inline-block; background-color: #4f46e5; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; }}
        .reset-button:hover {{ background-color: #4338ca; }}
        .footer {{ margin-top: 20px; font-size: 12px; color: #6b7280; }}
        .expiry {{ background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0; border-radius: 4px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MindTrace</h1>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>You requested to reset your password for MindTrace.</p>
            <div class="button-box">
                <a href="{reset_link}" class="reset-button">Reset Password</a>
            </div>
            <div class="expiry">
                <strong>⏰ This link will expire in 1 hour</strong>
            </div>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">{reset_link}</p>
            <p>If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
            <div class="footer">
                <p>Best regards,<br>MindTrace Team</p>
            </div>
        </div>
    </div>
</body>
</html>
"""
        
        # Attach both plain text and HTML versions
        part1 = MIMEText(text_content, "plain")
        part2 = MIMEText(html_content, "html")
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Secure the connection
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        print(f"Password recovery email sent successfully to {to_email}")
        return True
        
    except smtplib.SMTPAuthenticationError:
        print("ERROR: SMTP authentication failed. Check your Gmail credentials.")
        return False
    except smtplib.SMTPException as e:
        print(f"ERROR: SMTP error occurred: {str(e)}")
        return False
    except Exception as e:
        print(f"ERROR: Failed to send email: {str(e)}")
        return False
