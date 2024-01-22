package com.sixcube.recletter.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * 클라이언트가 메시지를 보낼 수 있는 endpoint 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // "/app"으로 시작하는 경로를 가진 메시지를 'message-handling methods', 즉 (@MessageMapping)로 라우팅함
        config.setApplicationDestinationPrefixes("/app");
        // "/topic"으로 시작하는 메시지가 메시지 브로커로 라우팅되어야 함
        // 메시지 브로커는 연결된 모든 클라이언트에게 메시지를 broadcast함
        config.enableSimpleBroker("/topic");
    }

    /**
     * websocket endpoint 등록
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // "/ws"라는 endpoint를 등록하고, 모든 도메인에서의 접근을 허용함
        // SockJS는 WebSocket을 지원하지 않는 브라우저에 대한 대안을 제공함
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}
