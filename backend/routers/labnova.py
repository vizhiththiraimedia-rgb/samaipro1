from fastapi import APIRouter
import random

router = APIRouter(
    prefix="/labnova",
    tags=["LabNova Portal"]
)

@router.get("/dashboard")
def get_dashboard():
    # Real random simulated data for enterprise dashboard
    return {
        "status": "active",
        "active_users": random.randint(120, 350),
        "total_revenue": round(random.uniform(10000, 50000), 2),
        "server_load": f"{random.randint(20, 85)}%",
        "recent_alerts": [
            {"id": 1, "msg": "Database sync completed successfully.", "type": "success"},
            {"id": 2, "msg": "High CPU usage detected on Node-3", "type": "warning"}
        ]
    }
