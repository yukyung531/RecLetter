# RecLetter Porting Manual

## 개발환경
- IntelliJ IDEA 2023.3 Community
- openjdk 17.0.2 2022-01-18
  - Spring Boot: 3.2.1
- nodeJS 18.19
  - React: 18.2.0
- python 3.11.7
  - FastAPI: 0.109.2
- AWS EC2 Ubuntu 20.04.6 LTS (GNU/Linux 5.15.0-1051-aws x86_64)
---
## EC2 설정
### 서버 시간 변경
```
sudo timedatectl set-timezone Asia/Seoul
```

### 미러서버 변경
```
sudo sed -i 's/ap-northeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list
```

### 패키지 목록 업데이트 및 패키지 업데이트
```
sudo apt-get -y update && sudo apt-get -y upgrade
```

### Swap 영역 할당
```
sudo mkswap /swapfile
```
```
sudo chmod 600 /swapfile
```
```
sudo fallocate -l 4G /swapfile
```
```
sudo swapon /swapfile
```
```
sudo echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```


---

## AWS S3 설정
### 버킷 만들기
### 버킷 이름 및 리전 설정
### 객체 소유권 지정
### IAM 사용자 생성
### IAM 사용자 Access Key 생성

---

## Docker
### Docker 설치전 필요 패키지 설치
```
sudo apt-get -y install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

### GPC Key 인증
```
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```
### apt 명령어에 Docker repository 등록
```
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### 패키지 리스트 갱신
```
sudo apt-get -y update
```

### Docker 패키지 설치
```
sudo apt-get -y install docker-ce docker-ce-cli containerd.io
```
### Docker Compose 설치
```
sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```
```
sudo chmod +x /usr/local/bin/docker-compose
```
---

## Jenkins
### Jenkins 컨테이너 생성
```
docker pull jenkins/jenkins:jdk17
```

```
docker run -d --restart always --env JENKINS_OPTS=--httpPort=8080 -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul -p 8080:8080 -v /jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose --name jenkins -u root jenkins/jenkins:jdk17
```
### Jenkins 플러그인 미러서버 변경
```
sudo docker stop jenkins
```

```
sudo mkdir /jenkins/update-center-rootCAs
```

```
sudo wget https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/rootCA/update-center.crt -O /jenkins/update-center-rootCAs/update-center.crt
```

```
sudo sed -i 's#https://updates.jenkins.io/update-center.json#https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tencent/update-center.json#' /jenkins/hudson.model.UpdateCenter.xml
```

```
sudo docker restart jenkins
```

### 첫 젠킨스 접근
```
docker exec -it jenkins /bin/bash
```

```
cd /var/jenkins_home/secrets
```

```
cat initialAdminPassword
```

- 위의 명령어를 통해 초기 비밀번호를 확인 후 localhost:8080으로 접속하여 사용

### Jenkins 기본 플러그인 설치
- Install suggested plugins 사용
- 
### 관리자 계정 설정
- 주어진 입력 폼에 맞춰 관리자 계정 생성

### Jenkins 내부에 Docker, Docker Compose 설치
```
docker exec -it jenkins /bin/bash
```

```
apt-get update && apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" && apt-get update && apt-get -y install docker-ce
```

```
groupadd -f docker
```

```
usermod -aG docker jenkins
```

```
chown root:docker /var/run/docker.sock
```

```
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

### 추가 플러그인 설치 목록
```
SSH Agent

Docker
Docker Commons
Docker Pipeline
Docker API

Generic Webhook Trigger

GitLab
GitLab API
GitLab Authentication
GitHub Authentication

NodeJS
Gradle
```

### Credential 설정
#### GitLab Credential
- 사용할 gitlab에 접근하기 위한 계정 정보
- Kind : Username with password 선택
- Username : Gitlab 계정 아이디 입력
- Password : Gitlab 계정 비밀번호 입력 **(토큰 발행시, API 토큰 입력)**
- ID : Credential을 구분하기 위한 별칭

#### GitLab API Token
- GitLab이 제공하는 API를 사용하기 위한 토큰
- Kind : Gitlab API token 선택
- API tokens : Gitlab 계정 토큰 입력
  - 사용하는 gitlab repo > settings > AccessTokens > Add new Tokens 을 통해 생성
- ID : Credential을 구분하기 위한 별칭

#### Webhook
- Jenkins에서 Jenkins 관리 > System > GitLab
  - Enable authentication for '/project' end-point 체크
  - Name: 해당 연결에 대한 이름 지정
  - GitLab host URL: 사용하는 repo의 host URL. SSAFY 기준 https://lab.ssafy.com
  - Credentials: 위에서 설정한 GitLab API Token ID
  - Test Connetion을 통해 확인후 저장
- 사용할 Pipeline 생성 후 build trigger 설정
  - pipeline > configure > General > Build Triggers
  - Build when a change is pushed to Gitlab 체크
  - Push Events 체크
  - Opened Merge Request Events 체크
  - Approved Merge Request (EE-only) 체크
  - Comments 체크
  - 하단 고급 > Secret token Generate 후 복사
- Gitlab repo > Settings > Webhooks > Add new webhook
  - URL: http://(젠킨스주소)/project/(pipeline 이름)
  - Secret Token: 위에서 저장한 secret token

#### Docker Hub Token
- docker hub 계정 생성
- 우측 상단 계정명 > Account Settings
- Security > New Access Token
  - 모든 Access 권한을 지정한 후 Generate후 복사
- Jenkins 관리 > Credentials
  - Kind : Username with password
  - Username : DockerHub에서 사용하는 계정 아이디 입력
  - Password : 위에서 저장한 Access Token 입력
  - ID : Credential을 구분하기 위한 별칭

#### Docker Hub Repository 생성
- frontend, backend, videobackend 를 저장할 public Repository 3개 생성

#### Ubuntu Credential 추가
- Jenkins 관리 > Credentials
  - Kind: SSH Username with private key
  - Username: SSH 원격 서버 호스트에서 사용하는 계정명
  - ID: Credential을 구분하기 위한 별칭
  - Enter directly를 체크하고 private key의 값 입력후 create

#### Secret File 추가
- 아래에 설명할 .env 와 cloudfront key 저장
- Jenkins 관리 > Credentials
  - Kind: Secret file
  - File: 저장할 파일 선택

#### .env
- 배포용 .env 파일.
```
DB_NAME=[DB 이름]
USER_NAME=[DB 사용자 이름]
USER_PASSWORD=[DB 비밀번호]
DB_URL=[DB URL]
DB_ROOT_PASSWORD=[DB 생성시 사용할 Root 비밀번호]

AWS_ACCESS=[AWS S3 Access Key]
AWS_SECRET=[AWS S3 Secret Key]
AWS_REGION=[AWS S3 Region]
AWS_BUCKET=[AWS S3 Bucket 이름]
AWS_FRONT=[AWS Cloud Front 주소]https://d3f9xm3snzk3an.cloudfront.net/
AWS_CLOUDFRONT_DOMAIN=d3kbsbmyfcnq5r.cloudfront.net
AWS_CLOUDFRONT_KEY=/private_cloudfront_key.pem
AWS_CLOUDFRONT_KEY_ID=K1AEDSJBCGMMS2
SPRING_SERVER_URL=http://RecLetterBackend

MAIL_ID=recletter.official@gmail.com
MAIL_SECRET=leuz rhvx vumw cvdt

JWT_KEY=vmfhaltmskdlstkfkdgodyroqkfwkdbalroqkfwkdbalaaaaabae3yjrdnafdalh2tnjkxzgjsafq

REDIS_HOST=RecLetterRedis
REDIS_PORT=6379

OPENVIDU_URL=https://recletter.me/openvidu/api/sessions
OPENVIDU_SECRET=dk34r0gd5id9s92u5udis1dfc

GOOGLE_CLIENT_ID=637985286518-ncq70na9pkq4lela9io03ms46l4no9sq.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REDIRECT_URL=https://recletter.me/login/oauth2/code/google

VITE_REACT_GOOGLE_LOGIN_URL=api/oauth2/authorization/google
VITE_REACT_GOOGLE_CHANGE_HOST=https://recletter.me/api
VITE_REACT_GOOGLE_PROTOCOL=https
VITE_REACT_API_URL=https://recletter.me
VITE_REACT_WEBSOCKET_URL=wss://recletter.me/ws

DOMAIN_OR_PUBLIC_IP=recletter.me
CERTIFICATE_TYPE=letsencrypt
LETSENCRYPT_EMAIL=recletter.official@gmail.com

OPENVIDU_RECORDING=false
OPENVIDU_RECORDING_DEBUG=false
OPENVIDU_RECORDING_PATH=/opt/openvidu/recordings
OPENVIDU_RECORDING_CUSTOM_LAYOUT=/opt/openvidu/custom-layout
OPENVIDU_RECORDING_PUBLIC_ACCESS=false
OPENVIDU_RECORDING_NOTIFICATION=publisher_moderator
OPENVIDU_RECORDING_AUTOSTOP_TIMEOUT=120
OPENVIDU_STREAMS_VIDEO_MAX_RECV_BANDWIDTH=1000
OPENVIDU_STREAMS_VIDEO_MIN_RECV_BANDWIDTH=300
OPENVIDU_STREAMS_VIDEO_MAX_SEND_BANDWIDTH=1000
OPENVIDU_STREAMS_VIDEO_MIN_SEND_BANDWIDTH=300
OPENVIDU_WEBHOOK=false
OPENVIDU_WEBHOOK_EVENTS=[sessionCreated,sessionDestroyed,participantJoined,participantLeft,webrtcConnectionCreated,webrtcConnectionDestroyed,recordingStatusChanged,filterEventDispatched,mediaNodeStatusChanged,nodeCrashed,nodeRecovered,broadcastStarted,broadcastStopped]
OPENVIDU_SESSIONS_GARBAGE_INTERVAL=900
OPENVIDU_SESSIONS_GARBAGE_THRESHOLD=3600
OPENVIDU_CDR=false
OPENVIDU_CDR_PATH=/opt/openvidu/cdr

KAFKA_BOOTSTRAP_SERVERS=RecLetterKafka:9093
KAFKA_LETTER_REQUEST_TOPIC=recletterbackend.letter.request
KAFKA_ASSET_DOWNLOADINFO_TOPIC=reclettervideo.asset.downloadinfo
KAFKA_LETTER_ENCODINGINFO_TOPIC=reclettervideo.letter.encodinginfo
KAFKA_LETTER_RESULTINFO_TOPIC=reclettervideo.letter.resultinfo

KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID=DownlaodAsset
KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID=EncodeVideo
KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID=UploadVideo
KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID=UpdateStudioStatus
KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID=DeleteVideo
RECLETTER_VIDEO_PORT_1=8001
RECLETTER_VIDEO_PORT_2=8002
RECLETTER_VIDEO_PORT_3=8003

```
### 파이프라인 설정

---

## openvidu
### on-premise CE 버전 설치
### 기본 app 제거
### RecLetter front/backend 설정
#### docker-compose.override.yml
### DB, Kafka 설정
#### docker-compose-db.yml

---

## SMTP용 계정 설정

---

## GOOGLE OAUTH2 사용을 위한 설정

---

## 실행

---

## 시연 시나리오
### 일반 회원가입
#### 이메일 인증
#### 제약 조건
### 일반 로그인
### 구글 회원가입
### 구글 로그인
### 스튜디오 생성
#### 제목 설정
#### 기한 설정
#### 프레임 설정
### 스튜디오 초대
### 채팅
### 클립 생성
#### 녹화
#### 클립 이름 설정
#### 저장할 클립 선택
#### 클립 길이 편집
#### 클립 저장
### 영상 편지 편집
#### 화면 공유
#### 클립 설정
##### 클립 순서 결정
##### 개별 클립 볼륨 조절
#### 프레임 변경
#### BGM 설정
##### BGM 볼륨 조절
#### 스티커 설정
##### 스티커 사이즈 조절
##### 스티커 각도 조절
##### 스티커 붙이기
##### 커스텀 스티커 이미지 업로드
##### 텍스트 스티커
##### 텍스트 스타일 설정
#### 영상 편지 완성
##### 완성된 영상 편지 공유
##### 완성된 영상 편지 다운로드