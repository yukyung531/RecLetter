package com.sixcube.recletter.clip.service;

//import com.amazonaws.services.s3.internal.ServiceUtils;
import com.amazonaws.Protocol;
import com.amazonaws.services.s3.internal.ServiceUtils;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.services.cloudfront.CloudFrontUtilities;
import software.amazon.awssdk.services.cloudfront.model.CannedSignerRequest;
import software.amazon.awssdk.services.cloudfront.url.SignedUrl;

import java.io.*;
import java.security.Security;
import java.util.Date;


public class CloudFrontManager {

    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    // Signed URLs for a private distribution
// Note that Java only supports SSL certificates in DER format,
// so you will need to convert your PEM-formatted file to DER format.
// To do this, you can use openssl:
// openssl pkcs8 -topk8 -nocrypt -in origin.pem -inform PEM -out new.der
//    -outform DER
// So the encoder works correctly, you should also add the bouncy castle jar
// to your project and then add the provider.


//    @Value("${AWS_CLOUDFRONT_KEY_ID}")
    private String keyPairId="K1AEDSJBCGMMS2";

//    @Value("${AWS_CLOUDFRONT_DOMAIN}")
    private String distributionDomain="d3kbsbmyfcnq5r.cloudfront.net";

//    @Value("${cloudfront.key}")
    private String privateKeyFilePath="./private_cloudfront_key.pem";
    String s3ObjectKey = "favicon.png";

// Convert your DER file into a byte array.

    public static byte[] readInputStreamToBytes(InputStream is) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        int b = -1;
        while ((b = is.read()) != -1) {
            baos.write(b);
        }
        return baos.toByteArray();
    }

    private byte[] derPrivateKey;
    public CloudFrontManager() throws IOException {
        System.out.println("hello "+privateKeyFilePath);
        System.out.println(keyPairId);

//        derPrivateKey = readInputStreamToBytes(new FileInputStream(privateKeyFilePath));
//        Security.addProvider(new org.bouncycastle.jce.provider.BouncyCastleProvider());
    }

    public void printUrl() throws Exception {
//        byte[] derPrivateKey = readInputStreamToBytes(new FileInputStream(privateKeyFilePath));

// Generate a "canned" signed URL to allow access to a
// specific distribution and file
        String fileName=s3ObjectKey;
        CannedSignerRequest request=CreateCannedPolicyRequest.createRequestForCannedPolicy(distributionDomain,fileName,privateKeyFilePath,keyPairId);

        SignedUrl signedUrlCanned = CloudFrontUtilities.create().getSignedUrlWithCannedPolicy(request);
        System.out.println(signedUrlCanned);

// Build a policy document to define custom restrictions for a signed URL.

//        String policy = CloudFrontService.buildPolicyForSignedUrl(
//                // Resource path (optional, can include '*' and '?' wildcards)
//                policyResourcePath,
//                // DateLessThan
//                ServiceUtils.parseIso8601Date("2011-11-14T22:20:00.000Z"),
//                // CIDR IP address restriction (optional, 0.0.0.0/0 means everyone)
//                "0.0.0.0/0",
//                // DateGreaterThan (optional)
//                ServiceUtils.parseIso8601Date("2011-10-16T06:31:56.000Z")
//        );
//
//// Generate a signed URL using a custom policy document.
//
//        String signedUrl = CloudFrontService.signUrl(
//                // Resource URL or Path
//                "https://" + distributionDomain + "/" + s3ObjectKey,
//                // Certificate identifier, an active trusted signer for the distribution
//                keyPairId,
//                // DER Private key data
//                derPrivateKey,
//                // Access control policy
//                policy
//        );
//        System.out.println(signedUrl);
    }

}
