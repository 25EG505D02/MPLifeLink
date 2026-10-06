package com.lifelink.dto;

import com.lifelink.entity.Resource;
import com.lifelink.entity.ResourceCategory;
import com.lifelink.entity.ResourceStatus;
import java.time.LocalDateTime;

public class ResourceResponseDto {

    private Long id;
    private Long providerId;
    private String providerName;
    private String organizationName;
    private String title;
    private ResourceCategory category;
    private Double quantity;
    private String unit;
    private LocalDateTime availableFrom;
    private LocalDateTime availableUntil;
    private LocalDateTime expiryDate;
    private String pickupLocation;
    private Double latitude;
    private Double longitude;
    private String description;
    private ResourceStatus status;
    private String imageUrl;
    private LocalDateTime createdAt;

    public ResourceResponseDto() {}

    public static ResourceResponseDto fromEntity(Resource res) {
        ResourceResponseDto dto = new ResourceResponseDto();
        dto.setId(res.getId());
        dto.setProviderId(res.getProvider().getId());
        dto.setProviderName(res.getProvider().getFullName());
        if (res.getProvider().getProviderProfile() != null) {
            dto.setOrganizationName(res.getProvider().getProviderProfile().getOrganizationName());
        }
        dto.setTitle(res.getTitle());
        dto.setCategory(res.getCategory());
        dto.setQuantity(res.getQuantity());
        dto.setUnit(res.getUnit());
        dto.setAvailableFrom(res.getAvailableFrom());
        dto.setAvailableUntil(res.getAvailableUntil());
        dto.setExpiryDate(res.getExpiryDate());
        dto.setPickupLocation(res.getPickupLocation());
        dto.setLatitude(res.getLatitude());
        dto.setLongitude(res.getLongitude());
        dto.setDescription(res.getDescription());
        dto.setStatus(res.getStatus());
        dto.setImageUrl(res.getImageUrl());
        dto.setCreatedAt(res.getCreatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public ResourceCategory getCategory() { return category; }
    public void setCategory(ResourceCategory category) { this.category = category; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDateTime availableFrom) { this.availableFrom = availableFrom; }

    public LocalDateTime getAvailableUntil() { return availableUntil; }
    public void setAvailableUntil(LocalDateTime availableUntil) { this.availableUntil = availableUntil; }

    public LocalDateTime getExpiryDate() { return expiryDate; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.expiryDate = expiryDate; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ResourceStatus getStatus() { return status; }
    public void setStatus(ResourceStatus status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
