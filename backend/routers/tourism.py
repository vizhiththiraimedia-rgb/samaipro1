from fastapi import APIRouter

router = APIRouter(tags=['tourism'])

@router.get('/status')
async def status():
    return {'status': 'active'}

