from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional, Any
from pydantic import BaseModel
from datetime import datetime

from ..database import get_db
from ..models import Interaction, User, Contact
from ..utils.auth import get_current_user

router = APIRouter(
    prefix="/interactions",
    tags=["interactions"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class InteractionBase(BaseModel):
    contact_id: Optional[int] = None
    contact_name: Optional[str] = None
    summary: Optional[str] = None
    full_details: Optional[str] = None
    key_topics: Optional[List[str]] = []
    mood: Optional[str] = "neutral"
    duration: Optional[str] = None
    location: Optional[str] = None
    starred: Optional[bool] = False

class InteractionCreate(InteractionBase):
    pass

class InteractionResponse(InteractionBase):
    id: int
    user_id: int
    timestamp: datetime
    
    # Enriched fields for frontend convenience
    contact_avatar: Optional[str] = None
    contact_relationship: Optional[str] = None
    contact_color: Optional[str] = None

    class Config:
        from_attributes = True

@router.get("/", response_model=List[InteractionResponse])
def get_interactions(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    mood: Optional[str] = None,
    starred: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Interaction).filter(Interaction.user_id == current_user.id)
    
    if mood and mood != 'all':
        query = query.filter(Interaction.mood == mood)
    
    if starred:
        query = query.filter(Interaction.starred == True)
        
    if search:
        # Simple search implementation
        search_term = f"%{search}%"
        query = query.filter(
            (Interaction.contact_name.ilike(search_term)) | 
            (Interaction.summary.ilike(search_term))
        )
    
    interactions = query.order_by(Interaction.timestamp.desc()).offset(skip).limit(limit).all()
    
    # Enrich with contact info if available
    results = []
    for interaction in interactions:
        resp = InteractionResponse.from_orm(interaction)
        if interaction.contact_id:
            contact = db.query(Contact).filter(Contact.id == interaction.contact_id).first()
            if contact:
                resp.contact_avatar = contact.avatar
                resp.contact_relationship = contact.relationship_detail or contact.relationship
                resp.contact_color = contact.color
        results.append(resp)
        
    return results

@router.get("/{interaction_id}", response_model=InteractionResponse)
def get_interaction(
    interaction_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id, Interaction.user_id == current_user.id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    resp = InteractionResponse.from_orm(interaction)
    if interaction.contact_id:
        contact = db.query(Contact).filter(Contact.id == interaction.contact_id).first()
        if contact:
            resp.contact_avatar = contact.avatar
            resp.contact_relationship = contact.relationship_detail or contact.relationship
            resp.contact_color = contact.color
            
    return resp

@router.post("/", response_model=InteractionResponse)
def create_interaction(
    interaction: InteractionCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # If contact_id provided, fetch name if not provided
    if interaction.contact_id and not interaction.contact_name:
        contact = db.query(Contact).filter(Contact.id == interaction.contact_id).first()
        if contact:
            interaction.contact_name = contact.name
            
    db_interaction = Interaction(**interaction.dict(), user_id=current_user.id)
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@router.put("/{interaction_id}/star", response_model=InteractionResponse)
def toggle_star_interaction(
    interaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id, Interaction.user_id == current_user.id).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="Interaction not found")
    
    interaction.starred = not interaction.starred
    db.commit()
    db.refresh(interaction)
    return interaction
