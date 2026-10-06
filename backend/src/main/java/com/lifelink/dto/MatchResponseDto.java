package com.lifelink.dto;

import com.lifelink.entity.MatchStatus;
import com.lifelink.entity.ResourceMatch;

public class MatchResponseDto {

    private Long id;
    private Long resourceId;
    private String resourceTitle;
    private String resourceCategory;
    private Double resourceQuantity;
    private String resourceUnit;
    private String resourcePickupLocation;
    private String providerOrgName;

    private Long requestId;
    private String requestTitle;
    private Double requestedQuantity;
    private String requestPriority;
    private String recipientOrgName;
    private String deliveryLocation;

    private Double score;
    private Double priorityScore;
    private Double distanceKm;
    private Double quantityFitScore;
    private Double urgencyScore;
    private Double allocatedQuantity;
    private String matchReason;
    private MatchStatus status;

    public MatchResponseDto() {}

    public static MatchResponseDto fromEntity(ResourceMatch match) {
        MatchResponseDto dto = new MatchResponseDto();
        dto.setId(match.getId());
        dto.setResourceId(match.getResource().getId());
        dto.setResourceTitle(match.getResource().getTitle());
        dto.setResourceCategory(match.getResource().getCategory().name());
        dto.setResourceQuantity(match.getResource().getQuantity());
        dto.setResourceUnit(match.getResource().getUnit());
        dto.setResourcePickupLocation(match.getResource().getPickupLocation());
        if (match.getResource().getProvider().getProviderProfile() != null) {
            dto.setProviderOrgName(match.getResource().getProvider().getProviderProfile().getOrganizationName());
        }

        dto.setRequestId(match.getRequest().getId());
        dto.setRequestTitle(match.getRequest().getTitle());
        dto.setRequestedQuantity(match.getRequest().getQuantityNeeded());
        dto.setRequestPriority(match.getRequest().getPriority().name());
        if (match.getRequest().getRecipient().getRecipientProfile() != null) {
            dto.setRecipientOrgName(match.getRequest().getRecipient().getRecipientProfile().getOrganizationName());
        }
        dto.setDeliveryLocation(match.getRequest().getDeliveryLocation());

        dto.setScore(match.getScore());
        dto.setPriorityScore(match.getPriorityScore());
        dto.setDistanceKm(match.getDistanceKm());
        dto.setQuantityFitScore(match.getQuantityFitScore());
        dto.setUrgencyScore(match.getUrgencyScore());
        dto.setAllocatedQuantity(match.getAllocatedQuantity());
        dto.setMatchReason(match.getMatchReason());
        dto.setStatus(match.getStatus());

        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getResourceId() { return resourceId; }
    public void setResourceId(Long resourceId) { this.resourceId = resourceId; }

    public String getResourceTitle() { return resourceTitle; }
    public void setResourceTitle(String resourceTitle) { this.resourceTitle = resourceTitle; }

    public String getResourceCategory() { return resourceCategory; }
    public void setResourceCategory(String resourceCategory) { this.resourceCategory = resourceCategory; }

    public Double getResourceQuantity() { return resourceQuantity; }
    public void setResourceQuantity(Double resourceQuantity) { this.resourceQuantity = resourceQuantity; }

    public String getResourceUnit() { return resourceUnit; }
    public void setResourceUnit(String resourceUnit) { this.resourceUnit = resourceUnit; }

    public String getResourcePickupLocation() { return resourcePickupLocation; }
    public void setResourcePickupLocation(String resourcePickupLocation) { this.resourcePickupLocation = resourcePickupLocation; }

    public String getProviderOrgName() { return providerOrgName; }
    public void setProviderOrgName(String providerOrgName) { this.providerOrgName = providerOrgName; }

    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getRequestTitle() { return requestTitle; }
    public void setRequestTitle(String requestTitle) { this.requestTitle = requestTitle; }

    public Double getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(Double requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public String getRequestPriority() { return requestPriority; }
    public void setRequestPriority(String requestPriority) { this.requestPriority = requestPriority; }

    public String getRecipientOrgName() { return recipientOrgName; }
    public void setRecipientOrgName(String recipientOrgName) { this.recipientOrgName = recipientOrgName; }

    public String getDeliveryLocation() { return deliveryLocation; }
    public void setDeliveryLocation(String deliveryLocation) { this.deliveryLocation = deliveryLocation; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }

    public Double getQuantityFitScore() { return quantityFitScore; }
    public void setQuantityFitScore(Double quantityFitScore) { this.quantityFitScore = quantityFitScore; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public Double getAllocatedQuantity() { return allocatedQuantity; }
    public void setAllocatedQuantity(Double allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }

    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
}
