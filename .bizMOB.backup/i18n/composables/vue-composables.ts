/**
 * Vue 3 Composables for bizMOB i18n
 * Vue 3 Composition API에서 사용할 수 있는 composables
 */

import { inject, reactive, type InjectionKey } from 'vue';
import type { UniversalI18n } from '../core/universal-i18n';

// Injection Key 정의
export const BizMOBI18nKey: InjectionKey<UniversalI18n> = Symbol('bizMOB-i18n');

/**
 * bizMOB i18n을 사용하기 위한 composable
 */
export function useBizMOBI18n() {
  const i18n = inject(BizMOBI18nKey);

  if (!i18n) {
    throw new Error('useBizMOBI18n must be called within a component that has bizMOB i18n provided');
  }

  // 반응형 상태 생성
  const state = reactive({
    locale: i18n.getCurrentLocale(),
    availableLocales: i18n.getAvailableLocales()
  });

  // 번역 함수
  const t = (key: string, params?: any): string => {
    return i18n.t(key, params);
  };

  // 언어 변경 함수
  const changeLocale = async (locale: string) => {
    await i18n.changeLocale(locale);
    state.locale = i18n.getCurrentLocale();
  };

  // 언어 감지 함수
  const detectBrowserLocale = (): string => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language.split('-')[0];
      return state.availableLocales.indexOf(browserLang) !== -1 ? browserLang : state.locale;
    }
    return state.locale;
  };

  return {
    // 상태
    ...state,

    // 함수들
    t,
    changeLocale,
    detectBrowserLocale,

    // 원본 인스턴스 (고급 사용을 위해)
    i18n
  };
}

/**
 * 간단한 번역만 필요한 경우 사용하는 composable
 */
export function useT() {
  const { t } = useBizMOBI18n();
  return t;
}
