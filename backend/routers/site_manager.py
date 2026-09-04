from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import json
import schemas

router = APIRouter(
    prefix="/site-manager",
    tags=["Site Manager"]
)

from pydantic import BaseModel
class SiteRequest(BaseModel):
    name: str
    type: str
    status: str
    manageUrl: str
    siteUrl: str

@router.get("/sites")
def get_sites(db: Session = Depends(get_db)):
    docs = db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.project_id == "site-manager").all()
    sites = []
    for d in docs:
        if d.metadata_json:
            meta = json.loads(d.metadata_json)
            meta['id'] = d.doc_id
            sites.append(meta)
    return {"sites": sites}

@router.post("/sites")
def add_site(req: SiteRequest, db: Session = Depends(get_db)):
    doc_id = models.generate_uuid()
    meta = req.dict()
    new_site = models.ProjectDocumentDB(
        project_id="site-manager",
        doc_id=doc_id,
        text="site entry",
        metadata_json=json.dumps(meta)
    )
    db.add(new_site)
    db.commit()
    meta['id'] = doc_id
    return {"status": "success", "site": meta}

@router.delete("/sites/{site_id}")
def delete_site(site_id: str, db: Session = Depends(get_db)):
    db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.doc_id == site_id).delete()
    db.commit()
    return {"status": "deleted"}
