from fastapi import APIRouter

router = APIRouter(tags=['recipe'])

@router.get('/status')
async def status():
    return {'status': 'active'}

