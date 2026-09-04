from fastapi import APIRouter

router = APIRouter(tags=['content'])

@router.get('/status')
async def status():
    return {'status': 'active'}

