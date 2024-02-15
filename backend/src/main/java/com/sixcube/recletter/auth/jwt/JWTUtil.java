package com.sixcube.recletter.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.sql.Date;

/**
 * jwt 발급
 * jwt 검증
 */

@Component
public class JWTUtil {

    private Key key;

    public JWTUtil(@Value("${spring.jwt.secret}") String secret) {

        byte[] byteSecretKey = Decoders.BASE64.decode(secret);
        key = Keys.hmacShaKeyFor(byteSecretKey); // 객체 key 생성
    }

    //username 검증
    public String getUserId(String token) {
        //sigingkey 부분이 유효성 검증하는 부분
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("userId", String.class);
    }

    //role 검증
    public String getRole(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("role", String.class);
    }

    //만료 일자 검증
    public Boolean isExpired(String token) {
        boolean expired;
        try {
            expired = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getExpiration().before(new Date(System.currentTimeMillis()));
        } catch (ExpiredJwtException e) {
            expired = true;
        }
        return expired;
    }

    //유효여부 확인
    public void checkValid(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
        }
    }


    //토큰 생성
    public String createJwt(String userId, String role, Long expiredMs) {

        Claims claims = Jwts.claims();
        claims.put("userId", userId);
        claims.put("role", role);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiredMs))
                .signWith(key, SignatureAlgorithm.HS256) //암호화
                .compact();
    }
}