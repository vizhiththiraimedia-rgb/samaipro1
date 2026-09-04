from fastapi import APIRouter

router = APIRouter(tags=['presentation'])

@router.get('/status')
async def status():
    return {'status': 'active'}

