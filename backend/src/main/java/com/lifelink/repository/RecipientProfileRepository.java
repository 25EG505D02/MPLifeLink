package com.lifelink.repository;

import com.lifelink.entity.RecipientProfile;
import com.lifelink.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecipientProfileRepository extends JpaRepository<RecipientProfile, Long> {
    Optional<RecipientProfile> findByUser(User user);
    Optional<RecipientProfile> findByUserId(Long userId);
    List<RecipientProfile> findByVerified(boolean verified);
}
