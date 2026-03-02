from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app.models import AnalyseDB, AnalyseCreate, AnalyseUpdate, AnalyseResponse

router = APIRouter(prefix="/api/analyses")

def generate_numero():
    return f"LAB-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:4].upper()}"

@router.post("", response_model=AnalyseResponse, status_code=201)
def create_analyse(analyse: AnalyseCreate, db: Session = Depends(get_db)):
    db_analyse = AnalyseDB(
        numero_analyse=generate_numero(),
        patient_id=analyse.patient_id,
        medecin_id=analyse.medecin_id,
        type_analyse=analyse.type_analyse,
        description=analyse.description,
        statut="EN_ATTENTE"
    )
    db.add(db_analyse)
    db.commit()
    db.refresh(db_analyse)
    return db_analyse

@router.get("", response_model=List[AnalyseResponse])
def get_all_analyses(db: Session = Depends(get_db)):
    return db.query(AnalyseDB).all()

@router.get("/{analyse_id}", response_model=AnalyseResponse)
def get_analyse(analyse_id: int, db: Session = Depends(get_db)):
    analyse = db.query(AnalyseDB).filter(AnalyseDB.id == analyse_id).first()
    if not analyse:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    return analyse

@router.get("/patient/{patient_id}", response_model=List[AnalyseResponse])
def get_by_patient(patient_id: int, db: Session = Depends(get_db)):
    return db.query(AnalyseDB).filter(AnalyseDB.patient_id == patient_id).all()

@router.put("/{analyse_id}", response_model=AnalyseResponse)
def update_analyse(analyse_id: int, update: AnalyseUpdate, db: Session = Depends(get_db)):
    analyse = db.query(AnalyseDB).filter(AnalyseDB.id == analyse_id).first()
    if not analyse:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    
    if update.resultat:
        analyse.resultat = update.resultat
        analyse.date_resultat = datetime.now()
    if update.statut:
        analyse.statut = update.statut
    
    db.commit()
    db.refresh(analyse)
    return analyse

@router.post("/{analyse_id}/terminer", response_model=AnalyseResponse)
def terminer_analyse(analyse_id: int, resultat: str, db: Session = Depends(get_db)):
    analyse = db.query(AnalyseDB).filter(AnalyseDB.id == analyse_id).first()
    if not analyse:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    
    analyse.resultat = resultat
    analyse.statut = "TERMINEE"
    analyse.date_resultat = datetime.now()
    
    db.commit()
    db.refresh(analyse)
    return analyse

@router.delete("/{analyse_id}", status_code=204)
def delete_analyse(analyse_id: int, db: Session = Depends(get_db)):
    analyse = db.query(AnalyseDB).filter(AnalyseDB.id == analyse_id).first()
    if not analyse:
        raise HTTPException(status_code=404, detail="Analyse non trouvée")
    db.delete(analyse)
    db.commit()
    return {"message": "Analyse supprimée"}