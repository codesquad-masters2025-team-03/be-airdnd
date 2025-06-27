package com.team3.airdnd.global.dto;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team3.airdnd.global.exception.ErrorCode;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

@Schema(name = "ResponseDto", description = "API 응답 DTO")
public record ResponseDto<T>(@JsonIgnore HttpStatus httpStatus,
							 @Schema(name = "success", description = "API 호출 성공 여부")
							 @NotNull Boolean success,
							 @Schema(name = "data", description = "API 호출 성공 시 응답 데이터")
							 @Nullable T data,
							 @Schema(name = "error", description = "API 호출 실패 시 응답 에러")
							 @Nullable ExceptionDto error) {
	public static <T> ResponseEntity<ResponseDto<T>> ok(@Nullable final T data) {
		return ResponseEntity.status(HttpStatus.OK)
			.body(new ResponseDto<>(HttpStatus.OK, true, data, null));
	}

	public static <T> ResponseEntity<ResponseDto<T>> created() {
		return ResponseEntity.status(HttpStatus.CREATED)
			.body(new ResponseDto<>(HttpStatus.CREATED, true, null, null));
	}

	public static <T> ResponseEntity<ResponseDto<T>> noContent() {
		return ResponseEntity.status(HttpStatus.NO_CONTENT)
			.body(new ResponseDto<>(HttpStatus.NO_CONTENT, true, null, null));
	}

	public static <T> ResponseDto<T> fail(HttpStatus status, String message) {
		return new ResponseDto<>(status, false, null,
			new ExceptionDto(ErrorCode.INTERNAL_SERVER_ERROR.getCode(), message));
	}

	public static <T> ResponseDto<T> fail(ErrorCode errorCode, String message) {
		return new ResponseDto<>(errorCode.getHttpStatus(), false, null,
			new ExceptionDto(errorCode.getCode(), message));
	}

	public static <T> ResponseDto<T> fail(ErrorCode errorCode) {
		return new ResponseDto<>(errorCode.getHttpStatus(), false, null, ExceptionDto.of(errorCode));
	}
}
