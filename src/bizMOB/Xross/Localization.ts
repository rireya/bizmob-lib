export default class Localization {
  /**
   * 현재 설정된 언어 코드 조회
   *
   * @description 현재 설정된 언어 코드를 조회하는 함수.
   * 앱 환경에서는 네이티브에서 설정된 언어 정보를 가져오고,
   * 웹 환경에서는 저장된 언어 코드 또는 브라우저 기본 언어를 반환한다.
   *
   * @param {Object} [arg] - 로케일 조회 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,     // 언어 조회 성공 여부
   *   locale: string       // 현재 설정된 전체 언어 코드 (예: "ko-KR", "en-US")
   * }>} 언어 조회 결과를 담은 Promise 객체
   * @example
   * import { Localization } from '@bizMOB';
   * // 현재 언어 설정 확인
   * const getLocResult = await Localization.getLocale();
   *
   * if (getLocResult.result) {
   *   console.log('현재 언어 설정:', getLocResult.locale);
   * }
   *
   */
  static getLocale(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.getLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }

  /**
   * 언어 코드 설정
   *
   * @description 애플리케이션의 언어 코드를 설정하는 함수.
   * 앱 환경에서는 네이티브 설정을 통해 언어를 변경하고,
   * 웹 환경에서는 브라우저 환경에 맞는 언어코드를 저장한다.
   *
   * @param {Object} arg - 로케일 설정 객체
   * @param {string} arg._sLocaleCd - 설정할 언어 코드 (예: "ko", "ko-KR", "en", "en-US")
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,     // 언어 설정 성공 여부
   *   locale: string       // 설정된 전체 언어 코드 (예: "ko-KR", "en-US")
   * }>} 언어 설정 결과를 담은 Promise 객체
   * @example
   * import { Localization } from '@bizMOB';
   * // 한국어로 언어 변경
   * const setLocResult = await Localization.setLocale({
   *   _sLocaleCd: 'ko'
   * });
   *
   * if (setLocResult.result) {
   *   console.log('언어가 한국어로 설정되었습니다:', setLocResult.locale);
   * } else {
   *   console.log('언어 설정에 실패했습니다');
   * }
   */
  static setLocale(arg: {
    _sLocaleCd: string, // 언어코드 (ko, en, ...)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.setLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }
}
