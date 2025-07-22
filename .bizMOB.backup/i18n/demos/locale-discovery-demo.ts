/**
 * Locale Discovery Demo
 * 동적 언어 감지 기능을 테스트하는 데모 스크립트
 */

import { createBizMOBI18n } from '../index';

// 데모 실행 함수
export async function runLocaleDiscoveryDemo() {
  try {
    console.log('🔍 Locale Discovery Demo Started\n');

    // 1. Universal i18n 인스턴스 생성
    const i18n = await createBizMOBI18n();

    // 2. 환경 정보 확인
    console.log('📋 Environment Info:');
    console.log('- Framework:', i18n.getEnvironmentInfo().framework);
    console.log('- Bundler:', i18n.getEnvironmentInfo().bundler);
    console.log('');

    // 3. 로더 정보 확인
    console.log('⚙️ Loader Info:');
    const loaderInfo = i18n.getLoaderInfo();
    console.log('- Default Locale:', loaderInfo.defaultLocale);
    console.log('- Fallback Locale:', loaderInfo.fallbackLocale);
    console.log('');

    // 4. 사용 가능한 어댑터 확인
    console.log('🔌 Available Adapters:');
    console.log(i18n.getAvailableAdapters().join(', '));
    console.log('');

    // 5. 현재 어댑터 정보
    console.log('🎯 Current Adapter Info:');
    const adapterInfo = i18n.getCurrentAdapterInfo();
    if (adapterInfo) {
      console.log('- Name:', adapterInfo.name);
      console.log('- Framework:', adapterInfo.framework);
      console.log('- Dependencies:', adapterInfo.dependencies.join(', ') || 'None');
      console.log('- Optional Dependencies:', adapterInfo.optionalDependencies.join(', ') || 'None');
    }
    console.log('');

    // 6. 동적으로 감지된 언어 목록
    console.log('🌍 Discovered Locales:');
    const discoveredLocales = await i18n.getDiscoveredLocales();
    console.log('- Available:', discoveredLocales.join(', '));
    console.log('- Count:', discoveredLocales.length);
    console.log('');

    // 7. 실제 로드된 언어 목록
    console.log('📦 Loaded Locales:');
    const loadedLocales = i18n.getAvailableLocales();
    console.log('- Loaded:', loadedLocales.join(', '));
    console.log('- Count:', loadedLocales.length);
    console.log('');

    // 8. 언어별 테스트
    console.log('🧪 Translation Test:');
    for (const locale of loadedLocales) {
      await i18n.changeLocale(locale);
      console.log(`- [${locale}] Current locale:`, i18n.getCurrentLocale());
      console.log(`- [${locale}] Test translation:`, i18n.t('common.loading', { fallback: `Loading (${locale})` }));
    }
    console.log('');

    // 9. 의존성 체크
    console.log('🔍 Dependency Check:');
    const deps = i18n.checkAdapterDependencies();
    console.log('- Available:', deps.available);
    console.log('- Missing:', deps.missing.join(', ') || 'None');
    console.log('- Optional Missing:', deps.optional.join(', ') || 'None');
    console.log('');

    console.log('✅ Locale Discovery Demo Completed Successfully!');

    return {
      environment: i18n.getEnvironmentInfo(),
      discoveredLocales,
      loadedLocales,
      adapterInfo,
      dependencies: deps
    };

  } catch (error) {
    console.error('❌ Demo failed:', error);
    throw error;
  }
}

// 브라우저 환경에서 실행하기 위한 전역 함수
if (typeof window !== 'undefined') {
  (window as any).runLocaleDiscoveryDemo = runLocaleDiscoveryDemo;
}

// Node.js 환경에서 직접 실행
if (typeof window === 'undefined' && typeof (globalThis as any).process !== 'undefined') {
  runLocaleDiscoveryDemo().catch(console.error);
}
