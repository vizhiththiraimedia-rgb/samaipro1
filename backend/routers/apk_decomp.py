from fastapi import APIRouter, File, UploadFile, HTTPException
import tempfile
import os

router = APIRouter(
    prefix="/apk-decomp",
    tags=["APK Decompiler"]
)

@router.post("/analyze")
async def analyze_apk(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith(".apk"):
            raise HTTPException(status_code=400, detail="Only APK files are allowed.")
            
        fd, path = tempfile.mkstemp(suffix=".apk")
        os.close(fd)
        
        with open(path, "wb") as buffer:
            buffer.write(await file.read())
            
        from androguard.core.bytecodes.apk import APK
        a = APK(path)
        
        info = {
            "package_name": a.get_package(),
            "app_name": a.get_app_name(),
            "version_name": a.get_version_name(),
            "version_code": a.get_version_code(),
            "permissions": a.get_permissions(),
            "activities": a.get_activities(),
            "services": a.get_services()
        }
        
        os.remove(path)
        return {"status": "success", "data": info}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
