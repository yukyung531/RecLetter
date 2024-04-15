# ■ RecLetter

#### 💻 주요 코드

##### 1. WebSocket

**[Back-end]**

📌 <u>**WebSocketConfig.java**</u> 

```java
package com.sixcube.recletter.config;

...

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
```

- WebSocket 통신의 경로 설정, 메시지 브로커 설정, 클라이언트로부터 들어오는 메시지를 처리할 인터셉터 설정


<br>

📌 <u>**ChatController.java**</u> 

```java
package com.sixcube.recletter.chat.controller;

...

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatService chatService;

    private final RedisListService redisListService;

    /**
     * 채팅방에 참여하는 엔드포인트
     * @param studioId 클라이언트가 보낸 메시지의 목적지에서 추출한 스튜디오 ID.
     * @param chatMessage 클라이언트가 보낸 메시지의 본문. JSON 형태의 메시지를 ChatMessage 객체로 변환하여 전달함.
     * @param principal 현재 인증된 사용자의 정보(JwtTokenChannelInterceptor에서 인증받은 사용자의 정보).
     * @return 채팅 서비스의 joinChat 메서드가 처리한 결과. 채팅 참가 요청의 처리 결과를 ChatMessage 객체로 반환.
     */
    @MessageMapping("/chat/{studioId}/join") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/{studioId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public ChatMessage joinChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 ChatMessage 객체로 변환하여 메서드에 전달)
          */
        // 현재 인증된 사용자의 정보를 User 객체로 변환
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.joinChat(studioId, chatMessage, user);
    }

    /**
     * 메시지를 보내는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/sendMessage")
    @SendTo("/topic/{studioId}")
    public ChatMessage sendMessage(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.sendMessage(studioId, chatMessage, user);
    }

    /**
     * 채팅방 나가는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/leave")
    @SendTo("/topic/{studioId}")
    public ChatMessage leaveChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.leaveChat(studioId, chatMessage, user);
    }

    /**
     * 채팅방(스튜디오)에 현재 접속해있는 유저리스트 조회
     * @param studioId 확인할 채팅방(스튜디오)
     * @return 채팅방(스튜디오)에 현재 접속해있는 유저리스트 반환
     */
    @GetMapping("/chat/{studioId}/userList")
    public ResponseEntity<List<String>> searchChatUserList(@PathVariable String studioId) {
        String key = RedisPrefix.STUDIO.prefix() + studioId;
        List<String> userList = redisListService.getList(key);
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

}
```

<br>

📌 <u>**ChatServiceImpl.java**</u> 

```java
package com.sixcube.recletter.chat.service;

...

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final StudioRepository studioRepository;

    private final RedisListService redisListService;

    private final StudioUtil studioUtil;

    @Override
    public ChatMessage joinChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, AlreadyJoinedStudioException, ChatJoinFailureException {
        try {
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 접속 정보를 레디스에 저장
            String key = RedisPrefix.STUDIO.prefix() + studioId;
            redisListService.addValueToList(key, user.getUserNickname());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 studioId에 studioId 등록
            chatMessage.setStudioId(studioId);

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            // 참여 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 참여하였습니다.");

            // 메시지를 채팅방에 브로드캐스트한다.
            return chatMessage;
        } catch (Exception e) {
            throw new ChatJoinFailureException(e);
        }
    }

    @Override
    public ChatMessage sendMessage(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatSendMessageFailureException {
        try {
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            return chatMessage;
        } catch (Exception e) {
            throw new ChatSendMessageFailureException(e);
        }
    }

    @Override
    public ChatMessage leaveChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatLeaveFailureException {
        try {

            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 studioId에 studioId 등록
            chatMessage.setStudioId(studioId);

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            // 퇴장 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 퇴장하였습니다.");

            /* 퇴장 정보를 레디스에 저장
               redis key값에 해당 studioId가 존재하고 해당 user가 접속중이라면, 그 key의 value에 userNickname 제거
               (하나만 제거, 중복될 수 있으니까)
               redis key값에 해당 studioId가 존재하지 않는다면, 예외처리
             */
            String key = RedisPrefix.STUDIO.prefix() + studioId;
            List<String> list = redisListService.getList(key);

            if(list != null && list.contains(user.getUserNickname())) {
                // 리스트에 userNickname이 존재하면, userNickname 제거
                redisListService.removeValueFromList(key,user.getUserNickname());
            } else {
                // 리스트에 userNickname이 존재하지 않으면, 예외 발생
                throw new NoSuchElementException("The userNickname does not exist in the list");
            }

            return chatMessage;
        } catch (Exception e) {
            throw new ChatLeaveFailureException(e);
        }
    }

}
```

- `joinChat` 메소드는 채팅방에 참여하는 로직을 처리한다. 스튜디오가 존재하고, 해당 스튜디오에 사용자가 이미 참여하고 있지 않은지 확인한 후, 사용자의 참여 정보를 Redis에 저장하고, 참여 메시지를 생성하여 반환한다.
- `sendMessage` 메소드는 채팅방에서 메시지를 보내는 로직을 처리한다. 스튜디오가 존재하고, 해당 스튜디오에 사용자가 참여하고 있는지 확인한 후, 메시지를 생성하여 반환한다.
- `leaveChat` 메소드는 채팅방에서 나가는 로직을 처리한다. 스튜디오가 존재하고, 해당 스튜디오에 사용자가 참여하고 있는지 확인한 후, 사용자의 참여 정보를 Redis에서 삭제하고, 퇴장 메시지를 생성하여 반환한다.

<br>

📌 <u>**JwtTokenChannelInterceptor.java**</u> 

```java
package com.sixcube.recletter.chat.Interceptor;

...

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
```

- 웹소켓 요청을 인터셉트하여 JWT 토큰을 확인하고 해당 사용자의 인증 정보를 가져오는 역할을 함

<br>

<br>

**2. OpenVidu**

📌 <u>**MeetingController.java**</u> 

```java
package com.sixcube.recletter.meeting.controller;

...

@RestController
@RequestMapping("/meeting")
@RequiredArgsConstructor
@Slf4j
public class MeetingController {

    private final MeetingService meetingService;

    /**
     * OpenVidu 서버에 새로운 세션을 생성하는 요청을 보내는 메서드
     * 화면 공유를 할 수 있는 환경(세션)을 생성(화면 공유를 시작하려는 사용자가 실행)
     * 이 세션에 대한 연결 개체가 생성되고 해당 토큰이 클라이언트 측에 전달될 수 있으므로, 클라이언트는 이를 사용하여 세션에 연결가능
     * @param studioId 스튜디오 ID. 이 아이디는 생성될 세션의 고유 아이디로 사용됨
     * @param user 현재 인증된 사용자. 이 사용자의 아이디는 편집 중인 사용자로 세션 정보에 추가됩니다.
     * @return 세션 정보를 담은 JSON 문자열을 포함하는 ResponseEntity 객체를 반환합니다. 세션 생성에 실패하면 에러 메시지를 담은 ResponseEntity를 반환합니다.
     */
    @PostMapping("/{studioId}")
    public ResponseEntity<String> initializeSession(@PathVariable("studioId") String studioId, @AuthenticationPrincipal User user) {
        String sessionInfo = meetingService.initializeSession(studioId, user);
        return ResponseEntity.ok().body(sessionInfo);
    }

    /**
     * 세션에서 새 연결 생성(화면 공유를 시작하는 사용자 포함 화면공유 세션에 참여하려면 실행)
     * @param sessionId 세션의 ID
     * @param user      현재 인증된 사용자
     * @return 연결 정보가 포함된 ResponseEntity 객체
     */
    @PostMapping("/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
        String connectionInfo = meetingService.createConnection(sessionId, user);
        return ResponseEntity.ok().body(connectionInfo);
    }


    /**
     * 세션 종료(해당 세션의 모든 프로세스가 중지됨. 모든 연결, 스트림 및 녹음이 닫힘)
     * @param sessionId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param user 현재 인증된 사용자
     * @return 종료 성공 메시지
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
        meetingService.deleteSession(sessionId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * sessionId가 활성화되어 있는지 여부를 알려주는 메서드
     * @param sessionId
     * @return 활성화되어있다면 세션 객체를, 아니라면 false 반환
     */
    @GetMapping("/{sessionId}/exists")
    public ResponseEntity<String> checkSession(@PathVariable("sessionId") String sessionId) {
        String sessionInfo = meetingService.checkSession(sessionId);
        return ResponseEntity.ok().body(sessionInfo);
    }
}
```

<br>

📌 <u>**MeetingServiceImpl.java**</u> 

```java
package com.sixcube.recletter.meeting.service;

...

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService {

    private final StudioRepository studioRepository;

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private RestTemplate restTemplate;

    public String initializeSession(String studioId, User user) throws StudioNotFoundException, MeetingInitializeSessionFailureException {
        // 스튜디오 존재 확인
        studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // OpenVidu 서버에 직접 HTTP POST 요청 보내기
        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // 요청 본문 생성(sessionId에 studioId를, name에 userId를 넣어서 각 세션에서 편집을 시작한 유저의 정보를 편리하게 관리하고자 함)
        String requestJson = "{\"customSessionId\":\"" + studioId + "\", \"defaultRecordingProperties\": {\"name\": \"" + user.getUserId() + "\"}}";

        // HttpEntity 생성 (헤더와 본문 포함)
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        try {
            // POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL, HttpMethod.POST, entity, String.class);

            // ObjectMapper 생성(Java 객체와 JSON 사이의 변환을 담당)
            ObjectMapper mapper = new ObjectMapper();

            // 세션 객체(JSON 문자열)를 Map으로 변환(editingUserId를 세션 정보에 추가하기 위해)
            Map<String, Object> sessionInfoMap = mapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {
            });

            // 세션 정보를 JSON 문자열로 변환(HTTP 응답 본문은 문자열 형태로 전달되기 때문)
            String sessionInfo = mapper.writeValueAsString(sessionInfoMap);

            return sessionInfo;
        } catch (Exception e) {
            throw new MeetingInitializeSessionFailureException(e);
        }
    }

    public String createConnection(String sessionId, User user) throws StudioNotFoundException, MaxMeetingParticipantException, MeetingCreateConnectionFailureException {
        // 참가자 제한 수 설정
        final int PARTICIPANT_LIMIT = 6;

        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 객체를 생성하여 HTTP 요청을 보낼 준비
        restTemplate = new RestTemplate();

        // HTTP 요청 헤더를 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 객체를 생성(헤더 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 세션 정보를 가져오기 위한 GET 요청을 보냄
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // 응답받은 세션 정보의 본문 가져오기
            String sessionInfo = response.getBody();

            // JSON 문자열을 파싱하기 위해 ObjectMapper 객체를 생성
            ObjectMapper mapper = new ObjectMapper();

            // 세션 정보를 JSON 문자열에서 Map 객체로 변환
            Map<String, Object> sessionInfoMap = mapper.readValue(sessionInfo, new TypeReference<Map<String, Object>>() {
            });

            // 현재 세션의 참가자 수 가져오기
            int currentParticipantCount = (int) ((Map<String, Object>) sessionInfoMap.get("connections")).get("numberOfElements");

            // 참가자 수 제한 확인(6명이 이미 들어와있다면 들어올 수 없음)
            if (currentParticipantCount >= PARTICIPANT_LIMIT) {
                throw new MaxMeetingParticipantException();
            }

            // HttpEntity 객체를 생성(본문, 헤더 포함)
            HttpEntity<String> postEntity = new HttpEntity<>(sessionInfo, headers);

            // POST 요청 보내기
            ResponseEntity<String> postResponse = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId + "/connection", HttpMethod.POST, postEntity, String.class);

            // 응답받은 연결 정보의 본문 가져오기
            String connectionInfo = postResponse.getBody();

            // 연결 정보를 JSON 문자열에서 Map 객체로 변환
            Map<String, Object> connectionInfoMap = mapper.readValue(connectionInfo, new TypeReference<Map<String, Object>>() {
            });

            // 연결 정보에 사용자 ID 추가
            connectionInfoMap.put("joinUserId", user.getUserId());

            // 연결 정보를 JSON 문자열로 다시 변환
            connectionInfo = mapper.writeValueAsString(connectionInfoMap);

            // 연결 정보를 포함한 connetionInfo 반환
            return connectionInfo;
        } catch (Exception e) {
            throw new MeetingCreateConnectionFailureException(e);
        }
    }

    public void deleteSession(String sessionId, User user) throws StudioNotFoundException, MeetingDeleteSessionFailureException{
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 생성 (헤더 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // DELETE 요청 보내기
            restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.DELETE, entity, String.class);
        } catch (Exception e) {
            throw new MeetingDeleteSessionFailureException(e);
        }
    }

    public String checkSession(String sessionId) throws StudioNotFoundException, MeetingCheckSessionFailureException {
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 생성 (헤더 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 해당 세션 정보를 가져오기 위한 GET 요청을 보냄
            log.info("openvidu_url: " + OPENVIDU_URL);
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // HTTP 상태 코드가 200이면 세션 ID가 활성화되어 있으므로, 세션 객체를 반환
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }

        } catch (HttpClientErrorException e) {
            // HTTP 상태 코드가 404이면 세션 ID가 존재하지 않음
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return "no exists";
            } else throw new MeetingCheckSessionFailureException(e);
        }

        return "no exists";
    }
}
```

- OpenVidu의 기본 기능을 활용하여 커스텀하였음
  - 세션 생성 시, 스튜디오 ID를 세션 ID로 사용하고, 사용자 ID를 녹화 이름으로 사용하여 각 세션에서 편집을 시작한 사용자의 정보를 편리하게 관리.
  - 연결 생성 시, 세션 참가자 수를 제한하여 최대 6명까지만 참가할 수 있도록 하였음.

<br>

---

## 🙋🏻‍♀️ 마무리

<br>

### 🔹어려웠던 점(원인, 해결, 느낀점)

#### 1. (인터셉터를 만들기 전에는) 로그인한 유저의 정보를 가져올 수 없어서 계속 user가 null로 뜬다.

- **원인:**

  - **HTTP 세션과 WebSocket 세션 간의 차이점** 때문에 발생

  - HTTP와 WebSocket은 모두 인터넷 프로토콜이지만, 두 프로토콜은 다른 목적과 기능을 가지고 있다.

    - HTTP는 요청-응답 모델을 기반으로 하는데, 이는 클라이언트가 서버에 요청을 보내면 서버가 응답을 반환하는 방식.
    - WebSocket은 풀 더플렉스(full-duplex) 통신을 가능하게 하는 프로토콜로, 클라이언트와 서버 간에 양방향 통신이 가능.

    ⇒ 이 때문에 HTTP와 WebSocket은 각각 독립적인 보안 체인(security chain)과 설정(config)을 가지게 된다. 즉, **HTTP 요청을 처리하는 과정에서 인증된 사용자의 정보가 HTTP 세션에 저장되더라도, 이 정보는 WebSocket 세션에서는 사용할 수 없다.**

  - 따라서, WebSocket 통신에서 인증된 사용자의 정보를 사용하려면 별도의 처리가 필요하다. 이를 위해 사용하는 것이 **인터셉터**입니다.

    **인터셉터는 메시지가 전송되기 전에 해당 메시지를 가로채서 필요한 처리를 수행할 수 있게 해준다.**

- **해결:**

  - 인터셉터를 만들어 해결하였다.

    1. `JwtTokenChannelInterceptor`

       WebSocket 연결 요청인 CONNECT 메시지를 가로채서, 이 메시지의 헤더에서 JWT 토큰을 추출하고 이 토큰을 디코딩하여 사용자 정보를 얻는 역할을 한다. 그리고 이 정보를 WebSocket 세션에 저장하여, 이후 WebSocket 통신에서도 이 정보를 사용할 수 있도록 한다.

       ⇒ WebSocket 세션에서도 인증된 사용자의 정보를 사용할 수 있게 되어, 사용자 인증이 필요한 WebSocket 통신을 보안적으로 안전하게 처리할 수 있다.

       ⇒ `HandshakeInterceptor` 가 아니라 `ChannelInterceptor` 를 사용한 이유

       - `HandshakeInterceptor`:

         이 인터페이스는 **WebSocket 핸드셰이크 단계에서 사용된다**. 핸드셰이크는 클라이언트와 서버가 WebSocket 연결을 시작할 때 진행하는 과정으로, 이 시점에서 어떤 동작을 수행하려면 `HandshakeInterceptor`를 사용한다.

         예를 들어, **클라이언트의 IP 주소를 로깅하거나, 특정 조건을 만족하지 않는 클라이언트의 연결 요청을 거부하는 등의 작업**을 수행할 수 있다.

       - `ChannelInterceptor`:

         이 인터페이스는 **WebSocket 메시지가 전송되는 채널에서 사용된다**. 즉, 연결이 완료된 후 클라이언트와 서버 간에 메시지를 주고받는 동안 어떤 동작을 수행하려면 `ChannelInterceptor`를 사용한다.

         예를 들어, **메시지 헤더에 있는 토큰을 검증하거나, 메시지의 내용을 수정하는 등의 작업**을 수행할 수 있습니다.

       ⇒ 따라서, JWT 토큰을 검증하고 **인증된 사용자의 정보를 WebSocket 세션에 저장하는 작업은 메시지 전송 동안 수행되어야 하므로**, `ChannelInterceptor`를 사용하는 것이다.

       이렇게 하면 연결이 완료된 후에도 **클라이언트와 서버 간의 모든 메시지에 대해 인터셉터가 동작하므로, 보다 안전하고 효율적인 인증 처리가 가능**하다.

    2. WebSocketConfig 에서 사용할 인터셉터를 적용하도록 설정

    3. ChatController 에서 인증된 사용자 정보 가져오기

- **느낀점**:

  - front 의 chat 기능 코드가 완성되기 전까지는 테스트를 해볼 수 없던 부분이라서 chat기능을 다 완성했다고 생각하고 있다가 수정해야 하는 상황을 맞닥뜨렸다.

    - 나중에 알고보니 postman으로도 websocket을 테스트할 수 있는 방법이 있는 듯했다.

  - 생각지도 못했던 문제였어서 당황했지만, 인터넷의 여러 자료들과 공식문서를 확인하며 겨우겨우 인터셉터를 완성했다.

  - 여러 자료를 찾아보니까, 이 문제를 해결하는 방법에도 여러가지가 있는 듯해서 우리 프로젝트에는 어떤 것을 적용해야 할지 헷갈렸다.

    현재 버전에서 문제를 해결한 자료들이 많지 않아서 자료들을 찾아보는 데에 시간을 많이 소비하였다.

- OpenVidu를 처음 접해봐서 서버단에서 OpenVidu를 사용하는 방법을 잘 몰라서 어려움을 겪었다.
  - 우선 튜토리얼을 따라해보았지만 도대체 서버단에서는 어떻게 하는지 알 수 없었다. 그래서 공식문서를 더 읽어보고, 다른 github을 참고하고, 구글링하며 서버단에서 직접 요청을 보내는 방법을 알아냈다. 
- WebSocket을 처음 사용해봐서 WebSocket 실행 과정을 이해하고 적용하는 데 시행착오가 있었다.
  - 여러 참고자료들을 보았는데, 자료들마다 다른 부분이 많아서 나의 프로젝트에 적용하는 방법을 찾는 데 시간이 걸렸다. 알고 보니 여러 방법이 있었을 뿐이고, 방법은 거의 유사한 것들이었다.

<br>

### 🔹아쉬운 점

- WebSocket과 OpenVidu를 담당했는데, 이 기능들에는 JPA를 별로 사용하지 않았다. JPA를 제대로 사용해보고 싶었는데, 그러지 못해서 아쉬웠다. 

<br>

### 🔹느낀 점

- 이번 프로젝트를 하면서 새로운 기술들을 많이 접해봐서 재미있었다! 내 역할이었던 WebSocket, OpenVidu는 물론이고,

  redis, S3, OAuth2.0 등을 접해볼 수 있어서 너무 좋았다. 물론 아직 완벽하게 이해했다고 말하기는 어렵지만, 이렇게 다양한 것들을 접해보고 나니 조금 자신감이 생긴 기분이다. 

  이번 프로젝트를 하면서 처음으로 JPA를 공부하고 사용해보았는데, 내 역할에서는 사용할 일이 많지 않아서 아쉬웠다. 다음 프로젝트를 할 때에는 더 공부해서 JPA를 제대로 사용해보고 싶다.

  로그인 관련 로직을 보니까 복잡하고 어려워보였지만 재미있을 것 같았다. 다음 프로젝트를 할 때는 로그인을 담당해서 Spring Security, jwt토큰, oauth2.0을 사용한 로그인을 구현해내는 것이 나의 목표이다!

- 이번 프로젝트를 진행하면서 디자인 부분에 많이 참여하였다. 생각보다 디자인하는 것도 재미있음을 느꼈다. 팀원들이 내가 디자인한 것을 보고 칭찬해주는 것에 뿌듯함을 느꼈다. 다음 프로젝트에서도 여유가 된다면 디자인에 적극적으로 참여하고 싶다.

- 이번 프로젝트에서 최종 발표를 맡게 되었다. 평소에 발표하는 것을 즐기지 않는 나로서는 달갑지 않았지만, 내가 맡게 된 역할이기에 열심히 연습하였다. 대본을 보지 않고 발표하는 것을 목표로, 발표자료를 보면서 시간을 재며 계속 연습하였다. 결국 우리조는 '우수상'이라는 좋은 결과를 받게 되어 뿌듯했다. 발표를 무서운 것이라고 생각했던 나에게는 아직도 여전히 발표는 많이 떨리지만,  발표에 대해 전보다 긍정적인 생각을 갖게 되었다.

- 팀원들이 누구하나 열심히 안 하는 팀원이 없어서 열심히 하는 분위기가 형성되어서 너무 좋았다. 힘들고 지칠 때도 옆에 팀원이 열심히 하고 있는 모습을 보면 나도 다시 힘내서 하게 되었다. 모두가 열심히 해서 우리의 프로젝트도 성공적으로 마칠 수 있었다. 좋은 팀원들을 만나는 것이 프로젝트 결과에 큰 영향을 끼친다는 것을 몸소 느낄 수 있었다.

<br>
