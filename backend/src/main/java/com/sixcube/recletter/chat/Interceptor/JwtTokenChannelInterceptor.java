package com.sixcube.recletter.chat.Interceptor;

import com.sixcube.recletter.auth.jwt.JwtToUserConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenChannelInterceptor implements ChannelInterceptor {

    private final JwtToUserConverter jwtToUserConverter;
    private final JwtDecoder jwtDecoder; // JwtDecoder를 주입받습니다.

    @Autowired
    public JwtTokenChannelInterceptor(JwtToUserConverter jwtToUserConverter, JwtDecoder jwtDecoder) {
        this.jwtToUserConverter = jwtToUserConverter;
        this.jwtDecoder = jwtDecoder;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String authToken = accessor.getFirstNativeHeader("Authorization");
        if (authToken != null && authToken.startsWith("Bearer ")) {
            String jwtToken = authToken.substring(7);
            try {
                // JwtDecoder를 사용하여 토큰을 디코딩합니다.
                Jwt jwt = jwtDecoder.decode(jwtToken);
                // JwtToUserConverter를 사용하여 Authentication 객체를 가져옵니다.
                Authentication authentication = jwtToUserConverter.convert(jwt);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } catch (JwtException e) {
                // 토큰이 유효하지 않을 경우에 대한 처리...
                // 로깅하거나, 적절한 예외 처리를 할 수 있습니다.
            }
        }
        return message;
    }
}
