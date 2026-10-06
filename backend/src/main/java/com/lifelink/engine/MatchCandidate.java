package com.lifelink.engine;

import com.lifelink.entity.Resource;
import com.lifelink.entity.ResourceRequest;

public class MatchCandidate implements Comparable<MatchCandidate> {

    private Resource resource;
    private ResourceRequest request;

    private double compositeScore;
    private double priorityScore;
    private double quantityFitScore;
    private double distanceKm;
    private double distanceScore;
    private double urgencyScore;
    private double allocatedQuantity;
    private String matchReason;

    public MatchCandidate() {}

    public MatchCandidate(Resource resource, ResourceRequest request, double compositeScore,
                          double priorityScore, double quantityFitScore, double distanceKm,
                          double distanceScore, double urgencyScore, double allocatedQuantity,
                          String matchReason) {
        this.resource = resource;
        this.request = request;
        this.compositeScore = compositeScore;
        this.priorityScore = priorityScore;
        this.quantityFitScore = quantityFitScore;
        this.distanceKm = distanceKm;
        this.distanceScore = distanceScore;
        this.urgencyScore = urgencyScore;
        this.allocatedQuantity = allocatedQuantity;
        this.matchReason = matchReason;
    }

    @Override
    public int compareTo(MatchCandidate other) {
        // Natural ordering: highest composite score first (descending)
        return Double.compare(other.compositeScore, this.compositeScore);
    }

    public Resource getResource() { return resource; }
    public void setResource(Resource resource) { this.resource = resource; }

    public ResourceRequest getRequest() { return request; }
    public void setRequest(ResourceRequest request) { this.request = request; }

    public double getCompositeScore() { return compositeScore; }
    public void setCompositeScore(double compositeScore) { this.compositeScore = compositeScore; }

    public double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(double priorityScore) { this.priorityScore = priorityScore; }

    public double getQuantityFitScore() { return quantityFitScore; }
    public void setQuantityFitScore(double quantityFitScore) { this.quantityFitScore = quantityFitScore; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public double getDistanceScore() { return distanceScore; }
    public void setDistanceScore(double distanceScore) { this.distanceScore = distanceScore; }

    public double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(double urgencyScore) { this.urgencyScore = urgencyScore; }

    public double getAllocatedQuantity() { return allocatedQuantity; }
    public void setAllocatedQuantity(double allocatedQuantity) { this.allocatedQuantity = allocatedQuantity; }

    public String getMatchReason() { return matchReason; }
    public void setMatchReason(String matchReason) { this.matchReason = matchReason; }
}
