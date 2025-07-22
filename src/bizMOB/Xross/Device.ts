export default class Device {
  /**
   * 디바이스의 상세 정보를 조회합니다.
   *
   * 현재 실행 중인 디바이스의 하드웨어, 운영체제, 앱 정보 등 다양한 시스템 정보를 제공하는 API입니다.
   * 특정 키를 지정하여 원하는 정보만 선택적으로 가져오거나, 전체 디바이스 정보를 한 번에 조회할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 디바이스 API를 통한 정확한 하드웨어 정보 제공
   * - 웹: 브라우저 API와 User-Agent를 통한 제한적 정보 제공
   *
   * @purpose 디바이스 최적화, 기능 분기 처리, 시스템 호환성 체크, 사용자 환경 분석
   *
   * @param {Object} [arg] - 디바이스 정보 조회 설정 객체 (선택적)
   * @param {string} [arg._sKey] - 조회할 특정 디바이스 정보 키
   *   - 'deviceId': 디바이스 고유 식별자
   *   - 'model': 디바이스 모델명
   *   - 'platform': 플랫폼 정보 (iOS, Android, Web)
   *   - 'version': OS 버전
   *   - 'appVersion': 앱 버전
   *   - 'manufacturer': 제조사 정보
   *   - 'screenWidth': 화면 가로 크기
   *   - 'screenHeight': 화면 세로 크기
   *
   * @returns {Object|string} 디바이스 정보 객체 또는 특정 키의 값
   * @returns {string} return.deviceId - 디바이스 고유 식별자
   * @returns {string} return.model - 디바이스 모델명
   * @returns {string} return.platform - 플랫폼 (iOS, Android, Web)
   * @returns {string} return.version - 운영체제 버전
   * @returns {string} return.appVersion - 앱 버전 정보
   * @returns {string} return.manufacturer - 제조사 (Samsung, Apple, etc.)
   * @returns {number} return.screenWidth - 화면 가로 크기 (픽셀)
   * @returns {number} return.screenHeight - 화면 세로 크기 (픽셀)
   * @returns {boolean} return.isTablet - 태블릿 여부
   * @returns {string} return.language - 시스템 언어
   * @returns {string} return.timeZone - 시간대 정보
   *
   * @caution
   * - 웹 환경에서는 제한적인 정보만 제공됩니다
   * - deviceId는 개인정보보호 정책에 따라 제한될 수 있습니다
   * - 일부 정보는 디바이스 권한 설정에 따라 접근이 제한될 수 있습니다
   *
   * @example
   * // 전체 디바이스 정보 조회
   * const deviceInfo = bizMOB.Device.getInfo();
   * console.log('디바이스 모델:', deviceInfo.model);
   * console.log('OS 버전:', deviceInfo.version);
   * console.log('화면 크기:', `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`);
   *
   * @example
   * // 특정 정보만 조회
   * const deviceModel = bizMOB.Device.getInfo({ _sKey: 'model' });
   * const platform = bizMOB.Device.getInfo({ _sKey: 'platform' });
   *
   * // 플랫폼별 분기 처리
   * if (platform === 'iOS') {
   *   console.log('iOS 디바이스입니다.');
   * } else if (platform === 'Android') {
   *   console.log('안드로이드 디바이스입니다.');
   * }
   *
   * @example
   * // 화면 크기에 따른 UI 최적화
   * const screenWidth = bizMOB.Device.getInfo({ _sKey: 'screenWidth' });
   * const screenHeight = bizMOB.Device.getInfo({ _sKey: 'screenHeight' });
   *
   * if (screenWidth < 768) {
   *   // 모바일 레이아웃 적용
   *   document.body.classList.add('mobile-layout');
   * } else {
   *   // 태블릿/데스크톱 레이아웃 적용
   *   document.body.classList.add('desktop-layout');
   * }
   *
   * @since bizMOB 4.0.0
   */
  static getInfo(arg?: {
    _sKey: string // Device Info Key
  }) {
    return arg ? window.bizMOB.Device.getInfo(arg) : window.bizMOB.Device.getInfo();
  }

  /**
   * 현재 환경이 네이티브 앱인지 판단합니다.
   *
   * bizMOB SDK가 네이티브 앱 환경에서 실행되고 있는지 확인하는 API입니다.
   * 앱과 웹 환경을 구분하여 각각에 최적화된 기능을 제공할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 앱 컨테이너에서 실행 시 true 반환
   * - 웹: 일반 브라우저에서 실행 시 false 반환
   *
   * @purpose 환경별 기능 분기, 네이티브 API 사용 여부 결정, UI/UX 최적화
   *
   * @returns {boolean} 앱 환경 여부
   *   - true: 네이티브 앱 환경에서 실행 중
   *   - false: 웹 브라우저 환경에서 실행 중
   *
   * @caution
   * - 하이브리드 앱과 일반 웹을 구분하는 기준으로 사용
   * - 앱 환경에서만 사용 가능한 네이티브 기능 접근 전 필수 체크
   *
   * @example
   * // 환경별 기능 분기
   * if (bizMOB.Device.isApp()) {
   *   // 앱 환경: 네이티브 기능 사용
   *   console.log('네이티브 앱에서 실행 중입니다.');
   *
   *   // 네이티브 API 사용 가능
   *   bizMOB.Device.getInfo(); // 상세한 디바이스 정보
   *   bizMOB.File.download(); // 파일 다운로드
   *   bizMOB.Push.registerToServer(); // 푸시 알림
   * } else {
   *   // 웹 환경: 웹 API 사용
   *   console.log('웹 브라우저에서 실행 중입니다.');
   *
   *   // 웹 API 또는 제한된 기능 사용
   *   navigator.geolocation.getCurrentPosition(); // 웹 위치 API
   * }
   *
   * @example
   * // UI 요소 동적 조정
   * const isNativeApp = bizMOB.Device.isApp();
   *
   * // 앱에서는 네이티브 뒤로가기 사용, 웹에서는 브라우저 뒤로가기
   * if (isNativeApp) {
   *   document.getElementById('back-button').style.display = 'none';
   * } else {
   *   document.getElementById('back-button').onclick = () => history.back();
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isApp() {
    return window.bizMOB.Device.isApp();
  }

  /**
   * 현재 환경이 웹 브라우저인지 판단합니다.
   *
   * bizMOB SDK가 일반 웹 브라우저 환경에서 실행되고 있는지 확인하는 API입니다.
   * 웹 전용 기능이나 브라우저 API를 사용하기 전에 환경을 확인할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 앱 컨테이너에서 실행 시 false 반환
   * - 웹: 일반 브라우저에서 실행 시 true 반환
   *
   * @purpose 웹 전용 기능 활성화, 브라우저 API 사용 여부 결정, 크로스 플랫폼 호환성
   *
   * @returns {boolean} 웹 환경 여부
   *   - true: 웹 브라우저 환경에서 실행 중
   *   - false: 네이티브 앱 환경에서 실행 중
   *
   * @caution
   * - isApp()과 상반된 결과를 반환합니다
   * - 웹 환경에서는 일부 네이티브 기능이 제한됩니다
   * - 브라우저별 호환성을 고려해야 합니다
   *
   * @example
   * // 웹 전용 기능 활성화
   * if (bizMOB.Device.isWeb()) {
   *   console.log('웹 브라우저에서 실행 중입니다.');
   *
   *   // 웹 전용 기능 사용
   *   window.addEventListener('beforeunload', (e) => {
   *     e.preventDefault();
   *     e.returnValue = '페이지를 떠나시겠습니까?';
   *   });
   *
   *   // 브라우저 히스토리 관리
   *   window.history.pushState({}, '', '/new-page');
   * } else {
   *   console.log('네이티브 앱에서 실행 중입니다.');
   * }
   *
   * @example
   * // 환경별 다른 로직 적용
   * const storage = bizMOB.Device.isWeb()
   *   ? localStorage  // 웹: localStorage 사용
   *   : bizMOB.Storage; // 앱: bizMOB Storage 사용
   *
   * storage.setItem('user_preference', 'value');
   *
   * @example
   * // 웹 환경에서만 SEO 메타태그 설정
   * if (bizMOB.Device.isWeb()) {
   *   document.title = '새로운 페이지 제목';
   *
   *   const metaDescription = document.createElement('meta');
   *   metaDescription.name = 'description';
   *   metaDescription.content = '페이지 설명';
   *   document.head.appendChild(metaDescription);
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isWeb() {
    return window.bizMOB.Device.isWeb();
  }

  /**
   * 현재 디바이스가 모바일 기기인지 판단합니다.
   *
   * 스마트폰이나 태블릿 등 모바일 디바이스에서 실행되고 있는지 확인하는 API입니다.
   * 화면 크기, 터치 지원, 모바일 OS 등을 종합적으로 판단하여 모바일 최적화 UI를 제공할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 디바이스 정보 기반 정확한 판단
   * - 웹: User-Agent와 화면 크기 기반 추정
   *
   * @purpose 반응형 디자인, 터치 UI 최적화, 모바일 전용 기능 활성화
   *
   * @returns {boolean} 모바일 기기 여부
   *   - true: 스마트폰 또는 태블릿 등 모바일 기기
   *   - false: PC, 노트북 등 데스크톱 기기
   *
   * @caution
   * - 태블릿도 모바일로 분류됩니다
   * - 웹 환경에서는 User-Agent 기반 추정으로 정확도가 제한적일 수 있습니다
   * - 브라우저 개발자 도구의 모바일 시뮬레이션에서도 true를 반환할 수 있습니다
   *
   * @example
   * // 모바일 최적화 UI 적용
   * if (bizMOB.Device.isMobile()) {
   *   console.log('모바일 기기에서 실행 중입니다.');
   *
   *   // 모바일 전용 CSS 클래스 적용
   *   document.body.classList.add('mobile-ui');
   *
   *   // 터치 이벤트 리스너 등록
   *   document.addEventListener('touchstart', handleTouchStart);
   *   document.addEventListener('touchmove', handleTouchMove);
   *
   *   // 모바일 네비게이션 메뉴 활성화
   *   document.getElementById('mobile-menu').style.display = 'block';
   * } else {
   *   // 데스크톱 UI 적용
   *   document.body.classList.add('desktop-ui');
   *   document.getElementById('desktop-menu').style.display = 'block';
   * }
   *
   * @example
   * // 입력 방식에 따른 UI 조정
   * const isMobileDevice = bizMOB.Device.isMobile();
   *
   * // 버튼 크기 조정 (모바일에서 더 크게)
   * const buttons = document.querySelectorAll('.action-button');
   * buttons.forEach(button => {
   *   if (isMobileDevice) {
   *     button.style.minHeight = '44px'; // 터치하기 쉬운 크기
   *     button.style.padding = '12px 20px';
   *   } else {
   *     button.style.minHeight = '32px';
   *     button.style.padding = '8px 16px';
   *   }
   * });
   *
   * @example
   * // 모바일에서만 스와이프 제스처 활성화
   * if (bizMOB.Device.isMobile()) {
   *   let startX = 0;
   *
   *   document.addEventListener('touchstart', (e) => {
   *     startX = e.touches[0].clientX;
   *   });
   *
   *   document.addEventListener('touchend', (e) => {
   *     const endX = e.changedTouches[0].clientX;
   *     const diffX = startX - endX;
   *
   *     if (Math.abs(diffX) > 100) {
   *       if (diffX > 0) {
   *         console.log('좌측으로 스와이프');
   *       } else {
   *         console.log('우측으로 스와이프');
   *       }
   *     }
   *   });
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isMobile() {
    return window.bizMOB.Device.isMobile();
  }

  /**
   * 현재 디바이스가 PC(데스크톱)인지 판단합니다.
   *
   * 데스크톱 컴퓨터나 노트북 등 PC 환경에서 실행되고 있는지 확인하는 API입니다.
   * 큰 화면과 마우스/키보드 입력에 최적화된 UI와 기능을 제공할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 디바이스 정보 기반 정확한 판단
   * - 웹: User-Agent와 화면 크기 기반 추정
   *
   * @purpose 데스크톱 UI 최적화, 마우스 상호작용, 큰 화면 레이아웃 적용
   *
   * @returns {boolean} PC 기기 여부
   *   - true: 데스크톱, 노트북 등 PC 기기
   *   - false: 스마트폰, 태블릿 등 모바일 기기
   *
   * @caution
   * - isMobile()과 상반된 결과를 반환합니다
   * - 웹 환경에서는 User-Agent 기반 추정으로 정확도가 제한적일 수 있습니다
   * - 일부 하이브리드 디바이스(태블릿+키보드)에서는 판단이 모호할 수 있습니다
   *
   * @example
   * // PC 최적화 UI 적용
   * if (bizMOB.Device.isPC()) {
   *   console.log('PC에서 실행 중입니다.');
   *
   *   // 데스크톱 전용 CSS 클래스 적용
   *   document.body.classList.add('desktop-ui');
   *
   *   // 마우스 이벤트 리스너 등록
   *   document.addEventListener('mouseenter', handleMouseEnter);
   *   document.addEventListener('mouseleave', handleMouseLeave);
   *
   *   // 데스크톱 네비게이션 메뉴 활성화
   *   document.getElementById('desktop-menu').style.display = 'block';
   *   document.getElementById('sidebar').style.display = 'block';
   * } else {
   *   // 모바일 UI 적용
   *   document.body.classList.add('mobile-ui');
   * }
   *
   * @example
   * // PC에서만 키보드 단축키 활성화
   * if (bizMOB.Device.isPC()) {
   *   document.addEventListener('keydown', (e) => {
   *     // Ctrl+S: 저장
   *     if (e.ctrlKey && e.key === 's') {
   *       e.preventDefault();
   *       saveDocument();
   *     }
   *
   *     // Ctrl+Z: 실행 취소
   *     if (e.ctrlKey && e.key === 'z') {
   *       e.preventDefault();
   *       undoAction();
   *     }
   *
   *     // ESC: 모달 닫기
   *     if (e.key === 'Escape') {
   *       closeModal();
   *     }
   *   });
   * }
   *
   * @example
   * // 화면 크기에 따른 레이아웃 조정
   * const isPCDevice = bizMOB.Device.isPC();
   *
   * // 그리드 레이아웃 조정
   * const gridContainer = document.querySelector('.grid-container');
   * if (isPCDevice) {
   *   // PC: 4열 그리드
   *   gridContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
   *   gridContainer.style.gap = '20px';
   * } else {
   *   // 모바일: 2열 그리드
   *   gridContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
   *   gridContainer.style.gap = '10px';
   * }
   *
   * @example
   * // PC에서만 드래그 앤 드롭 기능 활성화
   * if (bizMOB.Device.isPC()) {
   *   const dropZone = document.getElementById('file-drop-zone');
   *
   *   dropZone.addEventListener('dragover', (e) => {
   *     e.preventDefault();
   *     dropZone.classList.add('drag-over');
   *   });
   *
   *   dropZone.addEventListener('drop', (e) => {
   *     e.preventDefault();
   *     dropZone.classList.remove('drag-over');
   *
   *     const files = e.dataTransfer.files;
   *     handleFileUpload(files);
   *   });
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isPC() {
    return window.bizMOB.Device.isPC();
  }

  /**
   * 현재 디바이스가 Android 기기인지 판단합니다.
   *
   * Google Android 운영체제에서 실행되고 있는지 확인하는 API입니다.
   * Android 전용 기능이나 플랫폼별 최적화를 적용할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 플랫폼 정보 기반 정확한 판단
   * - 웹: User-Agent 문자열 분석을 통한 판단
   *
   * @purpose Android 전용 기능 활성화, 플랫폼별 UI/UX 최적화, 안드로이드 특화 동작
   *
   * @returns {boolean} Android 기기 여부
   *   - true: Android 운영체제 기기
   *   - false: iOS, Windows, macOS 등 기타 운영체제
   *
   * @caution
   * - Android 버전이나 제조사에 관계없이 Android OS면 true를 반환합니다
   * - 웹 환경에서는 User-Agent 스푸핑에 의해 부정확할 수 있습니다
   * - Chrome OS와 구분하여 판단합니다
   *
   * @example
   * // Android 전용 기능 활성화
   * if (bizMOB.Device.isAndroid()) {
   *   console.log('Android 기기에서 실행 중입니다.');
   *
   *   // Android 백 버튼 처리
   *   document.addEventListener('backbutton', (e) => {
   *     e.preventDefault();
   *     // 커스텀 뒤로가기 동작
   *     handleAndroidBackButton();
   *   });
   *
   *   // Android 메뉴 버튼 처리
   *   document.addEventListener('menubutton', () => {
   *     toggleMenu();
   *   });
   *
   *   // Android 상태바 색상 설정
   *   document.querySelector('meta[name="theme-color"]').content = '#2196F3';
   * }
   *
   * @example
   * // Android Material Design 적용
   * if (bizMOB.Device.isAndroid()) {
   *   // Material Design 스타일 적용
   *   document.body.classList.add('material-design');
   *
   *   // Floating Action Button 표시
   *   const fab = document.getElementById('floating-action-btn');
   *   fab.style.display = 'block';
   *
   *   // Android 타이포그래피 적용
   *   document.body.style.fontFamily = 'Roboto, sans-serif';
   * } else if (bizMOB.Device.isIOS()) {
   *   // iOS Human Interface Guidelines 적용
   *   document.body.classList.add('ios-design');
   *   document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
   * }
   *
   * @example
   * // Android 특화 알림 처리
   * if (bizMOB.Device.isAndroid()) {
   *   // Android 푸시 알림 설정
   *   const androidNotificationConfig = {
   *     sound: 'notification_sound.mp3',
   *     vibration: [200, 100, 200],
   *     ledColor: '#FF0000',
   *     smallIcon: 'ic_notification_small',
   *     largeIcon: 'ic_notification_large'
   *   };
   *
   *   bizMOB.Push.setNotificationConfig(androidNotificationConfig);
   * }
   *
   * @example
   * // Android 버전별 기능 분기
   * if (bizMOB.Device.isAndroid()) {
   *   const deviceInfo = bizMOB.Device.getInfo();
   *   const androidVersion = parseFloat(deviceInfo.version);
   *
   *   if (androidVersion >= 10.0) {
   *     // Android 10 이상에서만 지원하는 기능
   *     enableDarkModeSupport();
   *     enableGestureNavigation();
   *   } else if (androidVersion >= 8.0) {
   *     // Android 8 이상에서만 지원하는 기능
   *     enableNotificationChannels();
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isAndroid() {
    return window.bizMOB.Device.isAndroid();
  }

  /**
   * 현재 디바이스가 iOS 기기인지 판단합니다.
   *
   * Apple iOS 운영체제(iPhone, iPad, iPod touch)에서 실행되고 있는지 확인하는 API입니다.
   * iOS 전용 기능이나 Apple Human Interface Guidelines에 맞는 UI/UX를 적용할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 플랫폼 정보 기반 정확한 판단
   * - 웹: User-Agent 문자열 분석을 통한 판단
   *
   * @purpose iOS 전용 기능 활성화, Apple 디자인 가이드라인 적용, iOS 특화 동작
   *
   * @returns {boolean} iOS 기기 여부
   *   - true: iPhone, iPad, iPod touch 등 iOS 기기
   *   - false: Android, Windows, macOS 등 기타 운영체제
   *
   * @caution
   * - iPhone과 iPad 모두 iOS로 판단됩니다 (구분이 필요하면 isTablet() 함께 사용)
   * - iPadOS도 iOS로 분류됩니다
   * - 웹 환경에서는 User-Agent 스푸핑에 의해 부정확할 수 있습니다
   *
   * @example
   * // iOS 전용 기능 활성화
   * if (bizMOB.Device.isIOS()) {
   *   console.log('iOS 기기에서 실행 중입니다.');
   *
   *   // iOS 스타일 네비게이션 바
   *   document.body.classList.add('ios-navigation');
   *
   *   // iOS 전용 폰트 적용
   *   document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
   *
   *   // iOS 상태바 색상 설정
   *   const statusBarMeta = document.createElement('meta');
   *   statusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
   *   statusBarMeta.content = 'default';
   *   document.head.appendChild(statusBarMeta);
   * }
   *
   * @example
   * // iOS Human Interface Guidelines 적용
   * if (bizMOB.Device.isIOS()) {
   *   // iOS 스타일 버튼 적용
   *   const buttons = document.querySelectorAll('.action-button');
   *   buttons.forEach(button => {
   *     button.style.borderRadius = '8px';
   *     button.style.backgroundColor = '#007AFF';
   *     button.style.color = 'white';
   *     button.style.border = 'none';
   *     button.style.fontSize = '17px';
   *     button.style.fontWeight = '600';
   *   });
   *
   *   // iOS 스타일 리스트 적용
   *   const lists = document.querySelectorAll('.list-item');
   *   lists.forEach(item => {
   *     item.style.borderBottom = '1px solid #C7C7CC';
   *     item.style.padding = '11px 16px';
   *   });
   * }
   *
   * @example
   * // iOS Safe Area 대응
   * if (bizMOB.Device.isIOS()) {
   *   // CSS 변수로 Safe Area 설정
   *   const style = document.createElement('style');
   *   style.textContent = `
   *     :root {
   *       --safe-area-inset-top: env(safe-area-inset-top);
   *       --safe-area-inset-bottom: env(safe-area-inset-bottom);
   *       --safe-area-inset-left: env(safe-area-inset-left);
   *       --safe-area-inset-right: env(safe-area-inset-right);
   *     }
   *
   *     .header {
   *       padding-top: var(--safe-area-inset-top);
   *     }
   *
   *     .footer {
   *       padding-bottom: var(--safe-area-inset-bottom);
   *     }
   *   `;
   *   document.head.appendChild(style);
   * }
   *
   * @example
   * // iOS 버전별 기능 분기
   * if (bizMOB.Device.isIOS()) {
   *   const deviceInfo = bizMOB.Device.getInfo();
   *   const iosVersion = parseFloat(deviceInfo.version);
   *
   *   if (iosVersion >= 14.0) {
   *     // iOS 14 이상에서만 지원하는 기능
   *     enableWidgetSupport();
   *     enableAppClips();
   *   } else if (iosVersion >= 13.0) {
   *     // iOS 13 이상에서만 지원하는 기능
   *     enableDarkModeSupport();
   *     enableSignInWithApple();
   *   }
   *
   *   // iPhone과 iPad 구분
   *   if (bizMOB.Device.isTablet()) {
   *     console.log('iPad에서 실행 중');
   *     enableSplitViewSupport();
   *   } else {
   *     console.log('iPhone에서 실행 중');
   *     enableCompactInterface();
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isIOS() {
    return window.bizMOB.Device.isIOS();
  }

  /**
   * 현재 디바이스가 태블릿인지 판단합니다.
   *
   * iPad, Android 태블릿 등 태블릿 형태의 디바이스에서 실행되고 있는지 확인하는 API입니다.
   * 태블릿의 큰 화면과 터치 인터페이스에 최적화된 UI를 제공할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 디바이스 정보 기반 정확한 판단
   * - 웹: 화면 크기와 User-Agent 분석을 통한 추정
   *
   * @purpose 태블릿 최적화 레이아웃, 멀티컬럼 UI, 스플릿 뷰 인터페이스 제공
   *
   * @returns {boolean} 태블릿 기기 여부
   *   - true: iPad, Android 태블릿 등 태블릿 기기
   *   - false: 스마트폰, PC 등 기타 기기
   *
   * @caution
   * - 화면 크기를 기준으로 판단하므로 큰 스마트폰은 태블릿으로 인식될 수 있습니다
   * - 접이식 폰이나 하이브리드 기기에서는 판단이 모호할 수 있습니다
   * - 웹 환경에서는 브라우저 창 크기에 따라 결과가 달라질 수 있습니다
   *
   * @example
   * // 태블릿 최적화 레이아웃 적용
   * if (bizMOB.Device.isTablet()) {
   *   console.log('태블릿에서 실행 중입니다.');
   *
   *   // 태블릿 전용 CSS 클래스 적용
   *   document.body.classList.add('tablet-layout');
   *
   *   // 사이드바 활성화 (태블릿은 공간이 충분)
   *   const sidebar = document.getElementById('sidebar');
   *   sidebar.style.display = 'block';
   *   sidebar.style.width = '320px';
   *
   *   // 메인 컨텐츠 영역 조정
   *   const mainContent = document.getElementById('main-content');
   *   mainContent.style.marginLeft = '320px';
   * } else if (bizMOB.Device.isPhone()) {
   *   // 폰에서는 사이드바 숨기기
   *   document.getElementById('sidebar').style.display = 'none';
   * }
   *
   * @example
   * // iPad와 Android 태블릿 구분 처리
   * if (bizMOB.Device.isTablet()) {
   *   if (bizMOB.Device.isIOS()) {
   *     console.log('iPad에서 실행 중');
   *
   *     // iPad 전용 기능
   *     enableSplitView();
   *     enableSlideOver();
   *     enablePictureInPicture();
   *
   *     // iPad Safe Area 대응
   *     document.body.style.paddingTop = 'env(safe-area-inset-top)';
   *   } else if (bizMOB.Device.isAndroid()) {
   *     console.log('Android 태블릿에서 실행 중');
   *
   *     // Android 태블릿 전용 기능
   *     enableMultiWindow();
   *     enableAdaptiveUI();
   *   }
   * }
   *
   * @example
   * // 태블릿에서 멀티컬럼 레이아웃 적용
   * if (bizMOB.Device.isTablet()) {
   *   const container = document.querySelector('.content-grid');
   *
   *   // 태블릿: 3열 그리드
   *   container.style.display = 'grid';
   *   container.style.gridTemplateColumns = 'repeat(3, 1fr)';
   *   container.style.gap = '24px';
   *   container.style.padding = '24px';
   * } else if (bizMOB.Device.isPhone()) {
   *   // 폰: 1열 리스트
   *   container.style.display = 'block';
   *   container.style.padding = '16px';
   * }
   *
   * @example
   * // 태블릿에서 드래그 앤 드롭 지원
   * if (bizMOB.Device.isTablet()) {
   *   const dropZones = document.querySelectorAll('.drop-zone');
   *
   *   dropZones.forEach(zone => {
   *     // 터치 기반 드래그 앤 드롭
   *     let draggedElement = null;
   *
   *     zone.addEventListener('touchstart', (e) => {
   *       draggedElement = e.target.closest('.draggable');
   *       if (draggedElement) {
   *         draggedElement.style.opacity = '0.5';
   *       }
   *     });
   *
   *     zone.addEventListener('touchmove', (e) => {
   *       if (draggedElement) {
   *         e.preventDefault();
   *         const touch = e.touches[0];
   *         const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
   *
   *         if (elementBelow && elementBelow.classList.contains('drop-target')) {
   *           elementBelow.classList.add('drop-hover');
   *         }
   *       }
   *     });
   *
   *     zone.addEventListener('touchend', (e) => {
   *       if (draggedElement) {
   *         draggedElement.style.opacity = '1';
   *
   *         const touch = e.changedTouches[0];
   *         const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
   *
   *         if (dropTarget && dropTarget.classList.contains('drop-target')) {
   *           handleDrop(draggedElement, dropTarget);
   *         }
   *
   *         draggedElement = null;
   *       }
   *     });
   *   });
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isTablet() {
    return window.bizMOB.Device.isTablet();
  }

  /**
   * 현재 디바이스가 스마트폰인지 판단합니다.
   *
   * iPhone, Android 폰 등 스마트폰 형태의 디바이스에서 실행되고 있는지 확인하는 API입니다.
   * 작은 화면과 한 손 조작에 최적화된 모바일 UI를 제공할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 디바이스 정보 기반 정확한 판단
   * - 웹: 화면 크기와 User-Agent 분석을 통한 추정
   *
   * @purpose 모바일 최적화 UI, 한 손 조작 인터페이스, 세로 화면 레이아웃 제공
   *
   * @returns {boolean} 스마트폰 기기 여부
   *   - true: iPhone, Android 폰 등 스마트폰 기기
   *   - false: 태블릿, PC 등 기타 기기
   *
   * @caution
   * - 화면 크기를 기준으로 판단하므로 작은 태블릿은 폰으로 인식될 수 있습니다
   * - 폴더블 폰이나 대형 스마트폰에서는 판단이 모호할 수 있습니다
   * - 웹 환경에서는 브라우저 창 크기에 따라 결과가 달라질 수 있습니다
   *
   * @example
   * // 스마트폰 최적화 UI 적용
   * if (bizMOB.Device.isPhone()) {
   *   console.log('스마트폰에서 실행 중입니다.');
   *
   *   // 모바일 전용 CSS 클래스 적용
   *   document.body.classList.add('phone-layout');
   *
   *   // 하단 내비게이션 바 활성화
   *   const bottomNav = document.getElementById('bottom-navigation');
   *   bottomNav.style.display = 'flex';
   *
   *   // 사이드바 숨기기 (공간 부족)
   *   const sidebar = document.getElementById('sidebar');
   *   sidebar.style.display = 'none';
   *
   *   // 햄버거 메뉴 활성화
   *   const hamburgerMenu = document.getElementById('hamburger-menu');
   *   hamburgerMenu.style.display = 'block';
   * } else {
   *   // 태블릿이나 PC에서는 사이드바 표시
   *   document.getElementById('sidebar').style.display = 'block';
   * }
   *
   * @example
   * // 폰에서 한 손 조작 최적화
   * if (bizMOB.Device.isPhone()) {
   *   // 주요 버튼을 화면 하단에 배치
   *   const actionButtons = document.querySelectorAll('.primary-action');
   *   actionButtons.forEach(button => {
   *     button.style.position = 'fixed';
   *     button.style.bottom = '20px';
   *     button.style.right = '20px';
   *     button.style.width = '56px';
   *     button.style.height = '56px';
   *     button.style.borderRadius = '50%';
   *     button.style.zIndex = '1000';
   *   });
   *
   *   // 스와이프 제스처 활성화
   *   enableSwipeGestures();
   *
   *   // 풀 스크린 모달 사용
   *   const modals = document.querySelectorAll('.modal');
   *   modals.forEach(modal => {
   *     modal.style.height = '100vh';
   *     modal.style.width = '100vw';
   *     modal.style.borderRadius = '0';
   *   });
   * }
   *
   * @example
   * // iPhone과 Android 폰 구분 처리
   * if (bizMOB.Device.isPhone()) {
   *   if (bizMOB.Device.isIOS()) {
   *     console.log('iPhone에서 실행 중');
   *
   *     // iPhone 전용 최적화
   *     enableiOSHapticFeedback();
   *     enableSafeAreaInsets();
   *
   *     // iPhone 노치 대응
   *     const header = document.querySelector('.header');
   *     header.style.paddingTop = 'env(safe-area-inset-top)';
   *   } else if (bizMOB.Device.isAndroid()) {
   *     console.log('Android 폰에서 실행 중');
   *
   *     // Android 폰 전용 최적화
   *     enableAndroidBackButton();
   *     enableMaterialDesignRipple();
   *   }
   * }
   *
   * @example
   * // 폰에서 세로/가로 모드 대응
   * if (bizMOB.Device.isPhone()) {
   *   function handleOrientationChange() {
   *     const isPortrait = window.innerHeight > window.innerWidth;
   *
   *     if (isPortrait) {
   *       // 세로 모드: 일반적인 모바일 레이아웃
   *       document.body.classList.add('portrait-mode');
   *       document.body.classList.remove('landscape-mode');
   *
   *       // 하단 네비게이션 표시
   *       document.getElementById('bottom-nav').style.display = 'flex';
   *     } else {
   *       // 가로 모드: 더 넓은 화면 활용
   *       document.body.classList.add('landscape-mode');
   *       document.body.classList.remove('portrait-mode');
   *
   *       // 하단 네비게이션 숨기기 (공간 절약)
   *       document.getElementById('bottom-nav').style.display = 'none';
   *     }
   *   }
   *
   *   // 초기 설정 및 이벤트 리스너
   *   handleOrientationChange();
   *   window.addEventListener('orientationchange', handleOrientationChange);
   *   window.addEventListener('resize', handleOrientationChange);
   * }
   *
   * @since bizMOB 4.0.0
   */
  static isPhone() {
    return window.bizMOB.Device.isPhone();
  }
}
