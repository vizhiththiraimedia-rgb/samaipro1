from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
import json

router = APIRouter(
    prefix="/web-editor",
    tags=["Web Editor"]
)

class SaveRequest(BaseModel):
    code: str

@router.get("/code")
def get_code(db: Session = Depends(get_db)):
    doc = db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.project_id == "web-editor").first()
    if doc:
        return {"code": doc.text}
    return {"code": ""}

@router.post("/save")
def save_code(req: SaveRequest, db: Session = Depends(get_db)):
    doc = db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.project_id == "web-editor").first()
    if not doc:
        doc = models.ProjectDocumentDB(
            project_id="web-editor",
            doc_id=models.generate_uuid(),
            text=req.code,
            metadata_json="{}"
        )
        db.add(doc)
    else:
        doc.text = req.code
    
    db.commit()
    return {"status": "saved"}
