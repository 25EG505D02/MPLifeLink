package com.lifelink.controller;

import com.lifelink.dto.DeliveryResponseDto;
import com.lifelink.dto.DeliveryStatusUpdateDto;
import com.lifelink.service.DeliveryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping
    public ResponseEntity<List<DeliveryResponseDto>> getMyDeliveries() {
        return ResponseEntity.ok(deliveryService.getMyDeliveries());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryResponseDto> getDeliveryById(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryResponseDto> updateDeliveryStatus(@PathVariable Long id,
                                                                   @Valid @RequestBody DeliveryStatusUpdateDto dto) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, dto));
    }

    @PostMapping("/{id}/confirm-receipt")
    public ResponseEntity<DeliveryResponseDto> confirmReceipt(@PathVariable Long id) {
        return ResponseEntity.ok(deliveryService.confirmReceipt(id));
    }
}
