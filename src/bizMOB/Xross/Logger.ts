export default class Logger {
  /**
   * 정보성 로그 메시지 기록
   *
   * @description 일반적인 정보나 애플리케이션의 정상적인 동작을 기록할 때 사용합니다.
   * 사용자 액션, 시스템 상태 변경 등의 중요한 정보를 기록하는데 적합합니다.
   *
   * @param {string} _sMessage - 기록할 정보 메시지
   * @example
   * import { Logger } from '@bizMOB';
   * // 사용자 로그인 성공
   * Logger.info('사용자 로그인 성공: user@example.com');
   *
   */
  static info(_sMessage: string): void {
    window.bizMOB.Logger.info(_sMessage);
  }

  /**
   * 일반 로그 메시지 기록
   *
   * @description 개발 과정에서 추적이 필요한 일반적인 동작이나 상태를 기록할 때 사용합니다.
   * 디버깅보다는 가벼운 수준의 정보를 기록하는데 적합합니다.
   *
   * @param {string} _sMessage - 기록할 로그 메시지
   * @example
   * import { Logger } from '@bizMOB';
   * // 기본 앱 시작 로그
   * Logger.log('앱이 시작되었습니다.');
   */
  static log(_sMessage: string): void {
    window.bizMOB.Logger.log(_sMessage);
  }

  /**
   * 경고 로그 메시지 기록
   *
   * @description 애플리케이션이 정상 동작하지만 주의가 필요한 상황을 기록할 때 사용합니다.
   * 잠재적인 문제나 예상치 못한 상황, 성능 이슈 등을 알릴 때 적합합니다.
   *
   * @param {string} _sMessage - 기록할 경고 메시지
   * @example
   * import { Logger } from '@bizMOB';
   * // API 응답 지연 경고
   * Logger.warn(`API 응답 지연: ${responseTime}ms (임계값: 3000ms 초과)`);
   *
   */
  static warn(_sMessage: string): void {
    window.bizMOB.Logger.warn(_sMessage);
  }

  /**
   * 디버그 로그 메시지 기록
   *
   * @description 개발 및 디버깅 과정에서 상세한 정보를 추적할 때 사용합니다.
   * 변수값, 함수 호출 순서, 상태 변화 등 개발자가 문제를 진단하는데 필요한 정보를 기록합니다.
   * 일반적으로 개발 환경에서만 활성화되며, 운영 환경에서는 비활성화됩니다.
   *
   * @param {string} _sMessage - 기록할 디버그 메시지
   * @example
   * import { Logger } from '@bizMOB';
   * // 함수 진입/종료 추적
   * function processUserData(userData) {
   *   Logger.debug(`processUserData 시작: userId=${userData.id}`);
   *
   *   const result = transformData(userData);
   *   Logger.debug(`데이터 변환 완료: ${JSON.stringify(result)}`);
   *
   *   Logger.debug(`processUserData 종료: 처리 시간 ${Date.now() - startTime}ms`);
   *   return result;
   * }
   *
   */
  static debug(_sMessage: string): void {
    window.bizMOB.Logger.debug(_sMessage);
  }

  /**
   * 오류 로그 메시지 기록
   *
   * @description 애플리케이션에서 발생한 오류나 예외 상황을 기록할 때 사용합니다.
   * 시스템 에러, API 호출 실패, 예외 처리, 치명적인 문제 등을 기록하여
   * 문제 해결과 시스템 안정성 향상에 활용합니다.
   *
   * @param {string} _sMessage - 기록할 오류 메시지
   * @example
   * import { Logger } from '@bizMOB';
   * // 네트워크 오류 기록
   * Logger.error(`API 호출 실패: ${endpoint}, 상태코드: ${response.status}, 응답: ${responseText}`);
   *
   */
  static error(_sMessage: string): void {
    window.bizMOB.Logger.error(_sMessage);
  }
}
