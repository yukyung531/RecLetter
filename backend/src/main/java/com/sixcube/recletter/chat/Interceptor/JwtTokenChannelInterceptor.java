package com.sixcube.recletter.chat.Interceptor;

import com.sixcube.recletter.auth.jwt.JwtToUserConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class JwtTokenChannelInterceptor implements ChannelInterceptor {

    private final JwtToUserConverter jwtToUserConverter;
    private final JwtDecoder jwtDecoder;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authToken = accessor.getFirstNativeHeader("Authorization");
            System.out.println("Authorization 헤더: " + authToken);
            if (authToken != null && authToken.startsWith("Bearer ")) {
                String jwtToken = authToken.substring(7);
                try {
                    Jwt jwt = jwtDecoder.decode(jwtToken);
                    Authentication authentication = jwtToUserConverter.convert(jwt);
                    System.out.println("authentication: " + authentication);
                    accessor.setUser(authentication);
                    System.out.println("accessor: " + accessor);
                } catch (JwtException e) {
                    System.out.println("JWT 디코딩 실패: " + e.getMessage());
                    // 토큰이 유효하지 않을 경우에 대한 예외처리하기
                }
            }
        }
        return message;
    }
}
