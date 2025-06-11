package com.team3.airdnd.auth.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.auth.dto.request.LoginRequest;
import com.team3.airdnd.auth.dto.request.SignupRequest;
import com.team3.airdnd.auth.service.AuthService;
import com.team3.airdnd.global.dto.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
  private final AuthService authService;

  @PostMapping("/signup")
  public ResponseDto<?> signup(@RequestBody SignupRequest request){
    authService.signup(request);
    return ResponseDto.ok(null);
  }

  @PostMapping("/login")
  public ResponseDto<?> login(@RequestBody LoginRequest request) {
    authService.login(request);
    return ResponseDto.ok(null);
  }
}
