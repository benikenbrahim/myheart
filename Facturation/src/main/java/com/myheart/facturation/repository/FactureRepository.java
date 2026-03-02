package com.myheart.facturation.repository;

import com.myheart.facturation.model.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FactureRepository extends JpaRepository<Facture, Long> {
    Optional<Facture> findByNumeroFacture(String numeroFacture);
    List<Facture> findByPatientId(Long patientId);
    List<Facture> findByStatut(Facture.StatutFacture statut);
}