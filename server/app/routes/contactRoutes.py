from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import os
import shutil

from ..database import get_db
from ..models import Contact, User
from ..utils.auth import get_current_user

router = APIRouter(
    prefix="/contacts",
    tags=["contacts"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class ContactBase(BaseModel):
    name: str
    relationship: str
    relationship_detail: Optional[str] = None
    avatar: Optional[str] = None
    color: Optional[str] = "indigo"
    phone_number: Optional[str] = None
    email: Optional[str] = None
    notes: Optional[str] = None
    visit_frequency: Optional[str] = None
    profile_photo: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(ContactBase):
    pass

class ContactResponse(ContactBase):
    id: int
    user_id: int
    last_seen: Optional[datetime] = None
    is_active: bool
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[ContactResponse])
def get_contacts(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contacts = db.query(Contact).filter(Contact.user_id == current_user.id, Contact.is_active == True).offset(skip).limit(limit).all()
    return contacts

@router.post("/", response_model=ContactResponse)
def create_contact(
    contact: ContactCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = Contact(**contact.dict(), user_id=current_user.id)
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.post("/with-photo", response_model=ContactResponse)
async def create_contact_with_photo(
    name: str = Form(...),
    relationship: str = Form(...),
    relationship_detail: Optional[str] = Form(None),
    phone_number: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    notes: Optional[str] = Form(None),
    visit_frequency: Optional[str] = Form(None),
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a contact with a profile photo for face recognition"""
    try:
        # Create directory for contact photos
        BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        PHOTOS_DIR = os.path.join(BASE_DIR, "ai_engine", "profiles", "images")
        os.makedirs(PHOTOS_DIR, exist_ok=True)
        
        # Save the photo with a unique name
        file_extension = os.path.splitext(photo.filename)[1]
        safe_name = name.replace(" ", "_").lower()
        photo_filename = f"{safe_name}_{current_user.id}{file_extension}"
        photo_path = os.path.join(PHOTOS_DIR, photo_filename)
        
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
        
        # Create contact with photo path
        db_contact = Contact(
            user_id=current_user.id,
            name=name,
            relationship=relationship,
            relationship_detail=relationship_detail,
            phone_number=phone_number,
            email=email,
            notes=notes,
            visit_frequency=visit_frequency,
            profile_photo=photo_path,
            avatar=name[:2].upper(),
            color="indigo"
        )
        
        db.add(db_contact)
        db.commit()
        db.refresh(db_contact)
        
        return db_contact
        
    except Exception as e:
        print(f"Error creating contact with photo: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{contact_id}", response_model=ContactResponse)
def get_contact(
    contact_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    contact = db.query(Contact).filter(Contact.id == contact_id, Contact.user_id == current_user.id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact

@router.put("/{contact_id}", response_model=ContactResponse)
def update_contact(
    contact_id: int, 
    contact_update: ContactUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = db.query(Contact).filter(Contact.id == contact_id, Contact.user_id == current_user.id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    for key, value in contact_update.dict(exclude_unset=True).items():
        setattr(db_contact, key, value)
    
    db.commit()
    db.refresh(db_contact)
    return db_contact

@router.delete("/{contact_id}")
def delete_contact(
    contact_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contact = db.query(Contact).filter(Contact.id == contact_id, Contact.user_id == current_user.id).first()
    if not db_contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Soft delete
    db_contact.is_active = False
    db.commit()
    return {"message": "Contact deleted successfully"}
