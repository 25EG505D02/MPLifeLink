package com.lifelink.service;

import com.lifelink.dto.DeliveryResponseDto;
import com.lifelink.dto.DeliveryStatusUpdateDto;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final ResourceMatchRepository matchRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final AuthService authService;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public DeliveryService(DeliveryRepository deliveryRepository,
                           ResourceMatchRepository matchRepository,
                           ResourceRepository resourceRepository,
                           ResourceRequestRepository requestRepository,
                           AuthService authService,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository) {
        this.deliveryRepository = deliveryRepository;
        this.matchRepository = matchRepository;
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.authService = authService;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public List<DeliveryResponseDto> getMyDeliveries() {
        User user = authService.getCurrentAuthenticatedUser();
        if (user.getRole() == Role.ROLE_PROVIDER) {
            return deliveryRepository.findByProviderId(user.getId()).stream()
                    .map(DeliveryResponseDto::fromEntity)
                    .collect(Collectors.toList());
        } else if (user.getRole() == Role.ROLE_RECIPIENT) {
            return deliveryRepository.findByRecipientId(user.getId()).stream()
                    .map(DeliveryResponseDto::fromEntity)
                    .collect(Collectors.toList());
        } else {
            return deliveryRepository.findAll().stream()
                    .map(DeliveryResponseDto::fromEntity)
                    .collect(Collectors.toList());
        }
    }

    public DeliveryResponseDto getDeliveryById(Long id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found with ID: " + id));
        return DeliveryResponseDto.fromEntity(delivery);
    }

    @Transactional
    public DeliveryResponseDto updateDeliveryStatus(Long deliveryId, DeliveryStatusUpdateDto updateDto) {
        User actor = authService.getCurrentAuthenticatedUser();
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new IllegalArgumentException("Delivery not found with ID: " + deliveryId));

        DeliveryStatus newStatus = updateDto.getStatus();
        delivery.setStatus(newStatus);
        if (updateDto.getNotes() != null && !updateDto.getNotes().isBlank()) {
            delivery.setDeliveryNotes(updateDto.getNotes());
        }

        LocalDateTime now = LocalDateTime.now();
        if (newStatus == DeliveryStatus.IN_TRANSIT && delivery.getActualPickupTime() == null) {
            delivery.setActualPickupTime(now);
        } else if (newStatus == DeliveryStatus.DELIVERED && delivery.getDeliveredTime() == null) {
            delivery.setDeliveredTime(now);
        } else if (newStatus == DeliveryStatus.RECEIVED) {
            delivery.setReceivedTime(now);

            // Mark resource, request, and match as completed / fulfilled
            ResourceMatch match = delivery.getMatch();
            match.setStatus(MatchStatus.COMPLETED);
            matchRepository.save(match);

            Resource res = match.getResource();
            res.setStatus(ResourceStatus.COMPLETED);
            resourceRepository.save(res);

            ResourceRequest req = match.getRequest();
            req.setStatus(RequestStatus.FULFILLED);
            requestRepository.save(req);

            // Notify Provider of successful delivery completion
            notificationRepository.save(new Notification(
                    res.getProvider(),
                    "Redistribution Completed! 🎉",
                    "Recipient has confirmed receipt of " + match.getAllocatedQuantity() + " " + res.getUnit() + " of " + res.getTitle() + ". Impact recorded!",
                    NotificationType.STATUS_CHANGE,
                    "/provider/history"
            ));

            // Notify Recipient
            notificationRepository.save(new Notification(
                    req.getRecipient(),
                    "Receipt Confirmed",
                    "You have successfully accepted delivery for " + res.getTitle() + ". Thank you for partnering with LIFELINK!",
                    NotificationType.STATUS_CHANGE,
                    "/recipient/history"
            ));
        }

        Delivery saved = deliveryRepository.save(delivery);

        auditLogRepository.save(new AuditLog(
                "UPDATE_DELIVERY_STATUS",
                actor.getEmail(),
                "Updated Delivery #" + deliveryId + " status to " + newStatus
        ));

        return DeliveryResponseDto.fromEntity(saved);
    }

    @Transactional
    public DeliveryResponseDto confirmReceipt(Long deliveryId) {
        DeliveryStatusUpdateDto dto = new DeliveryStatusUpdateDto();
        dto.setStatus(DeliveryStatus.RECEIVED);
        dto.setNotes("Recipient confirmed safe arrival and receipt.");
        return updateDeliveryStatus(deliveryId, dto);
    }
}
