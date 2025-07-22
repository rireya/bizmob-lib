/**
 * bizMOB Universal i18n
 * Vue 3, React, Next.js, Nuxt.js에서 동일한 방식으로 사용할 수 있는 i18n 라이브러리
 */

import { UniversalI18n } from './core/universal-i18n';
import type { I18nConfig } from './core/types';

// =============================================================================
// 🎯 Universal API (모든 프레임워크에서 동일하게 사용)
// =============================================================================

/**
 * 새로운 i18n 인스턴스를 생성합니다.
 * @param options 초기화 옵션
 * @returns 초기화된 UniversalI18n 인스턴스
 */
export async function createBizMOBI18n(options?: Partial<I18nConfig>): Promise<UniversalI18n> {
  const i18n = new UniversalI18n();
  await i18n.init(options);
  return i18n;
}

/**
 * 싱글톤 인스턴스 (전역에서 하나만 사용하는 경우)
 */
let globalI18nInstance: UniversalI18n | null = null;

/**
 * 전역 i18n 인스턴스를 초기화하거나 반환합니다.
 */
export async function getBizMOBI18n(options?: Partial<I18nConfig>): Promise<UniversalI18n> {
  if (!globalI18nInstance) {
    globalI18nInstance = await createBizMOBI18n(options);
  }
  return globalI18nInstance;
}

// =============================================================================
// 📦 Core Classes & Types Export
// =============================================================================
export { UniversalI18n } from './core/universal-i18n';
export { EnvironmentDetector } from './core/environment';
export type { I18nConfig, I18nAdapter, MessageLoader, EnvironmentConfig } from './core/types';

// =============================================================================
// 🎨 Framework-specific Exports
// =============================================================================

// Vue 3 관련 exports
export { BizMOBI18nKey, useBizMOBI18n, useT as useVueT } from './composables/vue-composables';

// React 관련 exports (조건부 - React 환경에서만 사용)
// 실제 함수들은 React 환경에서만 호출되므로 Vue 환경에서는 안전합니다.
export {
  BizMOBI18nContext as ReactBizMOBI18nContext,
  useBizMOBI18n as useReactBizMOBI18n,
  useT as useReactT,
  isReactEnvironment,
  initializeReactContext
} from './composables/react-hooks';

// =============================================================================
// 🔧 Framework-specific Plugins
// =============================================================================

/**
 * Vue 3 플러그인 생성
 */
export async function createBizMOBVuePlugin(options?: Partial<I18nConfig>) {
  const { createI18n } = await import('vue-i18n');
  const universalI18n = await createBizMOBI18n(options);

  return {
    install(app: any) {
      // Universal i18n 인스턴스 제공
      app.provide('bizMOB-i18n', universalI18n);

      // Vue-i18n 인스턴스도 제공 (기존 코드 호환성)
      const vueI18n = createI18n({
        legacy: false,
        globalInjection: false,
        locale: universalI18n.getCurrentLocale(),
        fallbackLocale: options?.fallbackLocale || 'ko',
        messages: options?.messages || {}
      });

      app.use(vueI18n);

      console.log('[bizMOB-i18n] Vue 3 plugin initialized');
    }
  };
}

/**
 * React Provider 컴포넌트 생성 함수 (React 환경에서만 사용)
 */
export async function createBizMOBReactProvider(options?: Partial<I18nConfig>) {
  const universalI18n = await createBizMOBI18n(options);

  return {
    i18n: universalI18n,
    Provider: ({ children }: { children: any }) => {
      console.log('[bizMOB-i18n] React Provider created (mock for Vue environment)');
      // Vue 환경에서는 실제로 사용되지 않으므로 children을 그대로 반환
      return children;
    }
  };
}

// =============================================================================
// 🧪 Utility Functions
// =============================================================================

/**
 * 브라우저 언어 감지
 */
export function detectBrowserLocale(availableLocales: string[] = ['ko', 'en']): string {
  if (typeof navigator === 'undefined') return 'ko';

  const browserLang = navigator.language.split('-')[0];
  return availableLocales.indexOf(browserLang) !== -1 ? browserLang : 'ko';
}

/**
 * 환경 정보 확인 (디버깅용)
 */
export async function getEnvironmentInfo() {
  const { EnvironmentDetector } = await import('./core/environment');
  return EnvironmentDetector.getEnvironment();
}

/**
 * 사용 가능한 언어 목록을 동적으로 감지
 */
export async function discoverAvailableLocales(): Promise<string[]> {
  const { UniversalMessageLoader } = await import('./core/loader');
  const loader = new UniversalMessageLoader();
  return await loader.getAvailableLocales();
}

/**
 * 로케일 파일들을 사전 로드 (성능 최적화용)
 */
export async function preloadLocales(locales?: string[]): Promise<Record<string, any>> {
  const { UniversalMessageLoader } = await import('./core/loader');
  const loader = new UniversalMessageLoader();

  if (!locales) {
    // 모든 사용 가능한 로케일 로드
    return await loader.loadMessages();
  } else {
    // 지정된 로케일만 로드
    const messages: Record<string, any> = {};
    const allMessages = await loader.loadMessages();

    for (const locale of locales) {
      if (allMessages[locale]) {
        messages[locale] = allMessages[locale];
      }
    }

    return messages;
  }
}

// =============================================================================
// 🔄 Legacy Support (기존 Vue 코드 호환성)
// =============================================================================

/**
 * @deprecated 기존 Vue-i18n 방식 (하위 호환성을 위해 유지)
 * 새로운 코드에서는 createBizMOBI18n을 사용하세요.
 */
export async function createLegacyVueI18n() {
  try {
    const { createI18n } = await import('vue-i18n');
    const universalI18n = await getBizMOBI18n();

    return createI18n({
      legacy: false,
      globalInjection: true,
      locale: universalI18n.getCurrentLocale(),
      fallbackLocale: 'ko',
      messages: {} // 메시지는 Universal에서 관리
    });
  } catch (error) {
    console.error('[bizMOB-i18n] Legacy Vue i18n creation failed:', error);
    throw error;
  }
}

// 기본 export (하위 호환성)
export default createLegacyVueI18n;
