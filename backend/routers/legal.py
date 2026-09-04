from fastapi import APIRouter

router = APIRouter(tags=['legal'])

@router.get('/status')
async def status():
    return {'status': 'active'}

