package com.team3.airdnd.user.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	private final UserRepository userRepository;

	@Transactional
	public String changeRole(Long userId) {
		User user = userRepository.findById(userId)
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

		User.Role current = user.getRole();
		User.Role toggled = current == User.Role.HOST ? User.Role.GUEST : User.Role.HOST;
		user.setRole(toggled);

		return toggled.name(); // 변경된 Role 문자열로 반환
	}
}
