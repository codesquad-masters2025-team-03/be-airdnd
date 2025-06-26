package com.team3.airdnd.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team3.airdnd.global.dto.ResponseDto;
import com.team3.airdnd.user.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user")
public class UserContoller {
	private final UserService userService;

	@PostMapping("/role")
	public ResponseEntity<ResponseDto<String>> changeRole(HttpServletRequest request) {
		Long userId = (Long)request.getAttribute("userId");
		String newRole = userService.changeRole(userId);
		return ResponseDto.ok(newRole); // 변경된 Role 반환
	}
}
