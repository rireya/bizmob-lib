/**
 * Vanilla JavaScript I18n Adapter
 * 순수 JavaScript 환경에서 사용하는 기본 i18n 어댑터
 */

import type { I18nAdapter, I18nConfig } from '../core/types';

export class VanillaI18nAdapter implements I18nAdapter {
  private config: I18nConfig | null = null;
  private currentLocale: string = 'ko';

  async init(config: I18nConfig): Promise<any> {
    this.config = config;
    this.currentLocale = config.locale;
    return this;
  }

  t(key: string, params?: any): string {
    if (!this.config) return key;

    const keys = key.split('.');
    let value: any = this.config.messages[this.currentLocale];

    // 중첩된 키 탐색
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // 폴백 언어에서 찾기
        value = this.config.messages[this.config.fallbackLocale];
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return key; // 키를 찾을 수 없으면 원래 키 반환
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

  async changeLocale(locale: string): Promise<void> {
    if (this.config && this.config.messages[locale]) {
      this.currentLocale = locale;
    } else {
      console.warn(`[VanillaI18n] Locale ${locale} not found`);
    }
  }

  getCurrentLocale(): string {
    return this.currentLocale;
  }

  getAvailableLocales(): string[] {
    return this.config ? Object.keys(this.config.messages) : [];
  }
}
