package com.team3.airdnd.auth.controller;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.auth.dto.request.LoginRequestDto;
import com.team3.airdnd.auth.dto.request.SignupRequestDto;
import com.team3.airdnd.auth.service.AuthService;
import com.team3.airdnd.global.dto.ResponseDto;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping(value = "/signup", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ResponseDto<Void>> signup(@ModelAttribute SignupRequestDto request) {
		authService.signup(request);
		return ResponseDto.created();
	}

	@PostMapping("/login")
	public ResponseEntity<ResponseDto<Map<String, String>>> login(@RequestBody LoginRequestDto request) {
		String token = authService.login(request);
		Map<String, String> data = Map.of("accessToken", token);
		return ResponseDto.ok(data);
	}

	@PostMapping("/logout")
	public ResponseEntity<ResponseDto<Void>> logout() {
		// 아무 동작 없이 성공 응답만 내려줌
		return ResponseDto.ok(null);
	}
}
