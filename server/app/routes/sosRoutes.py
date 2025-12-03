from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from ..database import get_db
from ..models import SOSContact, SOSConfig, User
from ..utils.auth import get_current_user

router = APIRouter(
    prefix="/sos",
    tags=["sos"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class SOSContactBase(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    relationship: Optional[str] = None
    priority: int = 1

class SOSContactCreate(SOSContactBase):
    pass

class SOSContactResponse(SOSContactBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class SOSConfigBase(BaseModel):
    send_sms: bool = True
    make_call: bool = True
    share_location: bool = True
    record_audio: bool = False
    email_alert: bool = True
    alert_services: bool = False

class SOSConfigResponse(SOSConfigBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

# --- Contacts Endpoints ---

@router.get("/contacts", response_model=List[SOSContactResponse])
def get_sos_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(SOSContact).filter(SOSContact.user_id == current_user.id).order_by(SOSContact.priority).all()
    return contacts

@router.post("/contacts", response_model=SOSContactResponse)
def create_sos_contact(
    contact: SOSContactCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = SOSContact(**contact.dict(), user_id=current_user.id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/contacts/{contact_id}")
def delete_sos_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = db.query(SOSContact).filter(SOSContact.id == contact_id, SOSContact.user_id == current_user.id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    db.delete(db_contact)
    db.commit()
    return {"message": "Contact deleted successfully"}

# --- Config Endpoints ---

@router.get("/config", response_model=SOSConfigResponse)
def get_sos_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    config = db.query(SOSConfig).filter(SOSConfig.user_id == current_user.id).first()
    if not config:
        # Create default config if not exists
        config = SOSConfig(user_id=current_user.id)
        db.add(config)
        db.commit()
        db.refresh(config)
    return config

@router.put("/config", response_model=SOSConfigResponse)
def update_sos_config(
    config_update: SOSConfigBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    config = db.query(SOSConfig).filter(SOSConfig.user_id == current_user.id).first()
    if not config:
        config = SOSConfig(user_id=current_user.id)
        db.add(config)
    
    for key, value in config_update.dict(exclude_unset=True).items():
        setattr(config, key, value)
        
    db.commit()
    db.refresh(config)
    return config
