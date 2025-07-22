import type { EnvironmentConfig } from './types';
import { AdapterRegistry } from '../adapters/registry';

/**
 * Environment Detection Utility
 * 런타임에서 사용 중인 프레임워크와 번들러를 감지합니다.
 */
export class EnvironmentDetector {
  /**
   * 현재 실행 중인 프레임워크를 감지합니다.
   */
  static detectFramework(): EnvironmentConfig['framework'] {
    if (typeof window === 'undefined') return 'vanilla';

    const registry = AdapterRegistry.getInstance();
    const detectionOrder = registry.getDetectionOrder();

    // 설정된 순서대로 프레임워크 감지
    for (const framework of detectionOrder) {
      if (this.detectSpecificFramework(framework)) {
        return framework as EnvironmentConfig['framework'];
      }
    }

    return registry.getFallbackAdapter() as EnvironmentConfig['framework'];
  }

  /**
   * 특정 프레임워크를 감지합니다.
   */
  private static detectSpecificFramework(framework: string): boolean {
    switch (framework) {
      case 'next':
        return this.detectNext();
      case 'nuxt':
        return this.detectNuxt();
      case 'vue':
        return this.detectVue();
      case 'react':
        return this.detectReact();
      case 'svelte':
        return this.detectSvelte();
      case 'angular':
        return this.detectAngular();
      default:
        return false;
    }
  }

  /**
   * Next.js 감지
   */
  private static detectNext(): boolean {
    return typeof (window as any).__NEXT_DATA__ !== 'undefined' ||
      typeof (globalThis as any).__NEXT_DATA__ !== 'undefined';
  }

  /**
   * Nuxt.js 감지
   */
  private static detectNuxt(): boolean {
    return typeof (window as any).__NUXT__ !== 'undefined' ||
      typeof (window as any).$nuxt !== 'undefined' ||
      typeof (globalThis as any).__NUXT__ !== 'undefined';
  }

  /**
   * Vue 감지
   */
  private static detectVue(): boolean {
    if ((window as any).Vue || (window as any).__VUE__) return true;
    if (typeof document !== 'undefined') {
      const vueApp = document.querySelector('[data-v-]') || document.querySelector('.vue-app');
      if (vueApp) return true;
    }
    return false;
  }

  /**
   * React 감지
   */
  private static detectReact(): boolean {
    if ((window as any).React || (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) return true;
    if (typeof document !== 'undefined') {
      const reactRoot = document.querySelector('[data-reactroot]') || document.querySelector('#root');
      if (reactRoot) return true;
    }
    return false;
  }

  /**
   * Svelte 감지
   */
  private static detectSvelte(): boolean {
    return typeof (window as any).__SVELTE__ !== 'undefined' ||
      typeof (globalThis as any).__SVELTE__ !== 'undefined';
  }

  /**
   * Angular 감지
   */
  private static detectAngular(): boolean {
    return typeof (window as any).ng !== 'undefined' ||
      typeof (window as any).getAllAngularRootElements !== 'undefined';
  }

  /**
   * 현재 사용 중인 번들러를 감지합니다.
   */
  static detectBundler(): EnvironmentConfig['bundler'] {
    // Vite 감지
    if (typeof import.meta !== 'undefined' && (import.meta as any).hot) return 'vite';

    // Webpack 감지
    if (typeof (window as any).__webpack_require__ !== 'undefined') return 'webpack';
    if (typeof (globalThis as any).__webpack_require__ !== 'undefined') return 'webpack';

    // Next.js 감지 (Webpack 기반이지만 별도 처리)
    if (typeof (window as any).__NEXT_DATA__ !== 'undefined') return 'webpack';

    // Rollup 감지는 어려우므로 다른 조건들로 추정

    return 'unknown';
  }

  /**
   * 환경 변수를 프레임워크별로 추출합니다.
   */
  static getEnvVars(): Record<string, string> {
    const env: Record<string, string> = {};

    // Vite 환경 (Vue 3, Svelte 등)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const viteEnv = (import.meta as any).env;
      Object.keys(viteEnv).forEach(key => {
        if (key.startsWith('VITE_')) {
          env[key.replace('VITE_', '')] = viteEnv[key];
        }
      });
    }

    // Webpack 환경 (React CRA, Next.js)
    if (typeof (globalThis as any).process !== 'undefined' && (globalThis as any).process.env) {
      const processEnv = (globalThis as any).process.env;
      Object.keys(processEnv).forEach(key => {
        if (key.startsWith('REACT_APP_') || key.startsWith('NEXT_PUBLIC_')) {
          const cleanKey = key.replace('REACT_APP_', '').replace('NEXT_PUBLIC_', '');
          env[cleanKey] = processEnv[key] || '';
        }
      });
    }

    // Nuxt 환경
    if (typeof window !== 'undefined' && (window as any).$nuxt) {
      const nuxtConfig = (window as any).$nuxt.$config;
      if (nuxtConfig) {
        Object.keys(nuxtConfig).forEach(key => {
          if (key.startsWith('NUXT_PUBLIC_')) {
            env[key.replace('NUXT_PUBLIC_', '')] = nuxtConfig[key];
          }
        });
      }
    }

    // 기본값 설정
    env.I18N_LOCALE = env.I18N_LOCALE || 'ko';
    env.I18N_FALLBACK_LOCALE = env.I18N_FALLBACK_LOCALE || 'ko';

    return env;
  }

  /**
   * 전체 환경 정보를 반환합니다.
   */
  static getEnvironment(): EnvironmentConfig {
    return {
      framework: this.detectFramework(),
      bundler: this.detectBundler(),
      envVars: this.getEnvVars()
    };
  }
}
