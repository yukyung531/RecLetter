package com.sixcube.recletter.studio;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.cookie.CookiesForCannedPolicy;
import software.amazon.awssdk.services.cloudfront.cookie.CookiesForCustomPolicy;
import software.amazon.awssdk.services.cloudfront.internal.url.DefaultSignedUrl;
import software.amazon.awssdk.services.cloudfront.internal.utils.SigningUtils;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.model.CustomSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.net.URI;

/**
 * copyright from `https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javav2/example_code/cloudfront/src/main/java/com/example/cloudfront/SigningUtilities.java`
 */
public class SigningUtilities {
    private static final Logger logger = LoggerFactory.getLogger(SigningUtilities.class);
    private static final CloudFrontUtilities cloudFrontUtilities = CloudFrontUtilities.create();

    public static SignedUrl signUrlForCannedPolicy(CannedSignerRequest cannedSignerRequest){

        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCannedPolicy(cannedSignerRequest);
        logger.info("Signed URL: [{}]", signedUrl.url());
        return signedUrl;
    }

    public static SignedUrl getSignedUrlWithCannedPolicy(CannedSignerRequest request, byte[] signatureBytes) {
        String resourceUrl = request.resourceUrl();
        String cannedPolicy = SigningUtils.buildCannedPolicy(resourceUrl, request.expirationDate());
//            byte[] signatureBytes = SigningUtils.signWithSha1Rsa(cannedPolicy.getBytes(StandardCharsets.UTF_8), request.privateKey());
        String urlSafeSignature = SigningUtils.makeBytesUrlSafe(signatureBytes);
        URI uri = URI.create(resourceUrl);
        String protocol = uri.getScheme();
        String domain = uri.getHost();
        String encodedPath = uri.getRawPath() + (uri.getQuery() != null ? "?" + uri.getRawQuery() + "&" : "?") + "Expires=" + request.expirationDate().getEpochSecond() + "&Signature=" + urlSafeSignature + "&Key-Pair-Id=" + request.keyPairId();
        return DefaultSignedUrl.builder().protocol(protocol).domain(domain).encodedPath(encodedPath).url(protocol + "://" + domain + encodedPath).build();
    }

    public SignedUrl signUrlForCustomPolicy(CustomSignerRequest customSignerRequest){
        SignedUrl signedUrl = cloudFrontUtilities.getSignedUrlWithCustomPolicy(customSignerRequest);
        logger.info("Signed URL: [{}]", signedUrl.url());
        return signedUrl;
    }

    public static CookiesForCannedPolicy getCookiesForCannedPolicy(CannedSignerRequest cannedSignerRequest){
        CookiesForCannedPolicy cookiesForCannedPolicy = cloudFrontUtilities.getCookiesForCannedPolicy(cannedSignerRequest);
        logger.info("Cookie EXPIRES header [{}]", cookiesForCannedPolicy.expiresHeaderValue());
        logger.info("Cookie KEYPAIR header [{}]", cookiesForCannedPolicy.keyPairIdHeaderValue());
        logger.info("Cookie SIGNATURE header [{}]", cookiesForCannedPolicy.signatureHeaderValue());
        return cookiesForCannedPolicy;
    }

    public CookiesForCustomPolicy getCookiesForCustomPolicy(CustomSignerRequest customSignerRequest) {
        CookiesForCustomPolicy cookiesForCustomPolicy = cloudFrontUtilities.getCookiesForCustomPolicy(customSignerRequest);
        logger.info("Cookie POLICY header [{}]", cookiesForCustomPolicy.policyHeaderValue());
        logger.info("Cookie KEYPAIR header [{}]", cookiesForCustomPolicy.keyPairIdHeaderValue());
        logger.info("Cookie SIGNATURE header [{}]", cookiesForCustomPolicy.signatureHeaderValue());
        return cookiesForCustomPolicy;
    }
}

