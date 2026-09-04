from fastapi import APIRouter

router = APIRouter(tags=['document'])

@router.get('/status')
async def status():
    return {'status': 'active'}

