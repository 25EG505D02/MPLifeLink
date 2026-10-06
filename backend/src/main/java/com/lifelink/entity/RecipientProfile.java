package com.lifelink.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "recipient_profiles")
public class RecipientProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String organizationName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganizationType organizationType = OrganizationType.NGO;

    private String address;
    private Double latitude = 0.0;
    private Double longitude = 0.0;

    private String registrationNumber;
    private Integer capacityPeople = 50;
    private boolean verified = false;

    public RecipientProfile() {}

    public RecipientProfile(User user, String organizationName, OrganizationType organizationType, String address, Double latitude, Double longitude, String registrationNumber, Integer capacityPeople, boolean verified) {
        this.user = user;
        this.organizationName = organizationName;
        this.organizationType = organizationType;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.registrationNumber = registrationNumber;
        this.capacityPeople = capacityPeople;
        this.verified = verified;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getOrganizationName() { return organizationName; }
    public void setOrganizationName(String organizationName) { this.organizationName = organizationName; }

    public OrganizationType getOrganizationType() { return organizationType; }
    public void setOrganizationType(OrganizationType organizationType) { this.organizationType = organizationType; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getRegistrationNumber() { return registrationNumber; }
    public void setRegistrationNumber(String registrationNumber) { this.registrationNumber = registrationNumber; }

    public Integer getCapacityPeople() { return capacityPeople; }
    public void setCapacityPeople(Integer capacityPeople) { this.capacityPeople = capacityPeople; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }
}
