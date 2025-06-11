package com.team3.airdnd.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team3.airdnd.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByLoginId(String loginId);
  Optional<User> findByLoginId(String loginId);
}
