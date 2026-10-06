package com.lifelink.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_matches")
public class ResourceMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "resource_id", nullable = false)
    private Resource resource;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "request_id", nullable = false)
    private ResourceRequest request;

    @NotNull
    @Column(nullable = false)
    private Double score = 0.0;

    private Double priorityScore = 0.0;
    private Double distanceKm = 0.0;
    private Double quantityFitScore = 0.0;
    private Double urgencyScore = 0.0;
    private Double allocatedQuantity = 0.0;

    @Column(length = 2000)
    private String matchReason;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MatchStatus status = MatchStatus.PROPOSED;

    private LocalDateTime createdAt = LocalDateTime.now();

    public ResourceMatch() {}

    public ResourceMatch(Resource resource, ResourceRequest request, Double score,
                         Double priorityScore, Double distanceKm, Double quantityFitScore,
                         Double urgencyScore, Double allocatedQuantity, String matchReason,
                         MatchStatus status) {
        this.resource = resource;
        this.request = request;
        this.score = score;
        this.priorityScore = priorityScore;
        this.distanceKm = distanceKm;
        this.quantityFitScore = quantityFitScore;
        this.urgencyScore = urgencyScore;
        this.allocatedQuantity = allocatedQuantity;
        this.matchReason = matchReason;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public ResourceRequest getRequest() { return request; }
    public void setRequest(ResourceRequest request) { this.request = request; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
