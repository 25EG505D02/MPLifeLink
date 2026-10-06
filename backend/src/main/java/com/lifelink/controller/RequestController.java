package com.lifelink.controller;

import com.lifelink.dto.RequirementRequestDto;
import com.lifelink.dto.RequirementResponseDto;
import com.lifelink.service.RequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private final RequestService requestService;

    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<RequirementResponseDto> createRequest(@Valid @RequestBody RequirementRequestDto dto) {
        return ResponseEntity.ok(requestService.createRequest(dto));
    }

    @GetMapping
    public ResponseEntity<List<RequirementResponseDto>> getAllOpenRequests() {
        return ResponseEntity.ok(requestService.getAllOpenRequests());
    }

    @GetMapping("/my")
    public ResponseEntity<List<RequirementResponseDto>> getMyRequests() {
        return ResponseEntity.ok(requestService.getMyRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RequirementResponseDto> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(requestService.getRequestById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelRequest(@PathVariable Long id) {
        requestService.cancelRequest(id);
        return ResponseEntity.noContent().build();
    }
}
