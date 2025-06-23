package com.team3.airdnd.storedFile.validation;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;

@Component
public class ImageValidator {

	private static final int MAX_SIZE_MB = 10;

	public void validate(List<MultipartFile> files) {
		if (files == null || files.isEmpty() || files.size() > 5) {
			throw new CommonException(ErrorCode.INVALID_IMAGE);
		}

		for (MultipartFile file : files) {
			if (!isImage(file)) {
				throw new CommonException(ErrorCode.INVALID_IMAGE_TYPE);
			}
			if (file.getSize() > MAX_SIZE_MB * 1024 * 1024) {
				throw new CommonException(ErrorCode.IMAGE_TOO_LARGE);
			}
		}
	}

	private boolean isImage(MultipartFile file) {
		String contentType = file.getContentType();
		return contentType != null && contentType.startsWith("image/");
	}
}