package com.team3.airdnd.auth.controller;

import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<ResponseDto<Void>> signup(@RequestBody SignupRequest request) {
		authService.signup(request);
		return ResponseDto.created();
	}

	@PostMapping("/login")
	public ResponseEntity<ResponseDto<Void>> login(@RequestBody LoginRequest request) {
		authService.login(request);
		return ResponseDto.ok(null);
	}
}
