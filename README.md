# Custom Cloud & Desktop IDE Framework based on Theia Ide

## 개발 내용

### 개요

- 요약: 오픈소스 소프트웨어로 제공되는 Theia IDE를 기반으로 커스텀 통합개발환경 개발 및 구현
<!-- - AI 분야에서 인공지능 모델은 매우 중요한 요소
    - 이러한 모델을 학습하는 방법, 과정, 리소스 분배 등 학습을 빠르고 효율적으로 수행하는것이 주요 과제 중 하나
- 따라서, 인공지능 분야에서 주로 이루어지는 연구는 효율적인 학습의 구조 개발 및 개선, 효율적인 리소스 분배를 통한 모델학습 시간 단축, 다수의 학습데이터 활용하는 Large Language Model 연구 등 다양한 방향의 연구 및 개발이 이루어짐
- 높은 성능의 DL/ML 모델 개발을 위해서는 학습에 다수의 서버를 활용
    - 하지만 관리하는 서버의 수가 늘어날 수록 개발자 및 연구자는 각 서버에 대해 관리해야되는 문제가 발생
        - 이를 해결하기위해 서버를 클러스터로 묶고 클라우드 기반의 중앙화된 관리를 통해 쉽게 관리할 수 있는 연구가 이루어짐
- 다수의 학습 파라미터를 활용하는 학습의 경우 매우 큰 컴퓨팅 리소스를 요구
    - 즉, 주어진 한정적인 컴퓨팅 리소스 내에서 효율적인 리소스 분배를 통해 모델 학습을 하기위한 연구가 필요
- 따라서, 위와 같은 문제를 해결하기 위해 클라우드 기반의 효율적인 DL,ML 모델 개발을 위한 통합개발환경에 대해 연구를 진행 -->

### 구현 시스템 구조도

<!-- ![Untitled](%E1%84%8C%E1%85%A6%E1%84%86%E1%85%A9%E1%86%A8%20%E1%84%8B%E1%85%A5%E1%86%B9%E1%84%8B%E1%85%B3%E1%86%B7%20150fa534dfc88072a1daf534f16114c3/Untitled.png) -->
![Untitled](https://github.com/user-attachments/assets/6ba8b2d1-8cd1-444d-957a-06e335265018)

### 구현 기능

- Theia IDE 기반 총 13가지의 Custom menu 구성
- 구현된 메뉴 구성은 다음과 같음
    - Make Image
        - Generate Java Dockerfile
        - Generate Python Dockerfile
        - Generate Go Dockerfile
    - Init Project Dir
        - Init Go Project
    - Run Command
        - Run Java
        - Run Python3
        - Run Go
    - Docker Commend Menus
        - Build Dockerfile Command
        - Run Docker Image Command
        - Push Container Image
        - Pull Container Image
        - Docker Login
    - Generate YAML File
    - Add Node and Configure Workload
    - ML Pipeline Info Func
    - ML Pipeline Run Func
- 각 메뉴 기능 요약 설명
    - Generate Java Dockerfile
        - Java 코드를 동작하기 위한 도커파일 예제 생성
    - Generate Python Dockerfile
        - Python 코드를 동작하기 위한 Dockerfile 예제 생성
    - Generate Go Dockerfile
        - Go 코드를 동작하기 위한 Dockerfile 예제 생성
    - Init Project Dir
        - Go 개발을 위한 기본 Directory 구조 생성
    - Build Dockerfile Command
        - 선택한 Dockerfile 빌드 기능
    - Run Docker Image Command
        - 생성된 Image를 실행하기 위한 기능
    - Push Container Image
        - 입력한 Image를 Repository에 Push하는 기능
    - Pull Container Image
        - 입력한 Image와 Tag를 통해 Repository에서 Pull하는 기능
    - Docker Login
        - Push 및 Pull을 위한 Docker Login 기능
    - Generate YAML File
    <!-- - (Deleted) Add Node and Configure Workload
    - (Deleted) ML Pipeline Info Func
    - (Deleted) ML Pipeline Run Func -->
    - Create Run ML Pipeline
        - ML Pipeline YAML과 metadata YAML을 통해 Workload 생성하는 기능

### 로컬 동작 환경

- 총 3대의 VM을 통해 마스터 노드, 워커노드2개로 구성
- 워커 노드  중 한개의 노드에 NFS서버로 구축하여, IDE 작업에한 스토리지로 활용
- Ingress설정을 통해 keti01, keti02, keti03, keti04 네개의 Path를 통해 IDE 접근 구성

## Docker로 실행하기

1. Dockerfile 생성:
    ```Dockerfile
   # Builder stage
    FROM node:20-bullseye AS build-stage

    # Update apt sources to use HTTPS
    RUN sed -i 's|http|https|g' /etc/apt/sources.list

    # Install required tools to build the application
    RUN apt-get update && apt-get install -y \
        libxkbfile-dev \
        libsecret-1-dev

    WORKDIR /home/theia/workspace

    # Copy repository files
    COPY . .

    # Build and clean the application
    RUN yarn --pure-lockfile && \
        yarn build && \
        yarn download:plugins && \
        yarn browser build && \
        yarn --production && \
        yarn autoclean --init && \
        echo '*.ts' >> .yarnclean && \
        echo '*.ts.map' >> .yarnclean && \
        echo '*.spec.*' >> .yarnclean && \
        yarn autoclean --force && \
        yarn cache clean

    # Production stage
    FROM node:20-bullseye

    # Update apt sources to use HTTPS
    RUN sed -i 's|http|https|g' /etc/apt/sources.list

    # Install required tools for the production application
    RUN apt-get update && apt-get install -y \
        wget \
        apt-transport-https \
        git \
        openssh-client \
        openssh-server \
        bash \
        libsecret-1-0 \
        openjdk-11-jdk \
        golang \
        python3 \
        python3-pip \
        maven && \
        pip3 install --upgrade pip && \
        pip3 install pylint autopep8 && \
        wget -O - https://packages.adoptium.net/artifactory/api/gpg/key/public | tee /usr/share/keyrings/adoptium.asc && \
        echo "deb [signed-by=/usr/share/keyrings/adoptium.asc] https://packages.adoptium.net/artifactory/deb $(awk -F= '/^VERSION_CODENAME/{print$2}' /etc/os-release) main" | tee /etc/apt/sources.list.d/adoptium.list && \
        apt-get update && \
        apt-get install -y temurin-17-jdk && \
        apt-get purge -y wget && \
        apt-get clean && \
        rm -rf /var/lib/apt/lists/*
        
    RUN mkdir -m 0755 -p /etc/apt/keyrings && \
        curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg && \
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

    RUN apt-get update && \
        apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    # Create application directories
    RUN adduser --system --group theia && \
        mkdir -p /home/theia /home/project && \
        chown -R theia:theia /home/theia /home/project

    # Set working directory
    WORKDIR /home/theia/workspace

    # Copy application files from the builder stage
    COPY --from=build-stage --chown=theia:theia /home/theia /home/theia

    # Set environment variables
    ENV HOME=/home/theia/workspace \
        SHELL=/bin/bash \
        THEIA_DEFAULT_PLUGINS=local-dir:/home/theia/plugins \
        USE_LOCAL_GIT=true

    # Expose application port
    EXPOSE 3000

    # Set permissions and switch to Theia user
    USER theia
    WORKDIR /home/theia/examples/browser

    # Launch the backend application
    ENTRYPOINT [ "node", "/home/theia/examples/browser/lib/backend/main.js" ]
    CMD [ "/home/theia/workspace", "--hostname=0.0.0.0" ]

    ```

2. 이미지를 빌드 및 실행:
   ```bash
   docker build -t ${image name} -f Dockerfile .
   docker run --init --rm -p 3000:3000 -v "$(pwd)/workspace:/home/project:cached" -v /var/run/docker.sock:/var/run/docker.sock $1:$2
    ```

### 로컬 동작 결과

- 동작 결과는 다음과 같음
    
    ![keti01~04로 구분된 4개의 IDE를 동시에 띄운 결과](https://github.com/user-attachments/assets/3d906402-84d5-4daa-a6a5-da13f347c3df)
    
    keti01~04로 구분된 4개의 IDE를 동시에 띄운 결과
    
    ![개인 VM으로 구성된 k8s 클러스터에 띄운 결과(Deployment x 4, Service x 4, pv x 8, pvc x 8, ingress x 1)](https://github.com/user-attachments/assets/c1406054-1c3a-4650-a2a4-8df2e1a2bdf7)
    
    개인 VM으로 구성된 k8s 클러스터에 띄운 결과(Deployment x 4, Service x 4, pv x 8, pvc x 8, ingress x 1)
    
- 각 메뉴에 대한 실행 결과
    - Generate YAML File
        
        ![Gemerate YAML File 메뉴 선택](https://github.com/user-attachments/assets/b54161b0-b183-49ad-b2b8-95ee8208de7b)
        
        Gemerate YAML File 메뉴 선택
        
        ![Generate YAML File 메뉴 실행시 generateYAMLScript.py가 생성된 것을 확인 가능](https://github.com/user-attachments/assets/386f987a-731d-4f46-948f-55932cc14761)
        
        Generate YAML File 메뉴 실행시 generateYAMLScript.py가 생성된 것을 확인 가능
        
    - Run Python3
        
        ![Run Command - Run Python3 메뉴 선택](https://github.com/user-attachments/assets/a65ee836-1d2d-4bc9-893f-44cf3496b5c9)
        
        Run Command - Run Python3 메뉴 선택
        
        ![실행할 Python 파일 선택](https://github.com/user-attachments/assets/9c694013-d2da-4912-9ea7-f43c4b9aec5e)
        
        실행할 Python 파일 선택
        
        ![실행 결과 확인](https://github.com/user-attachments/assets/a0196d29-2f41-48d7-a5c2-af12d26bc572)
        
        실행 결과 확인
        
    - Generate Python Dockerfile
        
        ![Make Image - Generate Python Dockerfile 메뉴 선택](https://github.com/user-attachments/assets/7d431b62-64f6-4737-bfb5-80bbe6d60421)
        
        Make Image - Generate Python Dockerfile 메뉴 선택
        
        ![Python 실행을 위한 Dockerfile 예제 생성 결과](https://github.com/user-attachments/assets/2aafe3ce-747f-408e-8fab-9debeac1286d)
        
        Python 실행을 위한 Dockerfile 예제 생성 결과
        
    - Build Dockerfile Command
        
        ![Docker Command Menus - Build Dockerfile Command 메뉴 선택](https://github.com/user-attachments/assets/764170ed-e84e-4de3-a636-2ed2ce2b0ee7))
        
        Docker Command Menus - Build Dockerfile Command 메뉴 선택
        
        ![Build할 이미지명과 테그 입력](https://github.com/user-attachments/assets/91108e87-5524-4187-97ab-e6a4b51d34b1)
        
        Build할 이미지명과 테그 입력
        
        ![Build하려는 Dockerfile 선택](https://github.com/user-attachments/assets/f904ee6c-4c09-46c3-898c-4b1b086492e5)
        
        Build하려는 Dockerfile 선택
        
        ![Image생성 결과 확인](https://github.com/user-attachments/assets/6f7625df-bf15-40b1-ad60-5ca15bba8c53)
        
        Image생성 결과 확인
        
    - Run Docker Image Command
        
        ![메뉴 실행 전 현재 생성된 Image 목록 확인](https://github.com/user-attachments/assets/340b9790-c46d-4df4-a2c7-4ee84739c2b5)
        
        메뉴 실행 전 현재 생성된 Image 목록 확인
        
        ![Docker Command Menus - Run Docker Image Command 메뉴 선택](https://github.com/user-attachments/assets/b153a945-8d2d-4bf7-acb7-500a3807c833)
        
        Docker Command Menus - Run Docker Image Command 메뉴 선택
        
        ![실행할 명령어 및 옵션과 이미지 정보 입력](https://github.com/user-attachments/assets/dc359af1-23a6-49a1-8d82-46c05fa0253d)
        
        실행할 명령어 및 옵션과 이미지 정보 입력
        
        ![실행 결과 확인](https://github.com/user-attachments/assets/467914a2-5dd7-4d34-b572-85698e6e8e63)
        
        실행 결과 확인
        
    - Push Container Image
        
        ![메뉴 실행전 현재 Repository 목록](https://github.com/user-attachments/assets/b36a4352-0311-4e65-8354-4b06b496032f)
        
        메뉴 실행전 현재 Repository 목록
        
        ![Docker Command Menus - Push Container Image 선택](https://github.com/user-attachments/assets/4dea5cd5-b09f-4564-b3fa-0a132cce43a9)
        
        Docker Command Menus - Push Container Image 선택
        
        ![Push하려는 이미지 정보 입력](https://github.com/user-attachments/assets/761d302a-8ebf-454a-8da3-3d9d8b3116ce)
        
        Push하려는 이미지 정보 입력
        
        ![Push 실행 결과 확인](https://github.com/user-attachments/assets/4fa9bf57-b69f-453b-9999-0b24cb39c221)
        
        Push 실행 결과 확인
        
        ![Repository에 Push된 결과 확인](https://github.com/user-attachments/assets/0e5b9cb8-6aa2-48b9-9c0e-930d574d57be)
        
        Repository에 Push된 결과 확인
        
    - Pull Container Image
        
        ![Docker Command Menus - Pull container Image 선택 및 현재 이미지 목록 출력](https://github.com/user-attachments/assets/784418e3-0d4d-4433-a011-560abddc82af)
        
        Docker Command Menus - Pull container Image 선택 및 현재 이미지 목록 출력
        
        ![Pull하려는 이미지 정보 입력](https://github.com/user-attachments/assets/87376d80-8293-4d01-b7f5-947b9b886582)
        
        Pull하려는 이미지 정보 입력
        
        ![Pull 실행 결과 및 이미지 목록 확인](https://github.com/user-attachments/assets/753425c6-9a37-444c-9577-1bc63c56ff8e)
        
        Pull 실행 결과 및 이미지 목록 확인
        
        ![Untitled](https://github.com/user-attachments/assets/6b1c948a-c81a-446b-a505-29592c857b18)
        
    - Docker Login
        
        ![Docker Command Menus - Docker Login 메뉴 선택](https://github.com/user-attachments/assets/323d828d-2c05-4ff0-acfb-d56e08efee1a)
        
        Docker Command Menus - Docker Login 메뉴 선택
        
        ![Docker Login 결과 확인](https://github.com/user-attachments/assets/03d7a8d8-97a7-469b-8a69-acbcb6cfaf06)
        
        Docker Login 결과 확인
        
    <!-- - ~~Add Node and Configure Workload~~
        - 해당 메뉴는 Generate YAML File 메뉴를 통해 생성된 Python코드를 수정하여 실행한 결과로 생성된 YAML파일을 Workload에 따른 리소스 분배가 완료된 파일로 재변경해주는 메뉴
            
            ![Untitled](https://github.com/user-attachments/assets/ce4fbc30-12b1-456f-a849-077086fe87a0)
            
            ![Untitled](https://github.com/user-attachments/assets/bb7863be-95ca-4c7a-8284-3677dda1df26)
            
            ![Untitled](https://github.com/user-attachments/assets/6caab106-c527-4f92-b0f6-57c6aa427917)
            
    - ~~ML Pipeline Info Func~~
        - 현재 실행중인 ML Pipeline에 대한 정보를 콘솔에 출력해주는 기능
            
            ![Untitled](https://github.com/user-attachments/assets/747d562d-04cd-4bdc-8302-81e34d8a6a6e)
            
            ![Untitled](https://github.com/user-attachments/assets/bbd0ea5b-d6dc-4453-bd0b-003ae11ca8df)
            
    - ~~ML Pipeline Run Func~~
        - Add Node and Configure Workload메뉴를 통해 생성된 Yaml 파일을 기반으로 ML Pipeline을 생성해주는 메뉴 -->
        
    - Create Run ML Pipeline
        - PMS의 Create Run과 동일한 기능을 수행
        - metadata 및 ML pipeline yaml 파일 선택 → Yaml Management module로 전달하는 기능
        
        ![metadata에 대한 정보 작성](https://github.com/user-attachments/assets/1259adff-1074-4e34-a285-5d0b24ce8634)
        
        metadata에 대한 정보 작성
        
        ![2개 파일 선택](https://github.com/user-attachments/assets/45f2da0e-5f7d-497d-ad69-b98b79821825)
        
        2개 파일 선택
        
        ![alert를 통한 통신 결과 반환(200이 반환된 경우)](https://github.com/user-attachments/assets/956b0320-76c6-4075-b4ca-8408de5d1733)
        
        alert를 통한 통신 결과 반환(200이 반환된 경우)
        

### Strato Admin Cluster 배포

- 시스템 구성도는 아래 그림과 같으며, 기존 PVC를 통해 Claim을 걸던 구조에서 NFS와 직업 연결 형태로 변경

![배포된 IDE 시스템 구조도](https://github.com/user-attachments/assets/526fa0d8-58e5-4842-83c9-93de7045d705)

배포된 IDE 시스템 구조도

- [${domain}/${keti01-04}](http:/$domain/${keti01-04})/ 로 접속 가능
    - Sonicwall을 통한 VPN 설정 후 접속

![keti01-04 접속 결과](https://github.com/user-attachments/assets/2d0a61e0-801f-47fe-88db-a42e54e121e9)

keti01-04 접속 결과
