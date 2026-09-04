from fastapi import APIRouter

router = APIRouter(tags=['business'])

@router.get('/status')
async def status():
    return {'status': 'active'}

