package com.team3.airdnd.storedFile;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.team3.airdnd.accommodation.domain.Accommodation;
import com.team3.airdnd.aws.S3FileService;
import com.team3.airdnd.storedFile.domain.StoredFile;
import com.team3.airdnd.storedFile.repository.StoredFileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoredFileService {
	private final StoredFileRepository storedFileRepository;
	private final S3FileService s3FileService;

	public void saveFiles(List<MultipartFile> files, Accommodation accommodation) {
		for (int i = 0; i < files.size(); i++) {
			MultipartFile file = files.get(i);
			String url = s3FileService.upload(file);

			StoredFile image = StoredFile.builder()
				.fileUrl(url)
				.targetType(StoredFile.TargetType.ACCOMMODATION)
				.targetId(accommodation.getId())
				.fileOrder(i + 1) // 1부터 시작
				.build();

			storedFileRepository.save(image);
		}
	}

}
