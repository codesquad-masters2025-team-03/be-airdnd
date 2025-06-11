package com.team3.airdnd.auth.service;

import org.springframework.stereotype.Service;

import com.team3.airdnd.auth.dto.request.LoginRequest;
import com.team3.airdnd.auth.dto.request.SignupRequest;
import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;
import com.team3.airdnd.user.domain.User;
import com.team3.airdnd.user.domain.User.Role;
import com.team3.airdnd.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final UserRepository userRepository;

  public void signup(SignupRequest request) {
    if(userRepository.existsByLoginId(request.getLoginId())) {
      throw new CommonException(ErrorCode.DUPLICATED_LOGIN_ID);
    }

    User user = User.builder()
        .email(request.getEmail())
        .loginId(request.getLoginId())
        .password(request.getPassword())
        .username(request.getUsername())
        .phone(request.getPhone())
        .profileUrl(request.getProfileUrl())
        .role(Role.GUEST)
        .build();

    userRepository.save(user);
  }

  public void login(LoginRequest request) {
    User user = userRepository.findByLoginId(request.getLoginId())
        .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_USER));

    if (!user.getPassword().equals(request.getPassword())) {
      throw new CommonException(ErrorCode.FAILURE_LOGIN);
    }

    return;
  }
}
