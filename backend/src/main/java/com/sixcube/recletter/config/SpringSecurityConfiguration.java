package com.sixcube.recletter.config;

import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.jwt.CustomJwtAuthenticationProvider;
import com.sixcube.recletter.auth.jwt.JwtToUserConverter;
import com.sixcube.recletter.auth.jwt.KeyUtils;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.annotation.web.configurers.HttpBasicConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.resource.web.access.BearerTokenAccessDeniedHandler;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@Slf4j
@AllArgsConstructor
public class SpringSecurityConfiguration {

    private final JwtToUserConverter jwtToUserConverter;
    private final KeyUtils keyUtils;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;
    private final RedisService redisService;

    //HttpSecurity를 구성하여 보안 설정을 정의하는 함수
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.httpBasic(HttpBasicConfigurer::disable) //Basic 인증을 사용하지 않음
                .csrf(CsrfConfigurer::disable) //CSRF(Cross-Site Request Forgery) 보안을 비활성화
                .cors(CorsConfigurer::disable) //cors 관련 필터
                //요청에 대한 인가 규칙 설정
                .authorizeHttpRequests(authorize ->
                        authorize.requestMatchers("/auth/**").permitAll() //해당 경로에 대한 요청은 모든 사용자에게 허용(인증 안해도 접근 가능)
//                                .requestMatchers("/**").permitAll() //테스트 시에만 주석 풀기
                                .requestMatchers("/static/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/user").permitAll() //회원가입
                                .anyRequest().authenticated() //나머지 모든 요청은 인증을 필요로 함
                )
                .oauth2ResourceServer(
                        (oauth2) -> oauth2.jwt((jwt) -> jwt.jwtAuthenticationConverter(jwtToUserConverter)))
                .sessionManagement(
                        (session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling((exceptions) -> exceptions.authenticationEntryPoint(
                                new BearerTokenAuthenticationEntryPoint())
                        .accessDeniedHandler(new BearerTokenAccessDeniedHandler()));
        SecurityFilterChain chain =http.build();
        return chain; //설정대로 filter chain 생성 후 실행
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedMethod("PATCH");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    @Primary
    JwtDecoder jwtAccessTokenDecoder() {
        //공개키로 jwt 토큰의 서명 검증하는 디코더 반환
        return NimbusJwtDecoder.withPublicKey(keyUtils.getAccessTokenPublicKey()).build();
    }

    @Bean
    @Primary
    JwtEncoder jwtAccessTokenEncoder() {
        //jwt를 생성하는 인코더 (여기서 private key는 서명하는 데 사용됨)
        JWK jwk = new RSAKey.Builder(keyUtils.getAccessTokenPublicKey()).privateKey(
                keyUtils.getAccessTokenPrivateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    @Qualifier("jwtRefreshTokenDecoder")
    JwtDecoder jwtRefreshTokenDecoder() {
        return NimbusJwtDecoder.withPublicKey(keyUtils.getRefreshTokenPublicKey()).build();
    }

    @Bean
    @Qualifier("jwtRefreshTokenEncoder")
    JwtEncoder jwtRefreshTokenEncoder() {
        JWK jwk = new RSAKey.Builder(keyUtils.getRefreshTokenPublicKey()).privateKey(
                keyUtils.getRefreshTokenPrivateKey()).build();
        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    @Qualifier("jwtRefreshTokenAuthProvider")
    CustomJwtAuthenticationProvider jwtRefreshTokenAuthProvider() {
        CustomJwtAuthenticationProvider provider = new CustomJwtAuthenticationProvider(jwtRefreshTokenDecoder(), redisService);
        provider.setJwtAuthenticationConverter(jwtToUserConverter);
        return provider;
    }

    @Bean
    DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setPasswordEncoder(passwordEncoder);
        provider.setUserDetailsService(userDetailsService);
        return provider;
    }
}
