package com.myheart.facturation.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "factures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numeroFacture;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private Long rendezVousId;

    @Column(nullable = false)
    private LocalDateTime dateEmission;

    @Column(nullable = false)
    private Double montantTotal;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutFacture statut = StatutFacture.EN_ATTENTE;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<LigneFacture> lignes = new ArrayList<>();

    private LocalDateTime datePaiement;
    private String modePaiement;

    public enum StatutFacture {
        EN_ATTENTE, PAYEE, ANNULEE
    }

    public void calculerTotal() {
        this.montantTotal = lignes.stream()
                .mapToDouble(LigneFacture::getMontantTotal)
                .sum();
    }
}