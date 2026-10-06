package com.lifelink.dto;

import com.lifelink.entity.OrganizationType;
import com.lifelink.entity.ProviderType;
import com.lifelink.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RegisterRequest {

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;

    private String phoneNumber;

    @NotNull
    private Role role;

    @NotBlank
    private String organizationName;

    private ProviderType providerType;
    private OrganizationType organizationType;

    private String address;
    private Double latitude = 0.0;
    private Double longitude = 0.0;

    private String licenseOrRegNumber;
    private Integer capacityPeople = 50;

    public RegisterRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public ProviderType getProviderType() { return providerType; }
    public void setProviderType(ProviderType providerType) { this.providerType = providerType; }

    public OrganizationType getOrganizationType() { return organizationType; }
    public void setOrganizationType(OrganizationType organizationType) { this.organizationType = organizationType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getLicenseOrRegNumber() { return licenseOrRegNumber; }
    public void setLicenseOrRegNumber(String licenseOrRegNumber) { this.licenseOrRegNumber = licenseOrRegNumber; }

    public Integer getCapacityPeople() { return capacityPeople; }
    public void setCapacityPeople(Integer capacityPeople) { this.capacityPeople = capacityPeople; }
}
