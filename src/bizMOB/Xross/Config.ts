export default class Config {
  /**
   * bizMOB 클래스의 설정값을 저장합니다.
   *
   * bizMOB SDK 내부 클래스들의 동작을 제어하는 설정 매개변수를 설정하는 API입니다.
   * 네트워크 타임아웃, 로그 레벨, 캐시 정책 등 각 클래스별 세부 동작을 커스터마이징할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 설정 저장소에 클래스별 설정값 저장
   * - 웹: 브라우저 메모리 또는 로컬 스토리지에 설정값 저장
   *
   * @purpose SDK 동작 커스터마이징, 성능 최적화, 환경별 설정 적용, 클래스별 세부 제어
   *
   * @param {string} target - 설정 대상 모듈 또는 카테고리 (예: 'Network', 'Logger', 'Database')
   * @param {string} className - 설정할 클래스명 (예: 'Http', 'Storage', 'SQLite')
   * @param {*} arg - 설정값 객체 또는 값
   * @param {Object} arg - 객체 형태의 설정값
   * @param {number} [arg.timeout] - 타임아웃 시간 (초 단위)
   * @param {string} [arg.logLevel] - 로그 레벨 ('debug', 'info', 'warn', 'error')
   * @param {boolean} [arg.enableCache] - 캐시 사용 여부
   * @param {string} [arg.baseUrl] - 기본 서버 URL
   * @param {Object} [arg.headers] - 기본 HTTP 헤더
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 잘못된 설정값은 SDK 동작 오류를 일으킬 수 있습니다
   * - 런타임 중 설정 변경 시 이미 진행 중인 작업에는 적용되지 않을 수 있습니다
   * - 설정값의 타입과 범위를 반드시 확인하세요
   * - 중요한 보안 설정은 앱 시작 시에만 변경하는 것을 권장합니다
   * - 설정값이 유효하지 않을 경우 기본값으로 자동 복원될 수 있습니다
   *
   * @example
   * // Network 클래스의 HTTP 설정
   * bizMOB.Config.set('Network', 'Http', {
   *   timeout: 30,
   *   retryCount: 3,
   *   baseUrl: 'https://api.example.com',
   *   headers: {
   *     'Content-Type': 'application/json',
   *     'User-Agent': 'bizMOB/4.0.0'
   *   }
   * });
   *
   * // Logger 클래스의 로그 레벨 설정
   * bizMOB.Config.set('Logger', 'Console', {
   *   level: 'info',
   *   enableTimestamp: true,
   *   enableColors: true,
   *   maxLogSize: 1000
   * });
   *
   * // Database 클래스의 SQLite 설정
   * bizMOB.Config.set('Database', 'SQLite', {
   *   dbName: 'app_database.db',
   *   version: '1.0',
   *   enableWAL: true,
   *   cacheSize: 2000
   * });
   *
   * // Storage 클래스의 캐시 설정
   * bizMOB.Config.set('Storage', 'Cache', {
   *   maxCacheSize: 50, // MB 단위
   *   enableCompression: true,
   *   expireTime: 3600 // 1시간
   * });
   *
   * // 환경별 설정 적용
   * const isDevelopment = process.env.NODE_ENV === 'development';
   * bizMOB.Config.set('Network', 'Http', {
   *   timeout: isDevelopment ? 60 : 30,
   *   enableDebug: isDevelopment
   * });
   *
   * @since bizMOB 4.0.0
   */
  static set(target: string, className: string, arg: any) {
    window.bizMOB.setConfig(target, className, arg);
  }

  /**
   * bizMOB 클래스의 현재 설정값을 조회합니다.
   *
   * bizMOB SDK 내부 클래스들의 현재 설정 상태를 확인하는 API입니다.
   * 설정 적용 여부 확인, 디버깅, 또는 현재 설정에 기반한 조건부 로직 구현 시 사용합니다.
   *
   * @description
   * - 앱: 네이티브 설정 저장소에서 클래스별 설정값 조회
   * - 웹: 브라우저 메모리 또는 로컬 스토리지에서 설정값 조회
   *
   * @purpose 설정 상태 확인, 디버깅 정보 수집, 조건부 로직 구현, 설정 검증
   *
   * @param {string} target - 조회할 대상 모듈 또는 카테고리 (예: 'Network', 'Logger', 'Database')
   * @param {string} className - 조회할 클래스명 (예: 'Http', 'Storage', 'SQLite')
   *
   * @returns {*} 설정값 객체 또는 기본값
   * @returns {Object} return - 설정 객체 (설정이 존재하는 경우)
   * @returns {number} return.timeout - 타임아웃 시간 설정
   * @returns {string} return.logLevel - 로그 레벨 설정
   * @returns {boolean} return.enableCache - 캐시 사용 설정
   * @returns {string} return.baseUrl - 기본 URL 설정
   * @returns {Object} return.headers - 기본 헤더 설정
   * @returns {null|undefined} return - 설정이 없는 경우 null 또는 undefined
   *
   * @caution
   * - 설정이 존재하지 않는 경우 null 또는 undefined를 반환할 수 있습니다
   * - 반환된 객체를 직접 수정하면 예상치 못한 부작용이 발생할 수 있습니다
   * - 설정값의 타입을 확인한 후 사용하세요
   * - 기본값 처리 로직을 구현하는 것을 권장합니다
   *
   * @example
   * // Network HTTP 설정 조회
   * const networkConfig = bizMOB.Config.get('Network', 'Http');
   * if (networkConfig) {
   *   console.log('현재 타임아웃:', networkConfig.timeout);
   *   console.log('기본 URL:', networkConfig.baseUrl);
   * }
   *
   * // Logger 설정 확인 후 조건부 로깅
   * const loggerConfig = bizMOB.Config.get('Logger', 'Console');
   * const currentLogLevel = loggerConfig?.level || 'info';
   *
   * if (currentLogLevel === 'debug') {
   *   bizMOB.Logger.debug('디버그 모드에서만 표시되는 상세 정보');
   * }
   *
   * // 설정값 존재 여부 확인
   * const dbConfig = bizMOB.Config.get('Database', 'SQLite');
   * if (!dbConfig) {
   *   // 기본 설정 적용
   *   bizMOB.Config.set('Database', 'SQLite', {
   *     dbName: 'default.db',
   *     version: '1.0'
   *   });
   * }
   *
   * // 설정값 기반 조건부 처리
   * const storageConfig = bizMOB.Config.get('Storage', 'Cache');
   * const cacheEnabled = storageConfig?.enableCache ?? true;
   *
   * if (cacheEnabled) {
   *   // 캐시 기능 사용
   *   loadDataFromCache();
   * } else {
   *   // 직접 데이터 로드
   *   loadDataDirect();
   * }
   *
   * // 설정값 복사 및 수정 (원본 보호)
   * const originalConfig = bizMOB.Config.get('Network', 'Http');
   * const modifiedConfig = { ...originalConfig, timeout: 60 };
   * bizMOB.Config.set('Network', 'Http', modifiedConfig);
   *
   * // 전체 설정 상태 디버깅
   * const debugConfigs = () => {
   *   const targets = ['Network', 'Logger', 'Database', 'Storage'];
   *   const classes = ['Http', 'Console', 'SQLite', 'Cache'];
   *
   *   targets.forEach(target => {
   *     classes.forEach(className => {
   *       const config = bizMOB.Config.get(target, className);
   *       if (config) {
   *         console.log(`${target}.${className}:`, config);
   *       }
   *     });
   *   });
   * };
   *
   * @since bizMOB 4.0.0
   */
  static get(target: string, className: string) {
    return window.bizMOB.getConfig(target, className);
  }
}
