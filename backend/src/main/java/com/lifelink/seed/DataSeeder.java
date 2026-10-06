package com.lifelink.seed;

import com.lifelink.engine.DistanceCalculator;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final RecipientProfileRepository recipientProfileRepository;
    private final ResourceRepository resourceRepository;
    private final ResourceRequestRepository requestRepository;
    private final ResourceMatchRepository matchRepository;
    private final DeliveryRepository deliveryRepository;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${lifelink.seed.enabled:true}")
    private boolean seedEnabled;

    public DataSeeder(UserRepository userRepository,
                      ProviderProfileRepository providerProfileRepository,
                      RecipientProfileRepository recipientProfileRepository,
                      ResourceRepository resourceRepository,
                      ResourceRequestRepository requestRepository,
                      ResourceMatchRepository matchRepository,
                      DeliveryRepository deliveryRepository,
                      NotificationRepository notificationRepository,
                      AuditLogRepository auditLogRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.recipientProfileRepository = recipientProfileRepository;
        this.resourceRepository = resourceRepository;
        this.requestRepository = requestRepository;
        this.matchRepository = matchRepository;
        this.deliveryRepository = deliveryRepository;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedEnabled || userRepository.count() > 0) {
            return;
        }

        System.out.println(">>> [LIFELINK] Initializing Seed Data...");

        String defaultHash = passwordEncoder.encode("Pass@123");
        String adminHash = passwordEncoder.encode("Admin@123");

        // 1. ADMIN USER
        User admin = new User("admin@lifelink.org", adminHash, "System Administrator", "+1-800-543-3546", Role.ROLE_ADMIN, UserStatus.ACTIVE);
        userRepository.save(admin);

        // 2. PROVIDERS (5 Total)
        // Provider 1: Campus Cafeteria (DEMO SCENARIO STAR)
        User p1User = new User("cafeteria@lifelink.org", defaultHash, "Chef Rajan Sharma", "+91-98765-43210", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        userRepository.save(p1User);
        ProviderProfile p1Profile = new ProviderProfile(p1User, "Campus Central Cafeteria", ProviderType.CAFETERIA, "Central University Quad, Student Center", 12.9716, 77.5946, "FSSAI-112233445566", true);
        providerProfileRepository.save(p1Profile);
        p1User.setProviderProfile(p1Profile);

        // Provider 2: GreenGrocer Supermarket
        User p2User = new User("greengrocer@lifelink.org", defaultHash, "Marcus Vance", "+91-98765-43211", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        userRepository.save(p2User);
        ProviderProfile p2Profile = new ProviderProfile(p2User, "GreenGrocer Organics", ProviderType.SUPERMARKET, "Market Street Hub, Block 4", 12.9650, 77.6010, "FSSAI-223344556677", true);
        providerProfileRepository.save(p2Profile);
        p2User.setProviderProfile(p2Profile);

        // Provider 3: Metro Grand Hotel
        User p3User = new User("hotel@lifelink.org", defaultHash, "Chef Antoine Laurent", "+91-98765-43212", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        userRepository.save(p3User);
        ProviderProfile p3Profile = new ProviderProfile(p3User, "Metro Grand Hotel & Banquets", ProviderType.RESTAURANT, "88 Avenue Boulevard, Downtown", 12.9780, 77.5850, "FSSAI-334455667788", true);
        providerProfileRepository.save(p3Profile);
        p3User.setProviderProfile(p3Profile);

        // Provider 4: Daily Harvest Bakery
        User p4User = new User("bakery@lifelink.org", defaultHash, "Elena Rostova", "+91-98765-43213", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        userRepository.save(p4User);
        ProviderProfile p4Profile = new ProviderProfile(p4User, "Daily Harvest Artisan Bakery", ProviderType.BAKERY, "Baker's Lane, Old Town District", 12.9550, 77.5900, "FSSAI-445566778899", true);
        providerProfileRepository.save(p4Profile);
        p4User.setProviderProfile(p4Profile);

        // Provider 5: Sunshine Event Catering
        User p5User = new User("catering@lifelink.org", defaultHash, "David Miller", "+91-98765-43214", Role.ROLE_PROVIDER, UserStatus.ACTIVE);
        userRepository.save(p5User);
        ProviderProfile p5Profile = new ProviderProfile(p5User, "Sunshine Event Caterers", ProviderType.EVENT_ORGANIZER, "Exhibition Center Grounds, Hall 3", 12.9850, 77.6200, "FSSAI-556677889900", true);
        providerProfileRepository.save(p5Profile);
        p5User.setProviderProfile(p5Profile);

        // 3. RECIPIENT ORGANIZATIONS (5 Total)
        // Recipient A: Hope Community Shelter (DEMO SCENARIO STAR)
        User r1User = new User("shelter@lifelink.org", defaultHash, "Sarah Jenkins", "+91-91234-56780", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        userRepository.save(r1User);
        RecipientProfile r1Profile = new RecipientProfile(r1User, "Hope Community Shelter", OrganizationType.SHELTER, "14 Peace Way, Central Ward", 12.9800, 77.6000, "NGO-REG-9871", 120, true);
        recipientProfileRepository.save(r1Profile);
        r1User.setRecipientProfile(r1Profile);

        // Recipient B: City Food Relief Center (DEMO SCENARIO STAR)
        User r2User = new User("relief@lifelink.org", defaultHash, "Michael Chen", "+91-91234-56781", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        userRepository.save(r2User);
        RecipientProfile r2Profile = new RecipientProfile(r2User, "City Food Relief Center", OrganizationType.FOOD_BANK, "East Industrial Ring Road, Unit 12", 13.0200, 77.6350, "NGO-REG-8762", 300, true);
        recipientProfileRepository.save(r2Profile);
        r2User.setRecipientProfile(r2Profile);

        // Recipient C: Youth Care Center (DEMO SCENARIO STAR)
        User r3User = new User("youthcare@lifelink.org", defaultHash, "Anita Desai", "+91-91234-56782", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        userRepository.save(r3User);
        RecipientProfile r3Profile = new RecipientProfile(r3User, "Youth Care Center", OrganizationType.YOUTH_HOME, "22 Scholars Lane, North Campus Border", 12.9950, 77.5850, "NGO-REG-7653", 60, true);
        recipientProfileRepository.save(r3Profile);
        r3User.setRecipientProfile(r3Profile);

        // Recipient D: St. Jude Food Pantry
        User r4User = new User("pantry@lifelink.org", defaultHash, "Father Joseph", "+91-91234-56783", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        userRepository.save(r4User);
        RecipientProfile r4Profile = new RecipientProfile(r4User, "St. Jude Food Pantry", OrganizationType.COMMUNITY_KITCHEN, "Church Square, South District", 12.9450, 77.5800, "NGO-REG-6544", 150, true);
        recipientProfileRepository.save(r4Profile);
        r4User.setRecipientProfile(r4Profile);

        // Recipient E: Unity Elderly Care Home
        User r5User = new User("elderly@lifelink.org", defaultHash, "Dr. Teresa Gomez", "+91-91234-56784", Role.ROLE_RECIPIENT, UserStatus.ACTIVE);
        userRepository.save(r5User);
        RecipientProfile r5Profile = new RecipientProfile(r5User, "Unity Elderly Care Home", OrganizationType.ELDERLY_CARE, "5 Sunny Valley Park, West End", 12.9600, 77.5600, "NGO-REG-5435", 80, true);
        recipientProfileRepository.save(r5Profile);
        r5User.setRecipientProfile(r5Profile);

        LocalDateTime now = LocalDateTime.now();

        // 4. RESOURCES (15 Total, featuring the Campus Cafeteria 50 units scenario)
        // RES 1: Campus Cafeteria 50 units Prepared Meals
        Resource res1 = new Resource(p1User, "Prepared Food – Fresh Biryani & Vegetable Curry Meal Boxes",
                ResourceCategory.COOKED_MEALS, 50.0, "PORTIONS",
                now, now.plusHours(6), now.plusHours(4),
                "Campus Central Cafeteria Kitchen Loading Bay, Gate 2", 12.9716, 77.5946,
                "Freshly cooked wholesome university cafeteria lunch surplus. Packed in individual sanitized meal containers with spoons. Ready for immediate redistribution.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res1);

        // RES 2: GreenGrocer Fresh Apples & Oranges
        Resource res2 = new Resource(p2User, "Crisp Gala Apples & Nagpur Oranges",
                ResourceCategory.FRESH_PRODUCE, 85.0, "KG",
                now, now.plusDays(2), now.plusDays(3),
                "GreenGrocer Warehouse Dock A", 12.9650, 77.6010,
                "Quality fresh fruit crates, perfectly ripe, surplus from weekend supply.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res2);

        // RES 3: Metro Grand Hotel Gourmet Buffet Platters
        Resource res3 = new Resource(p3User, "Banquet Rice, Steamed Veggies & Grilled Wraps",
                ResourceCategory.COOKED_MEALS, 60.0, "PORTIONS",
                now, now.plusHours(5), now.plusHours(3),
                "Metro Grand Hotel Service Entrance, Basement 1", 12.9780, 77.5850,
                "High quality catered corporate buffet surplus, temperature controlled in commercial warmers.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res3);

        // RES 4: Daily Harvest Assorted Sourdough & Baguettes
        Resource res4 = new Resource(p4User, "Artisan Multigrain Breads & Croissants",
                ResourceCategory.BAKERY, 45.0, "BOXES",
                now, now.plusHours(18), now.plusHours(14),
                "Daily Harvest Back Dispatch Desk", 12.9550, 77.5900,
                "Daily evening surplus of artisanal baked sourdough loaves, baguettes, and fresh croissants.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res4);

        // RES 5: Sunshine Event Caterers Packaged Salads & Sandwiches
        Resource res5 = new Resource(p5User, "Boxed Club Sandwiches & Fresh Greek Salads",
                ResourceCategory.COOKED_MEALS, 75.0, "PORTIONS",
                now, now.plusHours(8), now.plusHours(5),
                "Exhibition Hall Dispatch Bay 3", 12.9850, 77.6200,
                "Packaged gourmet event sandwiches and salad bowls, kept chilled in insulated boxes.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res5);

        // RES 6: GreenGrocer Organic Farm Spinach & Tomatoes
        Resource res6 = new Resource(p2User, "Fresh Spinach Bunches & Vine Tomatoes",
                ResourceCategory.FRESH_PRODUCE, 40.0, "KG",
                now, now.plusDays(1), now.plusHours(36),
                "GreenGrocer Loading Bay 2", 12.9650, 77.6010,
                "Hydroponic clean spinach and vine tomatoes ready for community kitchens.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res6);

        // RES 7: Daily Harvest Whole Wheat Loaves
        Resource res7 = new Resource(p4User, "Sliced Whole Wheat Sandwich Breads",
                ResourceCategory.BAKERY, 35.0, "BOXES",
                now, now.plusHours(20), now.plusHours(16),
                "Daily Harvest Bakery Dispatch", 12.9550, 77.5900,
                "Nutritious whole grain sandwich loaves, suitable for breakfast programs.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res7);

        // RES 8: Metro Grand Pasteurized Whole Milk & Yogurts
        Resource res8 = new Resource(p3User, "Organic Milk Cartons & Greek Yogurts",
                ResourceCategory.DAIRY, 30.0, "LITERS",
                now, now.plusHours(24), now.plusHours(18),
                "Metro Grand Cold Storage", 12.9780, 77.5850,
                "Sealed dairy cartons chilled at 4°C, certified fresh.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res8);

        // RES 9: Campus Cafeteria Steamed Rice & Dal
        Resource res9 = new Resource(p1User, "Wholesome Lentil Dal & Basmati Rice",
                ResourceCategory.COOKED_MEALS, 40.0, "PORTIONS",
                now, now.plusHours(5), now.plusHours(3),
                "Campus Central Cafeteria Dock 1", 12.9716, 77.5946,
                "Nutritious comforting warm dinner surplus.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res9);

        // RES 10: GreenGrocer Potatoes & Onions Sack
        Resource res10 = new Resource(p2User, "Staple Potatoes & Red Onions",
                ResourceCategory.FRESH_PRODUCE, 120.0, "KG",
                now, now.plusDays(4), now.plusDays(6),
                "GreenGrocer Dry Storage", 12.9650, 77.6010,
                "Bulk sacks of premium kitchen staple vegetables.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res10);

        // RES 11: Sunshine Event Assorted Fruit Juices
        Resource res11 = new Resource(p5User, "Cold-Pressed Orange & Mango Juices",
                ResourceCategory.BEVERAGES, 50.0, "LITERS",
                now, now.plusHours(24), now.plusHours(20),
                "Sunshine Catering Dispatch A", 12.9850, 77.6200,
                "Pure fruit juices in 1-liter sealed bottles.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res11);

        // RES 12: Daily Harvest Muffins & Bagels
        Resource res12 = new Resource(p4User, "Blueberry Muffins & Sesame Bagels",
                ResourceCategory.BAKERY, 25.0, "BOXES",
                now, now.plusHours(12), now.plusHours(10),
                "Daily Harvest Bakery Dispatch", 12.9550, 77.5900,
                "Individually wrapped breakfast bakery goods.",
                ResourceStatus.AVAILABLE, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res12);

        // RES 13 (Completed historical): Campus Cafeteria 80 portions
        Resource res13 = new Resource(p1User, "Festival Lunch Surplus Boxes",
                ResourceCategory.COOKED_MEALS, 80.0, "PORTIONS",
                now.minusDays(3), now.minusDays(3).plusHours(4), now.minusDays(3).plusHours(3),
                "Campus Central Cafeteria", 12.9716, 77.5946,
                "Successfully delivered and verified last week.",
                ResourceStatus.COMPLETED, "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res13);

        // RES 14 (Completed historical): GreenGrocer 150 kg produce
        Resource res14 = new Resource(p2User, "Mixed Vegetable Crates",
                ResourceCategory.FRESH_PRODUCE, 150.0, "KG",
                now.minusDays(5), now.minusDays(5).plusHours(24), now.minusDays(4),
                "GreenGrocer Warehouse", 12.9650, 77.6010,
                "Rescued and distributed to community kitchens.",
                ResourceStatus.COMPLETED, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res14);

        // RES 15 (Completed historical): Metro Grand Hotel 100 portions
        Resource res15 = new Resource(p3User, "Conference Dinner Surplus",
                ResourceCategory.COOKED_MEALS, 100.0, "PORTIONS",
                now.minusDays(2), now.minusDays(2).plusHours(4), now.minusDays(2).plusHours(3),
                "Metro Grand Hotel", 12.9780, 77.5850,
                "Distributed to St. Jude Food Pantry.",
                ResourceStatus.COMPLETED, "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80");
        resourceRepository.save(res15);

        // 5. RESOURCE REQUESTS (15 Total, featuring Org A, B, C for the demo scenario)
        // REQ 1: Org A - Hope Community Shelter (DEMO STAR: 30 units, HIGH priority, nearby)
        ResourceRequest req1 = new ResourceRequest(r1User, "Hot Meal Lunch Support for Shelter Residents",
                ResourceCategory.COOKED_MEALS, 30.0, "PORTIONS", RequestPriority.HIGH,
                now.plusHours(3), "Hope Community Shelter, 14 Peace Way", 12.9800, 77.6000,
                "Urgent lunch requirement for 30 displaced individuals and families sheltered at our center.",
                RequestStatus.OPEN);
        requestRepository.save(req1);

        // REQ 2: Org B - City Food Relief (DEMO STAR: 40 units, MEDIUM priority, farther)
        ResourceRequest req2 = new ResourceRequest(r2User, "Daily Outreach Food Pack Supply",
                ResourceCategory.COOKED_MEALS, 40.0, "PORTIONS", RequestPriority.MEDIUM,
                now.plusHours(5), "City Food Relief Center, East Industrial Ring Rd", 13.0200, 77.6350,
                "Scheduled afternoon distribution for street dwellers across East sector.",
                RequestStatus.OPEN);
        requestRepository.save(req2);

        // REQ 3: Org C - Youth Care Center (DEMO STAR: 20 units, HIGH priority, moderate distance)
        ResourceRequest req3 = new ResourceRequest(r3User, "After-School Nutritious Dinner for Youth",
                ResourceCategory.COOKED_MEALS, 20.0, "PORTIONS", RequestPriority.HIGH,
                now.plusHours(4), "Youth Care Wing, 22 Scholars Lane", 12.9950, 77.5850,
                "Dinner requirement for 20 enrolled youth students living in campus transition shelter.",
                RequestStatus.OPEN);
        requestRepository.save(req3);

        // REQ 4: St. Jude Food Pantry Fresh Produce
        ResourceRequest req4 = new ResourceRequest(r4User, "Fresh Fruit & Vegetables for Community Soup Kitchen",
                ResourceCategory.FRESH_PRODUCE, 50.0, "KG", RequestPriority.HIGH,
                now.plusHours(8), "St. Jude Food Pantry, Church Square", 12.9450, 77.5800,
                "Fresh ingredients for preparing soup and stews for 150 daily visitors.",
                RequestStatus.OPEN);
        requestRepository.save(req4);

        // REQ 5: Unity Elderly Care Bakery Goods
        ResourceRequest req5 = new ResourceRequest(r5User, "Soft Breads & Breakfast Bakery for Seniors",
                ResourceCategory.BAKERY, 25.0, "BOXES", RequestPriority.MEDIUM,
                now.plusHours(12), "Unity Elderly Care Home, 5 Sunny Valley Park", 12.9600, 77.5600,
                "Morning breakfast supplies for 80 elderly residents.",
                RequestStatus.OPEN);
        requestRepository.save(req5);

        // REQ 6: Hope Community Shelter Critical Produce
        ResourceRequest req6 = new ResourceRequest(r1User, "Emergency Fresh Produce for Weekend Shelter Ration",
                ResourceCategory.FRESH_PRODUCE, 35.0, "KG", RequestPriority.CRITICAL,
                now.plusHours(6), "Hope Community Shelter Kitchen", 12.9800, 77.6000,
                "Critical need: our fresh food pantry reserves are depleted for the weekend.",
                RequestStatus.OPEN);
        requestRepository.save(req6);

        // REQ 7: City Food Relief Milk & Dairy
        ResourceRequest req7 = new ResourceRequest(r2User, "Nutritional Dairy for Child Distribution",
                ResourceCategory.DAIRY, 25.0, "LITERS", RequestPriority.HIGH,
                now.plusHours(10), "City Food Relief Hub", 13.0200, 77.6350,
                "Essential milk supplementation for children of low-income families.",
                RequestStatus.OPEN);
        requestRepository.save(req7);

        // REQ 8: Youth Care Center Beverages
        ResourceRequest req8 = new ResourceRequest(r3User, "Hydration & Juices for Youth Sports & Education Camp",
                ResourceCategory.BEVERAGES, 30.0, "LITERS", RequestPriority.LOW,
                now.plusHours(16), "Youth Care Center", 12.9950, 77.5850,
                "Juice packs for community sports camp.",
                RequestStatus.OPEN);
        requestRepository.save(req8);

        // REQ 9: St. Jude Bulk Vegetables
        ResourceRequest req9 = new ResourceRequest(r4User, "Potatoes and Staples for Weekly Pantry",
                ResourceCategory.FRESH_PRODUCE, 80.0, "KG", RequestPriority.MEDIUM,
                now.plusDays(2), "St. Jude Pantry Storage", 12.9450, 77.5800,
                "Long-lasting root vegetables for family takeaway grocery bags.",
                RequestStatus.OPEN);
        requestRepository.save(req9);

        // REQ 10: Unity Elderly Care Cooked Dinner
        ResourceRequest req10 = new ResourceRequest(r5User, "Low-Sodium Soft Dinner Meals",
                ResourceCategory.COOKED_MEALS, 35.0, "PORTIONS", RequestPriority.HIGH,
                now.plusHours(5), "Unity Elderly Dining Hall", 12.9600, 77.5600,
                "Warm wholesome dinner for senior citizens with dietary care.",
                RequestStatus.OPEN);
        requestRepository.save(req10);

        // Additional historical / fulfilled requests
        ResourceRequest req11 = new ResourceRequest(r1User, "Festival Feast Support",
                ResourceCategory.COOKED_MEALS, 80.0, "PORTIONS", RequestPriority.HIGH,
                now.minusDays(3), "Hope Community Shelter", 12.9800, 77.6000,
                "Fulfilled successfully from Campus Cafeteria.", RequestStatus.FULFILLED);
        requestRepository.save(req11);

        ResourceRequest req12 = new ResourceRequest(r4User, "Produce Donation Drive",
                ResourceCategory.FRESH_PRODUCE, 150.0, "KG", RequestPriority.HIGH,
                now.minusDays(5), "St. Jude Food Pantry", 12.9450, 77.5800,
                "Fulfilled successfully from GreenGrocer.", RequestStatus.FULFILLED);
        requestRepository.save(req12);

        ResourceRequest req13 = new ResourceRequest(r2User, "Community Banquet Redistribution",
                ResourceCategory.COOKED_MEALS, 100.0, "PORTIONS", RequestPriority.MEDIUM,
                now.minusDays(2), "City Food Relief Center", 13.0200, 77.6350,
                "Fulfilled successfully from Metro Grand Hotel.", RequestStatus.FULFILLED);
        requestRepository.save(req13);

        ResourceRequest req14 = new ResourceRequest(r3User, "Morning Bread Distribution",
                ResourceCategory.BAKERY, 30.0, "BOXES", RequestPriority.MEDIUM,
                now.minusDays(1), "Youth Care Center", 12.9950, 77.5850,
                "Fulfilled successfully.", RequestStatus.FULFILLED);
        requestRepository.save(req14);

        ResourceRequest req15 = new ResourceRequest(r5User, "Weekly Milk Supply",
                ResourceCategory.DAIRY, 40.0, "LITERS", RequestPriority.HIGH,
                now.minusDays(4), "Unity Elderly Care", 12.9600, 77.5600,
                "Fulfilled successfully.", RequestStatus.FULFILLED);
        requestRepository.save(req15);

        // 6. HISTORICAL MATCHES & DELIVERIES (To populate history, tracking, and analytics)
        ResourceMatch histMatch1 = new ResourceMatch(res13, req11, 94.5, 80.0, 1.5, 100.0, 95.0, 80.0,
                "Recommended because: HIGH priority; Short pickup distance (1.5 km); Optimal quantity alignment", MatchStatus.COMPLETED);
        matchRepository.save(histMatch1);

        Delivery histDelivery1 = new Delivery(histMatch1, DeliveryStatus.RECEIVED, now.minusDays(3).plusHours(1), "4821", "9012", "Completed on time without wastage.");
        histDelivery1.setActualPickupTime(now.minusDays(3).plusHours(1).plusMinutes(15));
        histDelivery1.setDeliveredTime(now.minusDays(3).plusHours(1).plusMinutes(45));
        histDelivery1.setReceivedTime(now.minusDays(3).plusHours(2));
        deliveryRepository.save(histDelivery1);

        ResourceMatch histMatch2 = new ResourceMatch(res14, req12, 91.0, 80.0, 3.1, 100.0, 88.0, 150.0,
                "Recommended because: HIGH priority; Proximity (3.1 km); Full bulk produce distribution", MatchStatus.COMPLETED);
        matchRepository.save(histMatch2);

        Delivery histDelivery2 = new Delivery(histMatch2, DeliveryStatus.RECEIVED, now.minusDays(5).plusHours(2), "1234", "5678", "Delivered directly to central walk-in cooler.");
        histDelivery2.setActualPickupTime(now.minusDays(5).plusHours(2).plusMinutes(30));
        histDelivery2.setDeliveredTime(now.minusDays(5).plusHours(3).plusMinutes(10));
        histDelivery2.setReceivedTime(now.minusDays(5).plusHours(3).plusMinutes(20));
        deliveryRepository.save(histDelivery2);

        ResourceMatch histMatch3 = new ResourceMatch(res15, req13, 89.2, 55.0, 5.8, 100.0, 92.0, 100.0,
                "Recommended because: Large demand alignment; Safe insulated transport within 6 km", MatchStatus.COMPLETED);
        matchRepository.save(histMatch3);

        Delivery histDelivery3 = new Delivery(histMatch3, DeliveryStatus.RECEIVED, now.minusDays(2).plusHours(1), "7788", "9900", "Van refrigerated transport successful.");
        histDelivery3.setActualPickupTime(now.minusDays(2).plusHours(1).plusMinutes(20));
        histDelivery3.setDeliveredTime(now.minusDays(2).plusHours(2));
        histDelivery3.setReceivedTime(now.minusDays(2).plusHours(2).plusMinutes(15));
        deliveryRepository.save(histDelivery3);

        // 7. IN-TRANSIT DEMO DELIVERY FOR RECIPIENT TRACKING PAGE
        // Match between res3 (Metro Grand) and req10 (Unity Elderly)
        ResourceMatch activeMatch = new ResourceMatch(res3, req10, 88.5, 80.0, 2.7, 85.0, 89.0, 35.0,
                "Recommended because: HIGH priority organization demand • Nearby transit radius (2.7 km) • Optimal quantity alignment (35 of 60 units)",
                MatchStatus.ACCEPTED);
        matchRepository.save(activeMatch);

        Delivery activeDelivery = new Delivery(activeMatch, DeliveryStatus.IN_TRANSIT, now.plusMinutes(45), "6543", "8765",
                "Volunteer courier vehicle on route with thermal meal carriers.");
        activeDelivery.setActualPickupTime(now.minusMinutes(20));
        deliveryRepository.save(activeDelivery);

        // Notifications
        notificationRepository.save(new Notification(p1User, "Welcome to LIFELINK",
                "Your Campus Cafeteria profile is active. Check '/provider/matches' to view algorithmically ranked recipients for your 50 units surplus.",
                NotificationType.SYSTEM, "/provider/matches"));

        notificationRepository.save(new Notification(r1User, "Surplus Match Available",
                "High priority match detected: Campus Central Cafeteria has 50 portions of Prepared Meals (1.5 km away).",
                NotificationType.MATCH_FOUND, "/recipient/matches"));

        notificationRepository.save(new Notification(r5User, "Delivery in Transit 🚚",
                "Metro Grand Hotel surplus (35 portions) is on the way to Unity Elderly Care. Expected arrival in 25 minutes.",
                NotificationType.STATUS_CHANGE, "/recipient/tracking"));

        auditLogRepository.save(new AuditLog("SYSTEM_SEED", "system@lifelink.org", "Realistic demo dataset initialized with 5 providers, 5 recipients, 15 resources, 15 requests."));

        System.out.println(">>> [LIFELINK] Seed Data Successfully Loaded!");
    }
}
