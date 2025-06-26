package com.team3.airdnd.auth;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthInterceptor implements HandlerInterceptor {
	private final JwtProvider jwtProvider;

	public AuthInterceptor(JwtProvider jwtProvider) {
		this.jwtProvider = jwtProvider;
	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
		throws Exception {
		
		if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
			return true;
		}

		String token = extractToken(request);

		if (token != null && jwtProvider.validateToken(token)) {
			Long userId = jwtProvider.getUserId(token);
			request.setAttribute("userId", userId); // 컨트롤러에서 꺼내쓸 수 있도록 저장
			return true;
		}

		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
		return false;
	}

	private String extractToken(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			return authHeader.substring(7); // "Bearer " 이후 실제 토큰만 추출
		}
		return null;
	}
}
