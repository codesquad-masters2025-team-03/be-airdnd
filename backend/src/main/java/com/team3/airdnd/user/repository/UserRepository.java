package com.team3.airdnd.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.team3.airdnd.user.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
	boolean existsByLoginId(String loginId);

	Optional<User> findByLoginId(String loginId);

	Optional<User> findByEmail(String email);

	// 중복 검사용
	Optional<User> findByEmailOrLoginId(String email, String loginId);
}
