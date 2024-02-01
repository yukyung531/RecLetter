package com.sixcube.recletter.clip.service;

import com.amazonaws.HttpMethod;
import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.Headers;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sixcube.recletter.clip.Repository.ClipRepository;
import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.exception.*;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ClipServiceImpl implements ClipService {

    private final ClipRepository clipRepository;
    private final StudioUtil studioUtil;
    private final AmazonS3Client amazonS3Client;
//    private final String cloudFront = "https://d3f9xm3snzk3an.cloudfront.net/";

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

//    @Value("${cloudfront}")
    @Value("${AWS_FRONT}")
    private String cloudFront;
    private final String extension = ".mp4";


    @Override
    public void createClip(Clip clip, MultipartFile file) {
        if (file==null || !file.getContentType().equals("video/mp4")) {
            throw new InvalidClipFormatException();
        }
        if (!studioUtil.isStudioParticipant(clip.getStudioId(),clip.getClipOwner())){
            throw new WeirdClipUserException();
        }

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
//        String fileKey = "test/"+clip.getClipTitle()+".mp4";
        String fileKey= getFileKey(clip);
        System.out.println(fileKey);

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        amazonS3Client.putObject(bucket, fileKey, file.getInputStream(), metadata);
    }

    @Override
    public Clip searchMyClip(String userId, int clipId) throws NotClipOwnerException{
        Clip clip=searchClip(clipId);
        if(userId.equals(clip.getClipOwner())){
            return clip;
        } else{
          throw new NotClipOwnerException();
        }
    }

    @Override
    public List<ClipInfo> searchClipInfoList(String studioId) {
        List<Clip> clipList = clipRepository.findClipsByStudioId(studioId);
        List<ClipInfo> clipInfoList = new ArrayList<>();
        for (Clip clip : clipList) {
            ClipInfo clipInfo = ClipInfo.builder()
                    .clipId(clip.getClipId())
                    .clipTitle(clip.getClipTitle())
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

    public String getPreSignedUrl(String fileName){
        try {
            CloudFrontManager cm=new CloudFrontManager();
            cm.printUrl();
        } catch (Exception e) {
            System.out.println("TT...");
            e.printStackTrace();
        }

        GeneratePresignedUrlRequest generatePresignedUrlRequest=getGeneratePreSignedUrlRequest(bucket,fileName);
        URL url=amazonS3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    /**
     * 파일 업로드용(PUT) presigned url 생성
     * @param bucket 버킷 이름
     * @param fileName S3 업로드용 파일 이름
     * @return presigned url
     */
    private GeneratePresignedUrlRequest getGeneratePreSignedUrlRequest(String bucket, String fileName) {
        GeneratePresignedUrlRequest generatePresignedUrlRequest =
                new GeneratePresignedUrlRequest(bucket, fileName)
                        .withMethod(HttpMethod.PUT)
                        .withExpiration(getPreSignedUrlExpiration());
        generatePresignedUrlRequest.addRequestParameter(
                Headers.S3_CANNED_ACL,
                CannedAccessControlList.PublicRead.toString());
        return generatePresignedUrlRequest;
    }

    /**
     * presigned url 유효 기간 설정
     * @return 유효기간
     */
    private Date getPreSignedUrlExpiration() {
        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 3;
        expiration.setTime(expTimeMillis);
        return expiration;
    }

    /**
     * 파일 고유 ID를 생성
     * @return 36자리의 UUID
     */
    private String createFileId() {
        return UUID.randomUUID().toString();
    }

    /**
     * 파일의 전체 경로를 생성
     * @param prefix 디렉토리 경로
     * @return 파일의 전체 경로
     */
    private String createPath(String prefix, String fileName) {
        String fileId = createFileId();
        return String.format("%s/%s", prefix, fileId + fileName);
    }


}
