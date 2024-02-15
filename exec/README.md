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
- 아래에 설명할 .env 와 cloud front에서 발급받은 cloudfront key 저장
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
AWS_CLOUDFRONT_DOMAIN=[AWS Cloud Front 도메인 주소]
AWS_CLOUDFRONT_KEY=[AWS Cloud Front private key 경로]
AWS_CLOUDFRONT_KEY_ID=[AWS Cloud Front Key Id]

MAIL_ID=[SMTP에 사용할 메일 주소]
MAIL_SECRET=[SMTP 메일 Secret key]

JWT_KEY=[JWT 서명에 사용할 임의의 키]

REDIS_HOST=[배포 환경에서의 Redis 주소]
REDIS_PORT=[배포 환경에서의 Redis 포트번호]

OPENVIDU_URL=[openvidu rest api 요청을 넣을 주소, ex) (도메인주소)/api/sessions]
OPENVIDU_SECRET=[openvidu secret key]

GOOGLE_CLIENT_ID=[Google OAuth2 client id]
GOOGLE_CLIENT_SECRET=[Google OAuth2 client secret]
GOOGLE_REDIRECT_URL=[Google OAuth2 redirect url, ex) (도메인)/login/oauth2/code/goole]

VITE_REACT_GOOGLE_LOGIN_URL=[login axios 요청에 사용할 url, ex) api/oauth2/authorization/google]
VITE_REACT_GOOGLE_CHANGE_HOST=[google 로그인 서버용 url, ex) https://recletter.me/api]
VITE_REACT_GOOGLE_PROTOCOL=[요청 프로토콜, ex) https]
VITE_REACT_API_URL=[backend api 요청 url, ex) https://recletter.me]
VITE_REACT_WEBSOCKET_URL=[웹소켓 Handshake를 위한 url, ex) wss://recletter.me/ws]

DOMAIN_OR_PUBLIC_IP=[소유한 도메인, ex) recletter.me]
CERTIFICATE_TYPE=[SSL 인증 방식, ex) letsencrypt]
LETSENCRYPT_EMAIL=[letsencrypt에 사용할 email 주소, ex) recletter.official@gmail.com]

# openvidu 기본 설정값
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

KAFKA_BOOTSTRAP_SERVERS=[Kafka bootstrap url]
KAFKA_LETTER_REQUEST_TOPIC=[영상 제작 요청 topic 이름, ex) recletterbackend.letter.request]
KAFKA_ASSET_DOWNLOADINFO_TOPIC=[영상 제작에 필요한 에셋 다운로드 완료 topic, ex) reclettervideo.asset.downloadinfo]
KAFKA_LETTER_ENCODINGINFO_TOPIC=[인코딩 완료 topic, ex) reclettervideo.letter.encodinginfo]
KAFKA_LETTER_RESULTINFO_TOPIC=[영상 제작 결과 topic, ex) reclettervideo.letter.resultinfo]

KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID=[영상 제작 요청 topic을 소비하는 consumer group id, ex) DownlaodAsset]
KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID=[영상 제작에 필요한 에셋 다운로드 topic을 소비하여 인코딩을 시작하는 consumer group id, ex) EncodeVideo]
KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID=[인코딩 완료 topic을 소비하여 업로드하는 consumer group id, ex) UploadVideo]
KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID=[영상 제작 결과 toipic을 소비하여 결과를 업데이트하는 consumer group id, ex) UpdateStudioStatus]
KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID=[영상 제작 결과 topic을 소비하여 남은 에셋을 삭제하는 consumer group id, ex) DeleteVideo]
RECLETTER_VIDEO_PORT_1=[video 서버 1 포트 번호, ex) 8001]
RECLETTER_VIDEO_PORT_2=[video 서버 2 포트 번호, ex) 8002]
RECLETTER_VIDEO_PORT_3=[video 서버 3 포트 번호, ex) 8003]
```
---

### 빌드용 tools 설정
- Jenkins > Jenkins 관리 > Tools
- > Gradle installations > Add Gradle
  - name: Tool을 구분하기 위한 별칭
  - version: backend에서 사용중인 Gradle version
- > NodeJS installations > Add NodeJS
  - name: Tool을 구분하기 위한 별칭
  - version: frontend에서 사용중인 NodeJs version

---

### 파이프라인 설정
```
pipeline {
    agent any
    
    environment {
        frontendImageName = [frontend docker hub repository 이름, ex) "ssuyas/recletter_frontend"]
        backendImageName = [backend docker hub repository 이름, ex) "ssuyas/recletter_backend"]
        videoBackendImageName = [video backend docker hub repository 이름, ex) "ssuyas/recletter_video"]
        registryCredential = [docker credential id, ex) 'jenkins_docker']
        
        releaseServerAccount = [ssh 계정명, ex), 'ubuntu']
        releaseServerUri = [ssh 접속 uri, ex) 'i00a000.p.ssafy.io']
    }
    
    tools {
        gradle [gradle tool name, ex) "gradle8.5"]
        nodejs [nodejs tool name, ex) "nodejs18.19"]
    }
        
    stages {
        stage('Git Clone') {
            steps {
                git branch: [배포에 사용할 branch 이름, ex) 'master'],
                    credentialsId: [Gitlab Credential Id, ex) 'treamor_gitlab'],
                    url: [Gitlab url, ex) 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12A606']
            }
        }
        stage('Jar Build') {
            steps {
                dir ([repository 내 backend 프로젝트 root directory, ex) 'backend']) {
                    sh 'gradle clean bootjar'
                }
            }
        }
        stage('Backend Image Build & DockerHub Push') {
            steps {
                dir([repository 내 backend 프로젝트 root directory, ex) 'backend']) {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $backendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $backendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        stage('Node Build') {
            steps {
                dir ([repository 내 frontend 프로젝트 root directory, ex) 'frontend']) {
                    withCredentials([file(credentialsId: [.env secret file id, ex) 'dotenv'], variable: 'dotenv')]) {
                        sh 'cp ${dotenv} .'
                        sh 'npm add @rollup/rollup-linux-x64-gnu'
                        sh 'npm add @esbuild/linux-x64 --omit=optional'
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }
        stage('Front Image Build & DockerHub Push') {
            steps {
                dir([repository 내 frontend 프로젝트 root directory, ex) 'frontend']) {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $frontendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64,linux/arm64 -t $frontendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        stage('Video Backend Image Build & DockerHub Push') {
            steps {
                dir([repository 내 videobackend 프로젝트 root directory, ex) 'videobackend']) {
                    script {
                        docker.withRegistry('', registryCredential) {
                            sh "docker buildx create --use --name mybuilder"
                            sh "docker buildx build --platform linux/amd64 -t $videoBackendImageName:$BUILD_NUMBER --push ."
                            sh "docker buildx build --platform linux/amd64 -t $videoBackendImageName:latest --push ."
                        }
                    }
                }
            }
        }
        stage("Copy SQL To Server") {
            steps {
                dir([repository 내 backend 프로젝트 root directory, ex) 'backend']) {
                    sshagent(credentials: [[ubuntu credential id, ex) 'ubuntu_a606']]) {
                    sh '''
                    scp -r ./db/initdb.d $releaseServerAccount@$releaseServerUri:/opt/openvidu/
                    '''
                    }
                }
            }
        }
        stage('Copy .env To Server') {
            steps {
                dir([repository 내 backend 프로젝트 root directory, ex) 'backend']) {
                    withCredentials([file(credentialsId: [.env secret file id, ex) 'dotenv'], variable: 'dotenv')]) {
                        sshagent(credentials: [[ubuntu credential id, ex) 'ubuntu_a606']]) {
                            sh 'scp -r ${dotenv}  $releaseServerAccount@$releaseServerUri:/opt/openvidu/.env'
                        }
                    }
                }
            }
        }
        stage('Copy Cloud Front Key To Server') {
            steps {
                withCredentials([file(credentialsId: [cloud front secret file id, ex) 'cloudfront_key'], variable: 'key')]) {
                    sshagent(credentials: [[ubuntu credential id, ex) 'ubuntu_a606']]) {
                        sh 'scp -r ${key}  $releaseServerAccount@$releaseServerUri:/opt/openvidu/private_cloudfront_key.pem'
                    }
                }
            }
        }
        stage('Service Stop') {
            steps {
                script {
                    sshagent(credentials: [[ubuntu credential id, ex) 'ubuntu_a606']]) {
                    // sh '''
                    // ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker-compose down"
                    // ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $frontendImageName:latest"
                    // ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd app; sudo docker rmi $backendImageName:latest"
                    // '''
                    sh 'ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd /opt/openvidu; sudo ./openvidu stop; sudo docker-compose -f docker-compose.yml down; sudo docker rmi $frontendImageName:latest; sudo docker rmi $backendImageName:latest; sudo docker rmi $videoBackendImageName:latest"'
                    }
                }
            }
        }
        stage('Service Start') {
            steps {
                script {
                    sshagent(credentials: [[ubuntu credential id, ex) 'ubuntu_a606']]) {
                        sh '''
                            ssh -o StrictHostKeyChecking=no $releaseServerAccount@$releaseServerUri "cd /opt/openvidu; sudo docker-compose up -d"
                        '''
                    }
                }
            }
        }
    }
}
```

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