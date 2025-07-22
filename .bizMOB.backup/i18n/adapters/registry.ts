import type { I18nAdapter } from '../core/types';
import adaptersConfig from './adapters.config.json';

/**
 * 어댑터 정보 인터페이스
 */
export interface AdapterInfo {
  name: string;
  file: string;
  framework: string;
  dependencies: string[];
  optionalDependencies: string[];
  environments: string[];
  bundlers: string[];
  description: string;
}

/**
 * 어댑터 레지스트리
 * 새로운 프레임워크 어댑터를 등록하고 관리하는 클래스
 */
export class AdapterRegistry {
  private static instance: AdapterRegistry;
  private adapters: Map<string, AdapterInfo> = new Map();
  private loadedAdapters: Map<string, any> = new Map();

  private constructor() {
    this.loadAdaptersFromConfig();
  }

  static getInstance(): AdapterRegistry {
    if (!AdapterRegistry.instance) {
      AdapterRegistry.instance = new AdapterRegistry();
    }
    return AdapterRegistry.instance;
  }

  /**
   * 설정 파일에서 어댑터 정보를 로드합니다.
   */
  private loadAdaptersFromConfig(): void {
    const config = adaptersConfig as any;

    for (const key in config.adapters) {
      if (config.adapters.hasOwnProperty(key)) {
        this.adapters.set(key, config.adapters[key] as AdapterInfo);
      }
    }
  }

  /**
   * 모든 등록된 어댑터 목록을 반환합니다.
   */
  getAvailableAdapters(): string[] {
    return Array.from(this.adapters.keys());
  }

  /**
   * 특정 어댑터 정보를 반환합니다.
   */
  getAdapterInfo(framework: string): AdapterInfo | undefined {
    return this.adapters.get(framework);
  }

  /**
   * 프레임워크 감지 순서를 반환합니다.
   */
  getDetectionOrder(): string[] {
    const config = adaptersConfig as any;
    return config.detectionOrder || [];
  }

  /**
   * 폴백 어댑터를 반환합니다.
   */
  getFallbackAdapter(): string {
    const config = adaptersConfig as any;
    return config.fallbackAdapter || 'vanilla';
  }

  /**
   * 어댑터를 동적으로 로드합니다.
   */
  async loadAdapter(framework: string): Promise<any> {
    // 이미 로드된 어댑터가 있으면 반환
    if (this.loadedAdapters.has(framework)) {
      return this.loadedAdapters.get(framework);
    }

    const adapterInfo = this.getAdapterInfo(framework);
    if (!adapterInfo) {
      throw new Error(`Unknown adapter: ${framework}`);
    }

    try {
      // 동적 import로 어댑터 로드
      const adapterPath = `./${adapterInfo.file}`;
      const module = await import(adapterPath) as any;
      const AdapterClass = module[adapterInfo.name];

      if (!AdapterClass) {
        throw new Error(`Adapter class ${adapterInfo.name} not found in ${adapterInfo.file}`);
      }

      // 캐시에 저장
      this.loadedAdapters.set(framework, AdapterClass);
      return AdapterClass;

    } catch (error) {
      console.warn(`[AdapterRegistry] Failed to load adapter ${framework}:`, error);
      throw error;
    }
  }

  /**
   * 어댑터 인스턴스를 생성합니다.
   */
  async createAdapter(framework: string): Promise<I18nAdapter> {
    const AdapterClass = await this.loadAdapter(framework);
    return new AdapterClass();
  }

  /**
   * 런타임에 새로운 어댑터를 등록합니다.
   * (개발자가 커스텀 어댑터를 추가할 때 사용)
   */
  registerAdapter(framework: string, adapterInfo: AdapterInfo, adapterClass?: any): void {
    this.adapters.set(framework, adapterInfo);

    if (adapterClass) {
      this.loadedAdapters.set(framework, adapterClass);
    }

    console.log(`[AdapterRegistry] Registered custom adapter: ${framework}`);
  }

  /**
   * 어댑터 의존성을 확인합니다.
   */
  checkDependencies(framework: string): {
    available: boolean;
    missing: string[];
    optional: string[]
  } {
    const adapterInfo = this.getAdapterInfo(framework);
    if (!adapterInfo) {
      return { available: false, missing: [framework], optional: [] };
    }

    const missing: string[] = [];
    const optional: string[] = [];

    // 필수 의존성 확인
    for (const dep of adapterInfo.dependencies) {
      try {
        // 전역 객체나 모듈 존재 여부 확인
        if (typeof window !== 'undefined') {
          // 브라우저 환경
          if (!(window as any)[dep] && !(globalThis as any)[dep]) {
            missing.push(dep);
          }
        }
      } catch {
        missing.push(dep);
      }
    }

    // 선택적 의존성 확인
    for (const dep of adapterInfo.optionalDependencies) {
      try {
        if (typeof window !== 'undefined') {
          if (!(window as any)[dep] && !(globalThis as any)[dep]) {
            optional.push(dep);
          }
        }
      } catch {
        optional.push(dep);
      }
    }

    return {
      available: missing.length === 0,
      missing,
      optional
    };
  }
}
