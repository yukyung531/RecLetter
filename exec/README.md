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
### Jenkins 컨테이너 실행
### Jenkins 환경 설정
### Jenkins 플러그인 설치
### 관리자 계정 설정
### Jenkins 내부에 Docker, Docker Compose 설치
### Credential 설정
#### GitLab Credential
#### GitLab API Token
#### Webhook
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