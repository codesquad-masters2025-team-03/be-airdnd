package com.team3.airdnd.utils;

import java.time.LocalDateTime;

import org.springframework.transaction.annotation.Transactional;

import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.repository.UserRepository;

public class UserDataGenerator {
	private final UserRepository userRepository;

	public UserDataGenerator(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Transactional
	public void generateUser(){

		User host = User.builder()
			.email("host1@nate.com")
			.username("홍길동")
			.loginId("host01")
			.password("pw01")
			.role(User.Role.HOST)
			.phone("016-387-7840")
			.profileUrl("https://placeimg.com/28/191/any")
			.createdAt(LocalDateTime.now())
			.build();

		User guset = User.builder()
			.email("ggim@dreamwiz.com")
			.username("김시우")
			.loginId("host01")
			.password("pw01")
			.role(User.Role.HOST)
			.phone("016-387-7840")
			.profileUrl("https://placeimg.com/28/191/any")
			.createdAt(LocalDateTime.now())
			.build();

		userRepository.save(host);
		userRepository.save(guset);
	}
}
