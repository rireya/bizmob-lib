/**
 * bizMOB 통합 로깅 시스템 클래스
 *
 * 앱의 실행 상태, 오류, 디버그 정보 등을 체계적으로 기록하고 관리하는 클래스입니다.
 * 다양한 로그 레벨을 통해 중요도별 분류가 가능하며, 개발 및 운영 환경에서 문제 진단에 활용됩니다.
 *
 * @description 지원하는 로그 레벨:
 *
 * **로그 레벨 (중요도 순):**
 * - `error`: 오류 발생 시 기록 (최고 중요도)
 * - `warn`: 경고 상황 기록
 * - `info`: 일반 정보 기록
 * - `log`: 기본 로그 기록
 * - `debug`: 디버그 정보 기록 (최저 중요도, 개발용)
 *
 * **로그 출력 위치:**
 * - 앱: 네이티브 로그 시스템 (Android Logcat, iOS Console)
 * - 웹: 브라우저 개발자 도구 Console
 * - 파일: 로컬 저장소의 로그 파일 (설정에 따라)
 *
 * @purpose 디버깅, 오류 추적, 성능 모니터링, 사용자 행동 분석, 운영 지원
 *
 * @caution
 * - 프로덕션 환경에서는 민감한 정보(비밀번호, 토큰 등)를 로그에 기록하지 마세요
 * - 과도한 로그는 성능에 영향을 줄 수 있습니다
 * - 로그 파일 크기와 보관 정책을 고려해야 합니다
 *
 * @since bizMOB 4.0.0
 */
export default class Logger {
  /**
   * 일반적인 정보성 메시지를 기록합니다.
   *
   * 앱의 정상적인 동작 상태나 중요한 이벤트 발생을 기록하는 로그 레벨입니다.
   * 사용자 액션, 상태 변경, 중요한 프로세스 완료 등을 추적할 때 사용합니다.
   *
   * @description
   * - 앱: 시스템 로그에 INFO 레벨로 기록
   * - 웹: console.info()로 브라우저 콘솔에 출력
   *
   * @purpose 상태 추적, 이벤트 기록, 프로세스 모니터링, 사용자 행동 분석
   *
   * @param {string} _sMessage - 기록할 정보 메시지
   *
   * @returns {void} 반환값 없음
   *
   * @example
   * // 사용자 로그인 성공
   * bizMOB.Logger.info('사용자 로그인 성공: user@example.com');
   *
   * @example
   * // 앱 초기화 완료
   * bizMOB.Logger.info('앱 초기화 완료 - 버전: 2.1.0');
   *
   * @example
   * // 데이터 동기화 완료
   * bizMOB.Logger.info(`데이터 동기화 완료 - ${syncedCount}개 항목 처리`);
   *
   * @example
   * // API 호출 성공
   * bizMOB.Logger.info(`API 호출 성공: ${apiEndpoint} (응답시간: ${responseTime}ms)`);
   *
   * @since bizMOB 4.0.0
   */
  static info(_sMessage: string): void {
    window.bizMOB.Logger.info(_sMessage);
  }

  /**
   * 기본적인 로그 메시지를 기록합니다.
   *
   * 일반적인 앱 동작과 이벤트를 기록하는 기본 로그 레벨입니다.
   * 개발 및 운영 환경에서 앱의 전반적인 흐름을 파악할 때 사용합니다.
   *
   * @description
   * - 앱: 시스템 로그에 기본 레벨로 기록
   * - 웹: console.log()로 브라우저 콘솔에 출력
   *
   * @purpose 기본 추적, 앱 흐름 기록, 일반적인 이벤트 로깅
   *
   * @param {string} _sMessage - 기록할 로그 메시지
   *
   * @returns {void} 반환값 없음
   *
   * @example
   * // 기본 앱 시작 로그
   * bizMOB.Logger.log('앱이 시작되었습니다.');
   *
   * @example
   * // 페이지 이동 추적
   * bizMOB.Logger.log(`페이지 이동: ${fromPage} → ${toPage}`);
   *
   * @example
   * // 설정 변경 기록
   * bizMOB.Logger.log(`사용자 설정 변경: ${settingKey} = ${newValue}`);
   *
   * @example
   * // 기능 사용 추적
   * bizMOB.Logger.log(`기능 사용: ${featureName} (사용자: ${userId})`);
   *
   * @example
   * // 파일 처리 과정 기록
   * async function processFiles(fileList) {
   *   bizMOB.Logger.log(`파일 처리 시작: ${fileList.length}개 파일`);
   *
   *   for (let i = 0; i < fileList.length; i++) {
   *     const file = fileList[i];
   *     bizMOB.Logger.log(`파일 처리 중: ${file.name} (${i + 1}/${fileList.length})`);
   *
   *     try {
   *       await processFile(file);
   *       bizMOB.Logger.log(`파일 처리 완료: ${file.name}`);
   *     } catch (error) {
   *       bizMOB.Logger.error(`파일 처리 실패: ${file.name} - ${error.message}`);
   *     }
   *   }
   *
   *   bizMOB.Logger.log('모든 파일 처리 완료');
   * }
   *
   * @since bizMOB 4.0.0
   */
  static log(_sMessage: string): void {
    window.bizMOB.Logger.log(_sMessage);
  }

  /**
   * 경고성 메시지를 기록합니다.
   *
   * 오류는 아니지만 주의가 필요한 상황이나 잠재적 문제를 기록하는 로그 레벨입니다.
   * 성능 저하, 비권장 사용법, 복구 가능한 오류 등을 추적할 때 사용합니다.
   *
   * @description
   * - 앱: 시스템 로그에 WARNING 레벨로 기록
   * - 웹: console.warn()로 브라우저 콘솔에 노란색으로 출력
   *
   * @purpose 잠재적 문제 알림, 성능 경고, 비권장 사용법 추적, 복구 가능한 오류 기록
   *
   * @param {string} _sMessage - 기록할 경고 메시지
   *
   * @returns {void} 반환값 없음
   *
   * @example
   * // API 응답 지연 경고
   * bizMOB.Logger.warn(`API 응답 지연: ${responseTime}ms (임계값: 3000ms 초과)`);
   *
   * @example
   * // 저장 공간 부족 경고
   * bizMOB.Logger.warn(`저장 공간 부족: ${availableSpace}MB 남음 (권장: 100MB 이상)`);
   *
   * @example
   * // 비권장 API 사용 경고
   * bizMOB.Logger.warn('비권장 API 사용: oldFunction()은 deprecated됩니다. newFunction()을 사용하세요.');
   *
   * @example
   * // 네트워크 연결 불안정 경고
   * bizMOB.Logger.warn(`네트워크 연결 불안정: 재시도 ${retryCount}회 (최대: ${maxRetries}회)`);
   *
   * @example
   * // 설정값 검증 경고
   * function validateConfiguration(config) {
   *   if (config.timeout < 1000) {
   *     bizMOB.Logger.warn(`타임아웃 설정이 너무 낮습니다: ${config.timeout}ms (권장: 1000ms 이상)`);
   *   }
   *
   *   if (config.maxRetries > 10) {
   *     bizMOB.Logger.warn(`재시도 횟수가 너무 높습니다: ${config.maxRetries} (권장: 10 이하)`);
   *   }
   *
   *   if (!config.apiKey) {
   *     bizMOB.Logger.warn('API 키가 설정되지 않았습니다. 일부 기능이 제한될 수 있습니다.');
   *   }
   * }
   *
   * @example
   * // 자동 복구 상황 기록
   * async function handleNetworkError(error) {
   *   bizMOB.Logger.warn(`네트워크 오류 발생, 자동 복구 시도: ${error.message}`);
   *
   *   try {
   *     await reconnectNetwork();
   *     bizMOB.Logger.info('네트워크 연결이 복구되었습니다.');
   *   } catch (recoveryError) {
   *     bizMOB.Logger.error(`네트워크 복구 실패: ${recoveryError.message}`);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static warn(_sMessage: string): void {
    window.bizMOB.Logger.warn(_sMessage);
  }

  /**
   * 디버그용 상세 메시지를 기록합니다.
   *
   * 개발 및 디버깅 과정에서 상세한 실행 흐름과 변수 상태를 추적하는 가장 상세한 로그 레벨입니다.
   * 프로덕션 환경에서는 일반적으로 비활성화되며, 개발 환경에서만 활용됩니다.
   *
   * @description
   * - 앱: 시스템 로그에 DEBUG 레벨로 기록 (개발 빌드에서만)
   * - 웹: console.debug()로 브라우저 콘솔에 회색으로 출력
   *
   * @purpose 상세 실행 흐름 추적, 변수 상태 확인, 성능 분석, 로직 검증
   *
   * @param {string} _sMessage - 기록할 디버그 메시지
   *
   * @returns {void} 반환값 없음
   *
   * @example
   * // 함수 진입/종료 추적
   * function processUserData(userData) {
   *   bizMOB.Logger.debug(`processUserData 시작: userId=${userData.id}`);
   *
   *   const result = transformData(userData);
   *   bizMOB.Logger.debug(`데이터 변환 완료: ${JSON.stringify(result)}`);
   *
   *   bizMOB.Logger.debug(`processUserData 종료: 처리 시간 ${Date.now() - startTime}ms`);
   *   return result;
   * }
   *
   * @example
   * // 변수 상태 추적
   * bizMOB.Logger.debug(`현재 상태: isLoading=${isLoading}, hasData=${!!data}, errorCount=${errorCount}`);
   *
   * @example
   * // API 요청/응답 상세 로깅
   * async function apiRequest(endpoint, params) {
   *   bizMOB.Logger.debug(`API 요청: ${endpoint}, 파라미터: ${JSON.stringify(params)}`);
   *
   *   const response = await fetch(endpoint, params);
   *   bizMOB.Logger.debug(`API 응답: 상태=${response.status}, 헤더=${JSON.stringify(response.headers)}`);
   *
   *   return response;
   * }
   *
   * @example
   * // 조건문 분기 추적
   * function calculateDiscount(user, product) {
   *   bizMOB.Logger.debug(`할인 계산 시작: 사용자타입=${user.type}, 상품가격=${product.price}`);
   *
   *   if (user.isPremium) {
   *     bizMOB.Logger.debug('프리미엄 사용자 할인 적용');
   *     return product.price * 0.2;
   *   } else if (product.price > 100000) {
   *     bizMOB.Logger.debug('고가 상품 할인 적용');
   *     return product.price * 0.1;
   *   } else {
   *     bizMOB.Logger.debug('기본 할인 적용');
   *     return product.price * 0.05;
   *   }
   * }
   *
   * @example
   * // 성능 측정 및 메모리 사용량 추적
   * function performanceDebug() {
   *   const startTime = performance.now();
   *   const startMemory = performance.memory?.usedJSHeapSize || 0;
   *
   *   bizMOB.Logger.debug(`성능 측정 시작: 시간=${startTime}, 메모리=${startMemory}bytes`);
   *
   *   // 복잡한 작업 수행
   *   heavyOperation();
   *
   *   const endTime = performance.now();
   *   const endMemory = performance.memory?.usedJSHeapSize || 0;
   *
   *   bizMOB.Logger.debug(`성능 측정 완료: 소요시간=${endTime - startTime}ms, 메모리증가=${endMemory - startMemory}bytes`);
   * }
   *
   * @note 디버그 로그는 개발 환경에서만 활성화하고, 프로덕션에서는 비활성화하여 성능에 영향을 주지 않도록 주의
   *
   * @since bizMOB 4.0.0
   */
  static debug(_sMessage: string): void {
    window.bizMOB.Logger.debug(_sMessage);
  }

  /**
   * 오류 메시지를 기록합니다.
   *
   * 애플리케이션 실행을 방해하는 심각한 오류나 예외 상황을 기록하는 최고 우선순위 로그 레벨입니다.
   * 즉시 조치가 필요한 문제들을 추적하며, 운영팀이나 개발팀의 긴급 대응을 요구하는 상황에 사용됩니다.
   *
   * @description
   * - 앱: 시스템 로그에 ERROR 레벨로 기록 (크래시 리포트 포함)
   * - 웹: console.error()로 브라우저 콘솔에 빨간색으로 출력
   *
   * @purpose 심각한 오류 추적, 예외 상황 기록, 시스템 장애 모니터링, 크래시 분석
   *
   * @param {string} _sMessage - 기록할 오류 메시지
   *
   * @returns {void} 반환값 없음
   *
   * @example
   * // 예외 처리와 함께 오류 기록
   * try {
   *   const result = await criticalOperation();
   * } catch (error) {
   *   bizMOB.Logger.error(`중요 작업 실패: ${error.message}, 스택: ${error.stack}`);
   *   throw error; // 상위로 전파
   * }
   *
   * @example
   * // 네트워크 오류 기록
   * bizMOB.Logger.error(`API 호출 실패: ${endpoint}, 상태코드: ${response.status}, 응답: ${responseText}`);
   *
   * @example
   * // 데이터베이스 오류 기록
   * async function saveUserData(userData) {
   *   try {
   *     await database.save(userData);
   *   } catch (dbError) {
   *     bizMOB.Logger.error(`사용자 데이터 저장 실패: ID=${userData.id}, 오류=${dbError.message}`);
   *
   *     // 백업 저장소 시도
   *     try {
   *       await backupStorage.save(userData);
   *       bizMOB.Logger.warn('백업 저장소에 데이터를 저장했습니다.');
   *     } catch (backupError) {
   *       bizMOB.Logger.error(`백업 저장소 저장도 실패: ${backupError.message}`);
   *       throw new Error('모든 저장 방법이 실패했습니다.');
   *     }
   *   }
   * }
   *
   * @example
   * // 파일 처리 오류 기록
   * function processFileUpload(file) {
   *   if (!file) {
   *     bizMOB.Logger.error('파일 업로드 실패: 파일이 선택되지 않았습니다.');
   *     return;
   *   }
   *
   *   if (file.size > MAX_FILE_SIZE) {
   *     bizMOB.Logger.error(`파일 크기 초과: ${file.size}bytes > ${MAX_FILE_SIZE}bytes`);
   *     return;
   *   }
   *
   *   try {
   *     uploadFile(file);
   *   } catch (uploadError) {
   *     bizMOB.Logger.error(`파일 업로드 처리 실패: ${file.name}, 오류: ${uploadError.message}`);
   *   }
   * }
   *
   * @example
   * // 시스템 리소스 부족 오류
   * function checkSystemResources() {
   *   const freeMemory = getFreeMemory();
   *   const freeDisk = getFreeDiskSpace();
   *
   *   if (freeMemory < MINIMUM_MEMORY) {
   *     bizMOB.Logger.error(`메모리 부족: 사용가능=${freeMemory}MB, 최소요구=${MINIMUM_MEMORY}MB`);
   *   }
   *
   *   if (freeDisk < MINIMUM_DISK) {
   *     bizMOB.Logger.error(`디스크 용량 부족: 사용가능=${freeDisk}GB, 최소요구=${MINIMUM_DISK}GB`);
   *   }
   * }
   *
   * @example
   * // 인증 및 보안 오류
   * async function authenticateUser(credentials) {
   *   try {
   *     const user = await authService.login(credentials);
   *     return user;
   *   } catch (authError) {
   *     if (authError.code === 'INVALID_CREDENTIALS') {
   *       bizMOB.Logger.error(`로그인 실패: 잘못된 인증정보, 사용자=${credentials.username}`);
   *     } else if (authError.code === 'ACCOUNT_LOCKED') {
   *       bizMOB.Logger.error(`계정 잠금: 사용자=${credentials.username}, 사유=${authError.reason}`);
   *     } else {
   *       bizMOB.Logger.error(`인증 시스템 오류: ${authError.message}`);
   *     }
   *     throw authError;
   *   }
   * }
   *
   * @warning 오류 로그는 민감한 정보(비밀번호, 토큰 등)를 포함하지 않도록 주의하세요
   * @caution 프로덕션 환경에서는 오류 로그가 자동으로 모니터링 시스템으로 전송될 수 있습니다
   *
   * @since bizMOB 4.0.0
   */
  static error(_sMessage: string): void {
    window.bizMOB.Logger.error(_sMessage);
  }
}
