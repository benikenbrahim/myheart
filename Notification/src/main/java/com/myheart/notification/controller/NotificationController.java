package com.myheart.notification.controller;

import com.myheart.notification.model.Notification;
import com.myheart.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification creer(@RequestBody Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        String email = request.get("email").toString();
        String type = request.get("type").toString();
        String sujet = request.get("sujet").toString();
        String message = request.get("message").toString();

        return notificationService.creerNotification(
                patientId,
                email,
                Notification.TypeNotification.valueOf(type),
                sujet,
                message
        );
    }

    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationService.getNotificationsByPatient(id).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
    }

    @GetMapping("/patient/{patientId}")
    public List<Notification> getByPatient(@PathVariable Long patientId) {
        return notificationService.getNotificationsByPatient(patientId);
    }

    @PostMapping("/{id}/envoyer")
    public Notification envoyer(@PathVariable Long id) {
        return notificationService.envoyerNotification(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimer(@PathVariable Long id) {
        notificationService.supprimerNotification(id);
    }
}