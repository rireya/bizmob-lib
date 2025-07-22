/**
 * React I18n Adapter
 * React 환경에서 사용하는 어댑터 (조건부 로딩)
 */

import type { I18nAdapter, I18nConfig } from '../core/types';

// 간단한 i18n 인터페이스 (i18next 없이도 동작)
interface SimpleI18n {
  t: (key: string, params?: any) => string;
  changeLanguage: (locale: string) => Promise<any>;
  language: string;
  languages: string[];
}

export class ReactI18nAdapter implements I18nAdapter {
  private i18n: SimpleI18n | null = null;
  private config: I18nConfig | null = null;
  private messages: Record<string, any> = {};
  private currentLocale: string = 'ko';

  async init(config: I18nConfig): Promise<any> {
    this.config = config;
    this.messages = config.messages;
    this.currentLocale = config.locale;

    // i18next가 있는 환경에서는 i18next 사용, 없으면 자체 구현 사용
    try {
      // 전역 i18next 확인
      if (this.isI18nextAvailable()) {
        const i18next = this.getGlobalI18next();
        if (i18next) {
          await this.initWithI18next(i18next, config);
        } else {
          this.initWithSimpleI18n(config);
        }
      } else {
        this.initWithSimpleI18n(config);
      }
    } catch (error) {
      console.warn('[ReactI18nAdapter] i18next not available, using simple implementation:', error);
      this.initWithSimpleI18n(config);
    }

    return this.i18n;
  }

  /**
   * i18next 사용 가능 여부 확인
   */
  private isI18nextAvailable(): boolean {
    try {
      // 전역 객체에 i18next가 있는지 확인
      return typeof (globalThis as any).i18next !== 'undefined' ||
        typeof (window as any).i18next !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * 전역 i18next 인스턴스 가져오기
   */
  private getGlobalI18next(): any {
    try {
      return (globalThis as any).i18next || (window as any).i18next || null;
    } catch {
      return null;
    }
  }

  /**
   * i18next를 사용한 초기화
   */
  private async initWithI18next(i18next: any, config: I18nConfig): Promise<void> {
    await i18next.init({
      lng: config.locale,
      fallbackLng: config.fallbackLocale,
      interpolation: {
        escapeValue: false
      },
      resources: this.convertMessagesToResources(config.messages)
    });

    this.i18n = {
      t: i18next.t.bind(i18next),
      changeLanguage: i18next.changeLanguage.bind(i18next),
      language: i18next.language,
      languages: i18next.languages || Object.keys(config.messages)
    };

    console.log('[ReactI18nAdapter] Initialized with i18next');
  }

  /**
   * 간단한 자체 구현으로 초기화
   */
  private initWithSimpleI18n(config: I18nConfig): void {
    this.i18n = {
      t: this.simpleTranslate.bind(this),
      changeLanguage: this.simpleChangeLanguage.bind(this),
      language: this.currentLocale,
      languages: Object.keys(config.messages)
    };

    console.log('[ReactI18nAdapter] Initialized with simple implementation');
  }

  /**
   * 간단한 번역 구현
   */
  private simpleTranslate(key: string, params?: any): string {
    const keys = key.split('.');
    let value: any = this.messages[this.currentLocale];

    // 중첩된 키 탐색
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 폴백 언어에서 찾기
        value = this.messages[this.config?.fallbackLocale || 'ko'];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key;
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') return key;

    // 파라미터 치환
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] || match;
      });
    }

    return value;
  }

  /**
   * 간단한 언어 변경 구현
   */
  private async simpleChangeLanguage(locale: string): Promise<void> {
    if (this.messages[locale]) {
      this.currentLocale = locale;
      if (this.i18n) {
        this.i18n.language = locale;
      }
    }
  }

  /**
   * vue-i18n 형식의 메시지를 i18next 형식으로 변환
   */
  private convertMessagesToResources(messages: Record<string, any>): Record<string, any> {
    const resources: Record<string, any> = {};

    for (const locale in messages) {
      resources[locale] = {
        translation: messages[locale]
      };
    }

    return resources;
  }

  t(key: string, params?: any): string {
    if (!this.i18n) return key;
    return this.i18n.t(key, params);
  }

  async changeLocale(locale: string): Promise<void> {
    if (!this.i18n) return;

    try {
      await this.i18n.changeLanguage(locale);
      this.currentLocale = locale;
    } catch (error) {
      console.warn(`[ReactI18nAdapter] Failed to change locale to ${locale}:`, error);
    }
  }

  getCurrentLocale(): string {
    return this.i18n?.language || this.currentLocale;
  }

  getAvailableLocales(): string[] {
    return this.i18n?.languages || Object.keys(this.config?.messages || {});
  }

  /**
   * React hooks와 함께 사용할 수 있는 유틸리티
   */
  getReactUtils() {
    if (!this.i18n) {
      throw new Error('[ReactI18nAdapter] Not initialized');
    }

    return {
      t: this.t.bind(this),
      i18n: this.i18n,
      getCurrentLocale: this.getCurrentLocale.bind(this),
      changeLocale: this.changeLocale.bind(this),
      getAvailableLocales: this.getAvailableLocales.bind(this)
    };
  }
}
