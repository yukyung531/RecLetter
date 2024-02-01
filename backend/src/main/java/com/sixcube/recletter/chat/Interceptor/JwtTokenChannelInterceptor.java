package com.sixcube.recletter.chat.Interceptor;

import com.sixcube.recletter.auth.jwt.JWTUtil;
import com.sixcube.recletter.chat.exception.ChatTokenInvalidFailureException;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

// JwtTokenChannelInterceptor는 웹소켓 요청을 인터셉트하여 JWT 토큰을 확인하고 해당 사용자의 인증 정보를 가져오는 역할을 함
@RequiredArgsConstructor
@Component
public class JwtTokenChannelInterceptor implements ChannelInterceptor {

    private final JWTUtil jwtUtil;
    private final UserRepository userRepository;

    /**
     * 메시지를 보내기 전에 실행되는 인터셉터 메소드
     * @param message 전송될 메시지. 이 메시지의 헤더에는 JWT 토큰이 포함되어 있어야 함
     * @param channel 메시지가 전송될 채널
     * @return 수정된 메시지를 반환(사용자 인증 정보가 추가된 메시지)
     */
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        // 만약 메시지의 종류가 CONNECT(WebSocket 연결을 시작하는 요청)라면
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // 메시지 헤더에서 "Authorization" 정보를 가져온다. 이 정보는 JWT 토큰을 포함하고 있다.
            String authToken = accessor.getFirstNativeHeader("Authorization");
            // 만약 토큰이 null이 아니고, "Bearer "로 시작한다면
            if (authToken != null && authToken.startsWith("Bearer ")) {
                // "Bearer " 다음에 오는 부분을 토큰으로 저장한다.
                String jwtToken = authToken.substring(7);
                try {
                    //토큰 소멸 시간 검증
                    if (jwtUtil.isExpired(jwtToken)) {
                        throw new JwtException("토큰이 만료되었습니다.");
                    }
                    //토큰에서 userId, role 획득
                    String userId = jwtUtil.getUserId(jwtToken);
                    String role = jwtUtil.getRole(jwtToken);

                    //user를 생성하여 값 set
                    User user = userRepository.findByUserId(userId).orElseThrow(()-> new JwtException("올바르지 않은 토큰입니다."));
                    user.setUserRole(role);

                    //스프링 시큐리티 인증 토큰 생성
                    Authentication authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                    // 사용자 정보를 메시지 헤더에 저장한다.
                    accessor.setUser(authentication);
                } catch (JwtException e) {
                    throw new ChatTokenInvalidFailureException(e);
                }
            }
        }
        // 사용자 인증 정보가 추가된 메시지를 반환한다.
        return message;
    }
}
