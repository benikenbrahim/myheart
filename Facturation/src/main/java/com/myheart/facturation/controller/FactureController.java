package com.myheart.facturation.controller;

import com.myheart.facturation.model.Facture;
import com.myheart.facturation.model.LigneFacture;
import com.myheart.facturation.service.FactureService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/factures")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FactureController {

    private final FactureService factureService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Facture creerFacture(@RequestBody Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long rendezVousId = Long.valueOf(request.get("rendezVousId").toString());

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> lignesData = (List<Map<String, Object>>) request.get("lignes");

        List<LigneFacture> lignes = lignesData.stream().map(l ->
                LigneFacture.builder()
                        .description(l.get("description").toString())
                        .quantite(Integer.valueOf(l.get("quantite").toString()))
                        .prixUnitaire(Double.valueOf(l.get("prixUnitaire").toString()))
                        .build()
        ).toList();

        return factureService.creerFacture(patientId, rendezVousId, lignes);
    }

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureService.getAllFactures();
    }

    @GetMapping("/{id}")
    public Facture getFacture(@PathVariable Long id) {
        return factureService.getFacture(id);
    }

    @GetMapping("/patient/{patientId}")
    public List<Facture> getFacturesByPatient(@PathVariable Long patientId) {
        return factureService.getFacturesByPatient(patientId);
    }

    @PostMapping("/{id}/payer")
    public Facture payerFacture(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String modePaiement = request.getOrDefault("modePaiement", "CARTE");
        return factureService.payerFacture(id, modePaiement);
    }

    @PostMapping("/{id}/annuler")
    public void annulerFacture(@PathVariable Long id) {
        factureService.annulerFacture(id);
    }
}