package com.team3.airdnd.global.exception;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.team3.airdnd.global.dto.ResponseDto;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ResponseDto<Void>> handleValidationException(MethodArgumentNotValidException e) {

		List<String> errors = e.getBindingResult()
			.getFieldErrors()
			.stream()
			.map(error -> error.getDefaultMessage())
			.collect(Collectors.toList());

		String message = errors.isEmpty() ? "잘못된 입력입니다." : errors.get(0);

		ResponseDto<Void> response = ResponseDto.fail(
			ErrorCode.INVALID_REQUEST.getHttpStatus(),
			message
		);

		return ResponseEntity.status(ErrorCode.INVALID_REQUEST.getHttpStatus()).body(response);
	}

	@ExceptionHandler(CommonException.class)
	public ResponseEntity<ResponseDto<Void>> handleCommonException(CommonException e) {
		ResponseDto<Void> response = ResponseDto.fail(
			e.getErrorCode(),
			e.getMessage()
		);
		return ResponseEntity.status(e.getErrorCode().getHttpStatus()).body(response);
	}

}
