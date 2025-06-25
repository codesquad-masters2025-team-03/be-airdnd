package com.team3.airdnd.auth.dto.request;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDto {
	@Email
	private String email;

	@NotBlank
	private String loginId;

	@NotBlank
	private String password;

	@NotBlank
	private String username;

	@NotBlank
	private String phone;

	private MultipartFile profileImage; //이미지 받아와서 -> s3 -> url 저장
}
