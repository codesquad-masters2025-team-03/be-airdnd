package com.team3.airdnd.storedFile;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.team3.airdnd.aws.S3FileService;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoredFileService {
	private final StoredFileRepository storedFileRepository;
	private final S3FileService s3FileService;

	@Transactional
	public void saveAccommodationImages(List<MultipartFile> files, Long accommodationId) {
		for (int i = 0; i < files.size(); i++) {
			MultipartFile file = files.get(i);
			String url = s3FileService.upload(file);

			StoredFile image = StoredFile.builder()
				.fileUrl(url)
				.targetType(StoredFile.TargetType.ACCOMMODATION)
				.targetId(accommodationId)
				.fileOrder(i + 1) // 1부터 시작
				.build();

			storedFileRepository.save(image);
		}
	}

	@Transactional
	public void deleteFilesByAccommodationId(Long accommodationId) {
		List<StoredFile> files = storedFileRepository.findByTargetTypeAndTargetId(
			StoredFile.TargetType.ACCOMMODATION, accommodationId
		);

		for (StoredFile file : files) {
			s3FileService.delete(file.getFileUrl());  // S3에서 삭제
			storedFileRepository.delete(file);        // DB에서 삭제
		}
	}

}
