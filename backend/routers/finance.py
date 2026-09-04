from fastapi import APIRouter

router = APIRouter(tags=['finance'])

@router.get('/status')
async def status():
    return {'status': 'active'}

