import type { MessageLoader, I18nConfig } from './types';
import { EnvironmentDetector } from './environment';

/**
 * Universal Message Loader
 * 다양한 번들러와 프레임워크에서 locale 파일을 로드합니다.
 */
export class UniversalMessageLoader implements MessageLoader {
  private environment = EnvironmentDetector.getEnvironment();

  /**
   * 환경에 따라 적절한 방법으로 메시지를 로드합니다.
   */
  async loadMessages(): Promise<Record<string, any>> {
    try {
      switch (this.environment.bundler) {
        case 'vite':
          return await this.loadViteMessages();
        case 'webpack':
          return await this.loadWebpackMessages();
        default:
          return await this.loadStaticMessages();
      }
    } catch (error) {
      console.warn('Failed to load locale messages, using fallback:', error);
      return await this.loadStaticMessages();
    }
  }

  /**
   * Vite 환경에서 메시지를 로드합니다.
   */
  private async loadViteMessages(): Promise<Record<string, any>> {
    if (typeof import.meta === 'undefined' || !(import.meta as any).glob) {
      throw new Error('Vite environment not detected');
    }

    // Vite의 glob을 사용하여 모든 locale 파일을 동적으로 로드
    const modules = (import.meta as any).glob('@/locales/*.json', { eager: true });
    const messages: Record<string, any> = {};

    for (const path in modules) {
      const matched = path.match(/\/([A-Za-z0-9-_]+)\.json$/i);
      if (matched && matched.length > 1) {
        const locale = matched[1];
        const module = modules[path] as { default: any };
        messages[locale] = module.default || module;
        console.log(`[UniversalMessageLoader] Loaded locale: ${locale} from ${path}`);
      }
    }

    console.log(`[UniversalMessageLoader] Vite: Loaded ${Object.keys(messages).length} locales:`, Object.keys(messages));
    return messages;
  }

  /**
   * Webpack 환경에서 메시지를 로드합니다.
   */
  private async loadWebpackMessages(): Promise<Record<string, any>> {
    const messages: Record<string, any> = {};

    // 먼저 require.context를 사용하여 동적 로드 시도 (Webpack 환경)
    if (typeof (globalThis as any).require !== 'undefined' && (globalThis as any).require.context) {
      try {
        return await this.loadWebpackWithContext();
      } catch (error) {
        console.warn('[UniversalMessageLoader] require.context failed, trying fallback method:', error);
      }
    }

    // 폴백: 일반적인 언어 목록으로 시도
    const commonLocales = await this.getCommonLocales();

    await Promise.all(
      commonLocales.map(async (locale) => {
        try {
          // 다양한 경로 패턴을 시도
          const paths = [
            `@/locales/${locale}.json`,
            `../../../locales/${locale}.json`,
            `./locales/${locale}.json`,
            `/src/locales/${locale}.json`
          ];

          for (const path of paths) {
            try {
              const module = await import(path);
              messages[locale] = module.default || module;
              console.log(`[UniversalMessageLoader] Loaded locale: ${locale} from ${path}`);
              break;
            } catch {
              // 다음 경로 시도
              continue;
            }
          }
        } catch (error) {
          console.warn(`[UniversalMessageLoader] Failed to load locale ${locale}:`, error);
        }
      })
    );

    console.log(`[UniversalMessageLoader] Webpack: Loaded ${Object.keys(messages).length} locales:`, Object.keys(messages));
    return messages;
  }

  /**
   * Webpack의 require.context를 사용하여 로드합니다.
   */
  private async loadWebpackWithContext(): Promise<Record<string, any>> {
    const messages: Record<string, any> = {};

    try {
      // require.context로 locales 디렉토리의 모든 .json 파일을 가져옴
      const requireFn = (globalThis as any).require;
      const localesContext = requireFn.context('@/locales', false, /\.json$/);

      localesContext.keys().forEach((key: string) => {
        const matched = key.match(/\.\/([A-Za-z0-9-_]+)\.json$/i);
        if (matched && matched.length > 1) {
          const locale = matched[1];
          const module = localesContext(key);
          messages[locale] = module.default || module;
          console.log(`[UniversalMessageLoader] Loaded locale: ${locale} from context`);
        }
      });

      return messages;
    } catch (error) {
      throw new Error(`require.context loading failed: ${error}`);
    }
  }

  /**
   * 일반적인 언어 목록을 반환합니다.
   */
  private async getCommonLocales(): Promise<string[]> {
    // 기본 언어 목록 (확장 가능)
    const baseLocales = ['ko', 'en', 'ja', 'zh', 'es', 'fr', 'de', 'it', 'pt', 'ru'];

    // 환경 변수에서 추가 언어 목록을 가져올 수 있음
    const envLocales = this.environment.envVars.SUPPORTED_LOCALES?.split(',') || [];

    // 중복 제거하고 반환
    return [...new Set([...baseLocales, ...envLocales])];
  }

  /**
   * 실제로 존재하는 locale 파일들을 감지합니다.
   */
  async discoverAvailableLocales(): Promise<string[]> {
    const locales: string[] = [];

    try {
      // Vite 환경에서 감지
      if (this.environment.bundler === 'vite' && typeof import.meta !== 'undefined' && (import.meta as any).glob) {
        const modules = (import.meta as any).glob('@/locales/*.json', { eager: false });
        for (const path in modules) {
          const matched = path.match(/\/([A-Za-z0-9-_]+)\.json$/i);
          if (matched && matched.length > 1) {
            locales.push(matched[1]);
          }
        }
      }
      // Webpack 환경에서 감지
      else if (this.environment.bundler === 'webpack') {
        const commonLocales = await this.getCommonLocales();

        // 각 언어 파일이 실제로 존재하는지 확인
        for (const locale of commonLocales) {
          try {
            await import(`@/locales/${locale}.json`);
            locales.push(locale);
          } catch {
            // 파일이 없으면 무시
          }
        }
      }
    } catch (error) {
      console.warn('[UniversalMessageLoader] Failed to discover locales:', error);
    }

    return locales.length > 0 ? locales : ['ko', 'en']; // 기본값
  }

  /**
   * 사용 가능한 모든 언어 목록을 반환합니다.
   */
  async getAvailableLocales(): Promise<string[]> {
    try {
      const messages = await this.loadMessages();
      return Object.keys(messages);
    } catch {
      return await this.discoverAvailableLocales();
    }
  }

  /**
   * 정적 메시지를 로드합니다 (폴백용).
   */
  private async loadStaticMessages(): Promise<Record<string, any>> {
    return {
      ko: {
        common: {
          loading: '로딩 중...',
          error: '오류가 발생했습니다.',
          success: '성공했습니다.',
          cancel: '취소',
          confirm: '확인'
        }
      },
      en: {
        common: {
          loading: 'Loading...',
          error: 'An error occurred.',
          success: 'Success!',
          cancel: 'Cancel',
          confirm: 'Confirm'
        }
      }
    };
  }

  /**
   * 기본 언어를 반환합니다.
   */
  getDefaultLocale(): string {
    return this.environment.envVars.I18N_LOCALE || 'ko';
  }

  /**
   * 폴백 언어를 반환합니다.
   */
  getFallbackLocale(): string {
    return this.environment.envVars.I18N_FALLBACK_LOCALE || 'ko';
  }
}
