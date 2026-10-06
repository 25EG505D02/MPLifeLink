package com.lifelink.service;

import com.lifelink.dto.ResourceRequestDto;
import com.lifelink.dto.ResourceResponseDto;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResourceService {

    private final ResourceRepository resourceRepository;
    private final AuthService authService;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public ResourceService(ResourceRepository resourceRepository,
                           AuthService authService,
                           NotificationRepository notificationRepository,
                           AuditLogRepository auditLogRepository) {
        this.resourceRepository = resourceRepository;
        this.authService = authService;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ResourceResponseDto createResource(ResourceRequestDto dto) {
        User provider = authService.getCurrentAuthenticatedUser();

        Double lat = dto.getLatitude();
        Double lng = dto.getLongitude();
        if ((lat == null || lat == 0.0) && provider.getProviderProfile() != null) {
            lat = provider.getProviderProfile().getLatitude();
            lng = provider.getProviderProfile().getLongitude();
        }

        Resource resource = new Resource(
                provider,
                dto.getTitle(),
                dto.getCategory(),
                dto.getQuantity(),
                dto.getUnit(),
                dto.getAvailableFrom() != null ? dto.getAvailableFrom() : LocalDateTime.now(),
                dto.getAvailableUntil(),
                dto.getExpiryDate(),
                dto.getPickupLocation(),
                lat,
                lng,
                dto.getDescription(),
                ResourceStatus.AVAILABLE,
                dto.getImageUrl()
        );

        Resource saved = resourceRepository.save(resource);

        auditLogRepository.save(new AuditLog(
                "CREATE_RESOURCE",
                provider.getEmail(),
                "Created resource listing #" + saved.getId() + " - " + saved.getTitle() + " (" + saved.getQuantity() + " " + saved.getUnit() + ")"
        ));

        // Create alert notification for provider
        notificationRepository.save(new Notification(
                provider,
                "Listing Published",
                "Your surplus listing '" + saved.getTitle() + "' is now active and being analyzed by the matching engine.",
                NotificationType.SYSTEM,
                "/provider/surplus"
        ));

        return ResourceResponseDto.fromEntity(saved);
    }

    public List<ResourceResponseDto> getMyResources() {
        User provider = authService.getCurrentAuthenticatedUser();
        return resourceRepository.findByProviderId(provider.getId()).stream()
                .map(ResourceResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ResourceResponseDto> getAllActiveResources() {
        return resourceRepository.findAvailableActiveResources(LocalDateTime.now()).stream()
                .map(ResourceResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<ResourceResponseDto> getExpiringSoon() {
        User provider = authService.getCurrentAuthenticatedUser();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime warning = now.plusHours(6);
        return resourceRepository.findExpiringSoonResources(provider.getId(), now, warning).stream()
                .map(ResourceResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    public ResourceResponseDto getResourceById(Long id) {
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found with ID: " + id));
        return ResourceResponseDto.fromEntity(res);
    }

    @Transactional
    public ResourceResponseDto updateResource(Long id, ResourceRequestDto dto) {
        User provider = authService.getCurrentAuthenticatedUser();
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + id));

        if (!res.getProvider().getId().equals(provider.getId()) && provider.getRole() != Role.ROLE_ADMIN) {
            throw new SecurityException("You do not have permission to edit this listing.");
        }

        res.setTitle(dto.getTitle());
        res.setCategory(dto.getCategory());
        res.setQuantity(dto.getQuantity());
        res.setUnit(dto.getUnit());
        res.setExpiryDate(dto.getExpiryDate());
        res.setPickupLocation(dto.getPickupLocation());
        if (dto.getLatitude() != null) res.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) res.setLongitude(dto.getLongitude());
        res.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) res.setImageUrl(dto.getImageUrl());

        Resource updated = resourceRepository.save(res);
        return ResourceResponseDto.fromEntity(updated);
    }

    @Transactional
    public void deleteResource(Long id) {
        User provider = authService.getCurrentAuthenticatedUser();
        Resource res = resourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + id));

        if (!res.getProvider().getId().equals(provider.getId()) && provider.getRole() != Role.ROLE_ADMIN) {
            throw new SecurityException("Unauthorized delete attempt.");
        }

        resourceRepository.delete(res);
        auditLogRepository.save(new AuditLog("DELETE_RESOURCE", provider.getEmail(), "Deleted resource #" + id));
    }
}
