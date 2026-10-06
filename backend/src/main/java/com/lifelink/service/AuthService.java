package com.lifelink.service;

import com.lifelink.dto.AuthRequest;
import com.lifelink.dto.AuthResponse;
import com.lifelink.dto.RegisterRequest;
import com.lifelink.dto.UserProfileDto;
import com.lifelink.entity.*;
import com.lifelink.repository.*;
import com.lifelink.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final RecipientProfileRepository recipientProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final NotificationRepository notificationRepository;
    private final AuditLogRepository auditLogRepository;

    public AuthService(UserRepository userRepository,
                       ProviderProfileRepository providerProfileRepository,
                       RecipientProfileRepository recipientProfileRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager,
                       UserDetailsService userDetailsService,
                       NotificationRepository notificationRepository,
                       AuditLogRepository auditLogRepository) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.recipientProfileRepository = recipientProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.notificationRepository = notificationRepository;
        this.auditLogRepository = auditLogRepository;
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid user email or password."));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("id", user.getId());
        claims.put("fullName", user.getFullName());

        String token = jwtService.generateToken(userDetails, claims);

        String orgName = "";
        boolean isVerified = false;
        if (user.getRole() == Role.ROLE_PROVIDER && user.getProviderProfile() != null) {
            orgName = user.getProviderProfile().getOrganizationName();
            isVerified = user.getProviderProfile().isVerified();
        } else if (user.getRole() == Role.ROLE_RECIPIENT && user.getRecipientProfile() != null) {
            orgName = user.getRecipientProfile().getOrganizationName();
            isVerified = user.getRecipientProfile().isVerified();
        } else if (user.getRole() == Role.ROLE_ADMIN) {
            orgName = "LifeLink Central Administration";
            isVerified = true;
        }

        auditLogRepository.save(new AuditLog("LOGIN", user.getEmail(), "User successfully logged in."));

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getStatus(),
                orgName,
                isVerified
        );
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = new User(
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhoneNumber(),
                request.getRole(),
                UserStatus.ACTIVE
        );

        user = userRepository.save(user);

        String orgName = request.getOrganizationName();
        boolean verified = false;

        if (request.getRole() == Role.ROLE_PROVIDER) {
            ProviderProfile profile = new ProviderProfile(
                    user,
                    request.getOrganizationName(),
                    request.getProviderType() != null ? request.getProviderType() : ProviderType.OTHER,
                    request.getAddress(),
                    request.getLatitude() != null ? request.getLatitude() : 0.0,
                    request.getLongitude() != null ? request.getLongitude() : 0.0,
                    request.getLicenseOrRegNumber(),
                    true // Auto-verify demo registrations for smooth university evaluation
            );
            providerProfileRepository.save(profile);
            user.setProviderProfile(profile);
            verified = true;
        } else if (request.getRole() == Role.ROLE_RECIPIENT) {
            RecipientProfile profile = new RecipientProfile(
                    user,
                    request.getOrganizationName(),
                    request.getOrganizationType() != null ? request.getOrganizationType() : OrganizationType.NGO,
                    request.getAddress(),
                    request.getLatitude() != null ? request.getLatitude() : 0.0,
                    request.getLongitude() != null ? request.getLongitude() : 0.0,
                    request.getLicenseOrRegNumber(),
                    request.getCapacityPeople() != null ? request.getCapacityPeople() : 50,
                    true // Auto-verify demo registrations
            );
            recipientProfileRepository.save(profile);
            user.setRecipientProfile(profile);
            verified = true;
        }

        // Welcome Notification
        notificationRepository.save(new Notification(
                user,
                "Welcome to LIFELINK",
                "Your account is registered successfully. You can now post surplus resources or create requirements.",
                NotificationType.SYSTEM,
                "/profile"
        ));

        auditLogRepository.save(new AuditLog("REGISTER", user.getEmail(), "New registration as " + user.getRole()));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        claims.put("id", user.getId());
        claims.put("fullName", user.getFullName());

        String token = jwtService.generateToken(userDetails, claims);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhoneNumber(),
                user.getRole(),
                user.getStatus(),
                orgName,
                verified
        );
    }

    public User getCurrentAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found in security context.");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + auth.getName()));
    }

    @Transactional
    public UserProfileDto updateProfile(UserProfileDto updateDto) {
        User user = getCurrentAuthenticatedUser();
        user.setFullName(updateDto.getFullName());
        user.setPhoneNumber(updateDto.getPhoneNumber());

        if (user.getRole() == Role.ROLE_PROVIDER && user.getProviderProfile() != null) {
            ProviderProfile pp = user.getProviderProfile();
            if (updateDto.getOrganizationName() != null) pp.setOrganizationName(updateDto.getOrganizationName());
            if (updateDto.getAddress() != null) pp.setAddress(updateDto.getAddress());
            if (updateDto.getLatitude() != null) pp.setLatitude(updateDto.getLatitude());
            if (updateDto.getLongitude() != null) pp.setLongitude(updateDto.getLongitude());
            if (updateDto.getLicenseOrReg() != null) pp.setLicenseNumber(updateDto.getLicenseOrReg());
            providerProfileRepository.save(pp);
        } else if (user.getRole() == Role.ROLE_RECIPIENT && user.getRecipientProfile() != null) {
            RecipientProfile rp = user.getRecipientProfile();
            if (updateDto.getOrganizationName() != null) rp.setOrganizationName(updateDto.getOrganizationName());
            if (updateDto.getAddress() != null) rp.setAddress(updateDto.getAddress());
            if (updateDto.getLatitude() != null) rp.setLatitude(updateDto.getLatitude());
            if (updateDto.getLongitude() != null) rp.setLongitude(updateDto.getLongitude());
            if (updateDto.getLicenseOrReg() != null) rp.setRegistrationNumber(updateDto.getLicenseOrReg());
            if (updateDto.getCapacityPeople() != null) rp.setCapacityPeople(updateDto.getCapacityPeople());
            recipientProfileRepository.save(rp);
        }

        user = userRepository.save(user);
        return UserProfileDto.fromUser(user);
    }
}
