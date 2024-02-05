package com.sixcube.recletter.studio;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.sixcube.recletter.clip.exception.AwsAuthorizationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.cloudfront.cookie.CookiesForCannedPolicy;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
@Slf4j
public class S3Util {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${AWS_FRONT}")
    private String cloudFront;

    @Value("${AWS_CLOUDFRONT_KEY_ID}")
    private String keyPairId;

    @Value("${AWS_CLOUDFRONT_DOMAIN}")
    private String distributionDomain;

    @Value("${AWS_CLOUDFRONT_KEY}")
    private String privateKeyFilePath;

    /**
     * 버킷에 원하는 이름으로 객체 파일 저장
     * @param fileName s3에 저장할 객체 이름(확장자 포함되어야 함)
     * @param file s3에 저장할 객체 파일
     * @throws IOException
     * @throws AmazonS3Exception
     */
    public void saveObject(String fileName, MultipartFile file)throws IOException, AmazonS3Exception {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentType(file.getContentType());
        metadata.setContentLength(file.getSize());
        amazonS3Client.putObject(bucket, fileName, file.getInputStream(), metadata);
    }

    /**
     * 특정 객체 파일 삭제
     * @param fileName 객체 이름
     */
    public void deleteObject(String fileName){
        amazonS3Client.deleteObject(bucket, fileName);
    }
    public boolean isObject(String fileName){
        return amazonS3Client.doesObjectExist(bucket, fileName);
    }
    public String getSignedUrl(String fileName) {
        CannedSignerRequest request;
        try {
            request = createRequestForCannedPolicy(distributionDomain,fileName,privateKeyFilePath,keyPairId);
            SignedUrl signedUrlCanned= SigningUtilities.signUrlForCannedPolicy(request);
            log.debug(signedUrlCanned.toString());
            return signedUrlCanned.url().toString();
        } catch (Exception e) {
            e.printStackTrace();
            throw new AwsAuthorizationException();
        }
    }

    private CannedSignerRequest createRequestForCannedPolicy(String distributionDomainName, String fileNameToUpload,
                                                                   String privateKeyFullPath, String publicKeyId) throws Exception{
        String protocol = "https";
        String resourcePath = "/" + URLEncoder.encode(fileNameToUpload,"UTF-8");
        String cloudFrontUrl = new URL(protocol, distributionDomainName, resourcePath).toString();
        Instant expirationDate = Instant.now().plus(1, ChronoUnit.HOURS);
        Path path = Paths.get(privateKeyFullPath);

        return CannedSignerRequest.builder()
                .resourceUrl(cloudFrontUrl)
                .privateKey(path)
                .keyPairId(publicKeyId)
                .expirationDate(expirationDate)
                .build();
    }
    public CookiesForCannedPolicy getSignedCookie(String fileName) throws Exception {
        CannedSignerRequest request=createRequestForCannedPolicy(distributionDomain,fileName,privateKeyFilePath,keyPairId);
        CookiesForCannedPolicy cookies=SigningUtilities.getCookiesForCannedPolicy(request);
        log.debug(cookies.toString());
        return cookies;

    }

}
