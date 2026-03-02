from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine
from app.models import Base
from app import routes

# Créer les tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Laboratoire Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/health")
def health():
    return {"status": "Laboratoire Service running on port 8084"}