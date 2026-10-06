package com.lifelink.repository;

import com.lifelink.entity.MatchStatus;
import com.lifelink.entity.Resource;
import com.lifelink.entity.ResourceMatch;
import com.lifelink.entity.ResourceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResourceMatchRepository extends JpaRepository<ResourceMatch, Long> {
    List<ResourceMatch> findByResource(Resource resource);
    List<ResourceMatch> findByRequest(ResourceRequest request);
    List<ResourceMatch> findByStatus(MatchStatus status);
    Optional<ResourceMatch> findByResourceAndRequest(Resource resource, ResourceRequest request);

    @Query("SELECT m FROM ResourceMatch m WHERE m.resource.provider.id = :providerId ORDER BY m.score DESC")
    List<ResourceMatch> findByProviderId(Long providerId);

    @Query("SELECT m FROM ResourceMatch m WHERE m.request.recipient.id = :recipientId ORDER BY m.score DESC")
    List<ResourceMatch> findByRecipientId(Long recipientId);

    @Query("SELECT m FROM ResourceMatch m WHERE m.resource.id = :resourceId ORDER BY m.score DESC")
    List<ResourceMatch> findByResourceIdOrdered(Long resourceId);

    @Query("SELECT m FROM ResourceMatch m WHERE m.request.id = :requestId ORDER BY m.score DESC")
    List<ResourceMatch> findByRequestIdOrdered(Long requestId);
}
