package com.lifelink.engine;

import com.lifelink.entity.*;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MatchingEngine {

    // Weight coefficients for multi-criteria scoring
    private static final double WEIGHT_PRIORITY = 0.30;
    private static final double WEIGHT_DISTANCE = 0.25;
    private static final double WEIGHT_QUANTITY = 0.25;
    private static final double WEIGHT_URGENCY  = 0.20;

    /**
     * Ranks all eligible recipient requests for a given provider resource.
     * Uses a PriorityQueue (Max-Heap) to sort candidates by composite score.
     */
    public List<MatchCandidate> rankRequestsForResource(Resource resource, List<ResourceRequest> openRequests) {
        if (resource == null || openRequests == null || openRequests.isEmpty()) {
            return Collections.emptyList();
        }

        PriorityQueue<MatchCandidate> maxHeap = new PriorityQueue<>();

        for (ResourceRequest req : openRequests) {
            // Category compatibility check
            if (resource.getCategory() != req.getResourceCategory()) {
                continue; // Skip incompatible categories
            }

            MatchCandidate candidate = evaluateMatch(resource, req);
            maxHeap.offer(candidate);
        }

        // Drain PriorityQueue into a sorted List
        List<MatchCandidate> rankedList = new ArrayList<>();
        while (!maxHeap.isEmpty()) {
            rankedList.add(maxHeap.poll());
        }

        return rankedList;
    }

    /**
     * Ranks all eligible provider resources for a given recipient request.
     */
    public List<MatchCandidate> rankResourcesForRequest(ResourceRequest request, List<Resource> availableResources) {
        if (request == null || availableResources == null || availableResources.isEmpty()) {
            return Collections.emptyList();
        }

        PriorityQueue<MatchCandidate> maxHeap = new PriorityQueue<>();

        for (Resource res : availableResources) {
            if (res.getCategory() != request.getResourceCategory()) {
                continue;
            }

            MatchCandidate candidate = evaluateMatch(res, request);
            maxHeap.offer(candidate);
        }

        List<MatchCandidate> rankedList = new ArrayList<>();
        while (!maxHeap.isEmpty()) {
            rankedList.add(maxHeap.poll());
        }

        return rankedList;
    }

    /**
     * Evaluates a single resource-request pair using multi-criteria weighted scoring.
     */
    public MatchCandidate evaluateMatch(Resource resource, ResourceRequest request) {
        // 1. Priority Score
        double priorityScore = calculatePriorityScore(request.getPriority());

        // 2. Quantity Fit Score
        double quantityFitScore = calculateQuantityFitScore(resource.getQuantity(), request.getQuantityNeeded());

        // 3. Distance & Distance Score
        double distanceKm = DistanceCalculator.calculateDistanceKm(
                resource.getLatitude(), resource.getLongitude(),
                request.getLatitude(), request.getLongitude()
        );
        double distanceScore = calculateDistanceScore(distanceKm);

        // 4. Urgency Score (expiry vs requiredBy)
        double urgencyScore = calculateUrgencyScore(resource.getExpiryDate(), request.getRequiredBy());

        // Composite Weighted Score (0 to 100)
        double compositeScore = (WEIGHT_PRIORITY * priorityScore) +
                                (WEIGHT_DISTANCE * distanceScore) +
                                (WEIGHT_QUANTITY * quantityFitScore) +
                                (WEIGHT_URGENCY * urgencyScore);

        // Round to 1 decimal place
        compositeScore = Math.round(compositeScore * 10.0) / 10.0;
        priorityScore = Math.round(priorityScore * 10.0) / 10.0;
        quantityFitScore = Math.round(quantityFitScore * 10.0) / 10.0;
        distanceScore = Math.round(distanceScore * 10.0) / 10.0;
        urgencyScore = Math.round(urgencyScore * 10.0) / 10.0;

        double allocatedQuantity = Math.min(resource.getQuantity(), request.getQuantityNeeded());

        // Generate human-readable recommendation explanation
        String reason = generateRecommendationReason(request.getPriority(), distanceKm,
                quantityFitScore, resource.getExpiryDate(), resource.getQuantity(), request.getQuantityNeeded());

        return new MatchCandidate(
                resource,
                request,
                compositeScore,
                priorityScore,
                quantityFitScore,
                distanceKm,
                distanceScore,
                urgencyScore,
                allocatedQuantity,
                reason
        );
    }

    /**
     * Greedy Multi-Allocation Algorithm:
     * When a provider has a large surplus, greedily allocates quantities to highest-ranked
     * requests until surplus is fully assigned.
     */
    public List<MatchCandidate> computeGreedyAllocation(Resource resource, List<ResourceRequest> requests) {
        List<MatchCandidate> ranked = rankRequestsForResource(resource, requests);
        List<MatchCandidate> allocationPlan = new ArrayList<>();

        double remainingSurplus = resource.getQuantity();

        for (MatchCandidate candidate : ranked) {
            if (remainingSurplus <= 0.001) {
                break;
            }
            double needed = candidate.getRequest().getQuantityNeeded();
            double assign = Math.min(remainingSurplus, needed);

            candidate.setAllocatedQuantity(Math.round(assign * 10.0) / 10.0);
            allocationPlan.add(candidate);

            remainingSurplus -= assign;
        }

        return allocationPlan;
    }

    private double calculatePriorityScore(RequestPriority priority) {
        if (priority == null) return 50.0;
        return switch (priority) {
            case CRITICAL -> 100.0;
            case HIGH -> 80.0;
            case MEDIUM -> 55.0;
            case LOW -> 30.0;
        };
    }

    private double calculateQuantityFitScore(double available, double needed) {
        if (available <= 0 || needed <= 0) return 0.0;
        if (available >= needed) {
            // Surplus covers request fully. If needed is close to available, efficiency is 100%.
            double ratio = needed / available;
            return 80.0 + (20.0 * ratio);
        } else {
            // Request is larger than surplus; partial fulfillment
            double ratio = available / needed;
            return 100.0 * ratio;
        }
    }

    private double calculateDistanceScore(double distanceKm) {
        if (distanceKm <= 1.0) {
            return 100.0;
        } else if (distanceKm <= 25.0) {
            return Math.max(10.0, 100.0 * (1.0 - (distanceKm / 25.0)));
        } else {
            return Math.max(5.0, 10.0 * Math.max(0.0, (50.0 - distanceKm) / 25.0));
        }
    }

    private double calculateUrgencyScore(LocalDateTime expiryDate, LocalDateTime requiredBy) {
        LocalDateTime now = LocalDateTime.now();

        // Expiry urgency
        double resScore = 50.0;
        if (expiryDate != null) {
            long hoursToExpiry = Duration.between(now, expiryDate).toHours();
            if (hoursToExpiry <= 2) resScore = 100.0;
            else if (hoursToExpiry <= 6) resScore = 90.0;
            else if (hoursToExpiry <= 12) resScore = 75.0;
            else if (hoursToExpiry <= 24) resScore = 60.0;
            else resScore = 40.0;
        }

        // Request urgency
        double reqScore = 50.0;
        if (requiredBy != null) {
            long hoursToNeeded = Duration.between(now, requiredBy).toHours();
            if (hoursToNeeded <= 3) reqScore = 100.0;
            else if (hoursToNeeded <= 8) reqScore = 80.0;
            else if (hoursToNeeded <= 24) reqScore = 60.0;
            else reqScore = 40.0;
        }

        return (0.6 * resScore) + (0.4 * reqScore);
    }

    private String generateRecommendationReason(RequestPriority priority, double distanceKm,
                                                double quantityFitScore, LocalDateTime expiryDate,
                                                double available, double needed) {
        List<String> reasons = new ArrayList<>();

        // Priority factor
        if (priority == RequestPriority.CRITICAL) {
            reasons.add("CRITICAL priority emergency requirement");
        } else if (priority == RequestPriority.HIGH) {
            reasons.add("HIGH priority organization demand");
        } else if (priority == RequestPriority.MEDIUM) {
            reasons.add("Standard community requirement");
        }

        // Distance factor
        if (distanceKm <= 2.0) {
            reasons.add("Short pickup distance (" + distanceKm + " km)");
        } else if (distanceKm <= 7.0) {
            reasons.add("Nearby transit radius (" + distanceKm + " km)");
        } else {
            reasons.add("Accessible distribution range (" + distanceKm + " km)");
        }

        // Quantity compatibility factor
        if (quantityFitScore >= 90.0) {
            reasons.add("Optimal quantity alignment (" + (int)needed + " of " + (int)available + " units)");
        } else if (available >= needed) {
            reasons.add("Full demand coverage with remaining surplus");
        } else {
            reasons.add("High partial allocation capacity");
        }

        // Urgency factor
        if (expiryDate != null) {
            long hoursLeft = Math.max(1, Duration.between(LocalDateTime.now(), expiryDate).toHours());
            if (hoursLeft <= 4) {
                reasons.add("Urgent: Limited time remaining (" + hoursLeft + " hrs left)");
            }
        }

        return "Recommended because: " + String.join(" • ", reasons);
    }
}
