package com.lifelink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_requests")
public class ResourceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recipient_id", nullable = false)
    private User recipient;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ResourceCategory resourceCategory;

    @NotNull
    @Positive
    @Column(nullable = false)
    private Double quantityNeeded;

    @NotBlank
    @Column(nullable = false)
    private String unit = "PORTIONS";

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestPriority priority = RequestPriority.HIGH;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime requiredBy;

    @NotBlank
    @Column(nullable = false)
    private String deliveryLocation;

    private Double latitude = 0.0;
    private Double longitude = 0.0;

    @Column(length = 2000)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public ResourceRequest() {}

    public ResourceRequest(User recipient, String title, ResourceCategory resourceCategory,
                           Double quantityNeeded, String unit, RequestPriority priority,
                           LocalDateTime requiredBy, String deliveryLocation, Double latitude,
                           Double longitude, String description, RequestStatus status) {
        this.recipient = recipient;
        this.title = title;
        this.resourceCategory = resourceCategory;
        this.quantityNeeded = quantityNeeded;
        this.unit = unit;
        this.priority = priority;
        this.requiredBy = requiredBy;
        this.deliveryLocation = deliveryLocation;
        this.latitude = latitude;
        this.longitude = longitude;
        this.description = description;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getRecipient() { return recipient; }
    public void setRecipient(User recipient) { this.recipient = recipient; }

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

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
