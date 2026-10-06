package com.lifelink.dto;

import com.lifelink.entity.Role;
import com.lifelink.entity.User;
import com.lifelink.entity.UserStatus;

public class UserProfileDto {

    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private Role role;
    private UserStatus status;

    private String organizationName;
    private String organizationType;
    private String address;
    private Double latitude;
    private Double longitude;
    private String licenseOrReg;
    private Integer capacityPeople;
    private boolean verified;

    public UserProfileDto() {}

    public static UserProfileDto fromUser(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());

        if (user.getRole() == Role.ROLE_PROVIDER && user.getProviderProfile() != null) {
            dto.setOrganizationName(user.getProviderProfile().getOrganizationName());
            dto.setOrganizationType(user.getProviderProfile().getProviderType().name());
            dto.setAddress(user.getProviderProfile().getAddress());
            dto.setLatitude(user.getProviderProfile().getLatitude());
            dto.setLongitude(user.getProviderProfile().getLongitude());
            dto.setLicenseOrReg(user.getProviderProfile().getLicenseNumber());
            dto.setVerified(user.getProviderProfile().isVerified());
        } else if (user.getRole() == Role.ROLE_RECIPIENT && user.getRecipientProfile() != null) {
            dto.setOrganizationName(user.getRecipientProfile().getOrganizationName());
            dto.setOrganizationType(user.getRecipientProfile().getOrganizationType().name());
            dto.setAddress(user.getRecipientProfile().getAddress());
            dto.setLatitude(user.getRecipientProfile().getLatitude());
            dto.setLongitude(user.getRecipientProfile().getLongitude());
            dto.setLicenseOrReg(user.getRecipientProfile().getRegistrationNumber());
            dto.setCapacityPeople(user.getRecipientProfile().getCapacityPeople());
            dto.setVerified(user.getRecipientProfile().isVerified());
        }
        return dto;
    }

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

    public String getOrganizationType() { return organizationType; }
    public void setOrganizationType(String organizationType) { this.organizationType = organizationType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLicenseOrReg() { return licenseOrReg; }
    public void setLicenseOrReg(String licenseOrReg) { this.licenseOrReg = licenseOrReg; }

    public Integer getCapacityPeople() { return capacityPeople; }
    public void setCapacityPeople(Integer capacityPeople) { this.capacityPeople = capacityPeople; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
