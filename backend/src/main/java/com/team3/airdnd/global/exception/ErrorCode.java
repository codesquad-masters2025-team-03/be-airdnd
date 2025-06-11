package com.team3.airdnd.global.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
  NOT_FOUND_RESOURCE(40400, HttpStatus.NOT_FOUND, "해당 리소스가 존재하지 않습니다."),
  NOT_FOUND_USER(40401, HttpStatus.NOT_FOUND, "해당 사용자가 존재하지 않습니다."),

  FAILURE_LOGIN(40100, HttpStatus.UNAUTHORIZED, "잘못된 아이디 또는 비밀번호입니다."),
  ACCESS_DENIED(40300, HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
  DUPLICATED_LOGIN_ID(40900, HttpStatus.CONFLICT, "이미 존재하는 로그인 아이디입니다."),

  INTERNAL_SERVER_ERROR(50000, HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 에러입니다.");

  private final Integer code;
  private final HttpStatus httpStatus;
  private final String message;
}
