package com.myheart.notification.service;

import com.myheart.notification.model.Notification;
import com.myheart.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification creerNotification(Long patientId, String email,
                                          Notification.TypeNotification type,
                                          String sujet, String message) {
        Notification notification = Notification.builder()
                .patientId(patientId)
                .email(email)
                .type(type)
                .sujet(sujet)
                .message(message)
                .statut(Notification.StatutNotification.EN_ATTENTE)
                .build();

        return notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public List<Notification> getNotificationsByPatient(Long patientId) {
        return notificationRepository.findByPatientId(patientId);
    }

    public Notification envoyerNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));

        try {
            // Simulation d'envoi d'email
            log.info("📧 Envoi d'email à {} : {}", notification.getEmail(), notification.getSujet());

            // Ici vous intégreriez vraiment JavaMailSender

            notification.setStatut(Notification.StatutNotification.ENVOYEE);
            notification.setDateEnvoi(LocalDateTime.now());

        } catch (Exception e) {
            notification.setStatut(Notification.StatutNotification.ERREUR);
            notification.setErreur(e.getMessage());
            log.error("❌ Erreur d'envoi: {}", e.getMessage());
        }

        return notificationRepository.save(notification);
    }

    public void supprimerNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}