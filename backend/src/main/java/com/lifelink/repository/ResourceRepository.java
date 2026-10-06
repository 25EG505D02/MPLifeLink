package com.lifelink.repository;

import com.lifelink.entity.Resource;
import com.lifelink.entity.ResourceCategory;
import com.lifelink.entity.ResourceStatus;
import com.lifelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByProvider(User provider);
    List<Resource> findByProviderId(Long providerId);
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByCategoryAndStatus(ResourceCategory category, ResourceStatus status);

    @Query("SELECT r FROM Resource r WHERE r.status = 'AVAILABLE' AND r.expiryDate > :now ORDER BY r.expiryDate ASC")
    List<Resource> findAvailableActiveResources(LocalDateTime now);

    @Query("SELECT r FROM Resource r WHERE r.provider.id = :providerId AND r.status = 'AVAILABLE' AND r.expiryDate > :now AND r.expiryDate < :warningTime")
    List<Resource> findExpiringSoonResources(Long providerId, LocalDateTime now, LocalDateTime warningTime);

    long countByStatus(ResourceStatus status);

    @Query("SELECT SUM(r.quantity) FROM Resource r WHERE r.status = 'COMPLETED'")
    Double sumCompletedRedistributedQuantity();
}
