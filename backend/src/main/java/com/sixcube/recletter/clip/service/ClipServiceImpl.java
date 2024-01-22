package com.sixcube.recletter.clip.service;

import com.amazonaws.services.s3.AmazonS3Client;
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
public class ClipServiceImpl implements ClipService{

    private final ClipRepository clipRepository;
    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Override
    public void createClip(Clip clip, MultipartFile file) {
        String fileName=file.getOriginalFilename(); //clip.getClipTitle()+"확장자";
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1);
        try {
            clipRepository.save(clip);
            System.out.println(clip);
            String fileKey= clip.getStudioId()+"/"+clip.getClipId()+"/"+clip.getClipTitle()+"."+extension;
            System.out.println(fileKey);

            ObjectMetadata metadata= new ObjectMetadata();
            metadata.setContentType(file.getContentType());
            metadata.setContentLength(file.getSize());
            amazonS3Client.putObject(bucket,fileKey,file.getInputStream(),metadata);
            System.out.println("fileUpload OK");

        } catch (IOException e) {
            e.printStackTrace();

        }
    }

    @Override
    public void updateClip(Clip clip) {

    }

    @Override
    public void deleteClip(int clipId) {
        //        try {
//            System.out.println("Ready to delete:"+fileName);
//            amazonS3Client.deleteObject(bucket,fileName);
//            System.out.println("fileDelete OK");
//            return ResponseEntity.ok(fileName);
//        } catch (AmazonServiceException e) {
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
    }

    @Override
    public Clip searchClip(int clipId) {

        Clip clip = clipRepository.findClipByClipId(clipId);
        System.out.println(clip.toString());
        return clip;
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
