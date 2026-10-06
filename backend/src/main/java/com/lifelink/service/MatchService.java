package com.lifelink.service;

import com.lifelink.dto.MatchResponseDto;
import com.lifelink.engine.MatchCandidate;
import com.lifelink.engine.MatchingEngine;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final ResourceMatchRepository matchRepository;
    private final DeliveryRepository deliveryRepository;
    private final MatchingEngine matchingEngine;
    private final AuthService authService;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    private final SecureRandom random = new SecureRandom();

    public MatchService(ResourceRepository resourceRepository,
                        ResourceRequestRepository requestRepository,
                        ResourceMatchRepository matchRepository,
                        DeliveryRepository deliveryRepository,
                        MatchingEngine matchingEngine,
                        AuthService authService,
                        NotificationRepository notificationRepository,
                        AuditLogRepository auditLogRepository) {
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.matchRepository = matchRepository;
        this.deliveryRepository = deliveryRepository;
        this.matchingEngine = matchingEngine;
        this.authService = authService;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Computes and retrieves real-time ranked matches for the current provider.
     */
    @Transactional
    public List<MatchResponseDto> getMatchesForCurrentProvider() {
        User provider = authService.getCurrentAuthenticatedUser();
        List<Resource> providerResources = resourceRepository.findByProviderId(provider.getId()).stream()
                .filter(r -> r.getStatus() == ResourceStatus.AVAILABLE || r.getStatus() == ResourceStatus.MATCHED)
                .toList();

        List<ResourceRequest> openRequests = requestRepository.findOpenActiveRequests(LocalDateTime.now());

        List<ResourceMatch> allMatches = new ArrayList<>();

        for (Resource res : providerResources) {
            List<MatchCandidate> candidates = matchingEngine.rankRequestsForResource(res, openRequests);
            for (MatchCandidate cand : candidates) {
                // Check if existing match record exists or create new
                ResourceMatch match = matchRepository.findByResourceAndRequest(cand.getResource(), cand.getRequest())
                        .orElse(new ResourceMatch(
                                cand.getResource(),
                                cand.getRequest(),
                                cand.getCompositeScore(),
                                cand.getPriorityScore(),
                                cand.getDistanceKm(),
                                cand.getQuantityFitScore(),
                                cand.getUrgencyScore(),
                                cand.getAllocatedQuantity(),
                                cand.getMatchReason(),
                                MatchStatus.PROPOSED
                        ));

                // Refresh score & reason
                match.setScore(cand.getCompositeScore());
                match.setPriorityScore(cand.getPriorityScore());
                match.setDistanceKm(cand.getDistanceKm());
                match.setQuantityFitScore(cand.getQuantityFitScore());
                match.setUrgencyScore(cand.getUrgencyScore());
                match.setAllocatedQuantity(cand.getAllocatedQuantity());
                match.setMatchReason(cand.getMatchReason());

                allMatches.add(matchRepository.save(match));
            }
        }

        // Return sorted by score descending
        return allMatches.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(MatchResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Computes ranked matches for a specific resource.
     */
    @Transactional
    public List<MatchResponseDto> getMatchesForResource(Long resourceId) {
        Resource resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new IllegalArgumentException("Resource not found: " + resourceId));

        List<ResourceRequest> openRequests = requestRepository.findOpenActiveRequests(LocalDateTime.now());
        List<MatchCandidate> candidates = matchingEngine.rankRequestsForResource(resource, openRequests);

        List<ResourceMatch> persistedMatches = new ArrayList<>();
        for (MatchCandidate cand : candidates) {
            ResourceMatch match = matchRepository.findByResourceAndRequest(resource, cand.getRequest())
                    .orElse(new ResourceMatch(
                            resource,
                            cand.getRequest(),
                            cand.getCompositeScore(),
                            cand.getPriorityScore(),
                            cand.getDistanceKm(),
                            cand.getQuantityFitScore(),
                            cand.getUrgencyScore(),
                            cand.getAllocatedQuantity(),
                            cand.getMatchReason(),
                            MatchStatus.PROPOSED
                    ));

            match.setScore(cand.getCompositeScore());
            match.setPriorityScore(cand.getPriorityScore());
            match.setDistanceKm(cand.getDistanceKm());
            match.setQuantityFitScore(cand.getQuantityFitScore());
            match.setUrgencyScore(cand.getUrgencyScore());
            match.setAllocatedQuantity(cand.getAllocatedQuantity());
            match.setMatchReason(cand.getMatchReason());

            persistedMatches.add(matchRepository.save(match));
        }

        return persistedMatches.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(MatchResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Computes ranked matches for the current recipient organization.
     */
    @Transactional
    public List<MatchResponseDto> getMatchesForCurrentRecipient() {
        User recipient = authService.getCurrentAuthenticatedUser();
        List<ResourceRequest> requests = requestRepository.findByRecipientId(recipient.getId()).stream()
                .filter(req -> req.getStatus() == RequestStatus.OPEN || req.getStatus() == RequestStatus.MATCHED)
                .toList();

        List<Resource> availableResources = resourceRepository.findAvailableActiveResources(LocalDateTime.now());
        List<ResourceMatch> allMatches = new ArrayList<>();

        for (ResourceRequest req : requests) {
            List<MatchCandidate> candidates = matchingEngine.rankResourcesForRequest(req, availableResources);
            for (MatchCandidate cand : candidates) {
                ResourceMatch match = matchRepository.findByResourceAndRequest(cand.getResource(), req)
                        .orElse(new ResourceMatch(
                                cand.getResource(),
                                req,
                                cand.getCompositeScore(),
                                cand.getPriorityScore(),
                                cand.getDistanceKm(),
                                cand.getQuantityFitScore(),
                                cand.getUrgencyScore(),
                                cand.getAllocatedQuantity(),
                                cand.getMatchReason(),
                                MatchStatus.PROPOSED
                        ));

                match.setScore(cand.getCompositeScore());
                match.setPriorityScore(cand.getPriorityScore());
                match.setDistanceKm(cand.getDistanceKm());
                match.setQuantityFitScore(cand.getQuantityFitScore());
                match.setUrgencyScore(cand.getUrgencyScore());
                match.setAllocatedQuantity(cand.getAllocatedQuantity());
                match.setMatchReason(cand.getMatchReason());

                allMatches.add(matchRepository.save(match));
            }
        }

        return allMatches.stream()
                .sorted((a, b) -> Double.compare(b.getScore(), a.getScore()))
                .map(MatchResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Accepts a match, updates status, provisions delivery workflow with OTP verification.
     */
    @Transactional
    public MatchResponseDto acceptMatch(Long matchId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        ResourceMatch match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        match.setStatus(MatchStatus.ACCEPTED);
        Resource res = match.getResource();
        ResourceRequest req = match.getRequest();

        res.setStatus(ResourceStatus.MATCHED);
        req.setStatus(RequestStatus.MATCHED);

        resourceRepository.save(res);
        requestRepository.save(req);
        match = matchRepository.save(match);

        // Generate 4-digit pickup and delivery OTPs
        String pickupOtp = String.format("%04d", random.nextInt(10000));
        String deliveryOtp = String.format("%04d", random.nextInt(10000));

        // Create Delivery entry if not exists
        Delivery delivery = deliveryRepository.findByMatch(match)
                .orElse(new Delivery(
                        match,
                        DeliveryStatus.APPROVED,
                        LocalDateTime.now().plusHours(2),
                        pickupOtp,
                        deliveryOtp,
                        "Match accepted by " + currentUser.getFullName() + ". Logistics pickup scheduled."
                ));
        delivery.setStatus(DeliveryStatus.APPROVED);
        deliveryRepository.save(delivery);

        // Notify Recipient
        String resOrgName = res.getProvider().getProviderProfile() != null
                ? res.getProvider().getProviderProfile().getOrganizationName()
                : res.getProvider().getFullName();
        notificationRepository.save(new Notification(
                req.getRecipient(),
                "Match Approved: " + res.getTitle(),
                "Provider " + resOrgName + " has approved resource allocation (" + match.getAllocatedQuantity() + " " + res.getUnit() + "). Delivery status: APPROVED.",
                NotificationType.STATUS_CHANGE,
                "/recipient/tracking"
        ));

        // Notify Provider
        notificationRepository.save(new Notification(
                res.getProvider(),
                "Match Confirmed: " + req.getTitle(),
                "Allocation confirmed for " + (req.getRecipient().getRecipientProfile() != null ? req.getRecipient().getRecipientProfile().getOrganizationName() : req.getRecipient().getFullName()) + ". Pickup OTP: " + pickupOtp,
                NotificationType.STATUS_CHANGE,
                "/provider/matches"
        ));

        auditLogRepository.save(new AuditLog(
                "ACCEPT_MATCH",
                currentUser.getEmail(),
                "Accepted match #" + matchId + " between Resource #" + res.getId() + " and Request #" + req.getId()
        ));

        return MatchResponseDto.fromEntity(match);
    }

    @Transactional
    public MatchResponseDto rejectMatch(Long matchId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        ResourceMatch match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found: " + matchId));

        match.setStatus(MatchStatus.REJECTED);
        matchRepository.save(match);

        auditLogRepository.save(new AuditLog(
                "REJECT_MATCH",
                currentUser.getEmail(),
                "Declined match proposal #" + matchId
        ));

        return MatchResponseDto.fromEntity(match);
    }
}
