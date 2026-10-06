package com.lifelink.service;

import com.lifelink.dto.RequirementRequestDto;
import com.lifelink.dto.RequirementResponseDto;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestService {

    private final ResourceRequestRepository requestRepository;
    private final AuthService authService;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public RequestService(ResourceRequestRepository requestRepository,
                          AuthService authService,
                          NotificationRepository notificationRepository,
                          AuditLogRepository auditLogRepository) {
        this.requestRepository = requestRepository;
        this.authService = authService;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public RequirementResponseDto createRequest(RequirementRequestDto dto) {
        User recipient = authService.getCurrentAuthenticatedUser();

        Double lat = dto.getLatitude();
        Double lng = dto.getLongitude();
        if ((lat == null || lat == 0.0) && recipient.getRecipientProfile() != null) {
            lat = recipient.getRecipientProfile().getLatitude();
            lng = recipient.getRecipientProfile().getLongitude();
        }

        ResourceRequest req = new ResourceRequest(
                recipient,
                dto.getTitle(),
                dto.getResourceCategory(),
                dto.getQuantityNeeded(),
                dto.getUnit(),
                dto.getPriority(),
                dto.getRequiredBy(),
                dto.getDeliveryLocation(),
                lat,
                lng,
                dto.getDescription(),
                RequestStatus.OPEN
        );

        ResourceRequest saved = requestRepository.save(req);

        auditLogRepository.save(new AuditLog(
                "CREATE_REQUEST",
                recipient.getEmail(),
                "Created requirement #" + saved.getId() + " - " + saved.getTitle() + " (" + saved.getQuantityNeeded() + " " + saved.getUnit() + ", Priority: " + saved.getPriority() + ")"
        ));

        // Create alert for recipient
        notificationRepository.save(new Notification(
                recipient,
                "Requirement Registered",
                "Your request for " + saved.getQuantityNeeded() + " " + saved.getUnit() + " of " + saved.getResourceCategory() + " has been broadcasted to the matching engine.",
                NotificationType.SYSTEM,
                "/recipient/requests"
        ));

        return RequirementResponseDto.fromEntity(saved);
    }

    public List<RequirementResponseDto> getMyRequests() {
        User recipient = authService.getCurrentAuthenticatedUser();
        return requestRepository.findByRecipientId(recipient.getId()).stream()
                .map(RequirementResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<RequirementResponseDto> getAllOpenRequests() {
        return requestRepository.findOpenActiveRequests(LocalDateTime.now()).stream()
                .map(RequirementResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public RequirementResponseDto getRequestById(Long id) {
        ResourceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with ID: " + id));
        return RequirementResponseDto.fromEntity(req);
    }

    @Transactional
    public void cancelRequest(Long id) {
        User recipient = authService.getCurrentAuthenticatedUser();
        ResourceRequest req = requestRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Request not found: " + id));

        if (!req.getRecipient().getId().equals(recipient.getId()) && recipient.getRole() != Role.ROLE_ADMIN) {
            throw new SecurityException("Unauthorized cancel request.");
        }

        req.setStatus(RequestStatus.CANCELLED);
        requestRepository.save(req);
        auditLogRepository.save(new AuditLog("CANCEL_REQUEST", recipient.getEmail(), "Cancelled requirement #" + id));
    }
}
