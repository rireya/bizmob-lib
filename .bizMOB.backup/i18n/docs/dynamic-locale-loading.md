# 동적 언어 감지 기능 사용법

## 🎯 **개요**

이제 bizMOB Universal i18n에서 `locales` 폴더에 있는 JSON 파일들을 자동으로 감지하여 동적으로 로드할 수 있습니다!

## 🚀 **주요 기능**

### **1. 자동 언어 파일 감지**
```typescript
import { discoverAvailableLocales, createBizMOBI18n } from '@/bizMOB/i18n';

// 사용 가능한 모든 언어 파일 자동 감지
const availableLocales = await discoverAvailableLocales();
console.log('감지된 언어들:', availableLocales); // ['ko', 'en', 'ja', 'zh']
```

### **2. 동적 언어 로딩**
```typescript
// 이제 하드코딩된 언어 목록이 필요 없음!
const i18n = await createBizMOBI18n(); // 자동으로 모든 언어 파일 로드

// 로드된 언어 확인
console.log('로드된 언어들:', i18n.getAvailableLocales());
```

### **3. 선택적 언어 사전 로드**
```typescript
import { preloadLocales } from '@/bizMOB/i18n';

// 특정 언어들만 사전 로드 (성능 최적화)
const messages = await preloadLocales(['ko', 'en']);

const i18n = await createBizMOBI18n({
  locale: 'ko',
  messages // 사전 로드된 메시지 사용
});
```

## 📁 **지원되는 파일 구조**

### **기본 구조**
```
src/locales/
├── ko.json          ✅ 자동 감지
├── en.json          ✅ 자동 감지
├── ja.json          ✅ 자동 감지
├── zh.json          ✅ 자동 감지
├── fr.json          ✅ 자동 감지
└── es.json          ✅ 자동 감지
```

### **복잡한 언어 코드도 지원**
```
src/locales/
├── ko-KR.json       ✅ 자동 감지
├── en-US.json       ✅ 자동 감지
├── zh-CN.json       ✅ 자동 감지
└── zh-TW.json       ✅ 자동 감지
```

## 🔧 **환경별 동작 방식**

### **Vite 환경**
```typescript
// Vite의 import.meta.glob 사용
const modules = import.meta.glob('@/locales/*.json', { eager: true });
// 모든 JSON 파일을 자동으로 스캔하여 언어 목록 생성
```

### **Webpack 환경**
```typescript
// require.context 사용 (있는 경우)
const localesContext = require.context('@/locales', false, /\.json$/);

// 폴백: 일반적인 언어 목록으로 시도
const commonLocales = ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', ...];
```

## 📊 **디버깅 도구**

### **전체 환경 정보 확인**
```typescript
const i18n = await createBizMOBI18n();

// 1. 환경 정보
console.log('Environment:', i18n.getEnvironmentInfo());

// 2. 로더 정보
console.log('Loader Info:', i18n.getLoaderInfo());

// 3. 감지된 언어들
const discovered = await i18n.getDiscoveredLocales();
console.log('Discovered Locales:', discovered);

// 4. 실제 로드된 언어들
console.log('Loaded Locales:', i18n.getAvailableLocales());
```

### **데모 스크립트 실행**
```typescript
import { runLocaleDiscoveryDemo } from '@/bizMOB/i18n/demos/locale-discovery-demo';

// 완전한 디버깅 정보 출력
const result = await runLocaleDiscoveryDemo();
/*
🔍 Locale Discovery Demo Started

📋 Environment Info:
- Framework: vue
- Bundler: vite

⚙️ Loader Info:
- Default Locale: ko
- Fallback Locale: ko

🔌 Available Adapters:
vue, react, next, nuxt, svelte, vanilla

🎯 Current Adapter Info:
- Name: VueI18nAdapter
- Framework: vue
- Dependencies: vue-i18n
- Optional Dependencies:

🌍 Discovered Locales:
- Available: ko, en
- Count: 2

📦 Loaded Locales:
- Loaded: ko, en
- Count: 2

✅ Locale Discovery Demo Completed Successfully!
*/
```

## 🔧 **환경 변수 설정**

### **추가 언어 지원**
```bash
# .env
VITE_SUPPORTED_LOCALES=ko,en,ja,zh,fr,es,de,it,pt,ru
```

### **기본 언어 설정**
```bash
# .env
VITE_I18N_LOCALE=ko
VITE_I18N_FALLBACK_LOCALE=en
```

## ✨ **장점**

1. **하드코딩 제거**: 더 이상 지원 언어 목록을 코드에 하드코딩할 필요 없음
2. **자동 감지**: 새로운 언어 파일을 추가하면 자동으로 감지
3. **성능 최적화**: 필요한 언어만 선택적으로 로드 가능
4. **디버깅 용이**: 풍부한 디버깅 도구 제공
5. **환경 무관**: Vite, Webpack 모든 환경에서 동작

## 🚀 **실제 사용 예시**

```typescript
// main.ts
import { createBizMOBI18n, detectBrowserLocale } from '@/bizMOB/i18n';

async function setupI18n() {
  // 1. 사용 가능한 언어들 자동 감지
  const i18n = await createBizMOBI18n();
  const availableLocales = i18n.getAvailableLocales();

  // 2. 브라우저 언어에 맞춰 자동 설정
  const browserLocale = detectBrowserLocale(availableLocales);
  await i18n.changeLocale(browserLocale);

  console.log(\`자동 감지된 \${availableLocales.length}개 언어 중 '\${browserLocale}' 선택됨\`);

  return i18n;
}

// Vue 앱에서 사용
app.use(await createBizMOBVuePlugin());
```

이제 새로운 언어 파일을 추가하기만 하면 자동으로 감지되어 사용할 수 있습니다! 🎉
