package com.lifelink.dto;

import com.lifelink.entity.RequestPriority;
import com.lifelink.entity.RequestStatus;
import com.lifelink.entity.ResourceCategory;
import com.lifelink.entity.ResourceRequest;
import java.time.LocalDateTime;

public class RequirementResponseDto {

    private Long id;
    private Long recipientId;
    private String recipientName;
    private String organizationName;
    private String title;
    private ResourceCategory resourceCategory;
    private Double quantityNeeded;
    private String unit;
    private RequestPriority priority;
    private LocalDateTime requiredBy;
    private String deliveryLocation;
    private Double latitude;
    private Double longitude;
    private String description;
    private RequestStatus status;
    private LocalDateTime createdAt;

    public RequirementResponseDto() {}

    public static RequirementResponseDto fromEntity(ResourceRequest req) {
        RequirementResponseDto dto = new RequirementResponseDto();
        dto.setId(req.getId());
        dto.setRecipientId(req.getRecipient().getId());
        dto.setRecipientName(req.getRecipient().getFullName());
        if (req.getRecipient().getRecipientProfile() != null) {
            dto.setOrganizationName(req.getRecipient().getRecipientProfile().getOrganizationName());
        }
        dto.setTitle(req.getTitle());
        dto.setResourceCategory(req.getResourceCategory());
        dto.setQuantityNeeded(req.getQuantityNeeded());
        dto.setUnit(req.getUnit());
        dto.setPriority(req.getPriority());
        dto.setRequiredBy(req.getRequiredBy());
        dto.setDeliveryLocation(req.getDeliveryLocation());
        dto.setLatitude(req.getLatitude());
        dto.setLongitude(req.getLongitude());
        dto.setDescription(req.getDescription());
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ResourceCategory getResourceCategory() { return resourceCategory; }
    public void setResourceCategory(ResourceCategory resourceCategory) { this.resourceCategory = resourceCategory; }

    public Double getQuantityNeeded() { return quantityNeeded; }
    public void setQuantityNeeded(Double quantityNeeded) { this.quantityNeeded = quantityNeeded; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public RequestPriority getPriority() { return priority; }
    public void setPriority(RequestPriority priority) { this.priority = priority; }

    public LocalDateTime getRequiredBy() { return requiredBy; }
    public void setRequiredBy(LocalDateTime requiredBy) { this.requiredBy = requiredBy; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
