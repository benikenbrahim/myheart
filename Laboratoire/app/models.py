from sqlalchemy import Column, Integer, String, DateTime, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

Base = declarative_base()

class AnalyseDB(Base):
    __tablename__ = "analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    numero_analyse = Column(String, unique=True, index=True)
    patient_id = Column(Integer, nullable=False)
    medecin_id = Column(Integer, nullable=False)
    type_analyse = Column(String, nullable=False)
    description = Column(Text)
    resultat = Column(Text)
    statut = Column(String, default="EN_ATTENTE")
    date_demande = Column(DateTime, default=datetime.now)
    date_resultat = Column(DateTime, nullable=True)

# Pydantic models
class AnalyseCreate(BaseModel):
    patient_id: int
    medecin_id: int
    type_analyse: str
    description: str

class AnalyseUpdate(BaseModel):
    resultat: Optional[str] = None
    statut: Optional[str] = None

class AnalyseResponse(BaseModel):
    id: int
    numero_analyse: str
    patient_id: int
    medecin_id: int
    type_analyse: str
    description: str
    resultat: Optional[str]
    statut: str
    date_demande: datetime
    date_resultat: Optional[datetime]
    
    class Config:
        from_attributes = True