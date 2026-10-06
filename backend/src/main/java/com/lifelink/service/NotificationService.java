package com.lifelink.service;

import com.lifelink.entity.Notification;
import com.lifelink.entity.User;
import com.lifelink.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AuthService authService;

    public NotificationService(NotificationRepository notificationRepository, AuthService authService) {
        this.notificationRepository = notificationRepository;
        this.authService = authService;
    }

    public List<Notification> getMyNotifications() {
        User user = authService.getCurrentAuthenticatedUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public long getUnreadCount() {
        User user = authService.getCurrentAuthenticatedUser();
        return notificationRepository.countByUserIdAndReadStatusFalse(user.getId());
    }

    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + notificationId));
        notif.setReadStatus(true);
        notificationRepository.save(notif);
    }

    @Transactional
    public void markAllAsRead() {
        User user = authService.getCurrentAuthenticatedUser();
        List<Notification> notifs = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : notifs) {
            n.setReadStatus(true);
        }
        notificationRepository.saveAll(notifs);
    }
}
