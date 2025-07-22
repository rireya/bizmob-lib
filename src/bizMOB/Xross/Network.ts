export default class Network {
  /**
   * 네트워크 통신의 로케일 설정을 변경합니다.
   *
   * 서버 통신 시 사용할 언어 및 지역 설정을 변경하는 API입니다.
   * API 응답 메시지, 오류 메시지, 날짜/시간 형식 등이 설정된 로케일에 맞게 반환됩니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트의 로케일 헤더 설정
   * - 웹: XMLHttpRequest/Fetch API의 Accept-Language 헤더 설정
   *
   * @purpose 다국어 서버 응답, 지역화 API 통신, 언어별 콘텐츠 요청
   *
   * @param {Object} arg - 네트워크 로케일 설정 객체
   * @param {string} arg._sLocaleCd - 설정할 언어 코드
   *   - `'ko'`: 한국어
   *   - `'en'`: 영어
   *   - `'ja'`: 일본어
   *   - `'zh'`: 중국어
   *   - `'es'`: 스페인어
   *   - `'fr'`: 프랑스어
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 네트워크 로케일 설정 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 설정 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1001': 설정 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 로케일 설정 결과 정보
   * @returns {string} return._oData.currentLocale - 현재 설정된 로케일 코드
   * @returns {string} return._oData.previousLocale - 이전 로케일 코드
   * @returns {string} return._oData.serverLocale - 서버에서 지원하는 로케일 목록
   * @returns {Object} return._oData.localeInfo - 로케일 상세 정보
   * @returns {string} return._oData.localeInfo.language - 언어명
   * @returns {string} return._oData.localeInfo.country - 국가명
   * @returns {string} return._oData.localeInfo.displayName - 표시명
   * @returns {string} return._oData.localeInfo.direction - 텍스트 방향 (ltr, rtl)
   *
   * @caution
   * - 잘못된 로케일 코드 입력 시 기본값(ko)으로 설정됩니다
   * - 로케일 변경 후 기존 캐시된 데이터는 새로운 언어로 다시 요청해야 합니다
   * - 서버에서 해당 언어를 지원하지 않을 경우 영어로 대체됩니다
   *
   * @example
   * // 기본 로케일 변경
   * const localeResult = await bizMOB.Network.changeLocale({
   *   _sLocaleCd: 'en'
   * });
   *
   * if (localeResult._bResult) {
   *   console.log('로케일 변경 성공:', localeResult._oData.currentLocale);
   *
   *   // 기존 데이터 새로고침
   *   await refreshAppData();
   * } else {
   *   console.error('로케일 변경 실패:', localeResult._sResultMessage);
   * }
   *
   * @example
   * // 다국어 지원 앱에서 언어 변경
   * async function changeAppLanguage(selectedLanguage) {
   *   const supportedLocales = ['ko', 'en', 'ja', 'zh'];
   *
   *   if (!supportedLocales.includes(selectedLanguage)) {
   *     throw new Error('지원하지 않는 언어입니다.');
   *   }
   *
   *   try {
   *     // 네트워크 로케일 변경
   *     const networkResult = await bizMOB.Network.changeLocale({
   *       _sLocaleCd: selectedLanguage
   *     });
   *
   *     if (networkResult._bResult) {
   *       // 로컬 스토리지에 언어 설정 저장
   *       await bizMOB.Storage.setItem('app_locale', selectedLanguage);
   *
   *       // 앱 내 다국어 설정 변경
   *       await bizMOB.Localization.setLocale({
   *         _sLocaleCd: selectedLanguage
   *       });
   *
   *       // 서버에서 새로운 언어로 메시지 가져오기
   *       await loadLocalizedMessages(selectedLanguage);
   *
   *       // UI 새로고침
   *       await refreshUI();
   *
   *       console.log('언어 변경 완료:', networkResult._oData.localeInfo.displayName);
   *
   *       return true;
   *     } else {
   *       console.error('네트워크 로케일 변경 실패');
   *       return false;
   *     }
   *   } catch (error) {
   *     console.error('언어 변경 중 오류:', error);
   *     return false;
   *   }
   * }
   *
   * @example
   * // 서버 응답의 다국어 처리
   * async function getLocalizedData(apiPath) {
   *   // 현재 설정된 로케일 확인
   *   const currentLocale = await bizMOB.Storage.getItem('app_locale') || 'ko';
   *
   *   // 네트워크 로케일 설정
   *   await bizMOB.Network.changeLocale({
   *     _sLocaleCd: currentLocale
   *   });
   *
   *   // API 요청 시 자동으로 로케일 헤더가 포함됨
   *   const apiResult = await bizMOB.Network.requestApi({
   *     _sUrl: apiPath,
   *     _sMethod: 'GET'
   *   });
   *
   *   if (apiResult._bResult) {
   *     // 응답 데이터가 설정된 언어로 반환됨
   *     return {
   *       data: apiResult._oData,
   *       messages: apiResult._oData.messages, // 다국어 메시지
   *       locale: apiResult._oData.responseLocale
   *     };
   *   } else {
   *     // 오류 메시지도 설정된 언어로 반환됨
   *     throw new Error(apiResult._sResultMessage);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static changeLocale(arg: {
    _sLocaleCd: string, // 언어코드
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return window.bizMOB.Network.changeLocale(arg);
  }

  /**
   * bizMOB 서버에 로그인 인증을 요청합니다.
   *
   * 사용자 인증 정보를 bizMOB 서버로 전송하여 로그인 처리를 수행하는 API입니다.
   * 인증 성공 시 세션 토큰을 획득하고, 이후 모든 API 요청에 인증 정보가 자동으로 포함됩니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트를 통한 보안 인증 통신
   * - 웹: HTTPS를 통한 암호화된 로그인 요청
   *
   * @purpose 사용자 인증, 세션 관리, 보안 토큰 획득, 권한 확인
   *
   * @param {Object} arg - 로그인 요청 설정 객체
   * @param {string} arg._sUserId - 인증 받을 사용자 아이디
   * @param {string} arg._sPassword - 인증 받을 사용자 패스워드 (암호화 권장)
   * @param {string} arg._sTrcode - 로그인 전문 코드 (예: 'LOGIN', 'AUTH_USER')
   * @param {Object} [arg._oHeader] - 추가 전문 헤더 객체
   * @param {Object} [arg._oBody] - 추가 전문 바디 객체 (추가 인증 정보)
   * @param {Object} [arg._oHttpHeader] - 사용자 정의 HTTP 헤더
   * @param {string} [arg._sQuery] - 쿼리 스트링 (웹 전용)
   * @param {boolean} [arg._bProgressEnable=true] - 로그인 중 진행률 표시 여부
   * @param {number} [arg._nTimeout=30] - 타임아웃 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 로그인 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 로그인 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1001': 인증 실패, '1002': 계정 잠김)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 로그인 결과 데이터
   * @returns {string} return._oData.sessionToken - 세션 토큰 (인증 성공 시)
   * @returns {string} return._oData.refreshToken - 리프레시 토큰
   * @returns {Object} return._oData.userInfo - 사용자 기본 정보
   * @returns {string} return._oData.userInfo.userId - 사용자 ID
   * @returns {string} return._oData.userInfo.userName - 사용자 이름
   * @returns {string} return._oData.userInfo.email - 이메일 주소
   * @returns {Array<string>} return._oData.userInfo.roles - 사용자 권한 목록
   * @returns {string} return._oData.loginTime - 로그인 시간
   * @returns {number} return._oData.sessionExpiry - 세션 만료 시간 (타임스탬프)
   * @returns {Object} return._oData.serverInfo - 서버 정보
   * @returns {string} return._oData.serverInfo.version - 서버 버전
   * @returns {string} return._oData.serverInfo.environment - 서버 환경 (dev, prod)
   *
   * @caution
   * - 패스워드는 반드시 암호화하여 전송해야 합니다
   * - 로그인 실패 시 계정 잠김 정책을 확인하세요
   * - 세션 토큰은 안전하게 저장하고 관리해야 합니다
   * - 네트워크 오류 시 재시도 로직을 구현하세요
   *
   * @example
   * // 기본 로그인
   * const loginResult = await bizMOB.Network.requestLogin({
   *   _sUserId: 'user123',
   *   _sPassword: encryptPassword('mypassword123'),
   *   _sTrcode: 'LOGIN'
   * });
   *
   * if (loginResult._bResult) {
   *   console.log('로그인 성공:', loginResult._oData.userInfo.userName);
   *
   *   // 세션 토큰 저장
   *   await bizMOB.Storage.setItem('session_token', loginResult._oData.sessionToken);
   *   await bizMOB.Storage.setItem('user_info', JSON.stringify(loginResult._oData.userInfo));
   *
   *   // 메인 화면으로 이동
   *   navigateToMainPage();
   * } else {
   *   console.error('로그인 실패:', loginResult._sResultMessage);
   *   showLoginError(loginResult._sResultMessage);
   * }
   *
   * @example
   * // 추가 인증 정보가 있는 로그인
   * async function loginWithDeviceInfo(userId, password) {
   *   const deviceInfo = await bizMOB.Device.getInfo();
   *
   *   const loginResult = await bizMOB.Network.requestLogin({
   *     _sUserId: userId,
   *     _sPassword: encryptPassword(password),
   *     _sTrcode: 'LOGIN_WITH_DEVICE',
   *     _oHeader: {
   *       clientVersion: await getAppVersion(),
   *       timestamp: Date.now()
   *     },
   *     _oBody: {
   *       deviceId: deviceInfo.deviceId,
   *       deviceModel: deviceInfo.model,
   *       osVersion: deviceInfo.version,
   *       pushToken: await getPushToken()
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 30
   *   });
   *
   *   if (loginResult._bResult) {
   *     // 디바이스 등록 성공
   *     await registerDevice(loginResult._oData.deviceToken);
   *
   *     // 사용자 설정 동기화
   *     await syncUserSettings(loginResult._oData.userInfo);
   *
   *     return loginResult._oData;
   *   } else {
   *     throw new Error('로그인 실패: ' + loginResult._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 자동 로그인 (저장된 토큰 사용)
   * async function tryAutoLogin() {
   *   const savedToken = await bizMOB.Storage.getItem('refresh_token');
   *
   *   if (savedToken) {
   *     try {
   *       const autoLoginResult = await bizMOB.Network.requestLogin({
   *         _sUserId: '',
   *         _sPassword: '',
   *         _sTrcode: 'AUTO_LOGIN',
   *         _oHeader: {
   *           refreshToken: savedToken
   *         },
   *         _bProgressEnable: false,
   *         _nTimeout: 10
   *       });
   *
   *       if (autoLoginResult._bResult) {
   *         console.log('자동 로그인 성공');
   *
   *         // 새로운 토큰 저장
   *         await bizMOB.Storage.setItem('session_token', autoLoginResult._oData.sessionToken);
   *
   *         return true;
   *       } else {
   *         // 자동 로그인 실패 - 수동 로그인 필요
   *         await bizMOB.Storage.removeItem('refresh_token');
   *         return false;
   *       }
   *     } catch (error) {
   *       console.error('자동 로그인 중 오류:', error);
   *       return false;
   *     }
   *   } else {
   *     return false;
   *   }
   * }
   *
   * @example
   * // 로그인 오류 처리
   * async function handleLogin(userId, password) {
   *   try {
   *     const result = await bizMOB.Network.requestLogin({
   *       _sUserId: userId,
   *       _sPassword: encryptPassword(password),
   *       _sTrcode: 'LOGIN',
   *       _nTimeout: 30
   *     });
   *
   *     switch (result._sResultCode) {
   *       case '0000':
   *         console.log('로그인 성공');
   *         await saveLoginInfo(result._oData);
   *         break;
   *
   *       case '1001':
   *         showError('아이디 또는 비밀번호가 잘못되었습니다.');
   *         break;
   *
   *       case '1002':
   *         showError('계정이 잠겨있습니다. 관리자에게 문의하세요.');
   *         break;
   *
   *       case '1003':
   *         showError('비밀번호를 변경해야 합니다.');
   *         navigateToPasswordChange();
   *         break;
   *
   *       default:
   *         showError('로그인 중 오류가 발생했습니다: ' + result._sResultMessage);
   *         break;
   *     }
   *   } catch (error) {
   *     console.error('로그인 요청 실패:', error);
   *     showError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static requestLogin(arg: {
    _sUserId: string, // 인증 받을 사용자 아이디
    _sPassword: string, // 인증 받을 사용자 패스워드
    _sTrcode: string, // 전문코드
    _oHeader?: Record<string, any>, // 전문 Header 객체
    _oBody?: Record<string, any>, // 전문 Body 객체
    _oHttpHeader?: Record<string, any>, // HTTP Header 객체
    _sQuery?: string, // Query String (web 전용)
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return window.bizMOB.Network.requestLogin(arg);
  }

  /**
   * bizMOB 서버로 TR 전문 통신을 요청합니다.
   *
   * 업무 로직에 필요한 데이터를 서버와 주고받기 위한 TR(Transaction) 통신 API입니다.
   * 표준 전문 형식을 사용하여 서버와 안전하고 일관된 데이터 교환을 수행합니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트를 통한 TR 전문 통신
   * - 웹: XMLHttpRequest/Fetch API를 이용한 AJAX 통신
   *
   * @purpose 업무 데이터 조회, 데이터 등록/수정/삭제, 파일 업로드/다운로드, 배치 처리
   *
   * @param {Object} arg - TR 요청 설정 객체
   * @param {string} arg._sTrcode - TR 전문 코드 (예: 'BZ001', 'USER_LIST', 'ORDER_SAVE')
   * @param {Object} [arg._oHeader] - 전문 헤더 객체 (업무별 추가 정보)
   * @param {Object} [arg._oBody] - 전문 바디 객체 (전송할 업무 데이터)
   * @param {Object} [arg._oHttpHeader] - 사용자 정의 HTTP 헤더
   * @param {string} [arg._sQuery] - 쿼리 스트링 (GET 방식 파라미터)
   * @param {boolean} [arg._bProgressEnable=true] - 통신 중 진행률 표시 여부
   * @param {number} [arg._nTimeout=30] - 타임아웃 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} TR 통신 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 처리 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '9999': 시스템 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 응답 데이터 (TR별로 구조가 다름)
   * @returns {Object} return._oHeader - 응답 헤더 (서버에서 전달하는 추가 정보)
   * @returns {string} return._sResponseTime - 응답 시간 (ISO 8601 형식)
   * @returns {number} return._nProcessTime - 처리 시간 (밀리초)
   *
   * @caution
   * - TR 코드는 서버와 사전에 정의된 것만 사용해야 합니다
   * - 대용량 데이터 전송 시 타임아웃 시간을 충분히 설정하세요
   * - 파일 업로드 시에는 적절한 Content-Type을 설정하세요
   * - 보안이 중요한 데이터는 암호화하여 전송하세요
   *
   * @example
   * // 기본 데이터 조회 TR
   * const userListResult = await bizMOB.Network.requestTr({
   *   _sTrcode: 'USER_LIST',
   *   _oBody: {
   *     pageNo: 1,
   *     pageSize: 20,
   *     searchType: 'name',
   *     searchValue: '김'
   *   }
   * });
   *
   * if (userListResult._bResult) {
   *   console.log('조회 성공, 총 건수:', userListResult._oData.totalCount);
   *
   *   userListResult._oData.userList.forEach(user => {
   *     console.log('사용자:', user.name, user.email);
   *   });
   * } else {
   *   console.error('조회 실패:', userListResult._sResultMessage);
   * }
   *
   * @example
   * // 데이터 저장 TR
   * async function saveUserInfo(userInfo) {
   *   const saveResult = await bizMOB.Network.requestTr({
   *     _sTrcode: 'USER_SAVE',
   *     _oHeader: {
   *       userId: await getCurrentUserId(),
   *       timestamp: Date.now()
   *     },
   *     _oBody: {
   *       user: {
   *         name: userInfo.name,
   *         email: userInfo.email,
   *         phone: userInfo.phone,
   *         department: userInfo.department
   *       },
   *       saveType: userInfo.id ? 'UPDATE' : 'INSERT'
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 15
   *   });
   *
   *   if (saveResult._bResult) {
   *     console.log('저장 성공, 사용자 ID:', saveResult._oData.userId);
   *
   *     // 성공 메시지 표시
   *     showSuccessMessage('사용자 정보가 저장되었습니다.');
   *
   *     // 목록 새로고침
   *     await refreshUserList();
   *
   *     return saveResult._oData.userId;
   *   } else {
   *     throw new Error('저장 실패: ' + saveResult._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 파일 업로드 TR
   * async function uploadDocument(file, documentInfo) {
   *   // Base64로 파일 인코딩
   *   const base64Data = await convertFileToBase64(file);
   *
   *   const uploadResult = await bizMOB.Network.requestTr({
   *     _sTrcode: 'DOCUMENT_UPLOAD',
   *     _oHeader: {
   *       contentType: file.type,
   *       contentLength: file.size,
   *       fileName: file.name
   *     },
   *     _oBody: {
   *       document: {
   *         title: documentInfo.title,
   *         category: documentInfo.category,
   *         description: documentInfo.description,
   *         tags: documentInfo.tags
   *       },
   *       fileData: base64Data
   *     },
   *     _oHttpHeader: {
   *       'Content-Type': 'multipart/form-data'
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 120 // 대용량 파일용 긴 타임아웃
   *   });
   *
   *   if (uploadResult._bResult) {
   *     console.log('업로드 성공:', uploadResult._oData.documentId);
   *
   *     return {
   *       documentId: uploadResult._oData.documentId,
   *       downloadUrl: uploadResult._oData.downloadUrl,
   *       thumbnailUrl: uploadResult._oData.thumbnailUrl
   *     };
   *   } else {
   *     throw new Error('업로드 실패: ' + uploadResult._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 배치 처리 TR (여러 데이터 일괄 처리)
   * async function bulkUpdateStatus(userIds, newStatus) {
   *   const bulkResult = await bizMOB.Network.requestTr({
   *     _sTrcode: 'USER_BULK_UPDATE',
   *     _oBody: {
   *       updateType: 'STATUS',
   *       targetUsers: userIds,
   *       updateData: {
   *         status: newStatus,
   *         updateTime: new Date().toISOString(),
   *         updatedBy: await getCurrentUserId()
   *       }
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 60 // 배치 처리용 긴 타임아웃
   *   });
   *
   *   if (bulkResult._bResult) {
   *     console.log('배치 업데이트 성공:');
   *     console.log('- 성공 건수:', bulkResult._oData.successCount);
   *     console.log('- 실패 건수:', bulkResult._oData.failCount);
   *
   *     if (bulkResult._oData.failCount > 0) {
   *       console.log('실패 목록:', bulkResult._oData.failList);
   *       showWarningMessage(`${bulkResult._oData.failCount}건의 업데이트가 실패했습니다.`);
   *     }
   *
   *     return bulkResult._oData;
   *   } else {
   *     throw new Error('배치 업데이트 실패: ' + bulkResult._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 오류 처리가 포함된 TR 호출
   * async function safeRequestTr(trcode, data) {
   *   try {
   *     const result = await bizMOB.Network.requestTr({
   *       _sTrcode: trcode,
   *       _oBody: data,
   *       _nTimeout: 30
   *     });
   *
   *     switch (result._sResultCode) {
   *       case '0000':
   *         console.log('TR 처리 성공');
   *         return result._oData;
   *
   *       case '1000':
   *         console.warn('비즈니스 로직 오류:', result._sResultMessage);
   *         showBusinessError(result._sResultMessage);
   *         return null;
   *
   *       case '9000':
   *         console.error('인증 오류 - 재로그인 필요');
   *         await handleReLogin();
   *         return null;
   *
   *       case '9999':
   *         console.error('시스템 오류:', result._sResultMessage);
   *         showSystemError();
   *         return null;
   *
   *       default:
   *         console.error('알 수 없는 오류:', result._sResultCode, result._sResultMessage);
   *         return null;
   *     }
   *   } catch (error) {
   *     console.error('TR 요청 실패:', error);
   *
   *     if (error.name === 'TimeoutError') {
   *       showError('서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.');
   *     } else if (error.name === 'NetworkError') {
   *       showError('네트워크 연결을 확인해주세요.');
   *     } else {
   *       showError('시스템 오류가 발생했습니다.');
   *     }
   *
   *     return null;
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static requestTr(arg: {
    _sTrcode: string, // 전문코드
    _oHeader?: Record<string, any>, // 전문 Header 객체
    _oBody?: Record<string, any>, // 전문 Body 객체
    _oHttpHeader?: Record<string, any>, // HTTP Header 객체
    _sQuery?: string, // Query String (web 전용)
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return window.bizMOB.Network.requestTr(arg);
  }

  /**
   * 표준 HTTP 통신을 요청합니다.
   *
   * RESTful API나 일반적인 웹 서비스와의 HTTP 통신을 수행하는 API입니다.
   * GET, POST, PUT, DELETE 등의 HTTP 메서드를 사용하여 다양한 서버와 통신할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트를 통한 표준 HTTP 통신
   * - 웹: XMLHttpRequest/Fetch API를 이용한 HTTP 요청
   *
   * @purpose 외부 API 연동, RESTful 서비스 호출, 파일 다운로드, 웹 서비스 통신
   *
   * @param {Object} arg - HTTP 요청 설정 객체
   * @param {string} arg._sUrl - 요청할 URL (완전한 URL 경로)
   * @param {string} arg._sMethod - HTTP 메서드
   *   - `'GET'`: 데이터 조회
   *   - `'POST'`: 데이터 생성/전송
   *   - `'PUT'`: 데이터 수정/업데이트
   *   - `'DELETE'`: 데이터 삭제
   *   - `'PATCH'`: 부분 데이터 수정
   *   - `'HEAD'`: 헤더 정보만 조회
   *   - `'OPTIONS'`: 지원 메서드 조회
   * @param {Object} [arg._oHeader] - HTTP 헤더 객체 (Content-Type, Authorization 등)
   * @param {Object} [arg._oBody] - HTTP 바디 객체 (POST, PUT 등에서 사용)
   * @param {string} [arg._sQuery] - 쿼리 스트링 (URL 파라미터)
   * @param {boolean} [arg._bProgressEnable=true] - 통신 중 진행률 표시 여부
   * @param {number} [arg._nTimeout=30] - 타임아웃 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} HTTP 통신 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 요청 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, 'HTTP_XXX': HTTP 상태코드)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 응답 데이터
   * @returns {number} return._nHttpStatus - HTTP 상태 코드 (200, 404, 500 등)
   * @returns {Object} return._oResponseHeaders - 응답 헤더 정보
   * @returns {string} return._sResponseText - 응답 텍스트 (원본)
   * @returns {string} return._sContentType - 응답 Content-Type
   * @returns {number} return._nContentLength - 응답 데이터 크기 (바이트)
   * @returns {string} return._sRequestTime - 요청 시간 (ISO 8601 형식)
   * @returns {number} return._nResponseTime - 응답 시간 (밀리초)
   *
   * @caution
   * - CORS 정책을 확인하여 웹에서 외부 도메인 접근 시 주의하세요
   * - 인증이 필요한 API는 적절한 인증 헤더를 포함해야 합니다
   * - 대용량 파일 전송 시 타임아웃과 메모리 사용량을 고려하세요
   * - HTTPS 사용을 권장하며, 민감한 데이터는 암호화하세요
   *
   * @example
   * // 기본 GET 요청
   * const apiResult = await bizMOB.Network.requestHttp({
   *   _sUrl: 'https://jsonplaceholder.typicode.com/posts/1',
   *   _sMethod: 'GET'
   * });
   *
   * if (apiResult._bResult) {
   *   console.log('API 응답:', apiResult._oData);
   *   console.log('HTTP 상태:', apiResult._nHttpStatus);
   * } else {
   *   console.error('API 요청 실패:', apiResult._sResultMessage);
   * }
   *
   * @example
   * // 인증 헤더가 포함된 GET 요청
   * async function fetchUserData(userId, authToken) {
   *   const result = await bizMOB.Network.requestHttp({
   *     _sUrl: `https://api.example.com/users/${userId}`,
   *     _sMethod: 'GET',
   *     _oHeader: {
   *       'Authorization': `Bearer ${authToken}`,
   *       'Content-Type': 'application/json',
   *       'Accept': 'application/json'
   *     },
   *     _nTimeout: 15
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 200) {
   *     return result._oData;
   *   } else if (result._nHttpStatus === 401) {
   *     throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
   *   } else if (result._nHttpStatus === 404) {
   *     throw new Error('사용자를 찾을 수 없습니다.');
   *   } else {
   *     throw new Error(`API 오류: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // POST 요청으로 데이터 생성
   * async function createPost(postData, authToken) {
   *   const result = await bizMOB.Network.requestHttp({
   *     _sUrl: 'https://api.example.com/posts',
   *     _sMethod: 'POST',
   *     _oHeader: {
   *       'Authorization': `Bearer ${authToken}`,
   *       'Content-Type': 'application/json'
   *     },
   *     _oBody: {
   *       title: postData.title,
   *       content: postData.content,
   *       category: postData.category,
   *       tags: postData.tags,
   *       published: postData.published || false
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 30
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 201) {
   *     console.log('포스트 생성 성공:', result._oData.id);
   *     return result._oData;
   *   } else {
   *     console.error('포스트 생성 실패:', result._sResultMessage);
   *     throw new Error('포스트 생성에 실패했습니다.');
   *   }
   * }
   *
   * @example
   * // 쿼리 파라미터가 포함된 GET 요청
   * async function searchPosts(searchOptions) {
   *   const queryParams = new URLSearchParams({
   *     q: searchOptions.keyword,
   *     category: searchOptions.category,
   *     page: searchOptions.page.toString(),
   *     limit: searchOptions.limit.toString(),
   *     sort: searchOptions.sort || 'created_desc'
   *   });
   *
   *   const result = await bizMOB.Network.requestHttp({
   *     _sUrl: 'https://api.example.com/posts/search',
   *     _sMethod: 'GET',
   *     _sQuery: queryParams.toString(),
   *     _oHeader: {
   *       'Accept': 'application/json'
   *     },
   *     _nTimeout: 20
   *   });
   *
   *   if (result._bResult) {
   *     return {
   *       posts: result._oData.results,
   *       totalCount: result._oData.totalCount,
   *       hasMore: result._oData.hasMore,
   *       currentPage: searchOptions.page
   *     };
   *   } else {
   *     throw new Error('검색 실패: ' + result._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 파일 업로드 (multipart/form-data)
   * async function uploadFile(file, metadata) {
   *   // FormData 준비
   *   const formData = new FormData();
   *   formData.append('file', file);
   *   formData.append('name', metadata.name);
   *   formData.append('description', metadata.description);
   *
   *   const result = await bizMOB.Network.requestHttp({
   *     _sUrl: 'https://api.example.com/upload',
   *     _sMethod: 'POST',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getAuthToken()}`
   *       // Content-Type은 FormData 사용 시 자동 설정
   *     },
   *     _oBody: formData,
   *     _bProgressEnable: true,
   *     _nTimeout: 120 // 파일 업로드용 긴 타임아웃
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 200) {
   *     console.log('파일 업로드 성공:', result._oData.fileId);
   *     return {
   *       fileId: result._oData.fileId,
   *       downloadUrl: result._oData.downloadUrl,
   *       fileSize: result._oData.fileSize
   *     };
   *   } else {
   *     throw new Error('파일 업로드 실패: ' + result._sResultMessage);
   *   }
   * }
   *
   * @example
   * // PUT 요청으로 데이터 수정
   * async function updateUser(userId, userData) {
   *   const result = await bizMOB.Network.requestHttp({
   *     _sUrl: `https://api.example.com/users/${userId}`,
   *     _sMethod: 'PUT',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getAuthToken()}`,
   *       'Content-Type': 'application/json'
   *     },
   *     _oBody: {
   *       name: userData.name,
   *       email: userData.email,
   *       profile: userData.profile,
   *       updatedAt: new Date().toISOString()
   *     },
   *     _nTimeout: 15
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 200) {
   *     console.log('사용자 정보 수정 성공');
   *     return result._oData;
   *   } else if (result._nHttpStatus === 409) {
   *     throw new Error('이메일이 이미 사용 중입니다.');
   *   } else {
   *     throw new Error('사용자 정보 수정 실패: ' + result._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 오류 처리가 포함된 HTTP 요청
   * async function safeHttpRequest(url, method, options = {}) {
   *   try {
   *     const result = await bizMOB.Network.requestHttp({
   *       _sUrl: url,
   *       _sMethod: method,
   *       _oHeader: options.headers,
   *       _oBody: options.body,
   *       _sQuery: options.query,
   *       _nTimeout: options.timeout || 30
   *     });
   *
   *     // HTTP 상태 코드별 처리
   *     switch (result._nHttpStatus) {
   *       case 200:
   *       case 201:
   *       case 204:
   *         return result._oData;
   *
   *       case 400:
   *         throw new Error('잘못된 요청입니다: ' + result._sResultMessage);
   *
   *       case 401:
   *         // 인증 토큰 갱신 후 재시도
   *         await refreshAuthToken();
   *         throw new Error('인증이 필요합니다. 다시 시도해주세요.');
   *
   *       case 403:
   *         throw new Error('접근 권한이 없습니다.');
   *
   *       case 404:
   *         throw new Error('요청한 리소스를 찾을 수 없습니다.');
   *
   *       case 500:
   *         throw new Error('서버 내부 오류가 발생했습니다.');
   *
   *       default:
   *         throw new Error(`HTTP 오류 (${result._nHttpStatus}): ${result._sResultMessage}`);
   *     }
   *   } catch (error) {
   *     console.error('HTTP 요청 실패:', error);
   *
   *     if (error.name === 'TimeoutError') {
   *       throw new Error('요청 시간이 초과되었습니다.');
   *     } else if (error.name === 'NetworkError') {
   *       throw new Error('네트워크 연결을 확인해주세요.');
   *     } else {
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static requestHttp(arg: {
    _sUrl: string, // 서버 URL
    _sMethod: 'GET' | 'POST', // 통신 방식 (get, post)
    _oHeader?: Record<string, any>, // Http Header 객체
    _oBody?: Record<string, any>, // Http Body 객체
    _bProgressEnable?: boolean, // 서버에 요청 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.requestHttp({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * REST API 통신을 요청합니다.
   *
   * RESTful 아키텍처를 따르는 API와의 통신을 수행하는 고급 HTTP 통신 API입니다.
   * 자동 JSON 파싱, 표준 REST 응답 처리, 오류 핸들링 등의 기능이 포함되어 있습니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트를 통한 RESTful API 통신
   * - 웹: Fetch API를 이용한 현대적 HTTP 요청
   *
   * @purpose REST API 서비스 연동, JSON 데이터 교환, 마이크로서비스 통신, SPA 백엔드 연동
   *
   * @param {Object} arg - REST API 요청 설정 객체
   * @param {string} arg._sUrl - API 엔드포인트 URL (RESTful 경로)
   * @param {string} arg._sMethod - HTTP 메서드
   *   - `'GET'`: 리소스 조회
   *   - `'POST'`: 리소스 생성
   *   - `'PUT'`: 리소스 전체 수정
   *   - `'PATCH'`: 리소스 부분 수정
   *   - `'DELETE'`: 리소스 삭제
   * @param {Object} [arg._oHeader] - HTTP 헤더 객체 (자동으로 JSON 헤더 추가)
   * @param {Object} [arg._oBody] - 요청 바디 객체 (자동으로 JSON 직렬화)
   * @param {string} [arg._sQuery] - 쿼리 스트링 (검색, 필터링, 페이징)
   * @param {boolean} [arg._bProgressEnable=true] - API 통신 중 진행률 표시 여부
   * @param {number} [arg._nTimeout=30] - 타임아웃 시간 (초 단위)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} REST API 통신 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - API 요청 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, 'REST_XXX': REST 오류코드)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - API 응답 데이터 (자동 JSON 파싱)
   * @returns {number} return._nHttpStatus - HTTP 상태 코드
   * @returns {Object} return._oResponseHeaders - 응답 헤더 정보
   * @returns {Object} return._oMeta - API 메타데이터 (페이징, 정렬 등)
   * @returns {string} return._sApiVersion - API 버전 정보
   * @returns {string} return._sRequestId - 요청 추적 ID
   * @returns {string} return._sRequestTime - 요청 시간 (ISO 8601)
   * @returns {number} return._nResponseTime - 응답 시간 (밀리초)
   * @returns {Object} return._oRateLimit - API 속도 제한 정보
   * @returns {number} return._oRateLimit.limit - 제한 횟수
   * @returns {number} return._oRateLimit.remaining - 남은 횟수
   * @returns {number} return._oRateLimit.resetTime - 제한 리셋 시간
   *
   * @caution
   * - API 키나 토큰이 필요한 경우 적절한 인증 헤더를 포함하세요
   * - Rate Limiting을 고려하여 과도한 요청을 피하세요
   * - CORS 정책을 확인하여 브라우저에서의 접근 제한을 고려하세요
   * - 대용량 데이터 처리 시 페이징을 활용하세요
   *
   * @example
   * // 기본 REST API 조회
   * const usersResult = await bizMOB.Network.requestApi({
   *   _sUrl: 'https://api.example.com/v1/users',
   *   _sMethod: 'GET'
   * });
   *
   * if (usersResult._bResult) {
   *   console.log('사용자 목록:', usersResult._oData.users);
   *   console.log('총 개수:', usersResult._oMeta.totalCount);
   *   console.log('API 버전:', usersResult._sApiVersion);
   * } else {
   *   console.error('API 요청 실패:', usersResult._sResultMessage);
   * }
   *
   * @example
   * // 페이징과 필터링이 포함된 조회
   * async function getUserList(page = 1, limit = 20, filters = {}) {
   *   const queryParams = new URLSearchParams({
   *     page: page.toString(),
   *     limit: limit.toString(),
   *     ...filters,
   *     sort: 'createdAt:desc'
   *   });
   *
   *   const result = await bizMOB.Network.requestApi({
   *     _sUrl: 'https://api.example.com/v1/users',
   *     _sMethod: 'GET',
   *     _sQuery: queryParams.toString(),
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getApiToken()}`
   *     },
   *     _nTimeout: 15
   *   });
   *
   *   if (result._bResult) {
   *     return {
   *       users: result._oData.users,
   *       pagination: {
   *         currentPage: result._oMeta.page,
   *         totalPages: result._oMeta.totalPages,
   *         totalCount: result._oMeta.totalCount,
   *         hasNext: result._oMeta.hasNext,
   *         hasPrev: result._oMeta.hasPrev
   *       },
   *       rateLimit: result._oRateLimit
   *     };
   *   } else {
   *     throw new Error(`사용자 목록 조회 실패: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // POST로 새 리소스 생성
   * async function createUser(userData) {
   *   const result = await bizMOB.Network.requestApi({
   *     _sUrl: 'https://api.example.com/v1/users',
   *     _sMethod: 'POST',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getApiToken()}`,
   *       'Content-Type': 'application/json'
   *     },
   *     _oBody: {
   *       name: userData.name,
   *       email: userData.email,
   *       role: userData.role || 'user',
   *       profile: {
   *         firstName: userData.firstName,
   *         lastName: userData.lastName,
   *         phone: userData.phone
   *       },
   *       settings: {
   *         notifications: true,
   *         theme: 'light'
   *       }
   *     },
   *     _bProgressEnable: true,
   *     _nTimeout: 20
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 201) {
   *     console.log('사용자 생성 성공:', result._oData.user.id);
   *     console.log('요청 ID:', result._sRequestId);
   *
   *     return {
   *       user: result._oData.user,
   *       location: result._oResponseHeaders.Location
   *     };
   *   } else {
   *     throw new Error(`사용자 생성 실패: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // PUT으로 리소스 전체 수정
   * async function updateUser(userId, userData) {
   *   const result = await bizMOB.Network.requestApi({
   *     _sUrl: `https://api.example.com/v1/users/${userId}`,
   *     _sMethod: 'PUT',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getApiToken()}`,
   *       'Content-Type': 'application/json',
   *       'If-Match': userData.etag // 낙관적 잠금
   *     },
   *     _oBody: {
   *       ...userData,
   *       updatedAt: new Date().toISOString()
   *     },
   *     _nTimeout: 15
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 200) {
   *     console.log('사용자 수정 성공');
   *     return result._oData.user;
   *   } else if (result._nHttpStatus === 409) {
   *     throw new Error('다른 사용자가 동시에 수정했습니다. 새로고침 후 다시 시도하세요.');
   *   } else if (result._nHttpStatus === 412) {
   *     throw new Error('데이터가 이미 변경되었습니다. 새로고침 후 다시 시도하세요.');
   *   } else {
   *     throw new Error(`사용자 수정 실패: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // PATCH로 부분 수정
   * async function updateUserStatus(userId, status, reason) {
   *   const result = await bizMOB.Network.requestApi({
   *     _sUrl: `https://api.example.com/v1/users/${userId}`,
   *     _sMethod: 'PATCH',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getApiToken()}`,
   *       'Content-Type': 'application/json-patch+json'
   *     },
   *     _oBody: [
   *       {
   *         op: 'replace',
   *         path: '/status',
   *         value: status
   *       },
   *       {
   *         op: 'add',
   *         path: '/statusHistory/-',
   *         value: {
   *           status: status,
   *           reason: reason,
   *           timestamp: new Date().toISOString(),
   *           updatedBy: await getCurrentUserId()
   *         }
   *       }
   *     ],
   *     _nTimeout: 10
   *   });
   *
   *   if (result._bResult && result._nHttpStatus === 200) {
   *     console.log('사용자 상태 변경 성공');
   *     return result._oData.user;
   *   } else {
   *     throw new Error(`상태 변경 실패: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // DELETE로 리소스 삭제
   * async function deleteUser(userId, reason) {
   *   const result = await bizMOB.Network.requestApi({
   *     _sUrl: `https://api.example.com/v1/users/${userId}`,
   *     _sMethod: 'DELETE',
   *     _oHeader: {
   *       'Authorization': `Bearer ${await getApiToken()}`,
   *       'X-Delete-Reason': reason
   *     },
   *     _nTimeout: 10
   *   });
   *
   *   if (result._bResult && (result._nHttpStatus === 200 || result._nHttpStatus === 204)) {
   *     console.log('사용자 삭제 성공');
   *     return true;
   *   } else if (result._nHttpStatus === 409) {
   *     throw new Error('관련된 데이터가 있어 삭제할 수 없습니다.');
   *   } else {
   *     throw new Error(`사용자 삭제 실패: ${result._sResultMessage}`);
   *   }
   * }
   *
   * @example
   * // 완전한 오류 처리를 포함한 API 호출
   * async function safeApiRequest(endpoint, method, options = {}) {
   *   try {
   *     const result = await bizMOB.Network.requestApi({
   *       _sUrl: `https://api.example.com/v1/${endpoint}`,
   *       _sMethod: method,
   *       _oHeader: {
   *         'Authorization': `Bearer ${await getApiToken()}`,
   *         'Content-Type': 'application/json',
   *         'Accept': 'application/json',
   *         'X-API-Version': 'v1',
   *         ...options.headers
   *       },
   *       _oBody: options.body,
   *       _sQuery: options.query,
   *       _nTimeout: options.timeout || 30
   *     });
   *
   *     // Rate Limit 체크
   *     if (result._oRateLimit && result._oRateLimit.remaining < 10) {
   *       console.warn('API 호출 제한에 근접했습니다:', result._oRateLimit);
   *     }
   *
   *     // HTTP 상태별 처리
   *     switch (result._nHttpStatus) {
   *       case 200:
   *       case 201:
   *       case 204:
   *         return result._oData;
   *
   *       case 400:
   *         throw new Error(`잘못된 요청: ${result._oData?.message || result._sResultMessage}`);
   *
   *       case 401:
   *         // 토큰 갱신 시도
   *         await refreshApiToken();
   *         throw new Error('인증이 만료되었습니다. 다시 시도해주세요.');
   *
   *       case 403:
   *         throw new Error('접근 권한이 없습니다.');
   *
   *       case 404:
   *         throw new Error('요청한 리소스를 찾을 수 없습니다.');
   *
   *       case 422:
   *         const validationErrors = result._oData?.errors || [];
   *         throw new Error(`입력 데이터 오류: ${validationErrors.map(e => e.message).join(', ')}`);
   *
   *       case 429:
   *         const retryAfter = result._oResponseHeaders['Retry-After'] || 60;
   *         throw new Error(`너무 많은 요청입니다. ${retryAfter}초 후에 다시 시도해주세요.`);
   *
   *       case 500:
   *         throw new Error('서버 내부 오류가 발생했습니다.');
   *
   *       case 502:
   *       case 503:
   *       case 504:
   *         throw new Error('서버가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.');
   *
   *       default:
   *         throw new Error(`API 오류 (${result._nHttpStatus}): ${result._sResultMessage}`);
   *     }
   *   } catch (error) {
   *     console.error('API 요청 실패:', error);
   *
   *     if (error.name === 'TimeoutError') {
   *       throw new Error('API 응답 시간이 초과되었습니다.');
   *     } else if (error.name === 'NetworkError') {
   *       throw new Error('네트워크 연결을 확인해주세요.');
   *     } else {
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static requestApi(arg: {
    _sMethod: 'GET' | 'POST', // HTTP Method
    _sUrl: string, // 호출 PATH
    _nTimeout?: number, // 타임아웃 시간 (sec 단위)
    _nRetries?: number, // API 요청 회수 (default: 1 -- 한번 요청 실패시 응답)
    _oHeader?: Record<string, any>, // HTTP Header
    _oBody?: any, // HTTP Body (Ex. new URLSearchParams(body || {}).toString(), JSON.stringify(body))
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Http.request({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
