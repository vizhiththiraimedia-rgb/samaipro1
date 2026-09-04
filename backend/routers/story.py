from fastapi import APIRouter

router = APIRouter(tags=['story'])

@router.get('/status')
async def status():
    return {'status': 'active'}

