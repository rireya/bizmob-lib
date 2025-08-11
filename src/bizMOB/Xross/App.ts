export default class App {
  /**
   * Native 플러그인 호출 API
   *
   * @param {string} api - 호출할 네이티브 플러그인 API ID (예: 'APP_UPDATE_CHECK')
   * @param {Object} [arg] - 플러그인 호출 매개변수 객체 
   * @param {*} [arg.key] - 플러그인별 커스텀 매개변수 (플러그인마다 다름)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<Object>} 플러그인 실행 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/App/callPlugIn/ - Mock 플러그인 응답 예제
   * @example
   * import { App } from '@bizMOB';
   * 
   * // APP_UPDATE_CHECK 플러그인 호출 예시
   * const appUpdate = await App.callPlugIn('APP_UPDATE_CHECK', {
   *   callback: function(response) {
   *     console.log('결과:', response.result);
   *   }
   * });
   * 
   */
  static callPlugIn(api: string, arg?: {
    [key: string]: any;
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.callPlugIn(api, {
        ...arg,
        callback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 애플리케이션을 종료하거나 재시작합니다.
   *
   * @param {Object} arg - 앱 종료 설정 객체
   * @param {String} arg._sType - 앱 종료 유형 (Default : kill ) ( logout 또는 exit )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<Object>} 앱 종료 처리 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/App/exit.json - Mock 응답 데이터 예제
   * @example
   * import { App } from '@bizMOB';
   * 
   * // 정상 종료
   * const exitResult = await App.exit({
   *   _sType: 'exit'
   * });
   *
   * // 로그아웃 후 재시작
   * const logoutResult = await App.exit({
   *   _sType: 'logout'
   * });
   *
   * // 앱 강제 종료
   * const emergencyExit = await App.exit({
   *   _sType: 'kill'
   * });
   */
  static exit(arg: {
    _sType: 'exit' | 'kill' | 'logout', // 어플리케이션 종료 유형
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.exit({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * App 자동 종료 시간 조회
   * @param {Object} [arg] - 옵션 객체 (선택)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{ 
   *   result: boolean,         // 성공 여부
   *   session_timeout: number  // 세션 만료 시간 (초)
   * }>} 세션 타임아웃 조회 결과
   * @see public/mock/bizMOB/App/getTimeout.json - Mock 응답 데이터 예제
   * @example
   * import { App } from '@bizMOB';
   * // 현재 세션 타임아웃 시간 조회
   * const timeoutInfo = await App.getTimeout();
   *
   * if (timeoutInfo.result) {
   *   const timeoutSeconds = timeoutInfo.session_timeout;
   *   console.log(`세션 타임아웃: ${timeoutSeconds}초`);
   *   // 타임아웃 시간에 따른 UI 처리
   *   if (timeoutSeconds > 0) {
   *     // 타이머 UI 표시
   *     startSessionTimer(timeoutSeconds); // 타이머 UI 처리 등
   *   }
   * }
   */
  static getTimeout(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.getTimeout({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * App 자동 종료 시간 설정
   *
   * @param {Object} [arg] - 타임아웃 설정 객체 (선택적)
   * @param {number} [arg._nSeconds] - 자동 종료 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{ 
   *   result: boolean,         // 성공 여부 
   *   session_timeout: number  // 세션 만료 시간 (초) 
   * }>} 세션 타임아웃 설정 결과
   * @see public/mock/bizMOB/App/setTimeout.json - Mock 응답 데이터 예제
   * @example
   * import { App } from '@bizMOB';
   * // 30분(1800초) 후 자동 종료 설정
   * await App.setTimeout({
   *   _nSeconds: 1800
   * });
   *
   * // 1시간(3600초) 후 자동 종료 설정
   * await App.setTimeout({
   *   _nSeconds: 3600
   * });
   *
   * // 2시간(7200초) 설정
   * await App.setTimeout({
   *   _nSeconds: 7200
   * });
   * 
   * // 세션 타임아웃 비활성화 (0으로 설정)
   * await App.setTimeout({
   *   _nSeconds: 0
   * });
   *
   */
  static setTimeout(arg?: {
    _nSeconds: number, // 어플리케이션의 자동 종료 시간 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.setTimeout({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * App 스플래시 화면 수동 종료
   *
   * @description 
   * 스플래시 화면의 자동 종료를 비활성화한 상태에서 수동으로 스플래시 화면을 닫는 함수.
   * 앱 초기화 로직 완료 후 호출하여 사용자에게 메인 화면을 표시한다.
   * @usage
   * 1. 앱 설정에서 스플래시 자동 종료 비활성화 필요
   * 2. 초기화 로직 (데이터 로드, 설정 확인 등) 완료 후 호출
   * 3. 매개변수 및 콜백 함수 없음
   * @example
   * import { App } from '@bizMOB';
   * // 앱 초기화 완료 후 스플래시 숨김
   * const initializeApp = async () => {
   *   // 초기화 로직 실행
   *   await loadUserData();
   *   await checkAppSettings();
   *
   *   // 초기화 완료 후 스플래시 화면 종료
   *   const splashResult = await App.hideSplash();
   * };
   */
  static hideSplash() {
    return new Promise(resolve => {
      window.bizMOB.App.hideSplash({
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
