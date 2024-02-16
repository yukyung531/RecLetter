# RecLetter Porting Manual

- [RecLetter Porting Manual](#recletter-porting-manual)
  * [개발환경](#----)
  * [EC2 설정](#ec2---)
    + [서버 시간 변경](#--------)
    + [미러서버 변경](#-------)
    + [패키지 목록 업데이트 및 패키지 업데이트](#----------------------)
    + [Swap 영역 할당](#swap------)

[//]: # (  * [AWS S3 설정]&#40;#aws-s3---&#41;)

[//]: # (    + [버킷 만들기]&#40;#------&#41;)

[//]: # (    + [버킷 이름 및 리전 설정]&#40;#-------------&#41;)

[//]: # (    + [객체 소유권 지정]&#40;#---------&#41;)

[//]: # (    + [IAM 사용자 생성]&#40;#iam-------&#41;)

[//]: # (    + [IAM 사용자 Access Key 생성]&#40;#iam-----access-key---&#41;)
  * [Docker](#docker)
    + [Docker 설치전 필요 패키지 설치](#docker--------------)
    + [GPC Key 인증](#gpc-key---)
    + [apt 명령어에 Docker repository 등록](#apt------docker-repository---)
    + [패키지 리스트 갱신](#----------)
    + [Docker 패키지 설치](#docker-------)
    + [Docker Compose 설치](#docker-compose---)
  * [Jenkins](#jenkins)
    + [Jenkins 컨테이너 생성](#jenkins--------)
    + [Jenkins 플러그인 미러서버 변경](#jenkins-------------)
    + [첫 젠킨스 접근](#--------)
    + [Jenkins 기본 플러그인 설치](#jenkins-----------)
    + [관리자 계정 설정](#---------)
    + [Jenkins 내부에 Docker, Docker Compose 설치](#jenkins-----docker--docker-compose---)
    + [추가 플러그인 설치 목록](#-------------)
    + [Credential 설정](#credential---)
      - [GitLab Credential](#gitlab-credential)
      - [GitLab API Token](#gitlab-api-token)
      - [Webhook](#webhook)
      - [Docker Hub Token](#docker-hub-token)
      - [Docker Hub Repository 생성](#docker-hub-repository---)
      - [Ubuntu Credential 추가](#ubuntu-credential---)
      - [Secret File 추가](#secret-file---)
      - [.env](#env)
    + [빌드용 tools 설정](#----tools---)
    + [파이프라인 설정](#--------)
  * [실행](#--)
    + [SMTP용 계정 설정](#smtp-------)
    + [Google OAuth2 사용을 위한 설정](#google-oauth2----------)
    + [openvidu](#openvidu)
      - [openvidu on-premise CE 버전 설치](#openvidu-on-premise-ce------)
    + [docker network 생성](#docker-network---)
    + [DB, Kafka 설정](#db--kafka---)
      - [docker-compose-db.yml](#docker-compose-dbyml)
    + [기본 app 제거](#---app---)
      - [docker-compose.override.yml](#docker-composeoverrideyml)
  * [실행](#---1)
    + [빌드 없이 실행](#--------)
    + [CI/CD 실행](#ci-cd---)
  * [시연 시나리오](#시연_시나리오)

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


[//]: # (---)

[//]: # (## AWS S3 설정)

[//]: # (### 버킷 만들기)

[//]: # (### 버킷 이름 및 리전 설정)

[//]: # (### 객체 소유권 지정)

[//]: # (### IAM 사용자 생성)

[//]: # (### IAM 사용자 Access Key 생성)

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

JWT_KEY=[JWT 서명에 사용할 임의의 키. 256bit(32Byte)이상의 임의의 문자열]

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

## 실행

### SMTP용 계정 설정
- **메일을 발송할 계정으로 구글 로그인**

  → .env의 `MAIL_ID`

- **‘계정’ 클릭**
  
  <img width="700" alt="image" src="/exec/image/Untitled.png" style="border: 1px solid darkgray;">

- **(2단계 인증이 되어 있지 않은 경우) 보안 탭 → 2단계 인증 진행**
- 
  <img width="700" alt="image" src="/exec/image/Untitled 1.png" style="border: 1px solid darkgray;">

- **검색창에 ‘앱 비밀번호’ 검색 후 클릭**
- 
  <img width="700" alt="image" src="/exec/image/Untitled 2.png" style="border: 1px solid darkgray;">

- **앱 이름 입력 후 ‘만들기’ 버튼 클릭**

  <img width="700" alt="image" src="/exec/image/Untitled 3.png" style="border: 1px solid darkgray;">
  
- **생성된 앱 비밀번호 별도 저장 (재확인 불가)**

  → .env의 `MAIL_SECRET`

  <img width="700" alt="image" src="/exec/image/Untitled 4.png" style="border: 1px solid darkgray;">
  
- **구글 Gmail → 설정(우측 상단 톱니바퀴 아이콘 클릭) → 모든 설정 보기**
- **‘전달 및 POP/IMAP’ 탭 → 아래와 같이 설정 → 변경사항 저장 클릭**

  <img width="700" alt="image" src="/exec/image/Untitled 5.png" style="border: 1px solid darkgray;">

### Google OAuth2 사용을 위한 설정

- [https://cloud.google.com/](https://cloud.google.com/) 접속 및 로그인
- 우측 상단 ‘콘솔’ 클릭
- 프로젝트 선택 → 새 프로젝트 → 만들기

  <img width="700" alt="image" src="/exec/image/Untitled 6.png" style="border: 1px solid darkgray;">

- 생성한 프로젝트 선택
- API 및 서비스 > 사용자 인증 정보 > 사용자 인증 정보 만들기 > OAuth 클라이언트 ID > 동의 화면 구성

  <img width="700" alt="image" src="/exec/image/Untitled 7.png" style="border: 1px solid darkgray;">
  
  .

  <img width="800" alt="image" src="/exec/image/Untitled 8.png" style="border: 1px solid darkgray;">
  
- User Type은 ‘외부’ 선택 후 ‘만들기’ 클릭

  <img width="700" alt="image" src="/exec/image/Untitled 9.png" style="border: 1px solid darkgray;">
  

- [OAuth 동의 화면]
  - 앱 이름, 사용자 지원 이메일, 앱 도메인, 개발자 연락처 정보 입력 후 ‘저장 후 계속’ 버튼 클릭

    <img width="700" alt="image" src="/exec/image/Untitled 10.png" style="border: 1px solid darkgray;">
  
- [범위]
  - ‘범위 추가 또는 삭제’ 버튼 클릭 → email, profile, openId 선택 후 아래 ‘업데이트’ 버튼 클릭

    <img width="700" alt="image" src="/exec/image/Untitled 11.png" style="border: 1px solid darkgray;">
  
  - 저장 후 계속 버튼 클릭

    <img width="700" alt="image" src="/exec/image/Untitled 12.png" style="border: 1px solid darkgray;">
  
- [테스트 사용자]
  - 테스트 사용자 필요 시 테스트 사용자 추가 후 ‘저장 후 계속’ 버튼 클릭

    <img width="700" alt="image" src="/exec/image/Untitled 13.png" style="border: 1px solid darkgray;">
  
- 좌측 ‘사용자 인증 정보’ 클릭 → 사용자 인증 정보 만들기 > OAuth 클라이언트 ID
  
  <img width="700" alt="image" src="/exec/image/Untitled 14.png" style="border: 1px solid darkgray;">
  
- 애플리케이션 유형, 이름, 승인된 리디렉션 URI 작성 후 ‘만들기’ 버튼 클릭
  - 애플리케이션 유형 : 웹 애플리케이션
  - **승인된 리디렉션 URI : (도메인)**/login/oauth2/code/google

    → .env의 `GOOGLE_REDIRECT_URL`
  
  <img width="700" alt="image" src="/exec/image/Untitled 15.png" style="border: 1px solid darkgray;">

- 클라이언트 ID, 클라이언트 보안 비밀번호 별도 저장 (비밀번호는 추후 재확인 불가)
  - 클라이언트 ID → .env의 `GOOGLE_CLIENT_ID`
  - 클라이언트 보안 비밀번호 → .env의 `GOOGLE_CLIENT_SECRET`

  <img width="800" alt="image" src="/exec/image/Untitled 16.png">

### openvidu
- [공식문서](https://docs.openvidu.io/en/stable/deployment/ce/on-premises/)
#### openvidu on-premise CE 버전 설치
```
sudo su
```

```
cd /opt
```

```
curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
```

- 기존의 .env를 위에서 작성한 .env로 변경
- 해당 경로에 private_cloudfront_key.pem 파일 복사

```
./openvidu start
```

- 실행 완료시 `ctrl + c` 로 백그라운드 앱으로 전환 후 종료
```
./openvidu stop
```
### docker network 생성
```
sudo docker network create RecLetterNetwork
```

### DB, Kafka 설정
#### docker-compose-db.yml
```
version: '3'

services:
  RecLetterRedis:
    image: redis:7.2.3
    container_name: RecLetterRedis
    restart: unless-stopped
    volumes:
      - redis-data:/data
    networks:
      - RecLetterNetwork

  RecLetterMariaDB:
    image: mariadb:10.4
    container_name: RecLetterMariaDB
    restart: unless-stopped
    volumes:
      - mariadb-data:/lib/var/mysql
      - ./initdb.d:/docker-entrypoint-initdb.d
    networks:
      - RecLetterNetwork
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    environment:
      MARIADB_DATABASE: ${DB_NAME}
      MARIADB_USER: ${USER_NAME}
      MARIADB_PASSWORD: ${USER_PASSWORD}
      MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    env_file:
      - .env

  zookeeper:
    image: bitnami/zookeeper:3.8.3
    container_name: RecLetterZookeeper
    restart: unless-stopped
    ports:
      - '2181:2181'
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
    volumes:
      - zookeeper-data:/bitnami/zookeeper
    networks:
      - RecLetterNetwork

  kafka:
    image: bitnami/kafka:3.6
    container_name: RecLetterKafka
    restart: unless-stopped
    ports:
      - "9093:9093"
    expose:
      - "9093"
    environment:
      - KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
      - KAFKA_CREATE_TOPICS="kafka_capstone_event_bus:1:1"
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CLIENT:PLAINTEXT,EXTERNAL:PLAINTEXT
      - KAFKA_CFG_LISTENERS=CLIENT://:9092,EXTERNAL://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=CLIENT://kafka:9092,EXTERNAL://RecLetterKafka:9093
      - KAFKA_INTER_BROKER_LISTENER_NAME=CLIENT
      - ALLOW_PLAINTEXT_LISTENER=yes
    depends_on:
      - zookeeper
    networks:
      - RecLetterNetwork
    volumes:
      - kafka-data:/bitnami/kafka
volumes:
  redis-data:
  mariadb-data:
  zookeeper-data:
  kafka-data:

networks:
  RecLetterNetwork:
    external: true


```

- docker-conmpose-db.yml 파일 작성 후 컨테이너 생성
```
sudo docker-compose -f docerk-compose-db.yml up -d
```

### 기본 app 제거
- 해당 디렉토리의 docker-compose.override.yml을 아래의 코드로 변경
#### docker-compose.override.yml

```
version: '3.1'

services:
  RecLetterBackend:
    image: ssuyas/recletter_backend
    container_name: RecLetterBackend
    restart: unless-stopped
    ports:
      - "8081:8081"
    networks:
      - RecLetterNetwork
    volumes:
      - ./private_cloudfront_key.pem:/private_cloudfront_key.pem
    environment:
      DB_URL: ${DB_URL}
      USER_NAME: ${USER_NAME}
      USER_PASSWORD: ${USER_PASSWORD}
      MAIL_ID: ${MAIL_ID}
      MAIL_SECRET: ${MAIL_SECRET}
      AWS_ACCESS: ${AWS_ACCESS}
      AWS_SECRET: ${AWS_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_BUCKET: ${AWS_BUCKET}
      AWS_FRONT: ${AWS_FRONT}
      AWS_CLOUDFRONT_DOMAIN: ${AWS_CLOUDFRONT_DOMAIN}
      AWS_CLOUDFRONT_KEY: ${AWS_CLOUDFRONT_KEY}
      AWS_CLOUDFRONT_KEY_ID: ${AWS_CLOUDFRONT_KEY_ID}
      JWT_KEY: ${JWT_KEY}
      REDIS_HOST: ${REDIS_HOST}
      REDIS_PORT: ${REDIS_PORT}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
      OPENVIDU_URL: ${OPENVIDU_URL}
      OPENVIDU_SECRET: ${OPENVIDU_SECRET}
    env_file:
      - .env

  video1:
    image: ssuyas/recletter_video
    container_name: RecLetterVideo_1
    restart: unless-stopped
    networks:
      - RecLetterNetwork
    ports:
      - ${RECLETTER_VIDEO_PORT_1}:${RECLETTER_VIDEO_PORT_1}
    environment:
      PORT_NUMBER: ${RECLETTER_VIDEO_PORT_1}
      AWS_ACCESS: ${AWS_ACCESS}
      AWS_SECRET: ${AWS_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_BUCKET: ${AWS_BUCKET}
      PYTHONPATH: /
      KAFKA_BOOTSTRAP_SERVERS: ${KAFKA_BOOTSTRAP_SERVERS}
      KAFKA_LETTER_REQUEST_TOPIC: ${KAFKA_LETTER_REQUEST_TOPIC}
      KAFKA_ASSET_DOWNLOADINFO_TOPIC: ${KAFKA_ASSET_DOWNLOADINFO_TOPIC}
      KAFKA_LETTER_ENCODINGINFO_TOPIC: ${KAFKA_LETTER_ENCODINGINFO_TOPIC}
      KAFKA_LETTER_RESULTINFO_TOPIC: ${KAFKA_LETTER_RESULTINFO_TOPIC}
      KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID: ${KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID}
      KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID: ${KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID}
    volumes:
      - video-data:/videobackend/${DOWNLOAD_PATH:-download}

  video2:
    image: ssuyas/recletter_video
    container_name: RecLetterVideo_2
    restart: unless-stopped
    networks:
      - RecLetterNetwork
    ports:
      - ${RECLETTER_VIDEO_PORT_2}:${RECLETTER_VIDEO_PORT_2}
    environment:
      PORT_NUMBER: ${RECLETTER_VIDEO_PORT_2}
      AWS_ACCESS: ${AWS_ACCESS}
      AWS_SECRET: ${AWS_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_BUCKET: ${AWS_BUCKET}
      PYTHONPATH: /
      KAFKA_BOOTSTRAP_SERVERS: ${KAFKA_BOOTSTRAP_SERVERS}
      KAFKA_LETTER_REQUEST_TOPIC: ${KAFKA_LETTER_REQUEST_TOPIC}
      KAFKA_ASSET_DOWNLOADINFO_TOPIC: ${KAFKA_ASSET_DOWNLOADINFO_TOPIC}
      KAFKA_LETTER_ENCODINGINFO_TOPIC: ${KAFKA_LETTER_ENCODINGINFO_TOPIC}
      KAFKA_LETTER_RESULTINFO_TOPIC: ${KAFKA_LETTER_RESULTINFO_TOPIC}
      KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID: ${KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID}
      KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID: ${KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID}
    volumes:
      - video-data:/videobackend/${DOWNLOAD_PATH:-download}

  video3:
    image: ssuyas/recletter_video
    container_name: RecLetterVideo_3
    restart: unless-stopped
    networks:
      - RecLetterNetwork
    ports:
      - ${RECLETTER_VIDEO_PORT_3}:${RECLETTER_VIDEO_PORT_3}
    environment:
      PORT_NUMBER: ${RECLETTER_VIDEO_PORT_3}
      AWS_ACCESS: ${AWS_ACCESS}
      AWS_SECRET: ${AWS_SECRET}
      AWS_REGION: ${AWS_REGION}
      AWS_BUCKET: ${AWS_BUCKET}
      PYTHONPATH: /
      KAFKA_BOOTSTRAP_SERVERS: ${KAFKA_BOOTSTRAP_SERVERS}
      KAFKA_LETTER_REQUEST_TOPIC: ${KAFKA_LETTER_REQUEST_TOPIC}
      KAFKA_ASSET_DOWNLOADINFO_TOPIC: ${KAFKA_ASSET_DOWNLOADINFO_TOPIC}
      KAFKA_LETTER_ENCODINGINFO_TOPIC: ${KAFKA_LETTER_ENCODINGINFO_TOPIC}
      KAFKA_LETTER_RESULTINFO_TOPIC: ${KAFKA_LETTER_RESULTINFO_TOPIC}
      KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID: ${KAFKA_LETTER_REQUEST_CONSUMER_GROUP_ID}
      KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID: ${KAFKA_ASSET_DOWNLOADINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_ENCODINGINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_CONSUMER_GROUP_ID}
      KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID: ${KAFKA_LETTER_RESULTINFO_DELETE_CONSUMER_GROUP_ID}
    volumes:
      - video-data:/videobackend/${DOWNLOAD_PATH:-download}

  app:
    image: ssuyas/recletter_frontend
    container_name: RecLetterFrontend
    restart: unless-stopped
    network_mode: host
    depends_on:
      - RecLetterBackend
    volumes:
      - ./.env:/usr/share/nginx/html/.env

networks:
  RecLetterNetwork:
    external: true

volumes:
  video-data:

```

---

## 실행
### 빌드 없이 실행
- 위의 과정을 모두 진행 한 후
```
sudo dokcer-compose up -d
```
- jenkins 제외 총 14개의 컨테이너가 실행중이면 완료
### CI/CD 실행
- 위 과정을 모두 진행 한 후, Jenkins에서 빌드 수행
---

## 시연 시나리오
- [프로젝트 README.md 참고](../README.md)