package com.lifelink.dto;

import com.lifelink.entity.DeliveryStatus;
import jakarta.validation.constraints.NotNull;

public class DeliveryStatusUpdateDto {

    @NotNull
    private DeliveryStatus status;

    private String pickupOtp;
    private String deliveryOtp;
    private String notes;

    public DeliveryStatusUpdateDto() {}

    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }

    public String getPickupOtp() { return pickupOtp; }
    public void setPickupOtp(String pickupOtp) { this.pickupOtp = pickupOtp; }

    public String getDeliveryOtp() { return deliveryOtp; }
    public void setDeliveryOtp(String deliveryOtp) { this.deliveryOtp = deliveryOtp; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
