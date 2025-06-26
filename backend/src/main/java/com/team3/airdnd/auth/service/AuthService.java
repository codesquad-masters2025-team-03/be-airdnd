package com.team3.airdnd.auth.service;

import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.team3.airdnd.auth.JwtProvider;
import com.team3.airdnd.auth.dto.request.LoginRequestDto;
import com.team3.airdnd.auth.dto.request.SignupRequestDto;
import com.team3.airdnd.aws.S3FileService;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.domain.User.Role;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	@Value("${profile.default-image-url}")
	private String DEFAULT_PROFILE_URL;

	private final UserRepository userRepository;
	private final S3FileService s3FileService;
	private final JwtProvider jwtProvider;

	public void signup(SignupRequestDto request) {

		validateDuplicateEmailOrLoginId(request);

		// 패스워드 해싱
		String hashPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());

		String profileUrl = request.getProfileImage() == null || request.getProfileImage().isEmpty()
			? DEFAULT_PROFILE_URL
			: s3FileService.upload(request.getProfileImage());

		User user = User.builder()
			.email(request.getEmail())
			.loginId(request.getLoginId())
			.password(hashPassword)
			.username(request.getUsername())
			.phone(request.getPhone())
			.profileUrl(profileUrl)
			.role(Role.GUEST)
			.build();

		userRepository.save(user);
	}

	public String login(LoginRequestDto request) {
		User user = userRepository.findByLoginId(request.getLoginId())
			.orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

		if (!BCrypt.checkpw(request.getPassword(), user.getPassword())) {
			throw new CommonException(ErrorCode.NOT_FOUND_USER);
		}
		// JWT 발급
		return jwtProvider.createToken(user);
	}

	private void validateDuplicateEmailOrLoginId(SignupRequestDto request) {
		Optional<User> duplicate = userRepository.findByEmailOrLoginId(request.getEmail(), request.getLoginId());

		if (duplicate.isPresent()) {
			User user = duplicate.get();
			if (user.getEmail().equals(request.getEmail())) {
				throw new CommonException(ErrorCode.DUPLICATED_EMAIL_ID);
			}
			if (user.getLoginId().equals(request.getLoginId())) {
				throw new CommonException(ErrorCode.DUPLICATED_LOGIN_ID);
			}
		}
	}

}
