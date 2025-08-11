export default class Device {
  /**
   * 단말기 정보 조회
   *
   * @description 현재 디바이스의 정보를 JSON 객체 형태로 즉시 반환하는 함수.
   * callback 함수 없이 동기적으로 디바이스 정보에 접근할 수 있다.
   *
   * @param {String} _sKey 디바이스 정보 키 값 (선택적)
   * @returns {DeviceInfo} 디바이스 정보 객체
   *
   * @typedef {Object} DeviceInfo
   * @property {string} device_id 디바이스 고유 식별자 - 기기를 구별하는 유니크한 ID
   * @property {string} os_type 운영체제 타입 - "Android", "iOS" 등의 플랫폼 구분
   * @property {string} device_os_type 디바이스 운영체제 타입 - "ANDROID", "IOS" 등의 상수값
   * @property {string} os_version 운영체제 상세 버전 - "15.0", "17.2.1" 등의 정확한 OS 버전
   * @property {string} device_os_version 디바이스 운영체제 메이저 버전 - "15", "17" 등의 주요 버전
   * @property {number} content_major_version 컨텐츠 메이저 버전 - 앱 컨텐츠의 주요 버전 번호
   * @property {number} content_minor_version 컨텐츠 마이너 버전 - 앱 컨텐츠의 세부 버전 번호
   * @property {number} app_major_version 앱 메이저 버전 - 애플리케이션의 주요 버전 번호
   * @property {number} app_minor_version 앱 마이너 버전 - 애플리케이션의 세부 버전 번호
   * @property {number} app_build_version 앱 빌드 버전 - 빌드 번호 또는 패치 버전
   * @property {string} [app_version] 통합 앱 버전 - bizMOBCore 초기화 시 동적으로 생성되는 버전 문자열 (예: "2.0.7_4.15")
   * @property {string} network_operater_name 통신사명 - "KT", "SKT", "LGU+" 등의 이동통신사
   * @property {number} screen_density 화면 밀도 - 화면의 픽셀 밀도 값
   * @property {number} screen_density_dpi 화면 DPI 값 - 인치당 도트 수 (120, 160, 240, 320, 480, 640 등)
   * @property {number} screen_width 화면 너비 - 화면의 가로 픽셀 수
   * @property {number} screen_height 화면 높이 - 화면의 세로 픽셀 수
   * @property {string} manufacturer 제조사명 - "Samsung", "Apple", "LG" 등의 기기 제조업체
   * @property {string} model 기기 모델명 - "SM-S921N", "iPhone14,2" 등의 구체적 모델명
   * @property {string} device_type 기기 타입 - "Phone", "Tablet", "Desktop" 등의 디바이스 분류
   * @property {string} app_key 앱 고유 키 - 애플리케이션을 식별하는 고유한 키값
   * @property {string} [push_key] 푸시 키 - 푸시 서비스를 위한 고유 키값 (bizMOB.Push.getPushKey() 호출 후 설정됨)
   * @property {boolean} release_flag 릴리즈 모드 여부 - true(운영환경), false(개발환경)
   * @property {string} push_provider_type 푸시 제공 서버(APNS 혹은 GCM)
   * @property {string} locale 국가 정보
   * @property {string} web_log_level 웹 로그 레벨
   * @property {string} language 언어 코드
   * @property {string} carrier_code 국가코드 + 통신사코드
   * @example
   * import { Device } from '@bizMOB';
   * // 전체 디바이스 정보 조회
   * const deviceInfo = Device.getInfo();
   * console.log('디바이스 ID:', deviceInfo.device_id);
   * console.log('운영체제:', deviceInfo.os_type);
   * console.log('화면 크기:', deviceInfo.screen_width + 'x' + deviceInfo.screen_height);
   * console.log('제조사:', deviceInfo.manufacturer);
   * console.log('모델명:', deviceInfo.model);
   *
   */
  static getInfo(arg?: {
    _sKey: string // Device Info Key
  }) {
    return arg ? window.bizMOB.Device.getInfo(arg) : window.bizMOB.Device.getInfo();
  }

  /**
   * 현재 환경이 App 환경인지 판별
   *
   * @description bizMOB 앱 컨테이너 내에서 실행 중인지 확인하는 함수.
   * 앱 환경에서만 사용 가능한 네이티브 기능을 호출하기 전에 체크하는데 사용된다.
   *
   * @returns {boolean} App 환경이면 true, 그렇지 않으면 false
   * @example
   * import { Device, System } from '@bizMOB';
   * if (Device.isApp()) {
   *   // 네이티브 기능 사용 가능
   *   System.callCamera();
   * } else {
   *   // 웹 환경: 웹 API 사용
   *   console.log('웹 브라우저에서 실행 중입니다.');
   * }
   */
  static isApp() {
    return window.bizMOB.Device.isApp();
  }

  /**
   * 현재 환경이 Web 환경인지 판별
   *
   * @description 웹 브라우저 환경에서 실행 중인지 확인하는 함수.
   * 웹 환경에서만 사용 가능한 기능을 분기 처리할 때 사용된다.
   *
   * @returns {boolean} Web 환경이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * if (Device.isWeb()) {
   *   console.log('웹 브라우저에서 실행 중입니다.');
   * } else {
   *   console.log('네이티브 앱에서 실행 중입니다.');
   * }
   */
  static isWeb() {
    return window.bizMOB.Device.isWeb();
  }

  /**
   * 현재 디바이스가 모바일 기기인지 판별
   *
   * @description 스마트폰, 태블릿 등 모바일 디바이스에서 실행 중인지 확인하는 함수.
   * 모바일 특화 UI나 기능을 적용할 때 사용된다.
   *
   * @returns {boolean} 모바일 기기이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * // 모바일 최적화 UI 적용
   * if (Device.isMobile()) {
   *   console.log('모바일 기기에서 실행 중입니다.');
   *
   *   // 모바일 전용 CSS 클래스 적용
   *   document.body.classList.add('mobile-ui');
   * } else {
   *   // 데스크톱 UI 적용
   *   document.body.classList.add('desktop-ui');
   * }
   */
  static isMobile() {
    return window.bizMOB.Device.isMobile();
  }

  /**
   * 현재 디바이스가 PC인지 판별
   *
   * @description 데스크톱, 노트북 등 PC 환경에서 실행 중인지 확인하는 함수.
   * PC 환경에 최적화된 UI나 기능을 적용할 때 사용된다.
   *
   * @returns {boolean} PC 환경이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * // PC 최적화 UI 적용
   * if (Device.isPC()) {
   *   console.log('PC에서 실행 중입니다.');
   *   // 데스크톱 전용 CSS 클래스 적용
   *   document.body.classList.add('desktop-ui');
   * } else {
   *   // 모바일 UI 적용
   *   document.body.classList.add('mobile-ui');
   * }
   */
  static isPC() {
    return window.bizMOB.Device.isPC();
  }

  /**
   * 현재 디바이스가 Android 기기인지 판별
   *
   * @description Android 운영체제를 사용하는 디바이스인지 확인하는 함수.
   * Android 특화 기능이나 UI를 적용할 때 사용된다.
   *
   * @returns {boolean} Android 기기이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * if (Device.isAndroid()) {
   *   console.log('Android 기기에서 실행 중입니다.');
   * }
   */
  static isAndroid() {
    return window.bizMOB.Device.isAndroid();
  }

  /**
   * 현재 디바이스가 iOS 기기인지 판별
   *
   * @description iPhone, iPad 등 iOS 운영체제를 사용하는 디바이스인지 확인하는 함수.
   * iOS 특화 기능이나 UI를 적용할 때 사용된다.
   *
   * @returns {boolean} iOS 기기이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * if (Device.isIOS()) {
   *   console.log('iOS 기기에서 실행 중입니다.');
   * }
   */
  static isIOS() {
    return window.bizMOB.Device.isIOS();
  }

  /**
   * 현재 디바이스가 태블릿인지 판별
   *
   * @description iPad, Android 태블릿 등 태블릿 형태의 디바이스인지 확인하는 함수.
   * 태블릿에 최적화된 레이아웃이나 기능을 적용할 때 사용된다.
   *
   * @returns {boolean} 태블릿이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * if (Device.isTablet()) {
   *   console.log('태블릿에서 실행 중입니다.');
   * } 
   */
  static isTablet() {
    return window.bizMOB.Device.isTablet();
  }

  /**
   * 현재 디바이스가 스마트폰인지 판별
   *
   * @description iPhone, Android 폰 등 스마트폰 형태의 디바이스인지 확인하는 함수.
   * 스마트폰에 최적화된 UI나 기능을 적용할 때 사용된다.
   *
   * @returns {boolean} 스마트폰이면 true, 그렇지 않으면 false
   * @example
   * import { Device } from '@bizMOB';
   * if (Device.isPhone()) {
   *   console.log('스마트폰에서 실행 중입니다.');
   * } 
   */
  static isPhone() {
    return window.bizMOB.Device.isPhone();
  }
}
