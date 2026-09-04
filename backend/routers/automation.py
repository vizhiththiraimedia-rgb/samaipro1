from fastapi import APIRouter

router = APIRouter(tags=['automation'])

@router.get('/status')
async def status():
    return {'status': 'active'}

