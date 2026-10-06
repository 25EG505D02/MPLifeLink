package com.lifelink.repository;

import com.lifelink.entity.RequestPriority;
import com.lifelink.entity.RequestStatus;
import com.lifelink.entity.ResourceCategory;
import com.lifelink.entity.ResourceRequest;
import com.lifelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ResourceRequestRepository extends JpaRepository<ResourceRequest, Long> {
    List<ResourceRequest> findByRecipient(User recipient);
    List<ResourceRequest> findByRecipientId(Long recipientId);
    List<ResourceRequest> findByStatus(RequestStatus status);
    List<ResourceRequest> findByPriority(RequestPriority priority);

    @Query("SELECT req FROM ResourceRequest req WHERE req.status = 'OPEN' AND req.requiredBy > :now ORDER BY req.requiredBy ASC")
    List<ResourceRequest> findOpenActiveRequests(LocalDateTime now);

    @Query("SELECT req FROM ResourceRequest req WHERE req.status = 'OPEN' AND req.resourceCategory = :category AND req.requiredBy > :now")
    List<ResourceRequest> findOpenByCategory(ResourceCategory category, LocalDateTime now);

    long countByStatus(RequestStatus status);
}
