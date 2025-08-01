export default class Event {
  /**
   * Native 이벤트 리스너를 등록하는 함수
   *
   * 앱/웹 환경에 따라 해당하는 EventManager를 통해 이벤트를 등록합니다.
   * - 앱 환경: bizMOBCore.EventManager.set 호출
   * - 웹 환경: bizMOBWebCore.EventManager.set 호출 (웹에서는 즉시 실행되는 이벤트도 존재)
   *
   * @param {String} sEvent Native 이벤트명
   *   - 'open': 페이지(웹뷰)를 열었을 때 발생하는 이벤트
   *   - 'close': 페이지(웹뷰)를 닫았을 때 발생하는 이벤트
   *   - 'beforeready': 페이지(웹뷰)가 로드되기 전에 발생하는 이벤트
   *   - 'ready': 페이지(웹뷰)가 로드되었을 때 발생하는 이벤트
   *   - 'backbutton': Back Button이 눌러졌을 때 발생하는 이벤트 (Android 전용)
   *   - 'resume': 페이지(웹뷰)가 활성화 되었을 때 발생하는 이벤트 (포커스, 화면 표시시)
   *   - 'push': Push 메세지를 수신하였을 때 발생하는 이벤트
   *   - 'networkstatechange': 네트워크 상태가 변경되었을 때 발생하는 이벤트
   *   - 'sessiontimeout': 세션 타임아웃이 발생했을 때의 이벤트
   * @param {Function} fCallback 이벤트 발생시 실행될 콜백 함수
   * @example
   * import { Event, Device } from '@bizMOB';
   * // Android 뒤로가기 버튼 처리
   * if (Device.isAndroid()) {
   *   Event.setEvent('backbutton', function() {
   *     console.log('뒤로가기 버튼이 눌렸습니다.');
   *   });
   * }
   */
  static setEvent(sEvent: string, fCallback: any): void {
    return window.bizMOB.setEvent(sEvent, fCallback);
  }

  /**
   * Native 이벤트 리스너를 제거하는 함수
   *
   * 등록된 Native 이벤트 리스너를 제거하여 더 이상 해당 이벤트가 발생해도 콜백이 실행되지 않습니다.
   * 앱/웹 환경에 따라 해당하는 EventManager.clear를 통해 이벤트를 제거합니다.
   *
   * @param {String} sEvent 제거할 Native 이벤트명
   *   - 'open': 페이지(웹뷰) 열림 이벤트
   *   - 'close': 페이지(웹뷰) 닫힘 이벤트
   *   - 'beforeready': 페이지(웹뷰) 로드 전 이벤트
   *   - 'ready': 페이지(웹뷰) 로드 완료 이벤트
   *   - 'backbutton': Back Button 이벤트 (Android 전용)
   *   - 'resume': 페이지(웹뷰) 활성화 이벤트
   *   - 'push': Push 메세지 수신 이벤트
   *   - 'networkstatechange': 네트워크 상태 변경 이벤트
   *   - 'sessiontimeout': 세션 타임아웃 이벤트
   * @example
   * import { Event } from '@bizMOB';
   * // 컴포넌트 정리 시 이벤트 제거
   * class MyComponent {
   *   unmounted() {
   *     // 메모리 누수 방지를 위한 이벤트 정리
   *     Event.clearEvent('resume');
   *     Event.clearEvent('networkstatechange');
   *     console.log('이벤트 핸들러가 정리되었습니다.');
   *   }
   * }
   */
  static clearEvent(sEvent: string): void {
    return window.bizMOB.clearEvent(sEvent);
  }
}
