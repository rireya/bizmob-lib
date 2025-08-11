export default class Network {
  /**
   * Network 통신 시 애플리케이션 로케일(언어/지역) 변경
   *
   * @description 애플리케이션의 언어 설정을 변경하여 서버 통신 시 사용할 로케일을 설정합니다.
   * 이 함수는 앱/웹 환경에 따라 다르게 동작합니다:
   *
   * **앱 환경 (bizMOBCore)**:
   * - Native 디바이스의 언어 설정과 연동
   * - 전체 앱의 언어 환경을 변경
   * - 네이티브 UI 요소의 언어도 함께 변경됨
   *
   * **웹 환경 (bizMOBWebCore)**:
   * - 브라우저의 언어 설정을 기반으로 동작
   * - 웹 애플리케이션 내부의 언어 환경만 변경
   * - HTTP 헤더의 Accept-Language에 반영
   *
   * @param {Object} arg - 네트워크 로케일 설정 객체
   * @param {string} arg._sLocaleCd - 설정할 언어 코드
   *   - 단순 언어코드: 'ko', 'en', 'ja', 'zh' 등
   *   - 전체 로케일코드: 'ko-KR', 'en-US', 'ja-JP', 'zh-CN' 등
   *   - 시스템이 자동으로 적절한 전체 로케일코드로 변환
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @example
   * import { Network } from '@bizMOB';
   * // 기본 로케일 변경
   * const localeResult = await Network.changeLocale({ _sLocaleCd: 'en' });
   *
   */
  static changeLocale(arg: {
    _sLocaleCd: string, // 언어코드 (ko, en, ...)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Network.changeLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }

  /**
   * bizMOB Server 로그인(인증)전문 통신
   *
   * @description bizMOB 서버 로그인 인증을 수행합니다.
   * 성공 시 JWT Access Token과 Refresh Token을 반환하며,
   * 이후 requestTr 호출 시 자동으로 Authorization 헤더에 적용됩니다.
   * 레거시 시스템과의 통합을 위해 기존 로그인 전문을 감싸서 처리합니다.
   *
   * @param {Object} arg - 로그인 요청 설정 객체
   * @param {string} arg._sUserId - 인증 받을 사용자 아이디
   * @param {string} arg._sPassword - 인증 받을 사용자 패스워드 
   * @param {string} arg._sTrcode - 레거시 로그인 인증 전문코드
   * @param {Object} [arg._oHeader] - 레거시 로그인 인증 전문 Header 객체
   * @param {Object} [arg._oBody] - 레거시 로그인 인증 전문 Body 객체
   * @param {Object} [arg._oHttpHeader] - 사용자 정의 HTTP 헤더
   * @param {string} [arg._sQuery] - 쿼리 스트링 (웹 전용)
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 서버에 통신 요청시 progress 표시 여부( true 또는 false )
   * @param {number} [arg._nTimeout=60] - (default: 60) 서버에 통신 요청시 timeout 시간 (sec)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   header: {
   *     result: boolean,                  // 성공 여부
   *     error_code: string,               // 에러 코드
   *     error_text: string,               // 에러 메시지
   *     trcode: string,                   // 트랜잭션 코드
   *     content_update_flag: boolean,     // 컨텐츠 업데이트 플래그
   *     emergency_flag: boolean,          // 긴급 플래그
   *     info_text: string,                // 정보 텍스트
   *     login_session_id: string,         // 로그인 세션 ID
   *     message_version: string,          // 메시지 버전
   *     content_major_version: number,    // 컨텐츠 메이저 버전
   *     content_minor_version: number     // 컨텐츠 마이너 버전
   *   },
   *   body: {
   *     accessToken: string,              // JWT Access Token (웹 환경)
   *     refreshToken: string,             // JWT Refresh Token (웹 환경)
   *     accessTokenExpTime: number,       // Access Token 만료 시간 (웹 환경)
   *     refreshTokenExpTime: number       // Refresh Token 만료 시간 (웹 환경)
   *   }
   * }>} 로그인 결과를 담은 Promise 객체
   * @example
   * import { Network } from '@bizMOB';
   * // 기본 로그인
   * const loginResult = await Network.requestLogin({
   *   _sTrcode: 'DM0001',
   *   _sUserId: 'user@example.com',   // 레거시 시스템용
   *   _sPassword: encryptPassword('mypassword123'),  // 레거시 시스템용
   *   _oBody: { userId: 'test', password: 'password123' }, // bizMOB 시스템용
   * });
   *
   * if (loginResult.header.result) {
   *   console.log('로그인 성공');
   *   // 메인 화면으로 이동
   *   navigateToMainPage();
   * } else {
   *   console.log('로그인 실패:', loginResult.body.error_text);
   * }
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
    return new Promise(resolve => {
      window.bizMOB.Network.requestLogin({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * bizMOB Server 전문 통신
   *
   * @description bizMOB 서버와 전문 기반 통신을 수행합니다.
   * JWT 토큰이 설정된 경우 자동으로 Authorization 헤더에 추가되며,
   * 암호화가 활성화된 경우 메시지 암호화를 지원합니다.
   * 토큰 없이도 기본 전문 통신이 가능합니다.
   *
   * @param {Object} arg - TR 요청 설정 객체
   * @param {string} arg._sTrcode - bizMOB Server 인증 전문코드
   * @param {Object} [arg._oHeader] - bizMOB Server 인증 전문 Header 객체
   * @param {Object} [arg._oBody] - bizMOB Server 인증 전문 Body 객체
   * @param {Object} [arg._oHttpHeader] - 사용자 정의 HTTP 헤더
   * @param {string} [arg._sQuery] - 쿼리 스트링 (GET 방식 파라미터)
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 서버에 통신 요청시 progress 표시 여부( true 또는 false )
   * @param {number} [arg._nTimeout=60] - (default: 60) 서버에 통신 요청시 timeout 시간 (sec)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   header: {
   *     result: boolean,         // 성공 여부
   *     error_code: string,      // 에러 코드
   *     error_text: string,      // 에러 메시지
   *     trcode: string           // 트랜잭션 코드
   *   },
   *   body: Object               // 응답 본문 (비즈니스 로직에 따라 구조가 달라짐)
   * }>} 서버 통신 결과를 담은 Promise 객체
   * @example
   * import { Network } from '@bizMOB';
   * // 기본 데이터 조회 TR
   * const userListResult = await Network.requestTr({
   *   _sTrcode: 'USER001',
   *   _oBody: {
   *     pageNo: 1,
   *     pageSize: 20,
   *     searchType: 'name',
   *     searchValue: '김'
   *   }
   * });
   *
   * if (userListResult.header.result) {
   *   console.log('조회 성공, 총 건수:', userListResult.body.totalCount);
   *
   * } else {
   *   console.error('조회 실패:', userListResult.header.error_text);
   * }
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
    return new Promise(resolve => {
      window.bizMOB.Network.requestTr({
        ...arg,
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * API 서버 통신
   *
   * @param {Object} arg - HTTP 요청 설정 객체
   * @param {string} arg._sUrl - 서버 URL
   * @param {string} arg._sMethod - 통신 방식 (GET, POST)
   * @param {Object} [arg._oHeader] - Http Header
   * @param {Object} [arg._oBody] - Http Body
   * @param {string} [arg._sQuery] - 쿼리 스트링 (URL 파라미터)
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 서버에 통신 요청시 progress 표시 여부( true 또는 false )
   * @param {number} [arg._nTimeout=60] - (default: 60) 서버에 통신 요청시 timeout 시간 (sec)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   data: Object,           // 응답 데이터 (API에 따라 구조가 달라짐)
   *   status: number,         // HTTP 상태 코드
   *   headers: Object         // 응답 헤더
   * }>} HTTP 통신 결과를 담은 Promise 객체
   * @example
   * import { Network } from '@bizMOB';
   * // 기본 GET 요청
   * const apiResult = await Network.requestHttp({
   *   _sUrl: 'https://jsonplaceholder.typicode.com/posts/1',
   *   _sMethod: 'GET'
   * });
   *
   * if (apiResult.result) {
   *   console.log('API 응답:', apiResult.data);
   *   console.log('HTTP 상태:', apiResult.status);
   * }
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
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * HTTP 요청 수행 (웹 환경 전용)
   *
   * @description 웹 환경에서 일반 API 통신을 위한 HTTP 요청 함수.
   * 앱 환경에서는 동작하지 않으며, bizMOB 서버가 아닌 외부 API와 통신할 때 사용한다.
   * JavaScript의 기본 fetch API를 기반으로 구현되어 fetch와 동일한 구조를 가진다.
   *
   * @param {Object} arg - REST API 요청 설정 객체
   * @param {string} arg._sUrl - 서버 URL
   * @param {string} arg._sMethod - 통신 방식 (get, post)
   * @param {Object} [arg._oHeader] - Http Header
   * @param {Object} [arg._oBody] - Http Body
   * @param {Object} [arg._oOption] - fetch 옵션 객체 (추가 fetch 설정)
   * @param {number} [arg._nTimeout=60] - (default: 60) 서버에 통신 요청시 timeout 시간 (sec)
   * @param {number} [arg._nRetries=1] (default: 1) API 요청 재시도 횟수 
   * @returns {Promise<{
   *   ok: boolean,        // 요청 성공 여부 (HTTP 200-299 범위)
   *   status: number,     // HTTP 상태 코드 (200, 404, 500 등)
   *   statusText: string, // HTTP 상태 텍스트 ("OK", "Not Found" 등)
   *   data: any           // 응답 데이터 (성공 시 JSON, 실패 시 null)
   * }>} HTTP 요청 결과를 담은 Promise 객체
   * @example
   * import { Network } from '@bizMOB';
   * // POST 요청으로 데이터 전송
   * const usersResult = await Network.requestApi({
   *   _sUrl: 'https://api.example.com/posts',
   *   _sMethod: 'POST',
   *   _oHeader: { 'Content-Type': 'application/json' },
   *   _oBody: JSON.stringify({ title: '제목', content: '내용' }),
   *   _nTimeout: 30,
   *   _nRetries: 2,
   * });
   *
   * if (usersResult.ok) {
   *   console.log('게시글 생성 성공:', usersResult.data);
   * } else {
   *   console.log('게시글 생성 실패');
   * }
   *
   * @note 이 함수는 웹 환경에서만 동작하며, 앱 환경에서는 사용할 수 없습니다.
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
        _fCallback: function(res: any) {
          resolve(res);
        }
      });
    });
  }
}
