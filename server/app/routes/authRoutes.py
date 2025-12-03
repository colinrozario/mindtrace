from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
import os
from pydantic import BaseModel, EmailStr

from ..database import get_db
from ..models import User
from ..utils.auth import get_password_hash, verify_password, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from ..utils.email_utils import send_password_reset_email
import secrets
from datetime import timedelta

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# --- Schemas ---
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str



# --- Routes ---

@router.post("/signup", response_model=Token)
def signup(user: UserSignup, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        password_hash=hashed_password,
        full_name=user.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email, "user_id": new_user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not db_user.password_hash or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email, "user_id": db_user.id},
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
def logout(current_user: User = Depends(get_db)):
    # Since we use JWTs, the server doesn't need to do much to "logout" a user 
    # unless we are blacklisting tokens. For now, we just acknowledge the request.
    return {"message": "Successfully logged out"}

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Send password reset email to the user.
    Always returns success to prevent email enumeration attacks.
    """
    try:
        # Look up user by email
        db_user = db.query(User).filter(User.email == request.email).first()
        
        if db_user:
            # Generate secure reset token
            reset_token = secrets.token_urlsafe(32)
            
            # Set token expiration (1 hour from now)
            from datetime import datetime, timedelta
            db_user.reset_token = reset_token
            db_user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
            db.commit()
            
            # Send reset email
            email_sent = send_password_reset_email(
                to_email=request.email,
                reset_token=reset_token
            )
            
            if email_sent:
                print(f"✅ Password reset email sent successfully to {request.email}")
            else:
                print(f"❌ Failed to send password reset email to {request.email}")
        else:
            print(f"ℹ️  No user found with email: {request.email}")
        
        # Always return success, even if user doesn't exist (security best practice)
        return {"message": "If an account exists with this email, a password reset email has been sent."}
        
    except Exception as e:
        # Log error but still return success to user
        print(f"❌ Error in forgot_password: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"message": "If an account exists with this email, a password reset email has been sent."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Reset user password using the reset token.
    """
    try:
        from datetime import datetime
        
        # Find user with this reset token
        db_user = db.query(User).filter(User.reset_token == request.token).first()
        
        if not db_user:
            raise HTTPException(status_code=400, detail="Invalid or expired reset token")
        
        # Check if token is expired
        if db_user.reset_token_expires < datetime.utcnow():
            raise HTTPException(status_code=400, detail="Reset token has expired")
        
        # Update password
        db_user.password_hash = get_password_hash(request.new_password)
        db_user.reset_token = None
        db_user.reset_token_expires = None
        db.commit()
        
        print(f"✅ Password reset successfully for {db_user.email}")
        return {"message": "Password has been reset successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error in reset_password: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Failed to reset password")
