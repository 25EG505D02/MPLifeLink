package com.lifelink.controller;

import com.lifelink.dto.ResourceRequestDto;
import com.lifelink.dto.ResourceResponseDto;
import com.lifelink.service.ResourceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    private final ResourceService resourceService;

    public ResourceController(ResourceService resourceService) {
        this.resourceService = resourceService;
    }

    @PostMapping
    public ResponseEntity<ResourceResponseDto> createResource(@Valid @RequestBody ResourceRequestDto dto) {
        return ResponseEntity.ok(resourceService.createResource(dto));
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDto>> getAllActiveResources() {
        return ResponseEntity.ok(resourceService.getAllActiveResources());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ResourceResponseDto>> getMyResources() {
        return ResponseEntity.ok(resourceService.getMyResources());
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<ResourceResponseDto>> getExpiringSoon() {
        return ResponseEntity.ok(resourceService.getExpiringSoon());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDto> updateResource(@PathVariable Long id, @Valid @RequestBody ResourceRequestDto dto) {
        return ResponseEntity.ok(resourceService.updateResource(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
