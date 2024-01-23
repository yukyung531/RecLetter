package com.sixcube.recletter.clip.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.CopyObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sixcube.recletter.clip.Repository.ClipRepository;
import com.sixcube.recletter.clip.dto.Clip;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClipServiceImpl implements ClipService {

    private final ClipRepository clipRepository;
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final String extension = ".mp4";

    @Override
    public void createClip(Clip clip, MultipartFile file) {
        try {
            clipRepository.save(clip);
            System.out.println(clip);

            saveS3Object(clip, file);
        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    @Override
    public void updateClip(Clip clip, String prevTitle, MultipartFile file) {
        try {
            System.out.println(clip);
            saveS3Object(clip, file);

            String prevKey = getFileKey(clip.getStudioId(), clip.getClipId(), prevTitle);
            amazonS3Client.deleteObject(bucket, prevKey);

            clipRepository.save(clip);
        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    @Override
    public void deleteClip(Clip clip) {
        try {
            String fileKey = getFileKey(clip);

            clipRepository.delete(clip);
            System.out.println("Ready to delete:" + fileKey);
            amazonS3Client.deleteObject(bucket, fileKey);
            System.out.println("fileDelete OK");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Clip searchClip(int clipId) {
        return clipRepository.findClipByClipId(clipId);
    }

    @Override
    public String getFileKey(Clip clip) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(clip.getStudioId())
                .append("/").append(clip.getClipId())
                .append("/").append(clip.getClipTitle())
                .append(extension);
        return stringBuilder.toString();
    }

    public String getFileKey(String studioId, int clipId, String clipTitle) {
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append(studioId)
                .append("/").append(clipId)
                .append("/").append(clipTitle)
                .append(extension);
        return stringBuilder.toString();
    }

    public void saveS3Object(Clip clip, MultipartFile file) throws IOException {
        String fileKey = getFileKey(clip);
        System.out.println(fileKey);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        amazonS3Client.putObject(bucket, fileKey, file.getInputStream(), metadata);
    }

    @Override
    public boolean isClipOwner(String userId, int clipId) {
        //userId==clipId의 clipOwner랑 같은지 확인
        return false;
    }

    @Override
    public List<Clip> searchStudioClipList(String studioId) {
        return null;
    }
}
