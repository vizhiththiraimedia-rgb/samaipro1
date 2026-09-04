from fastapi import APIRouter

router = APIRouter(tags=['health'])

@router.get('/status')
async def status():
    return {'status': 'active'}

