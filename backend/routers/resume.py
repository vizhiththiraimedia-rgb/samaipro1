from fastapi import APIRouter

router = APIRouter(tags=['resume'])

@router.get('/status')
async def status():
    return {'status': 'active'}

