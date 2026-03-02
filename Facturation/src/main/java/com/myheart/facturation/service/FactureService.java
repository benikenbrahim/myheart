package com.myheart.facturation.service;

import com.myheart.facturation.model.Facture;
import com.myheart.facturation.model.LigneFacture;
import com.myheart.facturation.repository.FactureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FactureService {

    private final FactureRepository factureRepository;

    @Transactional
    public Facture creerFacture(Long patientId, Long rendezVousId, List<LigneFacture> lignes) {
        Facture facture = Facture.builder()
                .numeroFacture(generateNumeroFacture())
                .patientId(patientId)
                .rendezVousId(rendezVousId)
                .dateEmission(LocalDateTime.now())
                .statut(Facture.StatutFacture.EN_ATTENTE)
                .build();

        // Associer les lignes à la facture
        lignes.forEach(ligne -> ligne.setFacture(facture));
        facture.setLignes(lignes);

        // Calculer le total
        facture.calculerTotal();

        return factureRepository.save(facture);
    }

    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    public Facture getFacture(Long id) {
        return factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée: " + id));
    }

    public List<Facture> getFacturesByPatient(Long patientId) {
        return factureRepository.findByPatientId(patientId);
    }

    @Transactional
    public Facture payerFacture(Long id, String modePaiement) {
        Facture facture = getFacture(id);

        if (facture.getStatut() == Facture.StatutFacture.PAYEE) {
            throw new RuntimeException("Facture déjà payée");
        }

        facture.setStatut(Facture.StatutFacture.PAYEE);
        facture.setDatePaiement(LocalDateTime.now());
        facture.setModePaiement(modePaiement);

        return factureRepository.save(facture);
    }

    @Transactional
    public void annulerFacture(Long id) {
        Facture facture = getFacture(id);
        facture.setStatut(Facture.StatutFacture.ANNULEE);
        factureRepository.save(facture);
    }

    private String generateNumeroFacture() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "FAC-" + timestamp + "-" + random;
    }
}