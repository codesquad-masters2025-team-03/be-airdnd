package com.team3.airdnd.auth;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.team3.airdnd.user.domain.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {
	private final Key key;
	private final long EXPIRATION = 1000L * 60 * 60; // 1시간

	//실행할때 한번만 실행
	public JwtProvider(@Value("${jwt.secret}") String secret) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String createToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + EXPIRATION);

		return Jwts.builder()
			.claim("userId", user.getId())
			.claim("username", user.getUsername())
			.claim("profileUrl", user.getProfileUrl())
			.setIssuedAt(now)
			.setExpiration(expiry)
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	public Claims getClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(key)
			.build()
			.parseClaimsJws(token)
			.getBody();
	}

	public Long getUserId(String token) {
		return getClaims(token).get("userId", Long.class);
	}

	public String getUsername(String token) {
		return getClaims(token).get("username", String.class);
	}

	public String getProfileUrl(String token) {
		return getClaims(token).get("profileUrl", String.class);
	}
}
