from fastapi import APIRouter

router = APIRouter(tags=['email'])

@router.get('/status')
async def status():
    return {'status': 'active'}

