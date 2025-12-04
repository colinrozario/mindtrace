from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import json

from ..database import get_db
from ..models import User, ChatMessage as ChatMessageModel
from ..utils.auth import get_current_user
from ..services.ai_service import ai_assistant

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    responses={404: {"description": "Not found"}},
)

# Pydantic models
class ChatMessageRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[dict] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: datetime
    conversation_id: Optional[str] = None

class ChatHistoryMessage(BaseModel):
    id: int
    role: str
    content: str
    timestamp: datetime

@router.post("/message", response_model=ChatResponse)
async def send_chat_message(
    chat_message: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to the AI chatbot"""
    try:
        # Generate conversation ID if not provided
        conversation_id = chat_message.conversation_id or f"conv_{current_user.id}_{datetime.now().timestamp()}"
        
        # Save user message to database
        user_message = ChatMessageModel(
            user_id=current_user.id,
            conversation_id=conversation_id,
            role="user",
            content=chat_message.message
        )
        db.add(user_message)
        db.commit()
        
        # Get conversation history for context
        history_messages = db.query(ChatMessageModel).filter(
            ChatMessageModel.user_id == current_user.id,
            ChatMessageModel.conversation_id == conversation_id
        ).order_by(ChatMessageModel.timestamp.asc()).all()
        
        # Convert to format expected by AI service
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in history_messages
        ]
        
        # Generate AI response
        ai_response = await ai_assistant.generate_response(
            message=chat_message.message,
            conversation_history=conversation_history,
            db=db,
            user=current_user
        )
        
        # Save assistant response to database
        assistant_message = ChatMessageModel(
            user_id=current_user.id,
            conversation_id=conversation_id,
            role="assistant",
            content=ai_response
        )
        db.add(assistant_message)
        db.commit()
        
        return ChatResponse(
            response=ai_response,
            timestamp=datetime.now(),
            conversation_id=conversation_id
        )
    except Exception as e:
        db.rollback()
        print(f"Error in chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat message: {str(e)}"
        )

@router.post("/stream")
async def send_chat_message_streaming(
    chat_message: ChatMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to the AI chatbot with streaming response"""
    try:
        # Generate conversation ID if not provided
        conversation_id = chat_message.conversation_id or f"conv_{current_user.id}_{datetime.now().timestamp()}"
        
        # Save user message to database
        user_message = ChatMessageModel(
            user_id=current_user.id,
            conversation_id=conversation_id,
            role="user",
            content=chat_message.message
        )
        db.add(user_message)
        db.commit()
        
        # Get conversation history for context
        history_messages = db.query(ChatMessageModel).filter(
            ChatMessageModel.user_id == current_user.id,
            ChatMessageModel.conversation_id == conversation_id
        ).order_by(ChatMessageModel.timestamp.asc()).all()
        
        # Convert to format expected by AI service
        conversation_history = [
            {"role": msg.role, "content": msg.content}
            for msg in history_messages
        ]
        
        # Stream AI response
        async def generate():
            full_response = ""
            try:
                async for chunk in ai_assistant.generate_streaming_response(
                    message=chat_message.message,
                    conversation_history=conversation_history,
                    db=db,
                    user=current_user
                ):
                    full_response += chunk
                    yield f"data: {json.dumps({'content': chunk})}\n\n"
                
                # Save complete assistant response to database
                assistant_message = ChatMessageModel(
                    user_id=current_user.id,
                    conversation_id=conversation_id,
                    role="assistant",
                    content=full_response
                )
                db.add(assistant_message)
                db.commit()
                
                yield "data: [DONE]\n\n"
            except Exception as e:
                print(f"Error in streaming: {str(e)}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"
        
        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            }
        )
    except Exception as e:
        db.rollback()
        print(f"Error in chat streaming: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing chat message: {str(e)}"
        )

@router.get("/history", response_model=List[ChatHistoryMessage])
def get_chat_history(
    conversation_id: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat history for the current user"""
    try:
        query = db.query(ChatMessageModel).filter(
            ChatMessageModel.user_id == current_user.id
        )
        
        if conversation_id:
            query = query.filter(ChatMessageModel.conversation_id == conversation_id)
        
        messages = query.order_by(
            ChatMessageModel.timestamp.desc()
        ).limit(limit).all()
        
        # Reverse to get chronological order
        messages.reverse()
        
        return [
            ChatHistoryMessage(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                timestamp=msg.timestamp
            )
            for msg in messages
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving chat history: {str(e)}"
        )

@router.delete("/history")
def clear_chat_history(
    conversation_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Clear chat history for the current user"""
    try:
        query = db.query(ChatMessageModel).filter(
            ChatMessageModel.user_id == current_user.id
        )
        
        if conversation_id:
            query = query.filter(ChatMessageModel.conversation_id == conversation_id)
        
        deleted_count = query.delete()
        db.commit()
        
        return {"message": f"Deleted {deleted_count} messages", "count": deleted_count}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error clearing chat history: {str(e)}"
        )
