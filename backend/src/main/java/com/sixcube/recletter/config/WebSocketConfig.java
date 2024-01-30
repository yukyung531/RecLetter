package com.sixcube.recletter.config;

import com.sixcube.recletter.chat.Interceptor.JwtTokenChannelInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@RequiredArgsConstructor
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenChannelInterceptor jwtTokenChannelInterceptor;

    // 클라이언트로부터 들어오는 메시지를 처리할 인터셉터를 설정
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(jwtTokenChannelInterceptor);
    }

    /**
     * 클라이언트가 메시지를 보낼 수 있는 endpoint 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "/topic"으로 시작하는 메시지가 메시지 브로커로 라우팅되어야 함
        // 메시지 브로커는 연결된 모든 클라이언트에게 메시지를 broadcast함
        config.enableSimpleBroker("/topic");
        // "/app"으로 시작하는 경로를 가진 메시지를 'message-handling methods', 즉 (@MessageMapping)로 라우팅함
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * websocket endpoint 등록
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // "/ws"라는 endpoint를 등록하고, 모든 도메인에서의 접근을 허용함
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
}
