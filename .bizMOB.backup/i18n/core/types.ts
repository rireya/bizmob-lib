/**
 * Universal I18n Types
 * Framework-agnostic type definitions
 */

export interface I18nConfig {
  locale: string;
  fallbackLocale: string;
  messages: Record<string, any>;
}

export interface I18nAdapter {
  init(config: I18nConfig): Promise<any>;
  t(key: string, params?: any): string;
  changeLocale(locale: string): Promise<void>;
  getCurrentLocale(): string;
  getAvailableLocales(): string[];
}

export interface MessageLoader {
  loadMessages(): Promise<Record<string, any>>;
  getDefaultLocale(): string;
  getFallbackLocale(): string;
  discoverAvailableLocales(): Promise<string[]>;
  getAvailableLocales(): Promise<string[]>;
}

export interface EnvironmentConfig {
  framework: 'vue' | 'react' | 'next' | 'nuxt' | 'angular' | 'svelte' | 'vanilla';
  bundler: 'vite' | 'webpack' | 'rollup' | 'esbuild' | 'unknown';
  envVars: Record<string, string>;
}
