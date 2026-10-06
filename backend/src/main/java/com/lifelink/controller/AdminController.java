package com.lifelink.controller;

import com.lifelink.dto.AnalyticsSummaryDto;
import com.lifelink.dto.DeliveryResponseDto;
import com.lifelink.dto.RequirementResponseDto;
import com.lifelink.dto.ResourceResponseDto;
import com.lifelink.entity.AuditLog;
import com.lifelink.entity.User;
import com.lifelink.entity.UserStatus;
import com.lifelink.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsSummaryDto> getAnalyticsSummary() {
        return ResponseEntity.ok(adminService.getAnalyticsSummary());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id, @RequestParam UserStatus status) {
        return ResponseEntity.ok(adminService.toggleUserStatus(id, status));
    }

    @GetMapping("/verifications")
    public ResponseEntity<Map<String, Object>> getPendingVerifications() {
        return ResponseEntity.ok(adminService.getPendingVerifications());
    }

    @PutMapping("/verifications/{id}")
    public ResponseEntity<Void> verifyOrganization(@PathVariable Long id,
                                                   @RequestParam String type,
                                                   @RequestParam boolean approve) {
        adminService.verifyOrganization(id, type, approve);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/resources")
    public ResponseEntity<List<ResourceResponseDto>> getAllResources() {
        return ResponseEntity.ok(adminService.getAllResources());
    }

    @GetMapping("/requests")
    public ResponseEntity<List<RequirementResponseDto>> getAllRequests() {
        return ResponseEntity.ok(adminService.getAllRequests());
    }

    @GetMapping("/deliveries")
    public ResponseEntity<List<DeliveryResponseDto>> getAllDeliveries() {
        return ResponseEntity.ok(adminService.getAllDeliveries());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(adminService.getRecentAuditLogs());
    }
}
