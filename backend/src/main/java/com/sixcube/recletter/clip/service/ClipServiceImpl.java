package com.sixcube.recletter.clip.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sixcube.recletter.clip.Repository.ClipRepository;
import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.exception.InvalidClipFormatException;
import com.sixcube.recletter.clip.exception.NoSuchClipException;
import com.sixcube.recletter.clip.exception.SaveClipFailException;
import com.sixcube.recletter.clip.exception.WeirdClipUserException;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClipServiceImpl implements ClipService {

    private final ClipRepository clipRepository;
    private final StudioParticipantRepository studioParticipantRepository;
    private final AmazonS3Client amazonS3Client;
    private final String cloudFront = "https://d3f9xm3snzk3an.cloudfront.net/";

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;
    private final String extension = ".mp4";

    private StudioParticipant checkValidUserClip(Clip clip) {
        return studioParticipantRepository.findById(new StudioParticipantId(clip.getStudioId(), clip.getClipOwner())).orElseThrow(WeirdClipUserException::new);
    }

    @Override
    public void createClip(Clip clip, MultipartFile file) {
        if (!file.getContentType().equals("video/mp4")) {
            throw new InvalidClipFormatException();
        }
        //아직 studioParticipant Table이 동작하지 않아 실행을 위해 주석 처리. 추후 구현 완료되면 예외처리를 위해 주석 해제 예정
//        checkValidUserClip(clip); 
        try {
            clipRepository.save(clip);
            System.out.println(clip);

            saveS3Object(clip, file);
        } catch (AmazonS3Exception | IOException e) {
            e.printStackTrace();
            clipRepository.delete(clip); //S3에 저장실패했으므로, DB에만 저장된 것 롤백처리
            throw new SaveClipFailException();
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
        } catch (AmazonS3Exception | IOException e) {
            e.printStackTrace();
            throw new SaveClipFailException();
        }
    }

    @Override
    public void deleteClip(Clip clip) {
        try {
            String fileKey = getFileKey(clip);

            clipRepository.delete(clip);
            amazonS3Client.deleteObject(bucket, fileKey);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public Clip searchClip(int clipId) {
        return clipRepository.findClipByClipId(clipId).orElseThrow(NoSuchClipException::new);
    }

    @Override
    public String searchClipUrl(int clipId){
        Clip clip=searchClip(clipId);
        StringBuilder clipUrl=new StringBuilder();
        clipUrl.append(cloudFront).append(getFileKey(clip));
        return clipUrl.toString();
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

    public void saveS3Object(Clip clip, MultipartFile file) throws IOException,AmazonS3Exception {
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
    public List<ClipInfo> searchClipInfoList(String studioId) {
        List<Clip> clipList = clipRepository.findClipsByStudioId(studioId);
        List<ClipInfo> clipInfoList = new ArrayList<>();
        for (Clip clip : clipList) {
            ClipInfo clipInfo = ClipInfo.builder()
                    .clipId(clip.getClipId())
                    .clipTitle(clip.getClipContent())
                    .clipVolume(clip.getClipVolume())
                    .clipOwner(clip.getClipOwner())
                    .clipContent(clip.getClipContent())
                    .clipOrder(clip.getClipOrder())
                    .clipUrl(cloudFront + getFileKey(clip))
                    .build();
            clipInfoList.add(clipInfo);
        }
        return clipInfoList;
    }
}
