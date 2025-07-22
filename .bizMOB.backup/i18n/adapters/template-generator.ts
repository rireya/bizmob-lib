/**
 * Adapter Template Generator
 * 새로운 프레임워크 어댑터를 위한 템플릿을 생성합니다.
 */

export interface AdapterTemplateOptions {
  frameworkName: string;
  className: string;
  fileName: string;
  dependencies: string[];
  optionalDependencies: string[];
  hasSSR: boolean;
  customMethods?: string[];
}

export class AdapterTemplateGenerator {
  /**
   * 새로운 어댑터 파일 템플릿을 생성합니다.
   */
  static generateAdapterTemplate(options: AdapterTemplateOptions): string {
    const {
      frameworkName,
      className,
      dependencies,
      optionalDependencies,
      hasSSR,
      customMethods = []
    } = options;

    return `/**
 * ${frameworkName} I18n Adapter
 * ${frameworkName} 환경에서 사용하는 어댑터
 */

import type { I18nAdapter, I18nConfig } from '../core/types';

// 간단한 i18n 인터페이스 (외부 라이브러리 없이도 동작)
interface SimpleI18n {
  t: (key: string, params?: any) => string;
  changeLanguage: (locale: string) => Promise<any>;
  language: string;
  languages: string[];
}

export class ${className} implements I18nAdapter {
  private i18n: SimpleI18n | null = null;
  private config: I18nConfig | null = null;
  private messages: Record<string, any> = {};
  private currentLocale: string = 'ko';

  async init(config: I18nConfig): Promise<any> {
    this.config = config;
    this.messages = config.messages;
    this.currentLocale = config.locale;

    try {
      if (this.isExternalLibraryAvailable()) {
        await this.initWithExternalLibrary(config);
      } else {
        this.initWithSimpleI18n(config);
      }
    } catch (error) {
      console.warn('[${className}] External library not available, using simple implementation:', error);
      this.initWithSimpleI18n(config);
    }

    return this.i18n;
  }

  /**
   * 외부 i18n 라이브러리 사용 가능 여부 확인
   */
  private isExternalLibraryAvailable(): boolean {
    try {
${this.generateDependencyChecks(dependencies, optionalDependencies)}
      return false;
    } catch {
      return false;
    }
  }

  /**
   * 외부 라이브러리를 사용한 초기화
   */
  private async initWithExternalLibrary(config: I18nConfig): Promise<void> {
    // TODO: ${frameworkName} 전용 i18n 라이브러리 초기화 로직 구현

    this.i18n = {
      t: this.externalTranslate.bind(this),
      changeLanguage: this.externalChangeLanguage.bind(this),
      language: this.currentLocale,
      languages: Object.keys(config.messages)
    };

    console.log('[${className}] Initialized with ${frameworkName} i18n library');
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

    console.log('[${className}] Initialized with simple implementation');
  }

  /**
   * 외부 라이브러리 번역 구현
   */
  private externalTranslate(key: string, params?: any): string {
    // TODO: ${frameworkName} 전용 번역 로직 구현
    return this.simpleTranslate(key, params);
  }

  /**
   * 외부 라이브러리 언어 변경 구현
   */
  private async externalChangeLanguage(locale: string): Promise<void> {
    // TODO: ${frameworkName} 전용 언어 변경 로직 구현
    await this.simpleChangeLanguage(locale);
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
      return value.replace(/\\{(\\w+)\\}/g, (match, paramKey) => {
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
      console.warn(\`[${className}] Failed to change locale to \${locale}:\`, error);
    }
  }

  getCurrentLocale(): string {
    return this.i18n?.language || this.currentLocale;
  }

  getAvailableLocales(): string[] {
    return this.i18n?.languages || Object.keys(this.config?.messages || {});
  }

${customMethods.map(method => `  /**
   * ${frameworkName} 전용 메서드: ${method}
   */
  ${method}() {
    // TODO: ${method} 구현
  }`).join('\n\n')}

  /**
   * ${frameworkName}와 함께 사용할 수 있는 유틸리티
   */
  get${frameworkName}Utils() {
    if (!this.i18n) {
      throw new Error('[${className}] Not initialized');
    }

    return {
      t: this.t.bind(this),
      i18n: this.i18n,
      getCurrentLocale: this.getCurrentLocale.bind(this),
      changeLocale: this.changeLocale.bind(this),
      getAvailableLocales: this.getAvailableLocales.bind(this)${hasSSR ? ',\n      // SSR 지원 유틸리티\n      isSSR: typeof window === \'undefined\'' : ''}
    };
  }
}`;
  }

  /**
   * 의존성 체크 코드를 생성합니다.
   */
  private static generateDependencyChecks(dependencies: string[], optionalDependencies: string[]): string {
    const checks: string[] = [];

    // 필수 의존성 체크
    dependencies.forEach(dep => {
      checks.push(`      // ${dep} 체크`);
      checks.push(`      if (typeof (globalThis as any).${dep} !== 'undefined') return true;`);
      checks.push(`      if (typeof (window as any).${dep} !== 'undefined') return true;`);
    });

    // 선택적 의존성 체크
    optionalDependencies.forEach(dep => {
      checks.push(`      // ${dep} 체크 (선택적)`);
      checks.push(`      if (typeof (globalThis as any).${dep} !== 'undefined') return true;`);
      checks.push(`      if (typeof (window as any).${dep} !== 'undefined') return true;`);
    });

    return checks.join('\n');
  }

  /**
   * 어댑터 설정을 JSON으로 생성합니다.
   */
  static generateAdapterConfig(options: AdapterTemplateOptions): object {
    const { frameworkName, className, fileName, dependencies, optionalDependencies, hasSSR } = options;

    return {
      [frameworkName]: {
        name: className,
        file: fileName,
        framework: frameworkName,
        dependencies,
        optionalDependencies,
        environments: hasSSR ? ['browser', 'ssr'] : ['browser'],
        bundlers: ['vite', 'webpack', 'rollup'],
        description: `${frameworkName} i18n adapter`
      }
    };
  }

  /**
   * 완전한 어댑터 세트업을 위한 가이드를 생성합니다.
   */
  static generateSetupGuide(options: AdapterTemplateOptions): string {
    const { frameworkName, className, fileName } = options;

    return `# ${frameworkName} Adapter Setup Guide

## 1. 파일 생성
- 파일명: ${fileName}
- 클래스명: ${className}

## 2. adapters.config.json에 추가
어댑터 설정을 추가하세요:

\`\`\`json
${JSON.stringify(this.generateAdapterConfig(options), null, 2)}
\`\`\`

## 3. 구현해야 할 메서드들
- \`initWithExternalLibrary()\`: ${frameworkName} 전용 라이브러리 초기화
- \`externalTranslate()\`: ${frameworkName} 전용 번역 로직
- \`externalChangeLanguage()\`: ${frameworkName} 전용 언어 변경 로직

## 4. 테스트
\`\`\`typescript
import { createBizMOBI18n } from '@/bizMOB/i18n';

const i18n = await createBizMOBI18n();
console.log('Current framework:', i18n.getEnvironmentInfo().framework);
console.log('Available adapters:', i18n.getAvailableAdapters());
\`\`\`

## 5. 프레임워크별 특화 기능 추가
${frameworkName} 고유의 기능들을 \`get${frameworkName}Utils()\` 메서드에 추가하세요.
`;
  }

  /**
   * CLI를 위한 대화형 어댑터 생성기
   */
  static async createInteractiveGenerator() {
    // 실제 CLI 환경에서 사용할 수 있는 대화형 생성기
    // inquirer 등을 사용하여 구현 가능
    console.log('Interactive Adapter Generator - Coming Soon!');
  }
}
