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
- 
#### Docker Hub Token
#### Docker Hub Repository 생성
#### Ubuntu Credential 추가
#### Secret File 추가
#### .env
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