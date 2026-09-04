from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from security import get_current_user
import json

router = APIRouter(
    prefix="/agency-workspace",
    tags=["Agency Workspace"]
)

@router.get("/jobs")
def get_agency_jobs(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    # Fetch agent plans from project memory
    docs = db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.project_id == "agency-workspace").order_by(models.ProjectDocumentDB.timestamp.desc()).all()
    
    jobs = []
    # Map them to the Job interface expected by the frontend
    for i, doc in enumerate(docs):
        meta = json.loads(doc.metadata_json) if doc.metadata_json else {}
        jobs.append({
            "id": f"AGENT-TASK-{i+1000}",
            "title": meta.get("title", "Untitled Agent Plan"),
            "category": "Autonomous AI Strategy",
            "moduleRequired": f"Agent: {meta.get('agent', 'Unknown')} (/modules/agents)",
            "clientBudget": 0,
            "workerPayout": 0,
            "companyProfit": 0,
            "status": "open",
            "deadline": "Autonomous",
            "description": doc.text[:200] + "..." if len(doc.text) > 200 else doc.text
        })
        
    return {"jobs": jobs}

from fastapi.responses import StreamingResponse
import asyncio

class ExecuteJobRequest(schemas.BaseModel):
    job_id: str

@router.post("/execute-job")
async def execute_agency_job(
    req: ExecuteJobRequest,
    db: Session = Depends(get_db)
):
    async def run_pipeline():
        # Fetch the plan
        doc = db.query(models.ProjectDocumentDB).filter(models.ProjectDocumentDB.project_id == "agency-workspace").first() # Just grab the first for demo
        plan_text = doc.text if doc else "Make a youtube video about our AI app."
        
        yield json.dumps({"step": 1, "agent": "Agency Manager", "status": "Reading Marketing Plan..."}) + "\n"
        await asyncio.sleep(1.0)
        
        from api_hub import api_hub
        
        yield json.dumps({"step": 2, "agent": "Content Creator", "status": "Writing YouTube Script..."}) + "\n"
        try:
            script_res = await api_hub.chat([
                {"role": "system", "content": "You are an expert YouTube Scriptwriter. Write a 1-minute high-energy script based on the marketing plan. ONLY output the script."},
                {"role": "user", "content": f"Plan:\n{plan_text[:1000]}"}
            ])
            script = script_res.get("content", "Failed to generate script.")
        except Exception as e:
            script = f"Error: {e}"
            
        yield json.dumps({"step": 2, "result": script}) + "\n"
        await asyncio.sleep(0.5)

        yield json.dumps({"step": 3, "agent": "Thumbnail Designer", "status": "Generating Image Prompt..."}) + "\n"
        try:
            prompt_res = await api_hub.chat([
                {"role": "system", "content": "You are an AI Midjourney expert. Based on the video script, output ONLY a highly detailed prompt for generating a viral YouTube thumbnail. No explanations."},
                {"role": "user", "content": f"Script:\n{script}"}
            ])
            img_prompt = prompt_res.get("content", "Failed to generate prompt.")
        except Exception as e:
            img_prompt = f"Error: {e}"
            
        yield json.dumps({"step": 3, "result": img_prompt}) + "\n"
        
        yield json.dumps({"step": 4, "agent": "System", "status": "Job Completed & Saved to Assets!"}) + "\n"
        
        # Save results back to DB
        new_doc = models.ProjectDocumentDB(
            project_id="agency-workspace",
            doc_id=models.generate_uuid(),
            text=f"# Final Deliverables\n\n## Script\n{script}\n\n## Thumbnail Prompt\n{img_prompt}",
            metadata_json=json.dumps({"title": "Completed Deliverables", "status": "done"})
        )
        db.add(new_doc)
        db.commit()

    return StreamingResponse(run_pipeline(), media_type="application/x-ndjson")
