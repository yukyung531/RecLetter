package com.sixcube.recletter.config;

import com.sixcube.recletter.auth.jwt.JWTFilter;
import com.sixcube.recletter.auth.jwt.JWTUtil;
import com.sixcube.recletter.auth.jwt.LoginFilter;
import com.sixcube.recletter.oauth2.CustomClientRegistrationRepo;
import com.sixcube.recletter.oauth2.service.CustomOAuth2AuthorizedClientService;
import com.sixcube.recletter.oauth2.OAuth2MemberFailureHandler;
import com.sixcube.recletter.oauth2.OAuth2MemberSuccessHandler;
import com.sixcube.recletter.oauth2.service.CustomOAuth2UserService;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity(prePostEnabled = true)
@Slf4j
@AllArgsConstructor
public class SecurityConfig {

    private final AuthenticationConfiguration authenticationConfiguration;
    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;
    private final RedisService redisService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomClientRegistrationRepo customClientRegistrationRepo;
    private final AuthenticationEntryPoint authenticationEntryPoint;
    private final CustomOAuth2AuthorizedClientService customOAuth2AuthorizedClientService;
    private final JdbcTemplate jdbcTemplate;

    //AuthenticationManager Bean 등록
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration)
            throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        LoginFilter loginFilter = new LoginFilter(authenticationManager(authenticationConfiguration),
                jwtUtil, redisService);
        loginFilter.setFilterProcessesUrl("/auth/login");
        // UsernamePasswordAuthenticationFilter의 정의에 따라서 /login 경로로 오는 POST 요청을 검증함.
        // 로그인은 기본 경로가 /login으로 되어 있어서 다른 경로에서 작동하게 하고 싶으면 위와 같이 작성해야 함.

        http
                .csrf((auth) -> auth.disable())
                .formLogin((auth) -> auth.disable())
                .httpBasic((auth) -> auth.disable());
        //소셜 로그인
        http
                .oauth2Login((oauth2) -> oauth2
                        //.loginPage("/login")
                        .successHandler(new OAuth2MemberSuccessHandler(userRepository, jwtUtil, redisService))
                        .failureHandler(new OAuth2MemberFailureHandler())
                        .clientRegistrationRepository(customClientRegistrationRepo.clientRegistrationRepository())
                        .authorizedClientService(customOAuth2AuthorizedClientService.oAuth2AuthorizedClientService(jdbcTemplate, customClientRegistrationRepo.clientRegistrationRepository()))
                        .userInfoEndpoint((userInfoEndpointConfig) -> userInfoEndpointConfig //data를 받을 수 있는 UserDetailsService를 등록해주는 endpoint
                                .userService(customOAuth2UserService)))
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(authenticationEntryPoint)
                );
        //자체 로그인
        http
                .authorizeHttpRequests((auth) -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers(HttpMethod.POST, "/user").permitAll()  //회원가입
                        .requestMatchers("/auth/email", "/auth/email/code", "/auth/password", "/auth/password/code").permitAll()  //이메일 인증(회원가입)
                        .requestMatchers("/auth/password", "/auth/password/code", "/user/password").permitAll()  //비밀번호 초기화
                        .requestMatchers("/studio/*/download").permitAll()  //영상 다운로드
                        .requestMatchers("/ws/**").permitAll() //웹소켓
                        .anyRequest().authenticated());
        //JWTFilter 등록
        http
                .addFilterBefore(new JWTFilter(jwtUtil, userRepository), LoginFilter.class);
        //LoginFilter 등록
        http
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);
        http
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        SecurityFilterChain chain = http.build();
        return chain;
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


}
