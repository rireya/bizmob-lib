/**
 * bizMOB 네이티브 이벤트 관리 클래스
 *
 * 앱 생명주기, 사용자 상호작용, 시스템 상태 변화 등 다양한 네이티브 이벤트를 처리하는 클래스입니다.
 * 크로스 플랫폼 이벤트 핸들링을 통해 일관된 사용자 경험을 제공합니다.
 *
 * @description 지원하는 이벤트 목록:
 *
 * **앱 생명주기 이벤트:**
 * - `open`: 페이지(웹뷰)를 열었을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - `close`: 페이지(웹뷰)를 닫았을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - `beforeready`: 페이지(웹뷰)가 로드되기 전 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - `ready`: 페이지(웹뷰)가 로드되었을 때 (bizMOB4에서는 단일 웹뷰라 사용 안함)
 * - `resume`: 페이지(웹뷰)가 활성화되었을 때 (포커스, 화면 전환 시)
 *
 * **사용자 상호작용 이벤트:**
 * - `backbutton`: Android 뒤로가기 버튼이 눌렸을 때
 *
 * **시스템 이벤트:**
 * - `push`: 푸시 메시지를 수신했을 때
 * - `networkstatechange`: 네트워크 상태가 변경되었을 때 (온라인/오프라인)
 *
 * @purpose 네이티브 이벤트 처리, 앱 상태 관리, 사용자 경험 최적화, 시스템 상태 모니터링
 *
 * @caution
 * - bizMOB4는 단일 웹뷰 구조로 일부 페이지 관련 이벤트는 사용되지 않습니다
 * - Android와 iOS에서 지원하는 이벤트가 다를 수 있습니다
 * - 이벤트 핸들러는 메모리 누수 방지를 위해 적절히 정리해야 합니다
 *
 * @since bizMOB 4.0.0
 */
export default class Event {
  /**
   * 네이티브 이벤트 핸들러를 설정합니다.
   *
   * 특정 네이티브 이벤트에 대한 콜백 함수를 등록하는 API입니다.
   * 기존에 등록된 이벤트 핸들러가 있다면 덮어쓰기됩니다.
   * 앱 생명주기, 사용자 상호작용, 시스템 상태 변화를 감지하여 적절한 처리를 할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 이벤트 시스템과 직접 연동
   * - 웹: 브라우저 이벤트로 시뮬레이션 (제한적)
   *
   * @purpose 이벤트 기반 프로그래밍, 앱 상태 관리, 사용자 경험 향상, 시스템 통합
   *
   * @param {string} sEvent - 등록할 네이티브 이벤트 명
   *   - `'resume'`: 앱이 활성화될 때 (포그라운드 전환, 포커스 획득)
   *   - `'backbutton'`: Android 뒤로가기 버튼 클릭 시
   *   - `'push'`: 푸시 알림 수신 시
   *   - `'networkstatechange'`: 네트워크 상태 변경 시
   *
   * @param {Function|string} fCallback - 이벤트 발생 시 호출될 콜백 함수 또는 함수명
   *   - Function: 직접 함수 객체 전달
   *   - string: 전역 함수명 문자열 전달
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 동일한 이벤트에 새로운 핸들러를 설정하면 기존 핸들러는 덮어쓰기됩니다
   * - 이벤트 핸들러는 앱 생명주기 동안 유지되므로 메모리 누수에 주의해야 합니다
   * - 일부 이벤트는 플랫폼별로 지원 여부가 다를 수 있습니다
   *
   * @example
   * // 앱 재개 이벤트 처리
   * bizMOB.Event.setEvent('resume', function() {
   *   console.log('앱이 활성화되었습니다.');
   *
   *   // 데이터 새로고침
   *   refreshUserData();
   *
   *   // 타이머 재시작
   *   restartTimers();
   *
   *   // 알림 상태 업데이트
   *   updateNotificationBadge();
   * });
   *
   * @example
   * // Android 뒤로가기 버튼 처리
   * if (bizMOB.Device.isAndroid()) {
   *   bizMOB.Event.setEvent('backbutton', function() {
   *     console.log('뒤로가기 버튼이 눌렸습니다.');
   *
   *     // 현재 페이지 상태 확인
   *     const currentPage = getCurrentPage();
   *
   *     if (currentPage === 'modal') {
   *       // 모달이 열려있으면 모달 닫기
   *       closeModal();
   *     } else if (currentPage === 'home') {
   *       // 홈 화면에서는 앱 종료 확인
   *       if (confirm('앱을 종료하시겠습니까?')) {
   *         bizMOB.App.exit();
   *       }
   *     } else {
   *       // 일반 페이지에서는 이전 페이지로 이동
   *       history.back();
   *     }
   *   });
   * }
   *
   * @example
   * // 푸시 알림 수신 처리
   * bizMOB.Event.setEvent('push', function(pushData) {
   *   console.log('푸시 알림을 받았습니다:', pushData);
   *
   *   // 알림 데이터 파싱
   *   const { title, message, data } = pushData;
   *
   *   // 알림 표시
   *   showNotification(title, message);
   *
   *   // 특정 액션 수행
   *   if (data.type === 'message') {
   *     navigateToMessage(data.messageId);
   *   } else if (data.type === 'update') {
   *     checkForUpdates();
   *   }
   * });
   *
   * @example
   * // 네트워크 상태 변경 처리
   * bizMOB.Event.setEvent('networkstatechange', function(networkInfo) {
   *   console.log('네트워크 상태가 변경되었습니다:', networkInfo);
   *
   *   if (networkInfo.isOnline) {
   *     console.log('온라인 상태입니다.');
   *
   *     // 오프라인 중 저장된 데이터 동기화
   *     syncOfflineData();
   *
   *     // 온라인 전용 기능 활성화
   *     enableOnlineFeatures();
   *
   *     // UI 상태 업데이트
   *     hideOfflineIndicator();
   *   } else {
   *     console.log('오프라인 상태입니다.');
   *
   *     // 오프라인 모드 활성화
   *     enableOfflineMode();
   *
   *     // 사용자에게 알림
   *     showOfflineIndicator();
   *   }
   * });
   *
   * @example
   * // 전역 함수명으로 이벤트 등록
   * window.handleAppResume = function() {
   *   console.log('앱이 활성화되었습니다 (전역 함수)');
   * };
   *
   * bizMOB.Event.setEvent('resume', 'handleAppResume');
   *
   * @since bizMOB 4.0.0
   */
  static setEvent(sEvent: string, fCallback: any): void {
    return window.bizMOB.setEvent(sEvent, fCallback);
  }

  /**
   * 등록된 네이티브 이벤트 핸들러를 모두 제거합니다.
   *
   * 특정 이벤트에 등록된 모든 콜백 함수를 제거하는 API입니다.
   * 메모리 누수 방지와 이벤트 핸들러 정리를 위해 사용합니다.
   * 컴포넌트 언마운트나 페이지 전환 시 이벤트 정리 목적으로 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 이벤트 시스템에서 핸들러 제거
   * - 웹: 브라우저 이벤트 리스너 제거
   *
   * @purpose 메모리 관리, 이벤트 정리, 리소스 해제, 성능 최적화
   *
   * @param {string} sEvent - 제거할 네이티브 이벤트 명
   *   - `'resume'`: 앱 활성화 이벤트
   *   - `'backbutton'`: Android 뒤로가기 버튼 이벤트
   *   - `'push'`: 푸시 알림 수신 이벤트
   *   - `'networkstatechange'`: 네트워크 상태 변경 이벤트
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 해당 이벤트에 등록된 모든 핸들러가 제거됩니다
   * - 제거 후에는 해당 이벤트가 발생해도 콜백이 호출되지 않습니다
   * - 중요한 시스템 이벤트를 제거할 때는 신중해야 합니다
   *
   * @example
   * // 컴포넌트 정리 시 이벤트 제거
   * class MyComponent {
   *   mounted() {
   *     // 이벤트 등록
   *     bizMOB.Event.setEvent('resume', this.handleResume.bind(this));
   *     bizMOB.Event.setEvent('networkstatechange', this.handleNetworkChange.bind(this));
   *   }
   *
   *   unmounted() {
   *     // 메모리 누수 방지를 위한 이벤트 정리
   *     bizMOB.Event.clearEvent('resume');
   *     bizMOB.Event.clearEvent('networkstatechange');
   *     console.log('이벤트 핸들러가 정리되었습니다.');
   *   }
   *
   *   handleResume() {
   *     console.log('앱이 활성화되었습니다.');
   *   }
   *
   *   handleNetworkChange(networkInfo) {
   *     console.log('네트워크 상태 변경:', networkInfo);
   *   }
   * }
   *
   * @example
   * // 조건부 이벤트 해제
   * function setupEventHandlers() {
   *   // Android에서만 뒤로가기 버튼 이벤트 등록
   *   if (bizMOB.Device.isAndroid()) {
   *     bizMOB.Event.setEvent('backbutton', handleBackButton);
   *   }
   * }
   *
   * function cleanupEventHandlers() {
   *   // 등록된 이벤트 정리
   *   if (bizMOB.Device.isAndroid()) {
   *     bizMOB.Event.clearEvent('backbutton');
   *     console.log('Android 뒤로가기 이벤트가 제거되었습니다.');
   *   }
   * }
   *
   * @example
   * // 특정 상황에서 푸시 이벤트 임시 비활성화
   * function disablePushNotifications() {
   *   bizMOB.Event.clearEvent('push');
   *   console.log('푸시 알림 이벤트가 비활성화되었습니다.');
   *
   *   // 사용자에게 알림
   *   showToast('푸시 알림이 일시적으로 비활성화되었습니다.');
   * }
   *
   * function enablePushNotifications() {
   *   // 푸시 이벤트 재등록
   *   bizMOB.Event.setEvent('push', handlePushNotification);
   *   console.log('푸시 알림 이벤트가 활성화되었습니다.');
   * }
   *
   * @example
   * // 페이지 전환 시 이벤트 정리
   * function navigateToPage(newPage) {
   *   // 현재 페이지의 이벤트 정리
   *   const currentPageEvents = getCurrentPageEvents();
   *   currentPageEvents.forEach(eventName => {
   *     bizMOB.Event.clearEvent(eventName);
   *   });
   *
   *   // 새 페이지로 이동
   *   location.href = newPage;
   * }
   *
   * @example
   * // 앱 종료 전 모든 이벤트 정리
   * function cleanupBeforeExit() {
   *   const registeredEvents = ['resume', 'backbutton', 'push', 'networkstatechange'];
   *
   *   registeredEvents.forEach(eventName => {
   *     try {
   *       bizMOB.Event.clearEvent(eventName);
   *       console.log(`${eventName} 이벤트가 정리되었습니다.`);
   *     } catch (error) {
   *       console.warn(`${eventName} 이벤트 정리 중 오류:`, error);
   *     }
   *   });
   *
   *   console.log('모든 이벤트 정리가 완료되었습니다.');
   * }
   *
   * @since bizMOB 4.0.0
   */
  static clearEvent(sEvent: string): void {
    return window.bizMOB.clearEvent(sEvent);
  }
}
