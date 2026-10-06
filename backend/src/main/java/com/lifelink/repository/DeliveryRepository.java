package com.lifelink.repository;

import com.lifelink.entity.Delivery;
import com.lifelink.entity.DeliveryStatus;
import com.lifelink.entity.ResourceMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByMatch(ResourceMatch match);
    List<Delivery> findByStatus(DeliveryStatus status);

    @Query("SELECT d FROM Delivery d WHERE d.match.resource.provider.id = :providerId ORDER BY d.updatedAt DESC")
    List<Delivery> findByProviderId(Long providerId);

    @Query("SELECT d FROM Delivery d WHERE d.match.request.recipient.id = :recipientId ORDER BY d.updatedAt DESC")
    List<Delivery> findByRecipientId(Long recipientId);

    long countByStatus(DeliveryStatus status);
}
