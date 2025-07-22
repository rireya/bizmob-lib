# bizMOB Library

bizMOB 라이브러리 파일 관리 프로젝트입니다.

## 📁 프로젝트 구조

```
bizmob-lib/
├── public/                # JavaScript 라이브러리 파일들
│   ├── bizMOB/           # bizMOB 핵심 라이브러리
│   │   ├── bizMOB-core.js
│   │   ├── bizMOB-core-web.js
│   │   ├── bizMOB-locale.js
│   │   ├── bizMOB-polyfill.js
│   │   └── bizMOB-xross4.js
│   ├── extlib/           # 외부 라이브러리
│   │   ├── crypto-js.min.js
│   │   └── forge.min.js
│   └── mock/             # 목업 데이터
├── src/                  # TypeScript 소스 코드
│   └── bizMOB/          # bizMOB TypeScript 구현체
│       ├── bizmob.d.ts  # 타입 정의 파일
│       ├── BzClass/     # 클래스 구현체
│       ├── i18n/        # 국제화
│       └── Xross/       # Xross 기능 래퍼
└── dist/                # 빌드 결과물
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 라이브러리 빌드

```bash
# 전체 빌드
npm run build

# JavaScript 라이브러리만 빌드
npm run build:js

# TypeScript 라이브러리만 빌드
npm run build:ts
```

### 3. 코드 품질 검사

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix
```

### 4. 테스트

```bash
npm test
```

## 📦 라이브러리 구성

### JavaScript 라이브러리 (`public/`)

- **bizMOB-core.js**: bizMOB 핵심 기능
- **bizMOB-core-web.js**: 웹 환경용 bizMOB 핵심 기능
- **bizMOB-locale.js**: 다국어 지원 기능
- **bizMOB-polyfill.js**: 브라우저 호환성 폴리필
- **bizMOB-xross4.js**: Xross4 플랫폼 연동 기능

### TypeScript 소스 코드 (`src/`)

JavaScript 라이브러리를 TypeScript에서 사용하기 위한 타입 정의, 래퍼 함수, 그리고 확장 구현체들을 제공합니다.

- **BzClass/**: 비즈니스 로직 클래스 구현체들
- **Xross/**: Xross 플랫폼 연동 래퍼 함수들
- **i18n/**: 국제화 지원 구현체

## 🛠️ 개발 환경

### 필수 요구사항

- Node.js 16.0.0 이상
- npm 8.0.0 이상

### 사용된 도구들

- **TypeScript**: 타입 안전성
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅
- **Jest**: 테스트 프레임워크
- **Webpack**: JavaScript 번들링
- **Babel**: JavaScript 트랜스파일링

## 📝 라이선스

MIT License