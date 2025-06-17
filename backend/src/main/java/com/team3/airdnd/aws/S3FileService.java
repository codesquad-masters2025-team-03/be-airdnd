package com.team3.airdnd.aws;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.team3.airdnd.global.exception.CommonException;
import com.team3.airdnd.global.exception.ErrorCode;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class S3FileService {
	private final S3Client s3Client;
	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	//S3에 파일 업로드 후 public URL 반환
	public String upload(MultipartFile file) {
		String key = generateFileName(file.getOriginalFilename());
		try {
			PutObjectRequest request = getRequest(file, key);
			s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

			return getFileUrl(key);
		} catch (IOException e) {
			throw new CommonException(ErrorCode.S3_UPLOAD_FAILED);
		}
	}

	//UUID 기반 고유 파일 이름 생성
	private String generateFileName(String originalFilename) {
		return UUID.randomUUID() + "-" + originalFilename;
	}

	private PutObjectRequest getRequest(MultipartFile file, String key) {
		return PutObjectRequest.builder()
			.bucket(bucket)
			.key(key)
			.contentType(file.getContentType())
			.build();
	}

	private String getFileUrl(String key) {
		return s3Client.utilities().getUrl(builder -> builder
				.bucket(bucket)
				.key(key))
			.toString();
	}

}
