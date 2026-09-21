from fastapi import FastAPI

from app.database import Base, engine
from app.models.user import User

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="LifeOS AI Backend",
    description="Backend API for LifeOS AI",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "LifeOS AI Backend is running"
    }