from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

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
