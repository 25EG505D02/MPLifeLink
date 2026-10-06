package com.lifelink.dto;

import com.lifelink.entity.Delivery;
import com.lifelink.entity.DeliveryStatus;
import java.time.LocalDateTime;

public class DeliveryResponseDto {

    private Long id;
    private Long matchId;
    private Long resourceId;
    private String resourceTitle;
    private String resourceCategory;
    private Double quantity;
    private String unit;
    private String providerOrg;
    private String recipientOrg;
    private String pickupLocation;
    private String deliveryLocation;
    private DeliveryStatus status;
    private int stepNumber; // 1 to 7
    private int progressPercentage; // 14% to 100%
    private LocalDateTime scheduledPickupTime;
    private LocalDateTime actualPickupTime;
    private LocalDateTime deliveredTime;
    private LocalDateTime receivedTime;
    private String pickupOtp;
    private String deliveryOtp;
    private String deliveryNotes;
    private LocalDateTime updatedAt;

    public DeliveryResponseDto() {}

    public static DeliveryResponseDto fromEntity(Delivery delivery) {
        DeliveryResponseDto dto = new DeliveryResponseDto();
        dto.setId(delivery.getId());
        dto.setMatchId(delivery.getMatch().getId());
        dto.setResourceId(delivery.getMatch().getResource().getId());
        dto.setResourceTitle(delivery.getMatch().getResource().getTitle());
        dto.setResourceCategory(delivery.getMatch().getResource().getCategory().name());
        dto.setQuantity(delivery.getMatch().getAllocatedQuantity());
        dto.setUnit(delivery.getMatch().getResource().getUnit());

        if (delivery.getMatch().getResource().getProvider().getProviderProfile() != null) {
            dto.setProviderOrg(delivery.getMatch().getResource().getProvider().getProviderProfile().getOrganizationName());
        }
        if (delivery.getMatch().getRequest().getRecipient().getRecipientProfile() != null) {
            dto.setRecipientOrg(delivery.getMatch().getRequest().getRecipient().getRecipientProfile().getOrganizationName());
        }

        dto.setPickupLocation(delivery.getMatch().getResource().getPickupLocation());
        dto.setDeliveryLocation(delivery.getMatch().getRequest().getDeliveryLocation());
        dto.setStatus(delivery.getStatus());

        // Step calculation for visual stepper
        switch (delivery.getStatus()) {
            case REQUESTED -> { dto.setStepNumber(1); dto.setProgressPercentage(14); }
            case MATCHED -> { dto.setStepNumber(2); dto.setProgressPercentage(28); }
            case APPROVED -> { dto.setStepNumber(3); dto.setProgressPercentage(42); }
            case PICKUP_SCHEDULED -> { dto.setStepNumber(4); dto.setProgressPercentage(57); }
            case IN_TRANSIT -> { dto.setStepNumber(5); dto.setProgressPercentage(71); }
            case DELIVERED -> { dto.setStepNumber(6); dto.setProgressPercentage(86); }
            case RECEIVED -> { dto.setStepNumber(7); dto.setProgressPercentage(100); }
        }

        dto.setScheduledPickupTime(delivery.getScheduledPickupTime());
        dto.setActualPickupTime(delivery.getActualPickupTime());
        dto.setDeliveredTime(delivery.getDeliveredTime());
        dto.setReceivedTime(delivery.getReceivedTime());
        dto.setPickupOtp(delivery.getPickupOtp());
        dto.setDeliveryOtp(delivery.getDeliveryOtp());
        dto.setDeliveryNotes(delivery.getDeliveryNotes());
        dto.setUpdatedAt(delivery.getUpdatedAt());

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceCategory() { return resourceCategory; }
    public void setResourceCategory(String resourceCategory) { this.resourceCategory = resourceCategory; }

    public Double getQuantity() { return quantity; }
    public void setQuantity(Double quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getProviderOrg() { return providerOrg; }
    public void setProviderOrg(String providerOrg) { this.providerOrg = providerOrg; }

    public String getRecipientOrg() { return recipientOrg; }
    public void setRecipientOrg(String recipientOrg) { this.recipientOrg = recipientOrg; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }

    public int getProgressPercentage() { return progressPercentage; }
    public void setProgressPercentage(int progressPercentage) { this.progressPercentage = progressPercentage; }

    public LocalDateTime getScheduledPickupTime() { return scheduledPickupTime; }
    public void setScheduledPickupTime(LocalDateTime scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }

    public LocalDateTime getActualPickupTime() { return actualPickupTime; }
    public void setActualPickupTime(LocalDateTime actualPickupTime) { this.actualPickupTime = actualPickupTime; }

    public LocalDateTime getDeliveredTime() { return deliveredTime; }
    public void setDeliveredTime(LocalDateTime deliveredTime) { this.deliveredTime = deliveredTime; }

    public LocalDateTime getReceivedTime() { return receivedTime; }
    public void setReceivedTime(LocalDateTime receivedTime) { this.receivedTime = receivedTime; }

    public String getPickupOtp() { return pickupOtp; }
    public void setPickupOtp(String pickupOtp) { this.pickupOtp = pickupOtp; }

    public String getDeliveryOtp() { return deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }

    public String getDeliveryNotes() { return deliveryNotes; }
    public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
