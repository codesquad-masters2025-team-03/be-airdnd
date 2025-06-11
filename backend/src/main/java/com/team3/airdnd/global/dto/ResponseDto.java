package com.team3.airdnd.global.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import org.springframework.http.HttpStatus;
import org.springframework.lang.Nullable;

@Schema(name = "ResponseDto", description = "API 응답 DTO")
public record ResponseDto<T>(@JsonIgnore HttpStatus httpStatus,
                             @Schema(name = "success", description = "API 호출 성공 여부")
                             @NotNull Boolean success,
                             @Schema(name = "data", description = "API 호출 성공 시 응답 데이터")
                             @Nullable T data,
                             @Schema(name = "error", description = "API 호출 실패 시 응답 에러")
                             @Nullable ExceptionDto error) {
  public static <T> ResponseDto<T> ok(@Nullable final T data) {
    return new ResponseDto<>(HttpStatus.OK, true, data, null);
  }

  public static <T> ResponseDto<T> created(@Nullable final T data) {
    return new ResponseDto<>(HttpStatus.CREATED, true, data, null);
  }
}
