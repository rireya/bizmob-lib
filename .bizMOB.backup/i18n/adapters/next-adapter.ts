/**
 * Next.js I18n Adapter
 * Next.js 환경에서 사용하는 어댑터 (next-i18next 지원)
 */

import type { I18nAdapter, I18nConfig } from '../core/types';

// 간단한 i18n 인터페이스 (next-i18next 없이도 동작)
interface SimpleI18n {
  t: (key: string, params?: any) => string;
  changeLanguage: (locale: string) => Promise<any>;
  language: string;
  languages: string[];
}

export class NextI18nAdapter implements I18nAdapter {
  private i18n: SimpleI18n | null = null;
  private config: I18nConfig | null = null;
  private messages: Record<string, any> = {};
  private currentLocale: string = 'ko';

  async init(config: I18nConfig): Promise<any> {
    this.config = config;
    this.messages = config.messages;
    this.currentLocale = config.locale;

    // next-i18next가 있는 환경에서는 next-i18next 사용, 없으면 자체 구현 사용
    try {
      if (this.isNextI18nextAvailable()) {
        await this.initWithNextI18next(config);
      } else {
        this.initWithSimpleI18n(config);
      }
    } catch (error) {
      console.warn('[NextI18nAdapter] next-i18next not available, using simple implementation:', error);
      this.initWithSimpleI18n(config);
    }

    return this.i18n;
  }

  /**
   * next-i18next 사용 가능 여부 확인
   */
  private isNextI18nextAvailable(): boolean {
    try {
      // 전역 객체에 next-i18next가 있는지 확인
      return typeof (globalThis as any).nextI18Next !== 'undefined' ||
        typeof (window as any).nextI18Next !== 'undefined';
    } catch {
      return false;
    }
  }

  /**
   * next-i18next를 사용한 초기화
   */
  private async initWithNextI18next(config: I18nConfig): Promise<void> {
    // Next.js의 경우 서버사이드에서 이미 i18n이 설정되어 있을 수 있음
    // 여기서는 클라이언트 사이드 추가 설정만 진행

    this.i18n = {
      t: this.nextTranslate.bind(this),
      changeLanguage: this.nextChangeLanguage.bind(this),
      language: this.currentLocale,
      languages: Object.keys(config.messages)
    };

    console.log('[NextI18nAdapter] Initialized with Next.js i18n');
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

    console.log('[NextI18nAdapter] Initialized with simple implementation');
  }

  /**
   * Next.js 번역 구현
   */
  private nextTranslate(key: string, params?: any): string {
    // Next.js router에서 locale 정보 확인
    if (typeof window !== 'undefined' && (window as any).location) {
      const pathname = (window as any).location.pathname;
      const localeMatch = pathname.match(/^\/([a-z]{2})\//);
      if (localeMatch) {
        this.currentLocale = localeMatch[1];
      }
    }

    return this.simpleTranslate(key, params);
  }

  /**
   * Next.js 언어 변경 구현
   */
  private async nextChangeLanguage(locale: string): Promise<void> {
    // Next.js router를 통한 언어 변경
    if (typeof window !== 'undefined' && (window as any).location) {
      const currentPath = (window as any).location.pathname;
      const newPath = currentPath.replace(/^\/[a-z]{2}\//, `/${locale}/`);

      // 실제 Next.js 환경에서는 router.push를 사용해야 함
      // 여기서는 간단한 예시만 제공
      console.log(`[NextI18nAdapter] Language change requested: ${locale} (path: ${newPath})`);
    }

    this.currentLocale = locale;
    if (this.i18n) {
      this.i18n.language = locale;
    }
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
      console.warn(`[NextI18nAdapter] Failed to change locale to ${locale}:`, error);
    }
  }

  getCurrentLocale(): string {
    return this.i18n?.language || this.currentLocale;
  }

  getAvailableLocales(): string[] {
    return this.i18n?.languages || Object.keys(this.config?.messages || {});
  }

  /**
   * Next.js와 함께 사용할 수 있는 유틸리티
   */
  getNextUtils() {
    if (!this.i18n) {
      throw new Error('[NextI18nAdapter] Not initialized');
    }

    return {
      t: this.t.bind(this),
      i18n: this.i18n,
      getCurrentLocale: this.getCurrentLocale.bind(this),
      changeLocale: this.changeLocale.bind(this),
      getAvailableLocales: this.getAvailableLocales.bind(this),
      // Next.js 특화 유틸리티
      getLocalizedPath: (path: string, locale?: string) => {
        const targetLocale = locale || this.currentLocale;
        return `/${targetLocale}${path.startsWith('/') ? path : '/' + path}`;
      }
    };
  }
}
