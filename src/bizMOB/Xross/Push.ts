export default class Push {
  /**
   * 푸시 알람 수신여부 조회
   *
   * 특정 사용자의 푸시 알림 설정 상태를 조회하여 현재 알림을 받을 수 있는지 확인합니다.
   * 사용자별로 개별 설정된 푸시 알림 활성화/비활성화 상태를 반환합니다.
   *
   * @description
   * - 앱: 네이티브 푸시 설정과 서버 설정을 동시 확인
   * - 웹: 브라우저 알림 권한과 서버 설정 확인
   *
   * @purpose 푸시 설정 UI 표시, 알림 가능 여부 확인, 사용자 환경설정 동기화
   *
   * @param {Object} arg - 푸시 알람 조회 설정 객체
   * @param {string} arg._sUserId - 푸시 알림 설정을 조회할 사용자 ID
   *   - 일반적으로 이메일 주소나 고유 사용자 식별자 사용
   *   - 푸시 서버에 등록된 사용자 ID와 일치해야 함
   * @param {boolean} [arg._bProgressEnable=true] - 서버 통신 중 진행률 표시 여부
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 푸시 알람 조회 결과를 담은 Promise
   * @returns {boolean} return.result - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 결과 메시지
   * @returns {Object} return.data - 알람 설정 데이터 (성공 시)
   * @returns {boolean} return.data.enabled - 알람 활성화 상태
   * @returns {string} return.data.userId - 사용자 ID
   * @returns {string} return.data.lastUpdated - 마지막 설정 변경 시간
   * @returns {Object} return.data.settings - 상세 알람 설정
   *
   * @caution
   * - 사용자가 푸시 서버에 등록되어 있어야 합니다
   * - 네트워크 연결이 필요합니다
   * - 서버와의 통신이 실패할 수 있습니다
   *
   * @example
   * // 현재 푸시 알람 설정 상태 확인
   * const alarmResult = await bizMOB.Push.getAlarm({
   *   _sUserId: 'user@example.com',
   *   _bProgressEnable: true
   * });
   *
   * if (alarmResult.result) {
   *   const isEnabled = alarmResult.data.enabled;
   *   console.log('푸시 알람 상태:', isEnabled ? '활성화' : '비활성화');
   *
   *   // UI 업데이트
   *   updateAlarmToggle(isEnabled);
   * } else {
   *   console.error('알람 설정 조회 실패:', alarmResult.resultMessage);
   * }
   *
   * @example
   * // 알림 설정 관리 시스템
   * class NotificationSettingsManager {
   *   static async loadUserNotificationSettings(userId) {
   *     try {
   *       console.log('사용자 알림 설정 로드 중...');
   *
   *       const alarmResult = await bizMOB.Push.getAlarm({
   *         _sUserId: userId,
   *         _bProgressEnable: false
   *       });
   *
   *       if (alarmResult.result) {
   *         const settings = {
   *           pushEnabled: alarmResult.data.enabled,
   *           userId: alarmResult.data.userId,
   *           lastUpdated: alarmResult.data.lastUpdated,
   *           serverSettings: alarmResult.data.settings
   *         };
   *
   *         // 로컬 설정과 서버 설정 동기화
   *         await this.syncLocalSettings(settings);
   *
   *         // 설정 UI 업데이트
   *         this.updateSettingsUI(settings);
   *
   *         // 설정 변경 이력 저장
   *         this.logSettingsLoad(userId, settings);
   *
   *         console.log('알림 설정 로드 완료');
   *         return settings;
   *       } else {
   *         throw new Error(`알림 설정 조회 실패: ${alarmResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('알림 설정 로드 실패:', error);
   *
   *       // 기본 설정 사용
   *       const defaultSettings = this.getDefaultSettings();
   *       this.updateSettingsUI(defaultSettings);
   *
   *       throw error;
   *     }
   *   }
   *
   *   static async syncLocalSettings(serverSettings) {
   *     // 로컬 저장소에서 설정 읽기
   *     const localSettings = await bizMOB.Storage.get({ _sKey: 'notification.settings' });
   *
   *     // 서버 설정이 더 최신인 경우 로컬 업데이트
   *     if (!localSettings ||
   *         new Date(serverSettings.lastUpdated) > new Date(localSettings.lastUpdated)) {
   *
   *       await bizMOB.Storage.set({
   *         _sKey: 'notification.settings',
   *         _vValue: serverSettings
   *       });
   *
   *       console.log('로컬 설정이 서버 설정으로 동기화되었습니다');
   *     }
   *   }
   * }
   *
   * @example
   * // 앱 시작 시 알림 상태 확인 및 초기화
   * class AppInitializer {
   *   static async initializeNotifications(userId) {
   *     try {
   *       console.log('알림 시스템 초기화 시작');
   *
   *       // 서버에서 알림 설정 조회
   *       const alarmStatus = await bizMOB.Push.getAlarm({
   *         _sUserId: userId,
   *         _bProgressEnable: false
   *       });
   *
   *       if (alarmStatus.result) {
   *         const isEnabled = alarmStatus.data.enabled;
   *
   *         if (isEnabled) {
   *           // 알림이 활성화된 경우 푸시 키 확인
   *           const pushKeyResult = await bizMOB.Push.getPushKey({
   *             _bProgressEnable: false
   *           });
   *
   *           if (pushKeyResult.result) {
   *             console.log('푸시 알림 시스템 준비 완료');
   *
   *             // 읽지 않은 메시지 수 확인
   *             const unreadResult = await bizMOB.Push.getUnreadCount({
   *               _sUserId: userId,
   *               _sAppName: await this.getAppName(),
   *               _bProgressEnable: false
   *             });
   *
   *             if (unreadResult.result) {
   *               // 배지 카운트 업데이트
   *               await bizMOB.Push.setBadgeCount({
   *                 _nBadgeCount: unreadResult.data.unreadCount
   *               });
   *             }
   *           } else {
   *             console.warn('푸시 키 조회 실패, 알림 기능 제한됨');
   *           }
   *         } else {
   *           console.log('사용자가 푸시 알림을 비활성화했습니다');
   *
   *           // 배지 카운트 제거
   *           await bizMOB.Push.setBadgeCount({ _nBadgeCount: 0 });
   *         }
   *
   *         // 알림 상태를 앱 전역 상태에 저장
   *         this.setGlobalNotificationState(isEnabled);
   *
   *         return {
   *           success: true,
   *           enabled: isEnabled,
   *           settings: alarmStatus.data
   *         };
   *       } else {
   *         console.error('알림 설정 조회 실패:', alarmStatus.resultMessage);
   *
   *         // 기본값으로 알림 활성화 시도
   *         return await this.enableDefaultNotifications(userId);
   *       }
   *     } catch (error) {
   *       console.error('알림 시스템 초기화 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static getAlarm(arg: {
    _sUserId: string, // 푸시 알림이 설정된 사용자 아이디
    _bProgressEnable?: boolean, // 푸시 서버와 통신 중일때 화면에 progress 를 표시할지에 대한 여부
    _bMock?: boolean, // Mock 데이터 사용 여부
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
   * 특정 사용자가 수신한 푸시 메시지 목록을 페이징 방식으로 조회합니다.
   * 메시지 제목, 내용, 발송 시간, 읽음 상태 등의 정보를 포함합니다.
   *
   * @description
   * - 앱: 푸시 서버 API를 통한 메시지 목록 조회
   * - 웹: RESTful API를 통한 메시지 목록 조회
   *
   * @purpose 알림함 구현, 메시지 히스토리, 푸시 관리 화면, 메시지 검색
   *
   * @param {Object} arg - 푸시 메시지 목록 조회 설정 객체
   * @param {string} arg._sUserId - 푸시 메시지를 조회할 사용자 ID
   * @param {number} arg._nPageIndex - 조회할 페이지 번호 (0부터 시작)
   * @param {number} arg._nItemCount - 페이지당 조회할 메시지 개수
   * @param {string} arg._sAppName - 푸시 서버에 등록된 앱 이름
   * @param {boolean} [arg._bProgressEnable=true] - 서버 통신 중 진행률 표시 여부
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 푸시 메시지 목록 조회 결과를 담은 Promise
   * @returns {boolean} return.result - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 결과 메시지
   * @returns {Object} return.data - 메시지 목록 데이터 (성공 시)
   * @returns {Array<Object>} return.data.list - 메시지 배열
   * @returns {string} return.data.list[].messageId - 메시지 고유 ID
   * @returns {string} return.data.list[].title - 메시지 제목
   * @returns {string} return.data.list[].content - 메시지 내용
   * @returns {string} return.data.list[].fromUser - 발송자 ID
   * @returns {string} return.data.list[].sentDate - 발송 시간
   * @returns {boolean} return.data.list[].isRead - 읽음 상태
   * @returns {string} return.data.list[].category - 메시지 카테고리
   * @returns {Object} return.data.list[].payload - 추가 데이터
   * @returns {number} return.data.totalCount - 전체 메시지 개수
   * @returns {number} return.data.pageIndex - 현재 페이지 번호
   * @returns {number} return.data.pageSize - 페이지 크기
   * @returns {boolean} return.data.hasMore - 다음 페이지 존재 여부
   *
   * @caution
   * - 사용자가 푸시 서버에 등록되어 있어야 합니다
   * - 페이지 번호는 0부터 시작합니다
   * - 대량의 메시지 조회 시 성능에 영향을 줄 수 있습니다
   * - 네트워크 연결이 필요합니다
   *
   * @example
   * // 최신 푸시 메시지 목록 조회 (첫 페이지, 20개)
   * const messageResult = await bizMOB.Push.getMessageList({
   *   _sAppName: 'MyMobileApp',
   *   _sUserId: 'user@example.com',
   *   _nPageIndex: 0,
   *   _nItemCount: 20,
   *   _bProgressEnable: true
   * });
   *
   * if (messageResult.result) {
   *   const messages = messageResult.data.list;
   *   console.log(`총 ${messageResult.data.totalCount}개 중 ${messages.length}개 조회`);
   *
   *   messages.forEach(message => {
   *     console.log(`[${message.isRead ? '읽음' : '안읽음'}] ${message.title}`);
   *   });
   * } else {
   *   console.error('메시지 목록 조회 실패:', messageResult.resultMessage);
   * }
   *
   * @example
   * // 알림함 UI 구현
   * class NotificationInboxManager {
   *   constructor(userId, appName) {
   *     this.userId = userId;
   *     this.appName = appName;
   *     this.currentPage = 0;
   *     this.pageSize = 20;
   *     this.messages = [];
   *     this.totalCount = 0;
   *   }
   *
   *   async loadMessages(refresh = false) {
   *     try {
   *       if (refresh) {
   *         this.currentPage = 0;
   *         this.messages = [];
   *       }
   *
   *       console.log(`메시지 목록 로드 중... (페이지: ${this.currentPage})`);
   *
   *       const result = await bizMOB.Push.getMessageList({
   *         _sAppName: this.appName,
   *         _sUserId: this.userId,
   *         _nPageIndex: this.currentPage,
   *         _nItemCount: this.pageSize,
   *         _bProgressEnable: this.currentPage === 0
   *       });
   *
   *       if (result.result) {
   *         const newMessages = result.data.list;
   *         this.totalCount = result.data.totalCount;
   *
   *         if (refresh) {
   *           this.messages = newMessages;
   *         } else {
   *           this.messages = [...this.messages, ...newMessages];
   *         }
   *
   *         // UI 업데이트
   *         this.updateInboxUI();
   *
   *         // 읽지 않은 메시지 수 업데이트
   *         const unreadCount = this.messages.filter(msg => !msg.isRead).length;
   *         await this.updateBadgeCount(unreadCount);
   *
   *         console.log(`메시지 로드 완료: ${this.messages.length}/${this.totalCount}`);
   *
   *         return {
   *           success: true,
   *           messages: this.messages,
   *           hasMore: result.data.hasMore
   *         };
   *       } else {
   *         throw new Error(`메시지 로드 실패: ${result.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('메시지 로드 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   async loadMoreMessages() {
   *     if (this.messages.length >= this.totalCount) {
   *       console.log('더 이상 로드할 메시지가 없습니다');
   *       return { success: true, hasMore: false };
   *     }
   *
   *     this.currentPage++;
   *     return await this.loadMessages(false);
   *   }
   *
   *   async markAsRead(messageId) {
   *     try {
   *       const message = this.messages.find(msg => msg.messageId === messageId);
   *       if (!message) {
   *         throw new Error('메시지를 찾을 수 없습니다');
   *       }
   *
   *       if (!message.isRead) {
   *         // 서버에 읽음 처리 요청
   *         await bizMOB.Push.readMessage({
   *           _sTrxDay: message.trxDay,
   *           _sTrxId: message.trxId,
   *           _sUserId: this.userId,
   *           _bProgressEnable: false
   *         });
   *
   *         // 로컬 상태 업데이트
   *         message.isRead = true;
   *         this.updateInboxUI();
   *
   *         // 배지 카운트 업데이트
   *         const unreadCount = this.messages.filter(msg => !msg.isRead).length;
   *         await this.updateBadgeCount(unreadCount);
   *       }
   *     } catch (error) {
   *       console.error('메시지 읽음 처리 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @example
   * // 메시지 검색 및 필터링 시스템
   * class MessageSearchManager {
   *   static async searchMessages(userId, appName, searchOptions = {}) {
   *     try {
   *       const {
   *         keyword = '',
   *         category = '',
   *         dateFrom = '',
   *         dateTo = '',
   *         readStatus = 'all', // 'all', 'read', 'unread'
   *         pageSize = 50
   *       } = searchOptions;
   *
   *       console.log('메시지 검색 시작:', { keyword, category, readStatus });
   *
   *       let allMessages = [];
   *       let currentPage = 0;
   *       let hasMore = true;
   *
   *       // 전체 메시지를 페이지별로 로드하여 검색
   *       while (hasMore && allMessages.length < 1000) { // 최대 1000개 제한
   *         const result = await bizMOB.Push.getMessageList({
   *           _sAppName: appName,
   *           _sUserId: userId,
   *           _nPageIndex: currentPage,
   *           _nItemCount: pageSize,
   *           _bProgressEnable: currentPage === 0
   *         });
   *
   *         if (result.result) {
   *           const messages = result.data.list;
   *           allMessages = [...allMessages, ...messages];
   *           hasMore = result.data.hasMore;
   *           currentPage++;
   *         } else {
   *           throw new Error(`메시지 검색 실패: ${result.resultMessage}`);
   *         }
   *       }
   *
   *       // 검색 조건에 따라 필터링
   *       let filteredMessages = allMessages.filter(message => {
   *         // 키워드 검색
   *         if (keyword && !message.title.includes(keyword) && !message.content.includes(keyword)) {
   *           return false;
   *         }
   *
   *         // 카테고리 필터
   *         if (category && message.category !== category) {
   *           return false;
   *         }
   *
   *         // 읽음 상태 필터
   *         if (readStatus === 'read' && !message.isRead) {
   *           return false;
   *         }
   *         if (readStatus === 'unread' && message.isRead) {
   *           return false;
   *         }
   *
   *         // 날짜 범위 필터
   *         if (dateFrom && message.sentDate < dateFrom) {
   *           return false;
   *         }
   *         if (dateTo && message.sentDate > dateTo) {
   *           return false;
   *         }
   *
   *         return true;
   *       });
   *
   *       // 최신순 정렬
   *       filteredMessages.sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));
   *
   *       console.log(`검색 완료: ${filteredMessages.length}개 메시지 발견`);
   *
   *       return {
   *         success: true,
   *         messages: filteredMessages,
   *         totalCount: filteredMessages.length,
   *         searchOptions: searchOptions
   *       };
   *     } catch (error) {
   *       console.error('메시지 검색 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static getMessageList(arg: {
    _sUserId: string, // 푸시 메세지를 가져올 사용자 이이디
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
   * 현재 디바이스의 고유한 푸시 토큰(키)을 조회합니다. 이 키는 푸시 메시지를
   * 특정 디바이스로 전송하기 위해 필요한 고유 식별자입니다.
   *
   * @description
   * - 앱: FCM(Android), APNs(iOS) 토큰 조회
   * - 웹: 브라우저 푸시 등록 토큰 조회
   *
   * @purpose 푸시 서버 등록, 디바이스 식별, 푸시 메시지 타겟팅
   *
   * @param {Object} [arg] - 푸시키 조회 설정 객체 (선택사항)
   * @param {boolean} [arg._bProgressEnable=true] - 서버 통신 중 진행률 표시 여부
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 푸시키 조회 결과를 담은 Promise
   * @returns {boolean} return.result - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 푸시키 또는 오류 메시지
   * @returns {Object} return.data - 푸시키 상세 정보 (성공 시)
   * @returns {string} return.data.pushKey - 디바이스 푸시 토큰
   * @returns {string} return.data.platform - 플랫폼 타입 ('ios', 'android', 'web')
   * @returns {string} return.data.generatedAt - 토큰 생성 시간
   * @returns {boolean} return.data.isValid - 토큰 유효성 상태
   *
   * @caution
   * - 앱이 푸시 알림 권한을 허용해야 합니다
   * - 네트워크 연결이 필요할 수 있습니다
   * - 토큰은 앱 재설치 시 변경될 수 있습니다
   * - iOS에서는 개발/배포 환경에 따라 다른 토큰이 생성됩니다
   *
   * @example
   * // 현재 디바이스의 푸시키 조회
   * const pushKeyResult = await bizMOB.Push.getPushKey({
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
   *
   * @example
   * // 앱 초기화 시 푸시키 등록 시스템
   * class PushKeyManager {
   *   static async initializePushKey(userId, appName) {
   *     try {
   *       console.log('푸시키 초기화 시작');
   *
   *       // 현재 푸시키 조회
   *       const pushKeyResult = await bizMOB.Push.getPushKey({
   *         _bProgressEnable: false
   *       });
   *
   *       if (pushKeyResult.result) {
   *         const currentPushKey = pushKeyResult.resultMessage;
   *
   *         // 로컬 저장소에서 이전 푸시키 확인
   *         const storedPushKey = await bizMOB.Storage.get({
   *           _sKey: 'push.lastPushKey'
   *         });
   *
   *         // 푸시키가 변경되었거나 처음 실행인 경우
   *         if (storedPushKey !== currentPushKey) {
   *           console.log('푸시키가 변경되었습니다. 서버 등록 진행...');
   *
   *           // 서버에 새 푸시키 등록
   *           const registerResult = await bizMOB.Push.registerToServer({
   *             _sServerType: 'bizpush',
   *             _sUserId: userId,
   *             _sAppName: appName,
   *             _bProgressEnable: true
   *           });
   *
   *           if (registerResult.result) {
   *             // 성공 시 로컬에 푸시키 저장
   *             await bizMOB.Storage.set({
   *               _sKey: 'push.lastPushKey',
   *               _vValue: currentPushKey
   *             });
   *
   *             // 등록 시간 저장
   *             await bizMOB.Storage.set({
   *               _sKey: 'push.lastRegistered',
   *               _vValue: new Date().toISOString()
   *             });
   *
   *             console.log('푸시키 등록 완료');
   *           } else {
   *             throw new Error(`푸시키 등록 실패: ${registerResult.resultMessage}`);
   *           }
   *         } else {
   *           console.log('기존 푸시키 사용 중');
   *         }
   *
   *         // 푸시키 정보 반환
   *         return {
   *           success: true,
   *           pushKey: currentPushKey,
   *           platform: pushKeyResult.data?.platform,
   *           isNewKey: storedPushKey !== currentPushKey
   *         };
   *       } else {
   *         throw new Error(`푸시키 조회 실패: ${pushKeyResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('푸시키 초기화 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async refreshPushKey(userId, appName) {
   *     try {
   *       console.log('푸시키 갱신 시작');
   *
   *       // 푸시 설정 리셋
   *       await bizMOB.Push.reset();
   *
   *       // 새 푸시키 조회
   *       const pushKeyResult = await bizMOB.Push.getPushKey({
   *         _bProgressEnable: true
   *       });
   *
   *       if (pushKeyResult.result) {
   *         const newPushKey = pushKeyResult.resultMessage;
   *
   *         // 서버에 새 푸시키 등록
   *         const registerResult = await bizMOB.Push.registerToServer({
   *           _sServerType: 'bizpush',
   *           _sUserId: userId,
   *           _sAppName: appName,
   *           _bProgressEnable: true
   *         });
   *
   *         if (registerResult.result) {
   *           // 로컬 저장소 업데이트
   *           await bizMOB.Storage.set({
   *             _sKey: 'push.lastPushKey',
   *             _vValue: newPushKey
   *           });
   *
   *           console.log('푸시키 갱신 완료');
   *           return { success: true, pushKey: newPushKey };
   *         } else {
   *           throw new Error(`푸시키 등록 실패: ${registerResult.resultMessage}`);
   *         }
   *       } else {
   *         throw new Error(`푸시키 조회 실패: ${pushKeyResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('푸시키 갱신 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @example
   * // 푸시키 상태 모니터링 시스템
   * class PushKeyMonitor {
   *   static async validatePushKey(userId, appName) {
   *     try {
   *       console.log('푸시키 유효성 검사 시작');
   *
   *       // 현재 푸시키 조회
   *       const pushKeyResult = await bizMOB.Push.getPushKey({
   *         _bProgressEnable: false
   *       });
   *
   *       if (pushKeyResult.result) {
   *         const currentPushKey = pushKeyResult.resultMessage;
   *
   *         // 서버에서 등록 상태 확인 (실제로는 별도 API 필요)
   *         const validationResult = await this.checkPushKeyOnServer(currentPushKey, userId, appName);
   *
   *         if (validationResult.isValid) {
   *           console.log('푸시키가 유효합니다');
   *           return {
   *             isValid: true,
   *             pushKey: currentPushKey,
   *             lastValidated: new Date().toISOString()
   *           };
   *         } else {
   *           console.warn('푸시키가 무효합니다. 재등록 필요');
   *
   *           // 자동 재등록 시도
   *           const reRegisterResult = await bizMOB.Push.registerToServer({
   *             _sServerType: 'bizpush',
   *             _sUserId: userId,
   *             _sAppName: appName,
   *             _bProgressEnable: false
   *           });
   *
   *           if (reRegisterResult.result) {
   *             console.log('푸시키 재등록 완료');
   *             return {
   *               isValid: true,
   *               pushKey: currentPushKey,
   *               reRegistered: true
   *             };
   *           } else {
   *             throw new Error('푸시키 재등록 실패');
   *           }
   *         }
   *       } else {
   *         throw new Error(`푸시키 조회 실패: ${pushKeyResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('푸시키 유효성 검사 실패:', error);
   *       return {
   *         isValid: false,
   *         error: error.message
   *       };
   *     }
   *   }
   *
   *   static async checkPushKeyOnServer(pushKey, userId, appName) {
   *     // 실제 구현에서는 서버 API 호출
   *     // 여기서는 예시로 간단한 검증 로직 사용
   *     try {
   *       // 예: 푸시 테스트 메시지 발송으로 유효성 확인
   *       const testResult = await bizMOB.Push.sendMessage({
   *         _sAppName: appName,
   *         _aUsers: [userId],
   *         _sFromUser: 'system',
   *         _sSubject: 'Push Key Validation',
   *         _sContent: 'This is a validation test message',
   *         _sTrxType: 'INSTANT',
   *         _sCategory: 'system',
   *         _bProgressEnable: false
   *       });
   *
   *       return { isValid: testResult.result };
   *     } catch (error) {
   *       return { isValid: false, error: error.message };
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 안읽은 푸시 개수 조회
   *
   * 현재 사용자가 읽지 않은 푸시 메시지의 개수를 조회합니다. 앱 아이콘 뱃지나
   * 알림 표시기 구현에 사용됩니다.
   *
   * @description
   * - 서버에서 안읽은 메시지 개수 실시간 조회
   * - 앱 뱃지 카운트, 알림 카운터 업데이트용
   * - 메시지 읽음 처리 후 개수 변경 확인 가능
   *
   * @purpose 뱃지 카운트 표시, 알림 상태 관리, UI 업데이트
   *
   * @param {Object} arg - 안읽은 개수 조회 설정 객체
   * @param {string} arg._sUserId - 사용자 ID (메시지 수신 대상자)
   * @param {string} arg._sAppName - 앱 이름 (등록된 앱 식별자)
   * @param {boolean} [arg._bProgressEnable=true] - 서버 통신 중 진행률 표시 여부
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 안읽은 개수 조회 결과를 담은 Promise
   * @returns {boolean} return.result - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 안읽은 개수 또는 오류 메시지
   * @returns {Object} return.data - 상세 개수 정보 (성공 시)
   * @returns {number} return.data.unreadCount - 총 안읽은 메시지 개수
   * @returns {number} return.data.totalCount - 전체 메시지 개수
   * @returns {string} return.data.lastUpdateTime - 마지막 업데이트 시간
   * @returns {Object} return.data.countByCategory - 카테고리별 안읽은 개수
   * @returns {Object} return.data.countByPriority - 우선순위별 안읽은 개수
   *
   * @caution
   * - 앱이 푸시 서버에 등록되어 있어야 합니다
   * - 네트워크 연결이 필요합니다
   * - 사용자 ID가 서버에 등록되어 있어야 합니다
   * - 서버 부하를 고려하여 적절한 간격으로 호출해야 합니다
   *
   * @example
   * // 기본 안읽은 개수 조회
   * const unreadResult = await bizMOB.Push.getUnreadCount({
   *   _sUserId: 'user123',
   *   _sAppName: 'MyApp',
   *   _bProgressEnable: false
   * });
   *
   * if (unreadResult.result) {
   *   const unreadCount = parseInt(unreadResult.resultMessage);
   *   console.log('안읽은 메시지 개수:', unreadCount);
   *
   *   // 앱 뱃지 업데이트
   *   await bizMOB.Push.setBadgeCount({
   *     _iCount: unreadCount
   *   });
   * } else {
   *   console.error('안읽은 개수 조회 실패:', unreadResult.resultCode);
   * }
   *
   * @example
   * // 실시간 뱃지 카운트 관리 시스템
   * class BadgeCountManager {
   *   static countUpdateInterval = null;
   *   static lastUnreadCount = 0;
   *
   *   static async startBadgeMonitoring(userId, appName, intervalMs = 30000) {
   *     try {
   *       console.log('뱃지 카운트 모니터링 시작');
   *
   *       // 초기 개수 조회
   *       await this.updateBadgeCount(userId, appName);
   *
   *       // 주기적 업데이트 시작
   *       this.countUpdateInterval = setInterval(async () => {
   *         try {
   *           await this.updateBadgeCount(userId, appName);
   *         } catch (error) {
   *           console.error('뱃지 카운트 업데이트 실패:', error);
   *         }
   *       }, intervalMs);
   *
   *       console.log(`뱃지 모니터링 시작됨 (${intervalMs}ms 간격)`);
   *     } catch (error) {
   *       console.error('뱃지 모니터링 시작 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async updateBadgeCount(userId, appName) {
   *     try {
   *       // 안읽은 개수 조회
   *       const unreadResult = await bizMOB.Push.getUnreadCount({
   *         _sUserId: userId,
   *         _sAppName: appName,
   *         _bProgressEnable: false
   *       });
   *
   *       if (unreadResult.result) {
   *         const currentUnreadCount = parseInt(unreadResult.resultMessage);
   *
   *         // 개수가 변경된 경우에만 업데이트
   *         if (currentUnreadCount !== this.lastUnreadCount) {
   *           console.log(`뱃지 카운트 변경: ${this.lastUnreadCount} → ${currentUnreadCount}`);
   *
   *           // 앱 뱃지 업데이트
   *           await bizMOB.Push.setBadgeCount({
   *             _iCount: currentUnreadCount
   *           });
   *
   *           // 상세 정보가 있는 경우 카테고리별 처리
   *           if (unreadResult.data?.countByCategory) {
   *             await this.handleCategoryCountUpdate(unreadResult.data.countByCategory);
   *           }
   *
   *           this.lastUnreadCount = currentUnreadCount;
   *
   *           // 커스텀 이벤트 발생 (UI 업데이트용)
   *           await bizMOB.Event.trigger({
   *             _sEventName: 'badge.count.changed',
   *             _vEventData: {
   *               unreadCount: currentUnreadCount,
   *               totalCount: unreadResult.data?.totalCount,
   *               lastUpdateTime: new Date().toISOString()
   *             }
   *           });
   *         }
   *
   *         return currentUnreadCount;
   *       } else {
   *         throw new Error(`안읽은 개수 조회 실패: ${unreadResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('뱃지 카운트 업데이트 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async handleCategoryCountUpdate(countByCategory) {
   *     try {
   *       // 카테고리별 개수 로컬 저장
   *       await bizMOB.Storage.set({
   *         _sKey: 'push.countByCategory',
   *         _vValue: JSON.stringify(countByCategory)
   *       });
   *
   *       // 중요한 카테고리 알림 처리
   *       if (countByCategory.urgent > 0) {
   *         console.log(`긴급 메시지 ${countByCategory.urgent}개 대기 중`);
   *
   *         // 긴급 메시지 알림음 설정
   *         await bizMOB.Push.setAlarm({
   *           _bEnable: true,
   *           _bVibration: true,
   *           _sSound: 'urgent_notification.mp3'
   *         });
   *       }
   *
   *       console.log('카테고리별 개수 업데이트 완료:', countByCategory);
   *     } catch (error) {
   *       console.error('카테고리별 개수 처리 실패:', error);
   *     }
   *   }
   *
   *   static stopBadgeMonitoring() {
   *     if (this.countUpdateInterval) {
   *       clearInterval(this.countUpdateInterval);
   *       this.countUpdateInterval = null;
   *       console.log('뱃지 카운트 모니터링 중지');
   *     }
   *   }
   * }
   *
   * @example
   * // 메시지 읽음 처리 후 카운트 업데이트 시스템
   * class MessageReadHandler {
   *   static async markMessageAsReadAndUpdateCount(userId, appName, messageId, trxDay) {
   *     try {
   *       console.log('메시지 읽음 처리 시작:', messageId);
   *
   *       // 읽음 처리 전 현재 개수 확인
   *       const beforeResult = await bizMOB.Push.getUnreadCount({
   *         _sUserId: userId,
   *         _sAppName: appName,
   *         _bProgressEnable: false
   *       });
   *
   *       const beforeCount = beforeResult.result ? parseInt(beforeResult.resultMessage) : 0;
   *
   *       // 메시지 읽음 처리
   *       const readResult = await bizMOB.Push.readMessage({
   *         _sTrxDay: trxDay,
   *         _sTrxId: messageId,
   *         _sUserId: userId,
   *         _sAppName: appName,
   *         _bProgressEnable: false
   *       });
   *
   *       if (readResult.result) {
   *         console.log('메시지 읽음 처리 완료:', messageId);
   *
   *         // 읽음 처리 후 개수 재조회
   *         const afterResult = await bizMOB.Push.getUnreadCount({
   *           _sUserId: userId,
   *           _sAppName: appName,
   *           _bProgressEnable: false
   *         });
   *
   *         if (afterResult.result) {
   *           const afterCount = parseInt(afterResult.resultMessage);
   *
   *           console.log(`안읽은 개수 변경: ${beforeCount} → ${afterCount}`);
   *
   *           // 뱃지 카운트 업데이트
   *           await bizMOB.Push.setBadgeCount({
   *             _iCount: afterCount
   *           });
   *
   *           return {
   *             success: true,
   *             beforeCount,
   *             afterCount,
   *             messageId
   *           };
   *         }
   *       } else {
   *         throw new Error(`메시지 읽음 처리 실패: ${readResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('메시지 읽음 처리 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 푸시 메시지 읽음 처리
   *
   * 특정 푸시 메시지를 읽음 상태로 변경하여 안읽은 메시지 개수를 감소시키고,
   * 뱃지 카운트 및 알림 상태를 업데이트합니다.
   *
   * @description
   * - 개별 메시지 읽음 상태 변경
   * - 안읽은 메시지 카운트 자동 감소
   * - 뱃지 및 알림 상태 실시간 업데이트
   * - 읽음 시간 및 이력 관리
   *
   * @purpose 메시지 상태 관리, 알림 카운트 업데이트, 사용자 상호작용 추적
   *
   * @param {Object} arg - 메시지 읽음 처리 설정 객체
   * @param {string} arg._sTrxDay - 푸시 메시지 송신 날짜 (yyyymmdd 형식)
   * @param {string} arg._sTrxId - 읽음 처리할 푸시 메시지 고유 ID
   * @param {string} arg._sUserId - 메시지를 읽는 사용자 ID
   * @param {boolean} [arg._bProgressEnable=true] - 서버 통신 중 진행률 표시 여부
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 읽음 처리 결과를 담은 Promise
   * @returns {boolean} return.result - 읽음 처리 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 처리 결과 메시지
   * @returns {Object} return.data - 읽음 처리 상세 정보 (성공 시)
   * @returns {string} return.data.messageId - 처리된 메시지 ID
   * @returns {string} return.data.readTime - 읽음 처리 시간 (ISO 8601)
   * @returns {number} return.data.newUnreadCount - 처리 후 안읽은 메시지 개수
   * @returns {boolean} return.data.badgeUpdated - 뱃지 카운트 업데이트 여부
   *
   * @caution
   * - 메시지 ID와 송신 날짜가 정확해야 합니다
   * - 이미 읽은 메시지를 다시 읽음 처리해도 오류가 발생하지 않습니다
   * - 네트워크 연결이 필요합니다
   * - 사용자 권한이 있는 메시지만 읽음 처리 가능합니다
   *
   * @example
   * // 기본 메시지 읽음 처리
   * const readResult = await bizMOB.Push.readMessage({
   *   _sTrxDay: '20240315',
   *   _sTrxId: 'MSG_20240315_001',
   *   _sUserId: 'user123',
   *   _bProgressEnable: false
   * });
   *
   * if (readResult.result) {
   *   console.log('메시지 읽음 처리 완료');
   *
   *   // 읽음 처리 후 뱃지 카운트 업데이트
   *   const newCount = readResult.data?.newUnreadCount;
   *   if (typeof newCount === 'number') {
   *     await bizMOB.Push.setBadgeCount({
   *       _iCount: newCount
   *     });
   *   }
   * } else {
   *   console.error('읽음 처리 실패:', readResult.resultCode);
   * }
   *
   * @example
   * // 메시지 목록에서 선택된 메시지들 일괄 읽음 처리
   * class MessageBatchReader {
   *   static async markSelectedMessagesAsRead(selectedMessages, userId) {
   *     try {
   *       console.log(`${selectedMessages.length}개 메시지 일괄 읽음 처리 시작`);
   *
   *       const results = [];
   *       let successCount = 0;
   *       let failureCount = 0;
   *
   *       // 선택된 메시지들을 순차적으로 읽음 처리
   *       for (const message of selectedMessages) {
   *         try {
   *           const readResult = await bizMOB.Push.readMessage({
   *             _sTrxDay: message.trxDay,
   *             _sTrxId: message.messageId,
   *             _sUserId: userId,
   *             _bProgressEnable: false
   *           });
   *
   *           if (readResult.result) {
   *             successCount++;
   *             results.push({
   *               messageId: message.messageId,
   *               status: 'success',
   *               readTime: readResult.data?.readTime
   *             });
   *           } else {
   *             failureCount++;
   *             results.push({
   *               messageId: message.messageId,
   *               status: 'failed',
   *               error: readResult.resultMessage
   *             });
   *           }
   *         } catch (error) {
   *           failureCount++;
   *           results.push({
   *             messageId: message.messageId,
   *             status: 'error',
   *             error: error.message
   *           });
   *         }
   *       }
   *
   *       console.log(`일괄 읽음 처리 완료: 성공 ${successCount}개, 실패 ${failureCount}개`);
   *
   *       // 최종 안읽은 개수 조회 및 뱃지 업데이트
   *       if (successCount > 0) {
   *         const unreadResult = await bizMOB.Push.getUnreadCount({
   *           _sUserId: userId,
   *           _sAppName: 'MyApp',
   *           _bProgressEnable: false
   *         });
   *
   *         if (unreadResult.result) {
   *           const finalUnreadCount = parseInt(unreadResult.resultMessage);
   *
   *           await bizMOB.Push.setBadgeCount({
   *             _iCount: finalUnreadCount
   *           });
   *
   *           console.log('최종 안읽은 개수:', finalUnreadCount);
   *         }
   *       }
   *
   *       return {
   *         totalProcessed: selectedMessages.length,
   *         successCount,
   *         failureCount,
   *         results
   *       };
   *     } catch (error) {
   *       console.error('일괄 읽음 처리 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @example
   * // 스마트 읽음 처리 시스템 (자동 뱃지 업데이트 포함)
   * class SmartMessageReader {
   *   static async readMessageWithAutoUpdate(messageData, userId, appName) {
   *     try {
   *       console.log('스마트 읽음 처리 시작:', messageData.messageId);
   *
   *       // 읽음 처리 전 현재 상태 확인
   *       const beforeUnreadResult = await bizMOB.Push.getUnreadCount({
   *         _sUserId: userId,
   *         _sAppName: appName,
   *         _bProgressEnable: false
   *       });
   *
   *       const beforeCount = beforeUnreadResult.result ? parseInt(beforeUnreadResult.resultMessage) : 0;
   *
   *       // 메시지 읽음 처리
   *       const readResult = await bizMOB.Push.readMessage({
   *         _sTrxDay: messageData.trxDay,
   *         _sTrxId: messageData.messageId,
   *         _sUserId: userId,
   *         _bProgressEnable: false
   *       });
   *
   *       if (readResult.result) {
   *         console.log('메시지 읽음 처리 성공');
   *
   *         // 읽음 처리 후 안읽은 개수 재조회
   *         const afterUnreadResult = await bizMOB.Push.getUnreadCount({
   *           _sUserId: userId,
   *           _sAppName: appName,
   *           _bProgressEnable: false
   *         });
   *
   *         if (afterUnreadResult.result) {
   *           const afterCount = parseInt(afterUnreadResult.resultMessage);
   *
   *           // 뱃지 카운트 업데이트
   *           await bizMOB.Push.setBadgeCount({
   *             _iCount: afterCount
   *           });
   *
   *           // 읽음 처리 결과 로깅
   *           console.log(`읽음 처리 완료: ${beforeCount} → ${afterCount} (${beforeCount - afterCount}개 감소)`);
   *
   *           // 로컬 저장소에 읽음 이력 저장
   *           const readHistory = await bizMOB.Storage.get({
   *             _sKey: 'push.readHistory'
   *           });
   *
   *           const historyList = readHistory ? JSON.parse(readHistory) : [];
   *           historyList.push({
   *             messageId: messageData.messageId,
   *             readTime: new Date().toISOString(),
   *             beforeCount,
   *             afterCount
   *           });
   *
   *           // 최근 100개만 유지
   *           if (historyList.length > 100) {
   *             historyList.splice(0, historyList.length - 100);
   *           }
   *
   *           await bizMOB.Storage.set({
   *             _sKey: 'push.readHistory',
   *             _vValue: JSON.stringify(historyList)
   *           });
   *
   *           // 커스텀 이벤트 발생
   *           await bizMOB.Event.trigger({
   *             _sEventName: 'message.read.completed',
   *             _vEventData: {
   *               messageId: messageData.messageId,
   *               beforeCount,
   *               afterCount,
   *               readTime: new Date().toISOString()
   *             }
   *           });
   *
   *           return {
   *             success: true,
   *             messageId: messageData.messageId,
   *             beforeCount,
   *             afterCount,
   *             decreasedCount: beforeCount - afterCount
   *           };
   *         }
   *       } else {
   *         throw new Error(`읽음 처리 실패: ${readResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('스마트 읽음 처리 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async getReadStatistics(userId) {
   *     try {
   *       // 읽음 이력 조회
   *       const readHistory = await bizMOB.Storage.get({
   *         _sKey: 'push.readHistory'
   *       });
   *
   *       if (!readHistory) {
   *         return { totalRead: 0, todayRead: 0, weeklyRead: 0 };
   *       }
   *
   *       const historyList = JSON.parse(readHistory);
   *       const today = new Date().toISOString().split('T')[0];
   *       const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
   *
   *       const todayRead = historyList.filter(h => h.readTime.startsWith(today)).length;
   *       const weeklyRead = historyList.filter(h => h.readTime >= weekAgo).length;
   *
   *       return {
   *         totalRead: historyList.length,
   *         todayRead,
   *         weeklyRead,
   *         recentHistory: historyList.slice(-10).reverse()
   *       };
   *     } catch (error) {
   *       console.error('읽음 통계 조회 실패:', error);
   *       return { totalRead: 0, todayRead: 0, weeklyRead: 0 };
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 수신 메시지 상세 정보 조회
   *
   * 수신받은 푸시 메시지의 상세 내용과 메타데이터를 조회합니다.
   * 메시지 내용, 발신자 정보, 첨부 파일 등의 상세 정보를 확인할 수 있습니다.
   *
   * @description
   * - 푸시 메시지 전체 내용 상세 조회
   * - 첨부 파일 및 미디어 정보 확인
   * - 발신자 정보 및 메시지 메타데이터 조회
   * - 메시지 읽음 상태 자동 업데이트
   *
   * @purpose 메시지 상세 보기, 첨부 파일 다운로드, 메시지 분석
   *
   * @param {Object} arg - 메시지 상세 조회 설정 객체
   * @param {string} arg._sUserId - 메시지를 수신한 사용자 ID
   * @param {string} arg._sMessageId - 상세 조회할 메시지 고유 ID
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 메시지 상세 정보를 담은 Promise
   * @returns {boolean} return.result - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return.resultCode - 결과 코드 ('0000': 성공, 'PUSH_XXX': 오류 코드)
   * @returns {string} return.resultMessage - 조회 결과 메시지
   * @returns {Object} return.data - 메시지 상세 정보 (성공 시)
   * @returns {string} return.data.messageId - 메시지 고유 ID
   * @returns {string} return.data.subject - 메시지 제목
   * @returns {string} return.data.content - 메시지 내용 (HTML/텍스트)
   * @returns {string} return.data.fromUser - 발신자 ID
   * @returns {string} return.data.fromUserName - 발신자 이름
   * @returns {string} return.data.sendTime - 발신 시간 (ISO 8601)
   * @returns {string} return.data.receiveTime - 수신 시간 (ISO 8601)
   * @returns {string} return.data.readTime - 읽음 시간 (읽지 않은 경우 null)
   * @returns {string} return.data.category - 메시지 카테고리
   * @returns {string} return.data.priority - 우선순위 ('high', 'normal', 'low')
   * @returns {Array} return.data.attachments - 첨부 파일 목록
   * @returns {Object} return.data.customData - 커스텀 데이터 (JSON)
   * @returns {boolean} return.data.isRead - 읽음 상태
   * @returns {Object} return.data.pushInfo - 푸시 알림 정보
   *
   * @caution
   * - 메시지 ID가 정확해야 합니다
   * - 사용자 권한이 있는 메시지만 조회 가능합니다
   * - 첨부 파일은 별도 다운로드 API 필요
   * - 메시지 조회 시 자동으로 읽음 처리될 수 있습니다
   *
   * @example
   * // 기본 메시지 상세 조회
   * const messageDetail = await bizMOB.Push.readReceiptMessage({
   *   _sUserId: 'user123',
   *   _sMessageId: 'MSG_20240315_001'
   * });
   *
   * if (messageDetail.result) {
   *   const message = messageDetail.data;
   *   console.log('메시지 제목:', message.subject);
   *   console.log('발신자:', message.fromUserName);
   *   console.log('내용:', message.content);
   *
   *   // 첨부 파일이 있는 경우 처리
   *   if (message.attachments && message.attachments.length > 0) {
   *     console.log('첨부 파일:', message.attachments.length + '개');
   *     for (const attachment of message.attachments) {
   *       console.log('- ' + attachment.fileName + ' (' + attachment.fileSize + ')');
   *     }
   *   }
   * } else {
   *   console.error('메시지 조회 실패:', messageDetail.resultCode);
   * }
   *
   * @example
   * // 메시지 상세 뷰어 시스템
   * class MessageDetailViewer {
   *   static async showMessageDetail(userId, messageId, containerElement) {
   *     try {
   *       console.log('메시지 상세 정보 로드 시작:', messageId);
   *
   *       // 메시지 상세 정보 조회
   *       const detailResult = await bizMOB.Push.readReceiptMessage({
   *         _sUserId: userId,
   *         _sMessageId: messageId
   *       });
   *
   *       if (detailResult.result) {
   *         const message = detailResult.data;
   *
   *         // HTML 구성
   *         const html = this.generateMessageHTML(message);
   *         containerElement.innerHTML = html;
   *
   *         // 첨부 파일 처리
   *         await this.setupAttachmentHandlers(message.attachments, containerElement);
   *
   *         // 커스텀 데이터 처리
   *         if (message.customData) {
   *           await this.handleCustomData(message.customData, containerElement);
   *         }
   *
   *         // 메시지 읽음 처리 (필요한 경우)
   *         if (!message.isRead) {
   *           await this.markAsRead(userId, messageId, message.sendTime);
   *         }
   *
   *         console.log('메시지 상세 화면 표시 완료');
   *         return { success: true, message };
   *       } else {
   *         throw new Error(`메시지 조회 실패: ${detailResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('메시지 상세 로드 실패:', error);
   *       containerElement.innerHTML = '<div class="error">메시지를 불러올 수 없습니다.</div>';
   *       throw error;
   *     }
   *   }
   *
   *   static generateMessageHTML(message) {
   *     const priorityClass = message.priority === 'high' ? 'priority-high' :
   *                          message.priority === 'low' ? 'priority-low' : 'priority-normal';
   *
   *     return `
   *       <div class="message-detail ${priorityClass}">
   *         <div class="message-header">
   *           <h3 class="message-subject">${this.escapeHtml(message.subject)}</h3>
   *           <div class="message-meta">
   *             <span class="sender">${this.escapeHtml(message.fromUserName)}</span>
   *             <span class="send-time">${this.formatDateTime(message.sendTime)}</span>
   *             <span class="category">${message.category}</span>
   *           </div>
   *         </div>
   *         <div class="message-content">
   *           ${message.content}
   *         </div>
   *         <div class="message-attachments" id="attachments-container">
   *           <!-- 첨부파일이 여기에 동적으로 추가됩니다 -->
   *         </div>
   *         <div class="message-actions">
   *           <button onclick="MessageDetailViewer.replyMessage('${message.messageId}')">답장</button>
   *           <button onclick="MessageDetailViewer.forwardMessage('${message.messageId}')">전달</button>
   *           <button onclick="MessageDetailViewer.deleteMessage('${message.messageId}')">삭제</button>
   *         </div>
   *       </div>
   *     `;
   *   }
   *
   *   static async setupAttachmentHandlers(attachments, containerElement) {
   *     if (!attachments || attachments.length === 0) return;
   *
   *     const attachmentsContainer = containerElement.querySelector('#attachments-container');
   *
   *     for (const attachment of attachments) {
   *       const attachmentElement = document.createElement('div');
   *       attachmentElement.className = 'attachment-item';
   *       attachmentElement.innerHTML = `
   *         <span class="attachment-icon">${this.getFileIcon(attachment.fileType)}</span>
   *         <span class="attachment-name">${attachment.fileName}</span>
   *         <span class="attachment-size">${this.formatFileSize(attachment.fileSize)}</span>
   *         <button class="download-btn" data-file-id="${attachment.fileId}">다운로드</button>
   *       `;
   *
   *       // 다운로드 버튼 이벤트 핸들러
   *       const downloadBtn = attachmentElement.querySelector('.download-btn');
   *       downloadBtn.addEventListener('click', async () => {
   *         await this.downloadAttachment(attachment);
   *       });
   *
   *       attachmentsContainer.appendChild(attachmentElement);
   *     }
   *   }
   *
   *   static async downloadAttachment(attachment) {
   *     try {
   *       console.log('첨부파일 다운로드 시작:', attachment.fileName);
   *
   *       // 파일 다운로드 (File API 사용)
   *       const downloadResult = await bizMOB.File.download({
   *         _sUrl: attachment.downloadUrl,
   *         _sFileName: attachment.fileName,
   *         _sTargetDir: 'downloads',
   *         _bProgressEnable: true
   *       });
   *
   *       if (downloadResult.result) {
   *         console.log('다운로드 완료:', downloadResult.data.filePath);
   *         alert('파일이 다운로드되었습니다.');
   *       } else {
   *         throw new Error(downloadResult.resultMessage);
   *       }
   *     } catch (error) {
   *       console.error('첨부파일 다운로드 실패:', error);
   *       alert('파일 다운로드에 실패했습니다.');
   *     }
   *   }
   *
   *   static escapeHtml(text) {
   *     const div = document.createElement('div');
   *     div.textContent = text;
   *     return div.innerHTML;
   *   }
   *
   *   static formatDateTime(isoString) {
   *     return new Date(isoString).toLocaleString('ko-KR');
   *   }
   *
   *   static getFileIcon(fileType) {
   *     const icons = {
   *       'image': '🖼️',
   *       'video': '🎥',
   *       'audio': '🎵',
   *       'pdf': '📄',
   *       'document': '📝',
   *       'archive': '📦'
   *     };
   *     return icons[fileType] || '📎';
   *   }
   *
   *   static formatFileSize(bytes) {
   *     if (bytes === 0) return '0 Bytes';
   *     const k = 1024;
   *     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
   *     const i = Math.floor(Math.log(bytes) / Math.log(k));
   *     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
   *   }
   * }
   *
   * @example
   * // 메시지 분석 및 통계 시스템
   * class MessageAnalyzer {
   *   static async analyzeMessage(userId, messageId) {
   *     try {
   *       // 메시지 상세 정보 조회
   *       const detailResult = await bizMOB.Push.readReceiptMessage({
   *         _sUserId: userId,
   *         _sMessageId: messageId
   *       });
   *
   *       if (detailResult.result) {
   *         const message = detailResult.data;
   *
   *         // 메시지 분석 데이터 생성
   *         const analysis = {
   *           messageId: message.messageId,
   *           subject: message.subject,
   *           contentLength: message.content ? message.content.length : 0,
   *           hasAttachments: message.attachments && message.attachments.length > 0,
   *           attachmentCount: message.attachments ? message.attachments.length : 0,
   *           priority: message.priority,
   *           category: message.category,
   *           sendTime: message.sendTime,
   *           receiveTime: message.receiveTime,
   *           readTime: message.readTime,
   *           responseTime: message.readTime ?
   *             new Date(message.readTime) - new Date(message.receiveTime) : null,
   *           fromUser: message.fromUser,
   *           hasCustomData: !!message.customData
   *         };
   *
   *         // 로컬 분석 데이터 저장
   *         await this.saveAnalysisData(analysis);
   *
   *         return analysis;
   *       } else {
   *         throw new Error(`메시지 조회 실패: ${detailResult.resultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('메시지 분석 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async saveAnalysisData(analysis) {
   *     try {
   *       // 기존 분석 데이터 조회
   *       const existingData = await bizMOB.Storage.get({
   *         _sKey: 'push.messageAnalysis'
   *       });
   *
   *       const analysisList = existingData ? JSON.parse(existingData) : [];
   *       analysisList.push(analysis);
   *
   *       // 최근 1000개만 유지
   *       if (analysisList.length > 1000) {
   *         analysisList.splice(0, analysisList.length - 1000);
   *       }
   *
   *       await bizMOB.Storage.set({
   *         _sKey: 'push.messageAnalysis',
   *         _vValue: JSON.stringify(analysisList)
   *       });
   *
   *       console.log('메시지 분석 데이터 저장 완료');
   *     } catch (error) {
   *       console.error('분석 데이터 저장 실패:', error);
   *     }
   *   }
   *
   *   static async getMessageStatistics(userId) {
   *     try {
   *       const analysisData = await bizMOB.Storage.get({
   *         _sKey: 'push.messageAnalysis'
   *       });
   *
   *       if (!analysisData) {
   *         return { totalMessages: 0 };
   *       }
   *
   *       const analysisList = JSON.parse(analysisData);
   *
   *       // 통계 계산
   *       const stats = {
   *         totalMessages: analysisList.length,
   *         readMessages: analysisList.filter(a => a.readTime).length,
   *         unreadMessages: analysisList.filter(a => !a.readTime).length,
   *         withAttachments: analysisList.filter(a => a.hasAttachments).length,
   *         avgResponseTime: this.calculateAverageResponseTime(analysisList),
   *         categoryStats: this.getCategoryStatistics(analysisList),
   *         priorityStats: this.getPriorityStatistics(analysisList),
   *         senderStats: this.getSenderStatistics(analysisList)
   *       };
   *
   *       return stats;
   *     } catch (error) {
   *       console.error('메시지 통계 조회 실패:', error);
   *       return { totalMessages: 0 };
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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

  /** 푸시키를 서버에 등록합니다. */
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

  /** 디바이스에 저장된 푸시 등록 관련 정보를 리셋합니다. */
  static reset(): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Push.reset({
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /** 푸시 메세지를 전송합니다. */
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

  /** 푸시 알람을 설정합니다. */
  static setAlarm(arg: {
    _sUserId: string, // 푸시 알람을 설정할 사용자 이이디
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

  /** 벳지 카운트를 설정합니다. */
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
