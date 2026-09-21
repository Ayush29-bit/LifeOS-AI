from fastapi import FastAPI

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