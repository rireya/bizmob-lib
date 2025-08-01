export default class Config {
  /**
   * bizMOB Core 모듈의 설정 값을 설정하는 함수
   *
   * 앱/웹 환경에 따라 해당하는 Core 모듈의 config 객체에 설정 값을 병합합니다.
   * 환경별로 다른 Core 파일의 클래스 config를 관리하기 위한 통합 인터페이스입니다.
   *
   * @param {string} target - 대상 환경 구분 ('APP' 또는 'WEB')
   *   - 'APP': bizMOBCore (앱 환경) 모듈의 config 설정
   *   - 'WEB': bizMOBWebCore (웹 환경) 모듈의 config 설정
   * @param {string} className - 설정할 클래스명 (예: 'App', 'Network', 'Database' 등)
   * @param {Object} arg - 설정할 config 객체 (기존 config와 병합됨)
   * @example
   * import { Config } from '@bizMOB';
   * // 앱 환경의 Network 클래스 config 설정
   * Config.set('APP', 'Network', {
   *   _sBaseUrl: 'https://api.example.com',
   *   _bIsProxy: true
   * });
   *
   * // 웹 환경의 App 클래스 config 설정
   * Config.set('WEB', 'App', {
   *   _bIsRelease: false,
   *   _sAppKey: 'myAppKey123'
   * });
   */
  static set(target: string, className: string, arg: any) {
    window.bizMOB.setConfig(target, className, arg);
  }

  /**
   * bizMOB Core 모듈의 설정 값을 조회하는 함수
   *
   * 앱/웹 환경에 따라 해당하는 Core 모듈의 config 객체를 반환합니다.
   * 환경별로 다른 Core 파일의 클래스 config를 조회하기 위한 통합 인터페이스입니다.
   *
   * @param {string} target - 대상 환경 구분 ('APP' 또는 'WEB')
   *   - 'APP': bizMOBCore (앱 환경) 모듈의 config 조회
   *   - 'WEB': bizMOBWebCore (웹 환경) 모듈의 config 조회
   * @param {string} className - 조회할 클래스명 (예: 'App', 'Network', 'Database' 등)
   * @returns {Object} return - 해당 클래스의 config 객체
   * @example
   * import { Config } from '@bizMOB';
   * // 앱 환경의 Network 클래스 config 조회
   * const appNetworkConfig = Config.get('APP', 'Network');
   * console.log(appNetworkConfig);
   *
   * // 웹 환경의 App 클래스 config 조회
   * const webAppConfig = Config.get('WEB', 'APP');
   * console.log(webAppConfig);
   */
  static get(target: string, className: string) {
    return window.bizMOB.getConfig(target, className);
  }
}
