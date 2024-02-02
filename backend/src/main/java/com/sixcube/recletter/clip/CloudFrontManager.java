package com.sixcube.recletter.clip;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.cloudfront.cookie.CookiesForCannedPolicy;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component

public class CloudFrontManager {

    @Value("${AWS_CLOUDFRONT_KEY_ID}")
    private String keyPairId;//="K1AEDSJBCGMMS2";

    @Value("${AWS_CLOUDFRONT_DOMAIN}")
    private String distributionDomain;//="d3kbsbmyfcnq5r.cloudfront.net";

    @Value("${AWS_CLOUDFRONT_KEY}")
    private String privateKeyFilePath;//="./private_cloudfront_key.der";

    public static CannedSignerRequest createRequestForCannedPolicy(String distributionDomainName, String fileNameToUpload,
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
    public String getSignedUrl(String fileName) throws Exception {

        CannedSignerRequest request=createRequestForCannedPolicy(distributionDomain,fileName,privateKeyFilePath,keyPairId);
        SignedUrl signedUrlCanned=SigningUtilities.signUrlForCannedPolicy(request);
//        System.out.println(signedUrlCanned);
        return signedUrlCanned.url().toString();
    }

    public CookiesForCannedPolicy getSignedCookie(String fileName) throws Exception {

        CannedSignerRequest request=createRequestForCannedPolicy(distributionDomain,fileName,privateKeyFilePath,keyPairId);

        CookiesForCannedPolicy cookies=SigningUtilities.getCookiesForCannedPolicy(request);

        System.out.println(cookies);
        return cookies;

    }

}
