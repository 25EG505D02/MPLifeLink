package com.lifelink.dto;

import com.lifelink.entity.Role;
import com.lifelink.entity.UserStatus;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private UserStatus status;
    private String organizationName;
    private boolean verified;

    public AuthResponse() {}

    public AuthResponse(String token, Long id, String email, String fullName, String phoneNumber,
                        Role role, UserStatus status, String organizationName, boolean verified) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.role = role;
        this.status = status;
        this.organizationName = organizationName;
        this.verified = verified;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
