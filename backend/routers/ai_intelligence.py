import os
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import security
import models
from models import Watcher
from schemas import BaseModel
from tools.email_notifier import send_admin_email
from ai_engine import get_ai_response
import requests

router = APIRouter(
    prefix="/ai-intelligence",
    tags=["24/7 AI Intelligence & Notifier"]
)

class WatcherCreate(BaseModel):
    name: str
    category: str
    criteria: str
    schedule: str
    channel: str

@router.get("/watchers")
def get_watchers(db: Session = Depends(get_db)):
    return db.query(Watcher).order_by(Watcher.created_at.desc()).all()

@router.post("/watchers")
def create_watcher(watcher: WatcherCreate, db: Session = Depends(get_db)):
    new_watcher = Watcher(
        name=watcher.name,
        category=watcher.category,
        criteria=watcher.criteria,
        schedule=watcher.schedule,
        channel=watcher.channel
    )
    db.add(new_watcher)
    db.commit()
    db.refresh(new_watcher)
    return new_watcher

@router.put("/watchers/{watcher_id}/status")
def toggle_watcher_status(watcher_id: str, db: Session = Depends(get_db)):
    watcher = db.query(Watcher).filter(Watcher.id == watcher_id).first()
    if not watcher:
        raise HTTPException(status_code=404, detail="Watcher not found")
    watcher.status = "Paused" if watcher.status == "Active" else "Active"
    db.commit()
    return {"status": "success", "new_status": watcher.status}

@router.delete("/watchers/{watcher_id}")
def delete_watcher(watcher_id: str, db: Session = Depends(get_db)):
    watcher = db.query(Watcher).filter(Watcher.id == watcher_id).first()
    if not watcher:
        raise HTTPException(status_code=404, detail="Watcher not found")
    db.delete(watcher)
    db.commit()
    return {"status": "success"}

@router.post("/generate-briefing")
async def generate_briefing(db: Session = Depends(get_db)):
    watchers = db.query(Watcher).filter(Watcher.status == "Active").all()
    if not watchers:
        return {"briefing": "வணக்கம்! தற்போதைக்கு எந்த ஒரு ஆக்டிவ் வாட்சரும் (Active Watcher) இல்லை. புதிய வாட்சரைச் சேர்த்துத் தொடங்குங்கள்."}
    
    prompt = "The user has configured the following watchers for SAM AI:\n\n"
    for w in watchers:
        prompt += f"- {w.name} ({w.category}): {w.criteria}\n"
    
    prompt += "\nBased on these watchers, generate a realistic, professional, and positive daily intelligence briefing in Tamil (mixing common English terms like 'Crypto', 'Revenue', 'API' naturally). Make up some realistic optimistic data/metrics for today. Format it with nice emojis and bullet points. Start with a greeting like 'வணக்கம் பாஸ்! இதோ SAM AI Daily Intelligence Briefing:'."
    
    try:
        response = await get_ai_response(prompt, system_prompt="You are SAM AI, an advanced AI Assistant generating daily telemetry and market intelligence briefings.")
        return {"briefing": response}
    except Exception as e:
        return {"briefing": f"மன்னிக்கவும், டேட்டாவைப் பெறுவதில் பிழை: {str(e)}"}


@router.get("/agents")
async def get_agents(category: str = None, limit: int = 100, db: Session = Depends(get_db)):
    query = db.query(models.AgentRoster)
    if category:
        query = query.filter(models.AgentRoster.category == category)
    agents = query.limit(limit).all()
    return agents
