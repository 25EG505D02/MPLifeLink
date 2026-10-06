package com.lifelink.dto;

import com.lifelink.entity.RequestPriority;
import com.lifelink.entity.ResourceCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

public class RequirementRequestDto {

    @NotBlank
    private String title;

    @NotNull
    private ResourceCategory resourceCategory;

    @NotNull
    @Positive
    private Double quantityNeeded;

    @NotBlank
    private String unit = "PORTIONS";

    @NotNull
    private RequestPriority priority = RequestPriority.HIGH;

    @NotNull
    private LocalDateTime requiredBy;

    @NotBlank
    private String deliveryLocation;

    private Double latitude;
    private Double longitude;
    private String description;

    public RequirementRequestDto() {}

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
}
