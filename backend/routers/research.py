from fastapi import APIRouter

router = APIRouter(tags=['research'])

@router.get('/status')
async def status():
    return {'status': 'active'}

