/**
 * Vue 3 I18n Adapter
 * Vue 3 환경에서 vue-i18n을 사용하는 어댑터
 */

import type { I18nAdapter, I18nConfig } from '../core/types';

// Vue-i18n 관련 타입들 (동적 import 시 사용)
interface VueI18nInstance {
  global: {
    t: (key: string, params?: any) => string;
    locale: any;
    availableLocales: string[];
    setLocaleMessage: (locale: string, message: any) => void;
  };
}

export class VueI18nAdapter implements I18nAdapter {
  private i18n: VueI18nInstance | null = null;
  private config: I18nConfig | null = null;

  async init(config: I18nConfig): Promise<any> {
    try {
      // vue-i18n 동적 import
      const { createI18n } = await import('vue-i18n');

      this.config = config;
      this.i18n = createI18n({
        legacy: false,
        globalInjection: false, // Composition API 사용을 위해 false
        locale: config.locale,
        fallbackLocale: config.fallbackLocale,
        messages: config.messages
      }) as VueI18nInstance;

      return this.i18n;
    } catch (error) {
      console.error('[VueI18nAdapter] Failed to initialize vue-i18n:', error);
      throw error;
    }
  }

  t(key: string, params?: any): string {
    if (!this.i18n) return key;
    return this.i18n.global.t(key, params);
  }

  async changeLocale(locale: string): Promise<void> {
    if (!this.i18n || !this.config) return;

    if (this.config.messages[locale]) {
      this.i18n.global.locale.value = locale;
    } else {
      console.warn(`[VueI18nAdapter] Locale ${locale} not found`);
    }
  }

  getCurrentLocale(): string {
    return this.i18n?.global.locale.value || this.config?.locale || 'ko';
  }

  getAvailableLocales(): string[] {
    return this.i18n?.global.availableLocales || Object.keys(this.config?.messages || {});
  }

  /**
   * Vue 3 Composition API에서 사용할 수 있는 composable 반환
   */
  getComposable() {
    if (!this.i18n) {
      throw new Error('[VueI18nAdapter] Not initialized');
    }

    return {
      t: this.t.bind(this),
      locale: this.getCurrentLocale(),
      availableLocales: this.getAvailableLocales(),
      changeLocale: this.changeLocale.bind(this)
    };
  }
}
