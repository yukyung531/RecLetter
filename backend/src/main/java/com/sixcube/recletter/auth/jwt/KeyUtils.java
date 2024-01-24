package com.sixcube.recletter.auth.jwt;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class KeyUtils {
    private final Environment environment;

    @Value("${access-token.private}")
    private String accessTokenPrivateKeyPath;

    @Value("${access-token.public}")
    private String accessTokenPublicKeyPath;

    @Value("${refresh-token.private}")
    private String refreshTokenPrivateKeyPath;

    @Value("${refresh-token.public}")
    private String refreshTokenPublicKeyPath;

    private KeyPair _accessTokenKeyPair;
    private KeyPair _refreshTokenKeyPair;

    public KeyUtils(Environment environment) {
        this.environment = environment;
    }

    private KeyPair getAccessTokenKeyPair() {
        if (Objects.isNull(_accessTokenKeyPair)) {
            _accessTokenKeyPair = getKeyPair(accessTokenPublicKeyPath, accessTokenPrivateKeyPath);
        }
        return _accessTokenKeyPair;
    }

    private KeyPair getRefreshTokenKeyPair() {
        if (Objects.isNull(_refreshTokenKeyPair)) {
            _refreshTokenKeyPair = getKeyPair(refreshTokenPublicKeyPath, refreshTokenPrivateKeyPath);
        }
        return _refreshTokenKeyPair;
    }

    private KeyPair getKeyPair(String publicKeyPath, String privateKeyPath) {
        KeyPair keyPair;

        File publicKeyFile = new File(publicKeyPath);
        File privateKeyFile = new File(privateKeyPath);

        //KEY가 이미 있으면 가져오기
        if (publicKeyFile.exists() && privateKeyFile.exists()) {
            log.info("loading keys from file: {}, {}", publicKeyPath, privateKeyPath);
            try {
                //KeyFactory: 키(공개 키 및 개인 키)의 생성을 담당하는 클래스
                // KeyFactory 인스턴스를 RSA 알고리즘으로 생성
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");

                // 공개 키 파일의 내용을 바이트 배열로 읽어옵니다.
                byte[] publicKeyBytes = Files.readAllBytes(publicKeyFile.toPath());
                // X.509 표준에 따라 인코딩된 공개 키를 나타내는 키 사양을 생성합니다.
                EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
                // 공개 키를 KeyFactory를 사용하여 생성합니다.
                PublicKey publicKey = keyFactory.generatePublic(publicKeySpec);

                // 개인 키 파일의 내용을 바이트 배열로 읽어옵니다.
                byte[] privateKeyBytes = Files.readAllBytes(privateKeyFile.toPath());
                // PKCS #8 표준에 따라 인코딩된 개인 키를 나타내는 키 사양을 생성합니다.
                PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
                // 개인 키를 KeyFactory를 사용하여 생성합니다.
                PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

                // 생성된 공개 키와 개인 키로 KeyPair 객체를 생성합니다.
                keyPair = new KeyPair(publicKey, privateKey);
                return keyPair;
            } catch (NoSuchAlgorithmException | IOException | InvalidKeySpecException e) {
                throw new RuntimeException(e);
            }
        } else {
            if (Arrays.stream(environment.getActiveProfiles()).anyMatch(s -> s.equals("prod"))) {
                throw new RuntimeException("public and private keys don't exist");
            }
        }

        //key가 없는 경우
        //폴더 만들고
        File directory = new File("access-refresh-token-keys");
        if (!directory.exists()) {
            directory.mkdirs();
        }
        //key 생성
        try {
            log.info("Generating new public and private keys: {}, {}", publicKeyPath, privateKeyPath);
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();
            try (FileOutputStream fos = new FileOutputStream(publicKeyPath)) {
                X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyPair.getPublic().getEncoded());
                fos.write(keySpec.getEncoded());
            }

            try (FileOutputStream fos = new FileOutputStream(privateKeyPath)) {
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyPair.getPrivate().getEncoded());
                fos.write(keySpec.getEncoded());
            }
        } catch (NoSuchAlgorithmException | IOException e) {
            throw new RuntimeException(e);
        }

        return keyPair;
    }


    public RSAPublicKey getAccessTokenPublicKey() {
        return (RSAPublicKey) getAccessTokenKeyPair().getPublic();
    };
    public RSAPrivateKey getAccessTokenPrivateKey() {
        return (RSAPrivateKey) getAccessTokenKeyPair().getPrivate();
    };
    public RSAPublicKey getRefreshTokenPublicKey() {
        return (RSAPublicKey) getRefreshTokenKeyPair().getPublic();
    };
    public RSAPrivateKey getRefreshTokenPrivateKey() {
        return (RSAPrivateKey) getRefreshTokenKeyPair().getPrivate();
    };
}
