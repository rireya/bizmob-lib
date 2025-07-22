/**
 * React Hooks for bizMOB i18n
 * React에서 사용할 수 있는 hooks (React 환경에서만 동작)
 * Vue 프로젝트에서는 실제로 호출되지 않으므로 안전합니다.
 */

import type { UniversalI18n } from '../core/universal-i18n';

// React 타입 정의 (실제 react 패키지 없이도 타입 정의 가능)
interface ReactContext<T> {
  Provider: any;
  Consumer: any;
  _currentValue: T;
}

// Mock React Context (실제 React가 없는 환경에서 사용)
const createMockContext = <T>(defaultValue: T): ReactContext<T> => ({
  Provider: null,
  Consumer: null,
  _currentValue: defaultValue
});

// Context 정의 (초기값으로 mock 사용)
export const BizMOBI18nContext: ReactContext<UniversalI18n | null> = createMockContext(null);

/**
 * 환경 체크 함수
 */
export function isReactEnvironment(): boolean {
  try {
    return typeof window !== 'undefined' &&
      ((window as any).React || (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__);
  } catch {
    return false;
  }
}

/**
 * React hooks가 사용 가능한지 체크
 */
function checkReactHooks() {
  if (!isReactEnvironment()) {
    throw new Error('[bizMOB-i18n] React environment not detected. This hook can only be used in React projects.');
  }
}

/**
 * bizMOB i18n을 사용하기 위한 hook
 * 주의: React 환경에서만 호출해야 합니다.
 */
export function useBizMOBI18n() {
  checkReactHooks();

  // React가 실제로 존재하는 환경에서만 이 코드가 실행됩니다.
  // Vue 환경에서는 위의 checkReactHooks()에서 에러가 발생하므로 여기까지 오지 않습니다.

  // 실제 React hooks는 런타임에 동적으로 사용됩니다.
  // 이 부분은 React 환경에서만 실행되므로 안전합니다.
  const React = (globalThis as any).React || (window as any).React;

  if (!React) {
    throw new Error('[bizMOB-i18n] React not found in global scope');
  }

  const i18n = React.useContext(BizMOBI18nContext);

  if (!i18n) {
    throw new Error('useBizMOBI18n must be used within BizMOBI18nProvider');
  }

  const [locale, setLocale] = React.useState(i18n.getCurrentLocale());
  const [availableLocales] = React.useState(i18n.getAvailableLocales());

  // 번역 함수 (useCallback으로 최적화)
  const t = React.useCallback((key: string, params?: any): string => {
    return i18n.t(key, params);
  }, [i18n]);

  // 언어 변경 함수
  const changeLocale = React.useCallback(async (newLocale: string) => {
    await i18n.changeLocale(newLocale);
    setLocale(i18n.getCurrentLocale());
  }, [i18n]);

  // 브라우저 언어 감지 함수
  const detectBrowserLocale = React.useCallback((): string => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return availableLocales.indexOf(browserLang) !== -1 ? browserLang : locale;
    }
    return locale;
  }, [availableLocales, locale]);

  return {
    // 상태
    locale,
    availableLocales,

    // 함수들
    t,
    changeLocale,
    detectBrowserLocale,

    // 원본 인스턴스 (고급 사용을 위해)
    i18n
  };
}

/**
 * 간단한 번역만 필요한 경우 사용하는 hook
 * 주의: React 환경에서만 호출해야 합니다.
 */
export function useT() {
  const { t } = useBizMOBI18n();
  return t;
}

/**
 * React Context를 실제 React Context로 초기화
 * React 프로젝트에서 앱 시작 시 호출해야 합니다.
 */
export function initializeReactContext() {
  if (!isReactEnvironment()) {
    console.warn('[bizMOB-i18n] Not in React environment, skipping context initialization');
    return BizMOBI18nContext;
  }

  const React = (globalThis as any).React || (window as any).React;

  if (React && React.createContext) {
    // 실제 React Context로 교체
    const realContext = (React as any).createContext(null);

    // Mock context의 속성들을 실제 context로 복사
    Object.assign(BizMOBI18nContext, realContext);

    console.log('[bizMOB-i18n] React context initialized');
    return BizMOBI18nContext;
  }

  return BizMOBI18nContext;
}
