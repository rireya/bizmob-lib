import type { I18nAdapter, I18nConfig } from './types';
import { UniversalMessageLoader } from './loader';
import { EnvironmentDetector } from './environment';
import { AdapterRegistry } from '../adapters/registry';

/**
 * Universal I18n Core
 * 모든 프레임워크에서 동일한 방식으로 사용할 수 있는 i18n 코어
 */
export class UniversalI18n {
  private adapter: I18nAdapter | null = null;
  private config: I18nConfig | null = null;
  private loader: UniversalMessageLoader;
  private environment = EnvironmentDetector.getEnvironment();
  private registry = AdapterRegistry.getInstance();

  constructor() {
    this.loader = new UniversalMessageLoader();
  }

  /**
   * I18n을 초기화합니다.
   */
  async init(options?: Partial<I18nConfig>): Promise<void> {
    try {
      const messages = options?.messages || await this.loader.loadMessages();

      this.config = {
        locale: options?.locale || this.loader.getDefaultLocale(),
        fallbackLocale: options?.fallbackLocale || this.loader.getFallbackLocale(),
        messages
      };

      this.adapter = await this.createAdapter();
      await this.adapter.init(this.config);

      console.log(`[bizMOB-i18n] Initialized with ${this.environment.framework} framework`, {
        locale: this.config.locale,
        availableLocales: Object.keys(messages),
        bundler: this.environment.bundler
      });
    } catch (error) {
      console.error('[bizMOB-i18n] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * 환경에 맞는 어댑터를 생성합니다.
   */
  private async createAdapter(): Promise<I18nAdapter> {
    const framework = this.environment.framework;

    try {
      // 레지스트리에서 어댑터 생성
      return await this.registry.createAdapter(framework);
    } catch (error) {
      console.warn(`[UniversalI18n] Failed to load ${framework} adapter, trying fallback:`, error);

      // 폴백 어댑터 시도
      const fallbackFramework = this.registry.getFallbackAdapter();
      if (fallbackFramework !== framework) {
        try {
          return await this.registry.createAdapter(fallbackFramework);
        } catch (fallbackError) {
          console.error('[UniversalI18n] Fallback adapter also failed:', fallbackError);
          throw new Error(`Failed to load any adapter. Last error: ${fallbackError}`);
        }
      } else {
        throw error;
      }
    }
  }

  /**
   * 번역 함수
   */
  t(key: string, params?: any): string {
    if (!this.adapter) {
      console.warn('[bizMOB-i18n] Not initialized yet');
      return key;
    }
    return this.adapter.t(key, params);
  }

  /**
   * 언어 변경
   */
  async changeLocale(locale: string): Promise<void> {
    if (!this.adapter) {
      throw new Error('[bizMOB-i18n] Not initialized yet');
    }
    await this.adapter.changeLocale(locale);
  }

  /**
   * 현재 언어 반환
   */
  getCurrentLocale(): string {
    return this.adapter?.getCurrentLocale() || this.config?.locale || 'ko';
  }

  /**
   * 사용 가능한 언어 목록 반환
   */
  getAvailableLocales(): string[] {
    return this.adapter?.getAvailableLocales() || Object.keys(this.config?.messages || {});
  }

  /**
   * 초기화 상태 확인
   */
  isInitialized(): boolean {
    return this.adapter !== null && this.config !== null;
  }

  /**
   * 환경 정보 반환 (디버깅용)
   */
  getEnvironmentInfo() {
    return this.environment;
  }

  /**
   * 사용 가능한 어댑터 목록 반환
   */
  getAvailableAdapters(): string[] {
    return this.registry.getAvailableAdapters();
  }

  /**
   * 현재 사용 중인 어댑터 정보 반환
   */
  getCurrentAdapterInfo() {
    return this.registry.getAdapterInfo(this.environment.framework);
  }

  /**
   * 어댑터 의존성 상태 확인
   */
  checkAdapterDependencies(framework?: string) {
    const targetFramework = framework || this.environment.framework;
    return this.registry.checkDependencies(targetFramework);
  }

  /**
   * 사용 가능한 언어 목록을 동적으로 가져옵니다.
   */
  async getDiscoveredLocales(): Promise<string[]> {
    return await this.loader.getAvailableLocales();
  }

  /**
   * 로더 정보를 반환합니다.
   */
  getLoaderInfo() {
    return {
      environment: this.environment,
      defaultLocale: this.loader.getDefaultLocale(),
      fallbackLocale: this.loader.getFallbackLocale()
    };
  }
}
