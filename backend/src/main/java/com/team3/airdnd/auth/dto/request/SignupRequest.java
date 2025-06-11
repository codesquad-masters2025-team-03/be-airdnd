package com.team3.airdnd.auth.dto.request;

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
public class SignupRequest {
  //todo: Email로 했을때의 문제점이 있음
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

  private String profileUrl;
}
