export default class Push {
  /**
   * 푸시 알람 수신여부 조회
   *
   * @param {Object} arg - 푸시 알람 조회 설정 객체
   * @param {string} arg._sUserId - 푸시 알림 설정을 조회할 사용자 아이디
   * @param {boolean} [arg._bProgressEnable=true] - (Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 알람 조회 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/getAlarm.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 현재 푸시 알람 설정 상태 확인
   * const alarmResult = await Push.getAlarm({
   *   _sUserId: 'user@example.com',
   *   _bProgressEnable: true
   * });
   *
   * if (alarmResult.result) {
   *   console.log('알람 설정 조회 성공');
   * } else {
   *   console.error('알람 설정 조회 실패:', alarmResult.resultMessage);
   * }
   *
   */
  static getAlarm(arg: {
    _sUserId: string, // 푸시 알림이 설정된 사용자 아이디
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
    _bMock?: boolean, // Mock 데이터 사용 여부 (개발용)
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getAlarm({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 푸시 수신 목록 조회
   *
   * @param {Object} arg - 푸시 메시지 목록 조회 설정 객체
   * @param {string} arg._sUserId - 푸시 메세지를 조회할 사용자 아이디.
   * @param {number} arg._nPageIndex - 푸시 메세지를 가져올 페이징 값.
   * @param {number} arg._nItemCount - 푸시 메세지를 가져올 페이징 처리 갯수
   * @param {string} arg._sAppName - 푸시 서버에 등록된 앱 이름
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 수신 목록 조회 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/getMessageList.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 최신 푸시 메시지 목록 조회 (첫 페이지, 20개)
   * const messageResult = await Push.getMessageList({
   *   _sAppName: 'MyMobileApp',
   *   _sUserId: 'user@example.com',
   *   _nPageIndex: 0,
   *   _nItemCount: 20,
   *   _bProgressEnable: true
   * });
   *
   * if (messageResult.result) {
   *   console.log('메시지 목록 조회 성공');
   * } else {
   *   console.error('메시지 목록 조회 실패:', messageResult.resultMessage);
   * }
   */
  static getMessageList(arg: {
    _sUserId: string, // 푸시 메세지를 가져올 사용자 아이디
    _nPageIndex: number, // 푸시 메세지를 가져올 페이지 번호
    _nItemCount: number, // 해당 페이지에서 가져올 푸시 메세지 갯수
    _sAppName: string, // 푸시 메세지를 가져올 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getMessageList({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 푸시키 정보 조회
   * 
   * @param {Object} [arg] - 푸시키 조회 설정 객체 (선택사항)
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시키 정보 조회 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/getPushKey.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 현재 디바이스의 푸시키 조회
   * const pushKeyResult = await Push.getPushKey({
   *   _bProgressEnable: true
   * });
   *
   * if (pushKeyResult.result) {
   *   const pushKey = pushKeyResult.resultMessage;
   *   console.log('푸시키:', pushKey);
   *
   *   // 서버에 푸시키 등록
   *   await registerPushKeyToServer(pushKey);
   * } else {
   *   console.error('푸시키 조회 실패:', pushKeyResult.resultCode);
   * }
   */
  static getPushKey(arg?: {
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getPushKey({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 읽지 않은 푸시 메세지 카운트 조회
   *
   * @param {Object} arg - 안읽은 개수 조회 설정 객체
   * @param {string} arg._sUserId - 푸시 메세지를 조회할 사용자 아이디.
   * @param {string} arg._sAppName - 푸시 서버에 등록된 앱 이름.
   * @param {boolean} [arg._bProgressEnable=true] - (Default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 읽지 않은 푸시 메세지 조회 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/getUnreadCount.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 기본 안읽은 개수 조회
   * const unreadResult = await Push.getUnreadCount({
   *   _sUserId: 'user123',
   *   _sAppName: 'MyApp',
   *   _bProgressEnable: false
   * });
   *
   * if (unreadResult.result) {
   *   console.log('안읽은 개수 조회 성공:', unreadResult.resultCode);
   * } else {
   *   console.error('안읽은 개수 조회 실패:', unreadResult.resultCode);
   * }
   */
  static getUnreadCount(arg: {
    _sUserId: string, // 읽지 않은 메세지를 가져올 사용자 아이디
    _sAppName: string, // 푸시 메세지를 가져올 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.getUnreadCount({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 푸시 메세지 읽기
   *
   * @param {Object} arg - 메시지 읽음 처리 설정 객체
   * @param {string} arg._sTrxDay - 푸시 메세지를 읽은 날짜.(yyyymmdd)
   * @param {string} arg._sTrxId - 푸시 메세지 아이디.
   * @param {string} arg._sUserId - 사용자 아이디.
   * @param {boolean} [arg._bProgressEnable=true] - (Default:true) 푸시 서버와 통신 중일때  화면에 progress 표시 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 읽음 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/readMessage.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 기본 메시지 읽음 처리
   * const readResult = await Push.readMessage({
   *   _sTrxDay: '20240315',
   *   _sTrxId: 'MSG_20240315_001',
   *   _sUserId: 'user123',
   *   _bProgressEnable: false
   * });
   *
   * if (readResult.result) {
   *   console.log('메시지 읽음 처리 완료');
   *
   *   // 읽지 않은 메시지 카운트 업데이트
   *   updateUnreadCount();
   * } else {
   *   console.error('읽음 처리 실패:', readResult.resultCode);
   * }
   */
  static readMessage(arg: {
    _sTrxDay: string, // 푸시 메세지를 읽은 날짜(yyyymmdd 형식)
    _sTrxId: string, // 푸시 메세지 아이디
    _sUserId: string, // 푸시 메세지를 읽음 처리할 사용자 아이디
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.readMessage({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 수신받은 푸시 메세지의 상세 정보를 조회
   * 
   * @param {Object} arg - 메시지 상세 조회 설정 객체
   * @param {string} arg._sUserId - 사용자 아이디.
   * @param {string} arg._sMessageId - 푸시 메세지 아이디.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,              // 성공 여부
   *   resultCode: string,           // 결과 코드
   *   resultMessage: string,        // 결과 메시지
   *   body: {
   *     channelType: string,        // 푸시발송시 요청이 들어온 채널 (HTTP 또는 DB)
   *     messageSubject: string,     // 푸시메세지 제목
   *     fromUser: string,           // 푸시메세지 발송자
   *     messageContent: string,     // 푸시메세지 내용
   *     messageCategory: string,    // 푸시메세지 카테고리
   *     processedDate: string,      // 발송처리시간
   *     trxType: string,            // 푸시메세지 전송방식
   *     appName: string,            // 푸시메세지를 수신한 앱 이름
   *     processed: boolean,         // 푸시 발송 처리 여부
   *     messagePayload: Object,     // 푸시메세지와 함께 전송된 파라미터
   *     trxId: number,              // 트랜잭션 아이디
   *     trxDay: string,             // 트랜잭션 날짜
   *     serverId: string,           // 푸시서버 아이디
   *     trxDate: string             // 푸시발송을 등록한 시간
   *   }
   * }>}
   * @see public/mock/bizMOB/Push/readReceiptMessage.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * // 기본 메시지 상세 조회
   * const messageDetail = await Push.readReceiptMessage({
   *   _sUserId: 'user123',
   *   _sMessageId: 'MSG_20240315_001'
   * });
   *
   * if (messageDetail.result) {
   *   const message = messageDetail.body;
   *   console.log('메시지 제목:', message.messageSubject);
   *   console.log('발신자:', message.fromUser);
   *   console.log('내용:', message.messageContent);
   *
   * } else {
   *   console.error('메시지 조회 실패:', messageDetail.resultCode);
   * }
   */
  static readReceiptMessage(arg: {
    _sUserId: string, // 수신받은 메세지를 조회할 사용자 아이디
    _sMessageId: string, // 조회할 수신 메시지의 아이디
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.readReceiptMessage({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시키를 서버에 등록합니다. 
   * @param {Object} arg - 푸시키 등록 설정 객체
   * @param {string} arg._sServerType - 푸시키를 등록할 서버 타입.( bizpush 또는 push )
   * @param {string} arg._sUserId - 푸시키를 등록할 사용자 아이디.
   * @param {string} arg._sAppName - 푸시키를 등록할 앱 이름.
   * @param {boolean} [arg._bProgressEnable=true] - (default:true) 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 서버 등록 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/registerToServer.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * const regResult = await Push.registerToServer({
   *   _sServerType: 'bizpush',
   *   _sUserId: 'user123',
   *   _sAppName: 'MyApp',
   *   _bProgressEnable: true
   * });
   *
   * if(regResult.result) {
   * console.log('푸시 등록 성공:', regResult.resultMessage);
   * } else {
   * console.error('푸시 등록 실패:', regResult.resultCode, regResult.resultMessage);
   * }
   * 
   */
  static registerToServer(arg: {
    _sServerType: 'bizpush' | 'push', // 푸시키를 등록할 서버 타입입니다. bizpush(대용량 푸시 서버)와 push(일반 푸시 서버)
    _sUserId: string, // 푸시키를 등록할 사용자의 아이디
    _sAppName: string, // 푸시키를 등록할 앱 이름
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.registerToServer({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   *  디바이스에 저장된 푸시 등록 관련 정보를 리셋합니다. 
   *
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   * }>} 푸시 정보 리셋 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/reset.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * const resetResult = await Push.reset();
   * 
   * if (resetResult.result) {
   *   console.log('푸시 정보 리셋 성공');  
   * } else {
   *  console.error('푸시 정보 리셋 실패');
   * }
  */
  static reset(): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.reset({
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 
   * 푸시 메세지를 전송합니다. 
   * 
   * @param {Object} arg - 푸시메시지 전송 설정 객체
   * @param {String} arg._sAppName 푸시 메세지 보낼 앱 이름.
   * @param {Array} arg._aUsers 푸시 메세지 받을 사용자 목록.
   * @param {String} arg._sFromUser 푸시 메세지를 보낼 사용자 아이디.
   * @param {String} arg._sSubject 푸시 메세지 제목.
   * @param {String} arg._sContent 푸시 메세지 내용.
   * @param {String} arg._sTrxType  (Default : INSTANT) 푸시 메세지 전송 방식.( INSTANT 또는 SCHEDULE )
   * @param {String} arg._sScheduleDate 푸시 메세지 전송 날짜.
   * @param {Array} arg._aGroups 푸시 메세지를 받을 그룹 목록
   * @param {Boolean} arg._bToAll (Default : false) 해당 앱을 사용하는 전체 사용자에게 푸시 메세지를 발송할지 여부.
   * @param {String} arg._sCategory (Default : def) 푸시 메세지 카테고리.
   * @param {Object} arg._oPayLoad 푸시 기폰 용량 초과시 전달할 메세지.
   * @param {boolean} [arg._bProgressEnable=true] - (Default:true) 푸시 서버와 통신 중일때  화면에 progress 표시 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 메세지 전송 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/sendMessage.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * const sendResult = await Push.sendMessage({
   *   _sAppName: 'MyApp',                  // 푸시를 보낼 앱 이름
   *   _aUsers: ['user01', 'user02'],       // 수신자 아이디 배열
   *   _sFromUser: 'adminUser',             // 발신자 아이디
   *   _sSubject: '공지사항',               // 제목
   *   _sContent: '오늘 3시에 점검이 있습니다.', // 내용
   *   _sTrxType: 'INSTANT',                // 즉시 전송
   *   _bToAll: false,                      // 전체 발송 여부
   *   _sCategory: 'notice',                // 카테고리
   *   _oPayLoad: { link: 'https://example.com' }, // 추가 데이터
   * })
   * if (sendResult.result) {
   *   console.log('푸시 전송 성공:', sendResult.resultMessage);
   * } else {
   *   console.error('푸시 전송 실패:', sendResult.resultCode, sendResult.resultMessage);
   * }
   * 
  */
  static sendMessage(arg: {
    _sAppName: string, // 푸시 메세지 보낼 앱 이름
    _aUsers: string[], // 푸시 메세지 받을 사용자 목록
    _sFromUser: string, // 푸시 메세지를 보낼 사용자 아이디
    _sSubject: string, // 푸시 메세지 제목
    _sContent: string, // 푸시 메세지 내용
    _sTrxType: 'INSTANT' | 'SCHEDULE', // 푸시 메세지 전송 타입입니다. INSTANT(즉시 전송), SCHEDULE(예약 전송)
    _sScheduleDate?: string, // 푸시 메세지를 예약 전송할 경우 전송 날짜(yyyymmdd 형식)
    _aGroups?: string[], // 푸시 메세지를 받을 그룹 목록
    _bToAll?: boolean, // (Default : false) 해당 앱을 사용하는 전체 사용자가 푸시 메세지를 받을지 설정하는 값
    _sCategory?: string, // (Default : def) 푸시 메세지 카테고리
    _oPayLoad?: Record<string, any>, // 푸시 메시지 전송시 기본 용량이 초과 할 경우 전송할 메세지
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.sendMessage({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 
   * 푸시 알람을 설정합니다. 
   * 
   * @param {Object} arg - 푸시 알람 설정 객체
   * @param {String} arg._sUserId 푸시 알림 설정을 등록할 사용자 아이디.
   * @param {Boolean} arg._bEnabled  (Default : true) 알람 수신 여부 설정 ( true 또는 false )
   * @param {Boolean} arg._bProgressEnable  (Default:true) 푸시 알람 설정 요청시 화면에 progress 표시 여부( true 또는 false )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   resultCode: string,     // 결과 코드
   *   resultMessage: string   // 결과 메시지
   * }>} 푸시 알람 설정 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/setAlarm.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * const setAlarmResult = await Push.setAlarm({
   *   _sUserId: 'user@example.com',
   *   _bEnabled: true,
   *   _bProgressEnable: true
   * })
   * if (setAlarmResult.result) {
   *   console.log('푸시 알람이 활성화되었습니다');
   * } else {
   *   console.log('알람 설정 실패: ' + setAlarmResult.resultMessage);
   * }
   * 
   * */
  static setAlarm(arg: {
    _sUserId: string, // 푸시 알람을 설정할 사용자 아이디
    _bEnabled: boolean, // 알람 설정 값입니다. true와 false로 설정이 가능
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.setAlarm({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 
   * 앱 아이콘에 숫자 표시하기 
   * 
   * @param {Object} arg - 뱃지 설정 객체
   * @param {Number} arg._nBadgeCount 뱃지에 표시할 값(양수 : 표시할 갯수, 0 : 뱃지카운트 초기화)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   * }>} 뱃지 설정 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Push/setBadgeCount.json - Mock 응답 데이터 예제
   * @example
   * import { Push } from '@bizMOB';
   * const setBadgeResult = await Push.setBadgeCount({
   *   _nBadgeCount: 5
   * })
   * if (setBadgeResult.result) {
   *   console.log('앱 아이콘에 뱃지 5개가 표시되었습니다');
   * } 
   * */
  static setBadgeCount(arg: {
    _nBadgeCount: number, // 뱃지에 표시할 수를 설정합니다. 양수(표시할 갯수), 0(뱃지 카운트 표시 삭제)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.setBadgeCount({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
