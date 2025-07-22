export default class App {
  /**
   * 네이티브 플러그인을 호출합니다.
   *
   * bizMOB 플랫폼의 확장 가능한 플러그인 시스템을 통해 커스텀 네이티브 기능을 호출하는 API입니다.
   * 기본 bizMOB API로 제공되지 않는 특별한 기능이나 제3자 라이브러리 연동 시 사용합니다.
   *
   * @description
   * - 앱: 네이티브 플러그인 시스템을 통한 확장 기능 호출
   * - 웹: 웹 전용 플러그인 또는 JavaScript 확장 기능 호출
   *
   * @purpose 커스텀 네이티브 기능 호출, 제3자 라이브러리 연동, 플랫폼별 특화 기능 사용
   *
   * @param {string} api - 호출할 네이티브 플러그인 API ID
   * @param {Object} [arg] - 플러그인 호출 매개변수 객체 (선택적)
   * @param {*} [arg.key] - 플러그인별 커스텀 매개변수 (플러그인마다 다름)
   * @param {string} [arg.data] - 플러그인에 전달할 데이터
   * @param {Object} [arg.options] - 플러그인 실행 옵션
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 플러그인 실행 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 플러그인 호출 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {*} return._oData - 플러그인 실행 결과 데이터 (플러그인마다 다름)
   * @returns {Object} return._oResponse - 플러그인 원본 응답 객체
   *
   * @caution
   * - 플러그인이 설치되지 않은 경우 오류가 발생할 수 있습니다
   * - 플러그인별 매개변수 형식과 응답 구조가 다를 수 있습니다
   * - 네이티브 플러그인은 플랫폼별로 다르게 구현될 수 있습니다
   * - 플러그인 호출 전에 해당 API가 지원되는지 확인하세요
   * - 플러그인에서 예외가 발생하면 앱이 종료될 수 있으니 주의하세요
   *
   * @see public/mock/bizMOB/App/callPlugIn/ - Mock 플러그인 응답 예제
   *
   * @example
   * // 바코드 스캐너 플러그인 호출
   * const barcodeResult = await bizMOB.App.callPlugIn('BARCODE_SCANNER', {
   *   format: ['QR_CODE', 'EAN_13'],
   *   prompt: '바코드를 스캔해주세요'
   * });
   *
   * if (barcodeResult._bResult) {
   *   console.log('스캔 결과:', barcodeResult._oData.text);
   * }
   *
   * // 지문 인증 플러그인 호출
   * const fingerprintResult = await bizMOB.App.callPlugIn('FINGERPRINT_AUTH', {
   *   title: '지문 인증',
   *   subtitle: '지문을 터치해주세요',
   *   fallbackEnabled: true
   * });
   *
   * // 커스텀 계산기 플러그인 호출
   * const calcResult = await bizMOB.App.callPlugIn('CUSTOM_CALCULATOR', {
   *   operation: 'add',
   *   numbers: [10, 20, 30]
   * });
   *
   * // 외부 결제 모듈 호출
   * const paymentResult = await bizMOB.App.callPlugIn('PAYMENT_MODULE', {
   *   amount: 50000,
   *   currency: 'KRW',
   *   merchantId: 'MERCHANT_001'
   * });
   *
   * @since bizMOB 4.0.0
   */
  static callPlugIn(api: string, arg?: {
    [key: string]: any;
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.callPlugIn(api, {
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 애플리케이션을 종료하거나 재시작합니다.
   *
   * 앱의 생명주기를 제어하는 API로, 완전 종료, 강제 종료, 또는 로그아웃 후 재시작을 수행합니다.
   * 사용자 로그아웃이나 앱 업데이트 등의 상황에서 앱을 안전하게 종료하거나 재시작할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 앱 생명주기 제어, 시스템 레벨에서 앱 종료/재시작
   * - 웹: 브라우저 탭 닫기 또는 페이지 새로고침으로 처리
   *
   * @purpose 사용자 로그아웃, 앱 업데이트 적용, 긴급 종료, 세션 초기화
   *
   * @param {Object} arg - 앱 종료 설정 객체
   * @param {'exit'|'kill'|'logout'} arg._sType - 앱 종료 유형
   * @param {'exit'} arg._sType - 정상 종료 (사용자 데이터 저장 후 종료)
   * @param {'kill'} arg._sType - 강제 종료 (즉시 앱 프로세스 종료)
   * @param {'logout'} arg._sType - 로그아웃 후 재시작 (앱 초기화 후 재시작)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 앱 종료 처리 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 종료 처리 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 종료 처리 결과 데이터
   * @returns {string} return._oData.exitType - 실행된 종료 유형
   * @returns {string} return._oData.timestamp - 종료 처리 시간
   *
   * @caution
   * - 'kill' 타입은 강제 종료이므로 저장되지 않은 데이터가 손실될 수 있습니다
   * - 종료 전에 중요한 데이터는 반드시 저장하세요
   * - 'logout' 타입은 재시작이므로 현재 세션 정보가 모두 초기화됩니다
   * - 웹에서는 브라우저 정책에 따라 동작이 제한될 수 있습니다
   * - Promise가 resolve되기 전에 앱이 종료될 수 있습니다
   *
   * @see public/mock/bizMOB/App/exit.json - Mock 응답 데이터 예제
   *
   * @example
   * // 정상 종료
   * const exitResult = await bizMOB.App.exit({
   *   _sType: 'exit'
   * });
   *
   * // 사용자 로그아웃 처리
   * // 1. 사용자 데이터 정리
   * bizMOB.Storage.remove({ _sKey: 'userToken' });
   * bizMOB.Storage.remove({ _sKey: 'userProfile' });
   *
   * // 2. 로그아웃 후 재시작
   * const logoutResult = await bizMOB.App.exit({
   *   _sType: 'logout'
   * });
   *
   * // 긴급 상황 시 강제 종료
   * const emergencyExit = await bizMOB.App.exit({
   *   _sType: 'kill'
   * });
   *
   * // 앱 업데이트 후 재시작
   * try {
   *   // 업데이트 로직 수행
   *   await updateApp();
   *
   *   // 업데이트 완료 후 재시작
   *   await bizMOB.App.exit({
   *     _sType: 'logout'
   *   });
   * } catch (error) {
   *   // 업데이트 실패 시 정상 종료
   *   await bizMOB.App.exit({
   *     _sType: 'exit'
   *   });
   * }
   *
   * @since bizMOB 4.0.0
   */
  static exit(arg: {
    _sType: 'exit' | 'kill' | 'logout', // 어플리케이션 종료 유형입니다. kill or exit : 어플리케이션 종료, logout : 어플리케이션 재시작
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.exit({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 현재 설정된 세션 타임아웃 값을 조회합니다.
   *
   * 애플리케이션의 자동 종료 시간 설정값을 확인하는 API입니다.
   * 보안상 일정 시간 동안 사용자 활동이 없으면 자동으로 앱이 종료되도록 설정된 시간을 조회합니다.
   *
   * @description
   * - 앱: 네이티브 설정에서 세션 타임아웃 값 조회
   * - 웹: 브라우저 세션 관리 설정값 조회
   *
   * @purpose 보안 정책 확인, 사용자 안내, 타임아웃 경고 표시, 세션 관리
   *
   * @param {Object} [arg] - 타임아웃 조회 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 세션 타임아웃 정보 객체를 담은 Promise
   * @returns {boolean} return._bResult - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 타임아웃 설정 정보
   * @returns {number} return._oData.timeout - 현재 설정된 타임아웃 시간 (초 단위)
   * @returns {number} return._oData.timeoutMinutes - 타임아웃 시간 (분 단위)
   * @returns {boolean} return._oData.enabled - 타임아웃 기능 활성화 여부
   * @returns {string} return._oData.lastActivity - 마지막 사용자 활동 시간
   * @returns {number} return._oData.remainingTime - 남은 시간 (초 단위)
   *
   * @caution
   * - 타임아웃이 설정되지 않은 경우 0 또는 -1을 반환할 수 있습니다
   * - 실제 타임아웃 동작은 사용자 활동(터치, 키보드 입력 등)에 따라 리셋됩니다
   * - 백그라운드 상태에서는 타임아웃 계산이 중단될 수 있습니다
   * - 보안 정책에 따라 조회 권한이 제한될 수 있습니다
   *
   * @see public/mock/bizMOB/App/getTimeout.json - Mock 응답 데이터 예제
   *
   * @example
   * // 현재 타임아웃 설정 확인
   * const timeoutInfo = await bizMOB.App.getTimeout();
   *
   * if (timeoutInfo._bResult) {
   *   const timeoutMinutes = timeoutInfo._oData.timeoutMinutes;
   *   const remainingMinutes = Math.floor(timeoutInfo._oData.remainingTime / 60);
   *
   *   console.log(`세션 타임아웃: ${timeoutMinutes}분 설정됨`);
   *   console.log(`남은 시간: ${remainingMinutes}분`);
   *
   *   // 타임아웃 경고 표시
   *   if (remainingMinutes <= 5) {
   *     alert(`세션이 ${remainingMinutes}분 후 만료됩니다.`);
   *   }
   * }
   *
   * // 타임아웃 상태에 따른 UI 처리
   * const checkSessionStatus = async () => {
   *   const result = await bizMOB.App.getTimeout();
   *
   *   if (result._bResult && result._oData.enabled) {
   *     const remaining = result._oData.remainingTime;
   *
   *     if (remaining <= 300) { // 5분 이하
   *       showTimeoutWarning(remaining);
   *     }
   *   }
   * };
   *
   * // 주기적 타임아웃 체크
   * setInterval(checkSessionStatus, 60000); // 1분마다 체크
   *
   * @since bizMOB 4.0.0
   */
  static getTimeout(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.getTimeout({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 애플리케이션의 세션 타임아웃 시간을 설정합니다.
   *
   * 보안상 일정 시간 동안 사용자 활동이 없으면 자동으로 앱이 종료되도록 하는 시간을 설정하는 API입니다.
   * 사용자가 터치, 키보드 입력 등의 활동을 하지 않으면 설정된 시간 후 자동으로 앱이 종료됩니다.
   *
   * @description
   * - 앱: 네이티브 세션 관리자에 타임아웃 시간 설정
   * - 웹: 브라우저 세션 관리 시스템에 타임아웃 설정
   *
   * @purpose 보안 정책 적용, 자동 로그아웃 설정, 배터리 절약, 개인정보 보호
   *
   * @param {Object} [arg] - 타임아웃 설정 객체 (선택적)
   * @param {number} [arg._nSeconds] - 자동 종료 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 타임아웃 설정 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 설정 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 타임아웃 설정 결과
   * @returns {number} return._oData.timeout - 설정된 타임아웃 시간 (초 단위)
   * @returns {number} return._oData.timeoutMinutes - 설정된 타임아웃 시간 (분 단위)
   * @returns {boolean} return._oData.enabled - 타임아웃 기능 활성화 여부
   * @returns {string} return._oData.setTime - 설정 시간
   *
   * @caution
   * - 0 또는 음수 값 설정 시 타임아웃 기능이 비활성화될 수 있습니다
   * - 너무 짧은 시간 설정 시 사용자 경험에 불편을 줄 수 있습니다
   * - 사용자 활동(터치, 스크롤, 입력 등)이 있으면 타이머가 리셋됩니다
   * - 백그라운드 상태에서는 타임아웃 동작이 달라질 수 있습니다
   * - 시스템 최소/최대 제한값이 있을 수 있습니다
   *
   * @see public/mock/bizMOB/App/setTimeout.json - Mock 응답 데이터 예제
   *
   * @example
   * // 30분 타임아웃 설정
   * const result = await bizMOB.App.setTimeout({
   *   _nSeconds: 1800 // 30분 = 30 * 60초
   * });
   *
   * if (result._bResult) {
   *   console.log('타임아웃이 30분으로 설정되었습니다.');
   * }
   *
   * // 보안 등급에 따른 타임아웃 설정
   * const setSecurityTimeout = async (securityLevel) => {
   *   let timeoutSeconds;
   *
   *   switch (securityLevel) {
   *     case 'high':
   *       timeoutSeconds = 300; // 5분
   *       break;
   *     case 'medium':
   *       timeoutSeconds = 900; // 15분
   *       break;
   *     case 'low':
   *       timeoutSeconds = 1800; // 30분
   *       break;
   *     default:
   *       timeoutSeconds = 600; // 10분 (기본값)
   *   }
   *
   *   await bizMOB.App.setTimeout({
   *     _nSeconds: timeoutSeconds
   *   });
   * };
   *
   * // 사용자 설정에 따른 타임아웃 적용
   * const userTimeout = await bizMOB.Storage.get({ _sKey: 'userTimeoutSetting' });
   * const timeoutMinutes = userTimeout || 15; // 기본 15분
   *
   * await bizMOB.App.setTimeout({
   *   _nSeconds: timeoutMinutes * 60
   * });
   *
   * // 타임아웃 비활성화 (0 설정)
   * await bizMOB.App.setTimeout({
   *   _nSeconds: 0
   * });
   *
   * @since bizMOB 4.0.0
   */
  static setTimeout(arg?: {
    _nSeconds: number, // 어플리케이션의 자동 종료 시간 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.App.setTimeout({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 네이티브 스플래시 화면을 수동으로 숨깁니다.
   *
   * 앱 시작 시 표시되는 스플래시 화면을 개발자가 원하는 시점에 제거하는 API입니다.
   * 일반적으로 앱 초기화가 완료되고 메인 화면이 준비된 후에 호출합니다.
   *
   * @description
   * - 앱: 네이티브 스플래시 스크린 제어 (수동 모드 앱에서만 사용)
   * - 웹: 커스텀 로딩 화면 또는 초기 스플래시 요소 제거
   *
   * @purpose 앱 초기화 완료 후 스플래시 제거, 사용자 경험 향상, 커스텀 로딩 플로우 구현
   *
   * @returns {Promise<Object>} 스플래시 숨김 처리 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 처리 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 스플래시 처리 결과
   * @returns {boolean} return._oData.hidden - 스플래시 숨김 여부
   * @returns {string} return._oData.hideTime - 숨김 처리 시간
   *
   * @caution
   * - 이 함수는 스플래시 수동 조작이 설정된 앱에서만 동작합니다
   * - 이미 숨겨진 스플래시를 다시 숨기려 하면 오류가 발생할 수 있습니다
   * - 스플래시가 숨겨지기 전에 메인 UI가 준비되어 있어야 합니다
   * - 자동 스플래시 모드 앱에서는 이 함수를 호출할 필요가 없습니다
   * - 웹에서는 실제 네이티브 스플래시가 없으므로 커스텀 구현에 따라 동작합니다
   *
   * @example
   * // 앱 초기화 완료 후 스플래시 숨김
   * const initializeApp = async () => {
   *   try {
   *     // 1. 필수 데이터 로딩
   *     await loadUserData();
   *     await loadAppConfig();
   *
   *     // 2. UI 컴포넌트 준비
   *     await setupMainUI();
   *
   *     // 3. 모든 준비 완료 후 스플래시 숨김
   *     const splashResult = await bizMOB.App.hideSplash();
   *
   *     if (splashResult._bResult) {
   *       console.log('스플래시 화면이 숨겨졌습니다.');
   *     }
   *   } catch (error) {
   *     console.error('앱 초기화 실패:', error);
   *     // 오류 발생 시에도 스플래시는 숨김
   *     await bizMOB.App.hideSplash();
   *   }
   * };
   *
   * // 지연된 스플래시 숨김 (최소 표시 시간 보장)
   * const hideAfterMinimumTime = async () => {
   *   const startTime = Date.now();
   *
   *   // 앱 초기화 수행
   *   await initializeApp();
   *
   *   // 최소 2초는 스플래시 표시
   *   const elapsedTime = Date.now() - startTime;
   *   const remainingTime = Math.max(0, 2000 - elapsedTime);
   *
   *   setTimeout(async () => {
   *     await bizMOB.App.hideSplash();
   *   }, remainingTime);
   * };
   *
   * // 조건부 스플래시 숨김
   * const conditionalHideSplash = async () => {
   *   const isFirstLaunch = await bizMOB.Storage.get({ _sKey: 'isFirstLaunch' });
   *
   *   if (isFirstLaunch) {
   *     // 첫 실행 시 온보딩 완료 후 숨김
   *     await showOnboarding();
   *   } else {
   *     // 일반 실행 시 즉시 숨김
   *     await bizMOB.App.hideSplash();
   *   }
   * };
   *
   * @since bizMOB 4.0.0
   */
  static hideSplash() {
    return new Promise(resolve => {
      window.bizMOB.App.hideSplash({
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
