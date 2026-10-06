package com.lifelink.engine;

import com.lifelink.entity.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class MatchingEngineTest {

    private MatchingEngine matchingEngine;

    @BeforeEach
    public void setup() {
        matchingEngine = new MatchingEngine();
    }

    @Test
    public void testDistanceCalculation() {
        // Lat/Lon distance test
        double distance = DistanceCalculator.calculateDistanceKm(12.9716, 77.5946, 12.9800, 77.6000);
        assertTrue(distance > 0.8 && distance < 2.0, "Distance should be ~1.1 to 1.5 km");
    }

    @Test
    public void testCampusCafeteriaScenarioRanking() {
        User provider = new User("cafeteria@lifelink.org", "pass", "Campus Cafeteria", "123", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        LocalDateTime now = LocalDateTime.now();

        // Provider surplus: 50 portions cooked food
        Resource cafeteriaSurplus = new Resource(
                provider,
                "Prepared Meals",
                ResourceCategory.COOKED_MEALS,
                50.0,
                "PORTIONS",
                now,
                now.plusHours(5),
                now.plusHours(4),
                "Campus Cafeteria",
                12.9716,
                77.5946,
                "Surplus lunch packs",
                ResourceStatus.AVAILABLE,
                null
        );

        // Org A: 30 units, HIGH, nearby (1.5 km)
        User userA = new User("orgA@test.com", "pass", "Hope Shelter", "123", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        ResourceRequest reqA = new ResourceRequest(
                userA, "Lunch Pack A", ResourceCategory.COOKED_MEALS,
                30.0, "PORTIONS", RequestPriority.HIGH, now.plusHours(3),
                "Location A", 12.9800, 77.6000, "Notes", RequestStatus.OPEN
        );

        // Org B: 40 units, MEDIUM, farther (6.8 km)
        User userB = new User("orgB@test.com", "pass", "City Food Relief", "123", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        ResourceRequest reqB = new ResourceRequest(
                userB, "Lunch Pack B", ResourceCategory.COOKED_MEALS,
                40.0, "PORTIONS", RequestPriority.MEDIUM, now.plusHours(5),
                "Location B", 13.0200, 77.6350, "Notes", RequestStatus.OPEN
        );

        // Org C: 20 units, HIGH, moderate distance (3.2 km)
        User userC = new User("orgC@test.com", "pass", "Youth Care", "123", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        ResourceRequest reqC = new ResourceRequest(
                userC, "Lunch Pack C", ResourceCategory.COOKED_MEALS,
                20.0, "PORTIONS", RequestPriority.HIGH, now.plusHours(4),
                "Location C", 12.9950, 77.5850, "Notes", RequestStatus.OPEN
        );

        List<MatchCandidate> ranked = matchingEngine.rankRequestsForResource(cafeteriaSurplus, List.of(reqA, reqB, reqC));

        assertEquals(3, ranked.size());
        // Verify scores are descending
        assertTrue(ranked.get(0).getCompositeScore() >= ranked.get(1).getCompositeScore());
        assertTrue(ranked.get(1).getCompositeScore() >= ranked.get(2).getCompositeScore());

        // Org A (HIGH priority, closest distance 1.1-1.5 km) should rank #1
        assertEquals("Lunch Pack A", ranked.get(0).getRequest().getTitle());

        // All should have non-empty recommendation reasons
        assertNotNull(ranked.get(0).getMatchReason());
        assertTrue(ranked.get(0).getMatchReason().contains("Recommended because:"));
    }
}
