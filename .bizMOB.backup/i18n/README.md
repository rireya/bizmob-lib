# bizMOB Universal i18n

Vue 3, React, Next.js, Nuxt.js, Svelte에서 **동일한 방식**으로 사용할 수 있는 다국어 지원 라이브러리입니다.

## 🎯 **특징**

- ✅ **Framework Agnostic**: Vue, React, Next.js, Nuxt.js, Svelte 모든 프레임워크 지원
- ✅ **동일한 API**: 프레임워크에 관계없이 동일한 사용감
- ✅ **자동 환경 감지**: 런타임에서 프레임워크와 번들러 자동 감지
- ✅ **TypeScript 완전 지원**: 타입 안전성 보장
- ✅ **확장 가능한 아키텍처**: 새로운 프레임워크 어댑터 쉽게 추가
- ✅ **플러그인 시스템**: 기존 코드 수정 없이 확장
- ✅ **하위 호환성**: 기존 Vue-i18n 코드와 호환

## 🚀 **새로운 프레임워크 어댑터 추가하기**

### **1단계: 템플릿 생성**

```typescript
import { AdapterTemplateGenerator } from '@/bizMOB/i18n/adapters/template-generator';

// 새로운 어댑터 템플릿 생성
const template = AdapterTemplateGenerator.generateAdapterTemplate({
  frameworkName: 'Angular',
  className: 'AngularI18nAdapter',
  fileName: 'angular-adapter.ts',
  dependencies: ['@angular/core'],
  optionalDependencies: ['@angular/localize'],
  hasSSR: true,
  customMethods: ['getAngularTranslate']
});

// 생성된 템플릿을 파일로 저장
```

### **2단계: 설정 파일 업데이트**

`src/bizMOB/i18n/adapters/adapters.config.json`에 추가:

```json
{
  "adapters": {
    "angular": {
      "name": "AngularI18nAdapter",
      "file": "angular-adapter.ts",
      "framework": "angular",
      "dependencies": ["@angular/core"],
      "optionalDependencies": ["@angular/localize"],
      "environments": ["browser", "ssr"],
      "bundlers": ["webpack"],
      "description": "Angular i18n adapter"
    }
  },
  "detectionOrder": ["next", "nuxt", "angular", "vue", "react", "svelte", "vanilla"]
}
```

### **3단계: 자동으로 사용 가능!**

```typescript
// 기존 코드 수정 없이 바로 사용 가능
const i18n = await createBizMOBI18n();
console.log('Detected framework:', i18n.getEnvironmentInfo().framework); // 'angular'
```

## 📦 **설치**

bizMOB 프로젝트에서는 이미 포함되어 있습니다.

```bash
# 별도 설치가 필요한 경우
npm install vue-i18n      # Vue 3 프로젝트
npm install i18next       # React 프로젝트
```

## 🚀 **사용법**

### 📁 **1. 언어 파일 준비**

```bash
src/locales/
├── ko.json
├── en.json
└── ja.json
```

```json
// src/locales/ko.json
{
  "common": {
    "loading": "로딩 중...",
    "save": "저장",
    "cancel": "취소"
  },
  "login": {
    "title": "로그인",
    "username": "사용자명",
    "password": "비밀번호"
  }
}
```

### 🎨 **2. Vue 3에서 사용**

#### **main.ts**

```typescript
import { createApp } from 'vue';
import { createBizMOBVuePlugin } from '@/bizMOB/i18n';

const app = createApp(App);

// bizMOB i18n 플러그인 등록
const i18nPlugin = await createBizMOBVuePlugin({
  locale: 'ko',
  fallbackLocale: 'ko'
});

app.use(i18nPlugin);
```

#### **Vue Component (Composition API)**

```vue
<template>
  <div>
    <h1>{{ t('login.title') }}</h1>
    <button @click="changeLanguage">
      {{ t('common.save') }}
    </button>
    <p>{{ t('login.welcome', { name: userName }) }}</p>
  </div>
</template>

<script setup lang="ts">
import { useBizMOBI18n } from '@/bizMOB/i18n';

const { t, locale, changeLocale, availableLocales } = useBizMOBI18n();

const userName = ref('김철수');

const changeLanguage = async () => {
  const newLocale = locale === 'ko' ? 'en' : 'ko';
  await changeLocale(newLocale);
};
</script>
```

#### **Options API (기존 코드 호환)**

```vue
<template>
  <div>
    <h1>{{ $t('login.title') }}</h1>
  </div>
</template>

<script>
export default {
  mounted() {
    console.log(this.$t('common.loading'));
  }
}
</script>
```

### ⚛️ **3. React에서 사용**

#### **App.tsx**

```tsx
import React from 'react';
import { createBizMOBReactProvider } from '@/bizMOB/i18n';

const { Provider: I18nProvider, i18n } = await createBizMOBReactProvider({
  locale: 'ko',
  fallbackLocale: 'ko'
});

function App() {
  return (
    <I18nProvider>
      <LoginComponent />
    </I18nProvider>
  );
}
```

#### **React Component**

```tsx
import React from 'react';
import { useReactBizMOBI18n } from '@/bizMOB/i18n';

function LoginComponent() {
  const { t, locale, changeLocale, availableLocales } = useReactBizMOBI18n();

  const handleLanguageChange = async () => {
    const newLocale = locale === 'ko' ? 'en' : 'ko';
    await changeLocale(newLocale);
  };

  return (
    <div>
      <h1>{t('login.title')}</h1>
      <button onClick={handleLanguageChange}>
        {t('common.save')}
      </button>
      <p>{t('login.welcome', { name: '김철수' })}</p>
    </div>
  );
}
```

### 🔥 **4. Next.js에서 사용**

#### **_app.tsx**

```tsx
import type { AppProps } from 'next/app';
import { createBizMOBReactProvider } from '@/bizMOB/i18n';

// 서버사이드에서는 실행하지 않음
let I18nProvider: any = ({ children }: any) => children;

if (typeof window !== 'undefined') {
  createBizMOBReactProvider().then(({ Provider }) => {
    I18nProvider = Provider;
  });
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  );
}
```

### 🚀 **5. Nuxt 3에서 사용**

#### **plugins/bizmob-i18n.client.ts**

```typescript
import { createBizMOBI18n } from '@/bizMOB/i18n';

export default defineNuxtPlugin(async () => {
  const i18n = await createBizMOBI18n({
    locale: 'ko',
    fallbackLocale: 'ko'
  });

  return {
    provide: {
      bizMOBI18n: i18n,
      t: i18n.t.bind(i18n)
    }
  };
});
```

#### **Nuxt Component**

```vue
<template>
  <div>
    <h1>{{ $t('login.title') }}</h1>
    <button @click="changeLanguage">언어 변경</button>
  </div>
</template>

<script setup lang="ts">
const { $bizMOBI18n, $t } = useNuxtApp();

const changeLanguage = async () => {
  await $bizMOBI18n.changeLocale('en');
};
</script>
```

## 🛠️ **고급 사용법**

### 🔍 **환경 감지**

```typescript
import { getEnvironmentInfo } from '@/bizMOB/i18n';

const env = await getEnvironmentInfo();
console.log('Framework:', env.framework); // 'vue' | 'react' | 'angular'
console.log('Bundler:', env.bundler);     // 'vite' | 'webpack'
```

### 🎯 **직접 인스턴스 사용**

```typescript
import { createBizMOBI18n } from '@/bizMOB/i18n';

const i18n = await createBizMOBI18n({
  locale: 'ko',
  messages: {
    ko: { hello: '안녕하세요' },
    en: { hello: 'Hello' }
  }
});

console.log(i18n.t('hello')); // '안녕하세요'
await i18n.changeLocale('en');
console.log(i18n.t('hello')); // 'Hello'
```

### 🌐 **브라우저 언어 자동 감지**

```typescript
import { detectBrowserLocale } from '@/bizMOB/i18n';

const locale = detectBrowserLocale(['ko', 'en', 'ja']);
// 브라우저 언어가 일본어면 'ja', 한국어면 'ko', 그 외에는 'ko'
```

## 🎨 **Vue 3 전용 기능**

### Composition API Composables

```typescript
import { useBizMOBI18n, useT } from '@/bizMOB/i18n';

// 전체 기능
const { t, locale, changeLocale, availableLocales } = useBizMOBI18n();

// 번역만 필요한 경우
const t = useT();
```

## ⚛️ **React 전용 기능**

### Custom Hooks

```typescript
import { useReactBizMOBI18n, useReactT } from '@/bizMOB/i18n';

// 전체 기능
const { t, locale, changeLocale, availableLocales } = useReactBizMOBI18n();

// 번역만 필요한 경우
const t = useReactT();
```

## 🔧 **환경 변수 설정**

### Vite (Vue 3)

```env
VITE_I18N_LOCALE=ko
VITE_I18N_FALLBACK_LOCALE=ko
```

### Webpack (React CRA)

```env
REACT_APP_I18N_LOCALE=ko
REACT_APP_I18N_FALLBACK_LOCALE=ko
```

### Next.js

```env
NEXT_PUBLIC_I18N_LOCALE=ko
NEXT_PUBLIC_I18N_FALLBACK_LOCALE=ko
```

### Nuxt 3

```env
NUXT_PUBLIC_I18N_LOCALE=ko
NUXT_PUBLIC_I18N_FALLBACK_LOCALE=ko
```

## 🚨 **주의사항**

1. **Vue 3에서는 Composition API 사용을 권장**합니다.
2. **React에서는 Provider로 감싸야** hooks가 작동합니다.
3. **SSR 환경에서는 클라이언트에서만** 초기화하세요.
4. **기존 Vue-i18n 코드**와의 호환성을 위해 legacy 모드를 지원합니다.

## 🐛 **문제 해결**

### "useBizMOBI18n must be called within..." 오류

- Vue: 플러그인이 등록되었는지 확인
- React: Provider로 컴포넌트가 감싸져 있는지 확인

### 언어 파일이 로드되지 않는 경우

- 경로가 `src/locales/*.json` 형태인지 확인
- 파일명이 언어 코드와 일치하는지 확인

### TypeScript 오류

- `@types/node` 설치 후 tsconfig에서 "node" 타입 추가
