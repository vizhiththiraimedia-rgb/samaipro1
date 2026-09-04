from fastapi import APIRouter, Depends

router = APIRouter(tags=["SEO"])

@router.get("/status")
async def seo_status():
    return {"status": "SEO Service is active"}
