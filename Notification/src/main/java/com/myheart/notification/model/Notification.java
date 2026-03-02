package com.myheart.notification.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long patientId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TypeNotification type;

    @Column(nullable = false)
    private String sujet;

    @Column(nullable = false, length = 2000)
    private String message;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private StatutNotification statut = StatutNotification.EN_ATTENTE;

    private LocalDateTime dateEnvoi;

    @Column(length = 500)
    private String erreur;

    public enum TypeNotification {
        EMAIL, SMS, RAPPEL_RENDEZ_VOUS, RESULTAT_ANALYSE, FACTURE
    }

    public enum StatutNotification {
        EN_ATTENTE, ENVOYEE, ERREUR
    }
}