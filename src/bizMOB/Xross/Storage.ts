// sessionStorage와 동일
export default class Storage {
  /**
   * Storage에서 데이터를 조회합니다.
   *
   * sessionStorage와 동일한 방식으로 동작하는 키-값 기반 저장소에서 데이터를 가져오는 API입니다.
   * 앱의 임시 데이터, 세션 정보, 사용자 설정 등을 조회할 때 사용됩니다.
   *
   * @description
   * - 앱: 네이티브 임시 저장소에서 데이터 조회
   * - 웹: sessionStorage에서 데이터 조회
   *
   * @purpose 임시 데이터 조회, 세션 관리, 사용자 설정 조회, 캐시 데이터 접근
   *
   * @param {Object} arg - Storage 조회 설정 객체
   * @param {string} arg._sKey - Storage에서 가져올 키 값
   *   - 저장된 데이터를 식별하는 고유 키
   *   - 대소문자를 구분하며 특수문자 사용 가능
   *   - 권장 네이밍: 'user.preferences', 'app.session', 'cache.data' 등
   *
   * @returns {any} 저장된 데이터 값
   * @returns {string | number | boolean | Object | Array | null} 저장된 데이터 타입에 따른 값
   *   - 문자열, 숫자, 불린, 객체, 배열 등 모든 타입 지원
   *   - 존재하지 않는 키인 경우 null 반환
   *   - JSON으로 저장된 객체는 자동으로 파싱되어 반환
   *
   * @caution
   * - 존재하지 않는 키 조회 시 null이 반환됩니다
   * - 앱 종료 시 sessionStorage 데이터는 삭제됩니다
   * - 웹에서는 탭 종료 시 데이터가 삭제됩니다
   * - 대용량 데이터 조회 시 성능에 영향을 줄 수 있습니다
   *
   * @example
   * // 기본 데이터 조회
   * const userData = bizMOB.Storage.get({
   *   _sKey: 'user.profile'
   * });
   *
   * if (userData) {
   *   console.log('사용자 정보:', userData);
   *   console.log('사용자 이름:', userData.name);
   * } else {
   *   console.log('저장된 사용자 정보가 없습니다.');
   * }
   *
   * @example
   * // 다양한 데이터 타입 조회
   * class StorageDataManager {
   *   getUserPreferences() {
   *     // 객체 데이터 조회
   *     const preferences = bizMOB.Storage.get({
   *       _sKey: 'user.preferences'
   *     });
   *
   *     return preferences || {
   *       theme: 'light',
   *       language: 'ko',
   *       notifications: true
   *     };
   *   }
   *
   *   getAppSettings() {
   *     // 문자열 데이터 조회
   *     const theme = bizMOB.Storage.get({
   *       _sKey: 'app.theme'
   *     });
   *
   *     const version = bizMOB.Storage.get({
   *       _sKey: 'app.version'
   *     });
   *
   *     return {
   *       theme: theme || 'default',
   *       version: version || '1.0.0'
   *     };
   *   }
   *
   *   getSessionData() {
   *     // 배열 데이터 조회
   *     const recentItems = bizMOB.Storage.get({
   *       _sKey: 'session.recentItems'
   *     });
   *
   *     // 숫자 데이터 조회
   *     const lastLoginTime = bizMOB.Storage.get({
   *       _sKey: 'session.lastLoginTime'
   *     });
   *
   *     // 불린 데이터 조회
   *     const isFirstLaunch = bizMOB.Storage.get({
   *       _sKey: 'app.isFirstLaunch'
   *     });
   *
   *     return {
   *       recentItems: recentItems || [],
   *       lastLoginTime: lastLoginTime || 0,
   *       isFirstLaunch: isFirstLaunch !== null ? isFirstLaunch : true
   *     };
   *   }
   *
   *   getCacheData(key) {
   *     // 캐시 데이터 조회 (만료 시간 체크 포함)
   *     const cacheData = bizMOB.Storage.get({
   *       _sKey: `cache.${key}`
   *     });
   *
   *     if (cacheData && cacheData.expireTime) {
   *       const now = Date.now();
   *       if (now > cacheData.expireTime) {
   *         // 만료된 캐시 삭제
   *         bizMOB.Storage.remove({
   *           _sKey: `cache.${key}`
   *         });
   *         return null;
   *       }
   *       return cacheData.data;
   *     }
   *
   *     return cacheData;
   *   }
   * }
   *
   * @example
   * // 안전한 데이터 조회 및 기본값 처리
   * class SafeStorageAccess {
   *   static getWithDefault(key, defaultValue) {
   *     try {
   *       const value = bizMOB.Storage.get({ _sKey: key });
   *       return value !== null ? value : defaultValue;
   *     } catch (error) {
   *       console.warn(`Storage 조회 실패 (${key}):`, error);
   *       return defaultValue;
   *     }
   *   }
   *
   *   static getTypedData(key, expectedType, defaultValue) {
   *     try {
   *       const value = bizMOB.Storage.get({ _sKey: key });
   *
   *       if (value === null) {
   *         return defaultValue;
   *       }
   *
   *       // 타입 검증
   *       if (expectedType === 'string' && typeof value === 'string') {
   *         return value;
   *       } else if (expectedType === 'number' && typeof value === 'number') {
   *         return value;
   *       } else if (expectedType === 'boolean' && typeof value === 'boolean') {
   *         return value;
   *       } else if (expectedType === 'object' && typeof value === 'object') {
   *         return value;
   *       } else if (expectedType === 'array' && Array.isArray(value)) {
   *         return value;
   *       } else {
   *         console.warn(`타입 불일치 (${key}): 예상 ${expectedType}, 실제 ${typeof value}`);
   *         return defaultValue;
   *       }
   *     } catch (error) {
   *       console.error(`타입 검증 중 오류 (${key}):`, error);
   *       return defaultValue;
   *     }
   *   }
   *
   *   static getUserConfig() {
   *     // 사용자 설정 조회 (기본값 포함)
   *     return {
   *       userId: this.getTypedData('user.id', 'string', ''),
   *       userName: this.getTypedData('user.name', 'string', 'Guest'),
   *       preferences: this.getTypedData('user.preferences', 'object', {}),
   *       loginCount: this.getTypedData('user.loginCount', 'number', 0),
   *       isNewUser: this.getTypedData('user.isNew', 'boolean', true),
   *       favoriteItems: this.getTypedData('user.favorites', 'array', [])
   *     };
   *   }
   * }
   *
   * @example
   * // 데이터 조회 및 유효성 검사
   * class DataValidator {
   *   static validateAndGetUserData() {
   *     const userData = bizMOB.Storage.get({
   *       _sKey: 'user.data'
   *     });
   *
   *     if (!userData) {
   *       return { isValid: false, error: '사용자 데이터가 없습니다.' };
   *     }
   *
   *     // 필수 필드 검증
   *     const requiredFields = ['id', 'name', 'email'];
   *     for (const field of requiredFields) {
   *       if (!userData[field]) {
   *         return {
   *           isValid: false,
   *           error: `필수 필드 누락: ${field}`
   *         };
   *       }
   *     }
   *
   *     // 데이터 형식 검증
   *     if (typeof userData.id !== 'string' || userData.id.length === 0) {
   *       return { isValid: false, error: '유효하지 않은 사용자 ID' };
   *     }
   *
   *     if (typeof userData.email !== 'string' || !userData.email.includes('@')) {
   *       return { isValid: false, error: '유효하지 않은 이메일 형식' };
   *     }
   *
   *     return { isValid: true, data: userData };
   *   }
   *
   *   static validateAndGetAppSettings() {
   *     const settings = bizMOB.Storage.get({
   *       _sKey: 'app.settings'
   *     });
   *
   *     if (!settings) {
   *       // 기본 설정 반환
   *       return {
   *         theme: 'light',
   *         language: 'ko',
   *         autoSave: true,
   *         notifications: {
   *           push: true,
   *           email: false,
   *           sms: false
   *         }
   *       };
   *     }
   *
   *     // 설정 값 검증 및 보정
   *     const validatedSettings = {
   *       theme: ['light', 'dark'].includes(settings.theme) ? settings.theme : 'light',
   *       language: ['ko', 'en', 'ja'].includes(settings.language) ? settings.language : 'ko',
   *       autoSave: typeof settings.autoSave === 'boolean' ? settings.autoSave : true,
   *       notifications: {
   *         push: typeof settings.notifications?.push === 'boolean' ? settings.notifications.push : true,
   *         email: typeof settings.notifications?.email === 'boolean' ? settings.notifications.email : false,
   *         sms: typeof settings.notifications?.sms === 'boolean' ? settings.notifications.sms : false
   *       }
   *     };
   *
   *     return validatedSettings;
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static get(arg: {
    _sKey: string, // Storage 에서 가져올 키 값
  }): any {
    return window.bizMOB.Storage.get({
      ...arg,
    });
  }

  /**
   * Storage에서 데이터를 제거합니다.
   *
   * sessionStorage와 동일한 방식으로 동작하는 키-값 기반 저장소에서 특정 키의 데이터를 삭제하는 API입니다.
   * 불필요한 데이터 정리, 사용자 로그아웃, 임시 데이터 삭제 등에 사용됩니다.
   *
   * @description
   * - 앱: 네이티브 임시 저장소에서 데이터 삭제
   * - 웹: sessionStorage에서 데이터 삭제
   *
   * @purpose 데이터 정리, 메모리 최적화, 보안 강화, 세션 종료, 캐시 무효화
   *
   * @param {Object} arg - Storage 제거 설정 객체
   * @param {string} arg._sKey - Storage에서 삭제할 키 값
   *   - 삭제할 데이터를 식별하는 고유 키
   *   - 존재하지 않는 키를 삭제해도 오류가 발생하지 않음
   *   - 와일드카드는 지원하지 않으므로 정확한 키 이름 필요
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 삭제된 데이터는 복구할 수 없습니다
   * - 존재하지 않는 키를 삭제해도 오류가 발생하지 않습니다
   * - 다른 세션이나 탭에서는 삭제가 즉시 반영되지 않을 수 있습니다
   * - 대용량 데이터 삭제 시 성능에 영향을 줄 수 있습니다
   *
   * @example
   * // 기본 데이터 삭제
   * bizMOB.Storage.remove({
   *   _sKey: 'user.tempData'
   * });
   *
   * console.log('임시 데이터가 삭제되었습니다.');
   *
   * @example
   * // 사용자 로그아웃 시 관련 데이터 정리
   * class UserSessionManager {
   *   static logout() {
   *     console.log('사용자 로그아웃 처리 시작');
   *
   *     // 1. 사용자 세션 데이터 삭제
   *     const sessionKeys = [
   *       'user.session',
   *       'user.preferences',
   *       'user.tempSettings',
   *       'user.draftData',
   *       'user.recentActivity'
   *     ];
   *
   *     sessionKeys.forEach(key => {
   *       try {
   *         bizMOB.Storage.remove({ _sKey: key });
   *         console.log(`${key} 삭제 완료`);
   *       } catch (error) {
   *         console.warn(`${key} 삭제 실패:`, error);
   *       }
   *     });
   *
   *     // 2. 캐시 데이터 삭제
   *     this.clearCacheData();
   *
   *     // 3. 보안 관련 데이터 삭제
   *     this.clearSecurityData();
   *
   *     console.log('로그아웃 데이터 정리 완료');
   *   }
   *
   *   static clearCacheData() {
   *     const cacheKeys = [
   *       'cache.userProfile',
   *       'cache.menuData',
   *       'cache.notifications',
   *       'cache.recentItems'
   *     ];
   *
   *     cacheKeys.forEach(key => {
   *       bizMOB.Storage.remove({ _sKey: key });
   *     });
   *   }
   *
   *   static clearSecurityData() {
   *     const securityKeys = [
   *       'auth.tempToken',
   *       'auth.deviceFingerprint',
   *       'security.sessionId'
   *     ];
   *
   *     securityKeys.forEach(key => {
   *       bizMOB.Storage.remove({ _sKey: key });
   *     });
   *   }
   * }
   *
   * @example
   * // 조건부 데이터 삭제
   * class ConditionalDataCleaner {
   *   static cleanExpiredData() {
   *     // 만료된 캐시 데이터 확인 및 삭제
   *     const cacheKeys = [
   *       'cache.news',
   *       'cache.weather',
   *       'cache.stocks',
   *       'cache.userFeed'
   *     ];
   *
   *     cacheKeys.forEach(key => {
   *       const cacheData = bizMOB.Storage.get({ _sKey: key });
   *
   *       if (cacheData && cacheData.expireTime) {
   *         const now = Date.now();
   *         if (now > cacheData.expireTime) {
   *           bizMOB.Storage.remove({ _sKey: key });
   *           console.log(`만료된 캐시 삭제: ${key}`);
   *         }
   *       }
   *     });
   *   }
   *
   *   static cleanLargeData() {
   *     // 대용량 데이터 정리 (메모리 최적화)
   *     const largeDataKeys = [
   *       'temp.imageCache',
   *       'temp.documentCache',
   *       'temp.mediaFiles'
   *     ];
   *
   *     largeDataKeys.forEach(key => {
   *       const data = bizMOB.Storage.get({ _sKey: key });
   *
   *       if (data) {
   *         // 데이터 크기 추정 (문자열로 변환하여 측정)
   *         const dataSize = JSON.stringify(data).length;
   *         const maxSize = 1024 * 1024; // 1MB
   *
   *         if (dataSize > maxSize) {
   *           bizMOB.Storage.remove({ _sKey: key });
   *           console.log(`대용량 데이터 삭제: ${key} (${dataSize} bytes)`);
   *         }
   *       }
   *     });
   *   }
   *
   *   static cleanOldUserData(currentUserId) {
   *     // 다른 사용자의 잔여 데이터 정리
   *     const userData = bizMOB.Storage.get({ _sKey: 'user.profile' });
   *
   *     if (userData && userData.userId !== currentUserId) {
   *       console.log('이전 사용자 데이터 정리 시작');
   *
   *       const userSpecificKeys = [
   *         'user.profile',
   *         'user.preferences',
   *         'user.favorites',
   *         'user.history',
   *         'user.drafts'
   *       ];
   *
   *       userSpecificKeys.forEach(key => {
   *         bizMOB.Storage.remove({ _sKey: key });
   *       });
   *
   *       console.log('이전 사용자 데이터 정리 완료');
   *     }
   *   }
   * }
   *
   * @example
   * // 배치 삭제 및 안전한 삭제
   * class SafeDataRemover {
   *   static removeWithConfirmation(key, confirmationMessage) {
   *     // 중요 데이터 삭제 시 확인
   *     const shouldDelete = confirm(confirmationMessage || `${key} 데이터를 삭제하시겠습니까?`);
   *
   *     if (shouldDelete) {
   *       // 삭제 전 백업
   *       const backupData = bizMOB.Storage.get({ _sKey: key });
   *       if (backupData) {
   *         const backupKey = `backup.${key}.${Date.now()}`;
   *         bizMOB.Storage.set({
   *           _sKey: backupKey,
   *           _vValue: backupData
   *         });
   *         console.log(`백업 저장: ${backupKey}`);
   *       }
   *
   *       // 실제 삭제
   *       bizMOB.Storage.remove({ _sKey: key });
   *       console.log(`데이터 삭제 완료: ${key}`);
   *
   *       return true;
   *     }
   *
   *     return false;
   *   }
   *
   *   static batchRemove(keys, options = {}) {
   *     const results = [];
   *     let successCount = 0;
   *     let failureCount = 0;
   *
   *     console.log(`배치 삭제 시작: ${keys.length}개 항목`);
   *
   *     keys.forEach((key, index) => {
   *       try {
   *         // 삭제 전 존재 여부 확인
   *         const exists = bizMOB.Storage.get({ _sKey: key }) !== null;
   *
   *         if (exists || options.ignoreNotFound) {
   *           bizMOB.Storage.remove({ _sKey: key });
   *           results.push({ key, status: 'success', index });
   *           successCount++;
   *
   *           if (options.verbose) {
   *             console.log(`삭제 성공 (${index + 1}/${keys.length}): ${key}`);
   *           }
   *         } else {
   *           results.push({ key, status: 'not_found', index });
   *           console.warn(`키를 찾을 수 없음: ${key}`);
   *         }
   *
   *         // 대량 삭제 시 성능 고려한 지연
   *         if (options.delay && index < keys.length - 1) {
   *           setTimeout(() => {}, options.delay);
   *         }
   *       } catch (error) {
   *         results.push({ key, status: 'error', error: error.message, index });
   *         failureCount++;
   *         console.error(`삭제 실패 (${index + 1}/${keys.length}): ${key}`, error);
   *       }
   *     });
   *
   *     console.log(`배치 삭제 완료: 성공 ${successCount}, 실패 ${failureCount}`);
   *
   *     return {
   *       total: keys.length,
   *       success: successCount,
   *       failure: failureCount,
   *       results: results
   *     };
   *   }
   *
   *   static removeByPattern(pattern) {
   *     // 패턴 매칭으로 여러 키 삭제 (주의: 모든 키를 검사해야 하므로 성능 고려)
   *     console.warn('패턴 기반 삭제는 성능에 영향을 줄 수 있습니다.');
   *
   *     // 실제 구현에서는 Storage API의 한계로 인해
   *     // 미리 정의된 키 목록을 사용하는 것이 좋습니다.
   *     const commonKeys = [
   *       'user.profile', 'user.preferences', 'user.session',
   *       'cache.data', 'cache.images', 'cache.documents',
   *       'temp.uploads', 'temp.downloads', 'temp.processing'
   *     ];
   *
   *     const matchingKeys = commonKeys.filter(key => {
   *       if (typeof pattern === 'string') {
   *         return key.includes(pattern);
   *       } else if (pattern instanceof RegExp) {
   *         return pattern.test(key);
   *       }
   *       return false;
   *     });
   *
   *     if (matchingKeys.length > 0) {
   *       console.log(`패턴 "${pattern}"과 일치하는 ${matchingKeys.length}개 키 삭제`);
   *       return this.batchRemove(matchingKeys, { verbose: true });
   *     } else {
   *       console.log(`패턴 "${pattern}"과 일치하는 키가 없습니다.`);
   *       return { total: 0, success: 0, failure: 0, results: [] };
   *     }
   *   }
   * }
   *
   * @example
   * // 앱 종료 시 정리 작업
   * class AppShutdownCleaner {
   *   static performShutdownCleanup() {
   *     console.log('앱 종료 전 데이터 정리 시작');
   *
   *     try {
   *       // 1. 임시 데이터 삭제
   *       const tempKeys = [
   *         'temp.formData',
   *         'temp.uploadQueue',
   *         'temp.processingData',
   *         'temp.draftContent'
   *       ];
   *
   *       tempKeys.forEach(key => {
   *         bizMOB.Storage.remove({ _sKey: key });
   *       });
   *
   *       // 2. 캐시 데이터 선별 삭제 (영구 보관이 필요한 것 제외)
   *       const volatileCacheKeys = [
   *         'cache.liveData',
   *         'cache.notifications',
   *         'cache.realtimeUpdates'
   *       ];
   *
   *       volatileCacheKeys.forEach(key => {
   *         bizMOB.Storage.remove({ _sKey: key });
   *       });
   *
   *       // 3. 보안 관련 임시 데이터 삭제
   *       const securityTempKeys = [
   *         'security.csrfToken',
   *         'security.requestNonce',
   *         'security.tempSession'
   *       ];
   *
   *       securityTempKeys.forEach(key => {
   *         bizMOB.Storage.remove({ _sKey: key });
   *       });
   *
   *       console.log('앱 종료 전 데이터 정리 완료');
   *     } catch (error) {
   *       console.error('데이터 정리 중 오류:', error);
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static remove(arg: {
    _sKey: string, // Storage 에서 삭제할 키 값
  }): void {
    window.bizMOB.Storage.remove({
      ...arg,
    });
  }

  /**
   * Storage에 데이터를 저장합니다 (단일).
   *
   * sessionStorage와 동일한 방식으로 동작하는 키-값 기반 저장소에 단일 데이터를 저장하는 API입니다.
   * 문자열, 숫자, 객체, 배열 등 모든 타입의 데이터를 저장할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 임시 저장소에 데이터 저장
   * - 웹: sessionStorage에 데이터 저장
   *
   * @purpose 임시 데이터 저장, 세션 관리, 사용자 설정 저장, 캐시 데이터 보관
   *
   * @param {Object} arg - Storage 저장 설정 객체
   * @param {string} arg._sKey - Storage에 저장할 키 값
   *   - 데이터를 식별하는 고유 키
   *   - 대소문자를 구분하며 특수문자 사용 가능
   *   - 권장 네이밍: 'user.preferences', 'app.session', 'cache.data' 등
   *   - 기존 키가 있는 경우 덮어쓰기됨
   * @param {any} arg._vValue - Storage에 저장할 값
   *   - 문자열, 숫자, 불린, 객체, 배열 등 모든 JavaScript 타입 지원
   *   - 객체와 배열은 자동으로 JSON으로 직렬화되어 저장
   *   - null, undefined도 저장 가능
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 앱 종료 시 sessionStorage 데이터는 삭제됩니다
   * - 웹에서는 탭 종료 시 데이터가 삭제됩니다
   * - 저장 용량에는 제한이 있습니다 (일반적으로 5-10MB)
   * - 순환 참조가 있는 객체는 저장할 수 없습니다
   * - 기존 키가 있는 경우 덮어쓰기됩니다
   *
   * @example
   * // 기본 데이터 저장
   * bizMOB.Storage.set({
   *   _sKey: 'user.name',
   *   _vValue: '홍길동'
   * });
   *
   * bizMOB.Storage.set({
   *   _sKey: 'user.age',
   *   _vValue: 25
   * });
   *
   * bizMOB.Storage.set({
   *   _sKey: 'user.isActive',
   *   _vValue: true
   * });
   *
   * console.log('사용자 정보 저장 완료');
   *
   * @example
   * // 객체 및 배열 데이터 저장
   * class UserDataManager {
   *   static saveUserProfile(userInfo) {
   *     // 객체 데이터 저장
   *     const userProfile = {
   *       id: userInfo.id,
   *       name: userInfo.name,
   *       email: userInfo.email,
   *       preferences: {
   *         theme: 'light',
   *         language: 'ko',
   *         notifications: true
   *       },
   *       lastLogin: new Date().toISOString(),
   *       loginCount: userInfo.loginCount || 1
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: 'user.profile',
   *       _vValue: userProfile
   *     });
   *
   *     console.log('사용자 프로필 저장:', userProfile);
   *   }
   *
   *   static saveRecentActivity(activities) {
   *     // 배열 데이터 저장
   *     const recentActivities = activities.slice(0, 10); // 최근 10개만 저장
   *
   *     bizMOB.Storage.set({
   *       _sKey: 'user.recentActivities',
   *       _vValue: recentActivities
   *     });
   *
   *     console.log(`최근 활동 ${recentActivities.length}개 저장`);
   *   }
   *
   *   static saveAppSettings(settings) {
   *     // 복합 객체 저장
   *     const appSettings = {
   *       version: '1.0.0',
   *       theme: settings.theme || 'light',
   *       language: settings.language || 'ko',
   *       features: {
   *         pushNotifications: settings.features?.pushNotifications || true,
   *         autoSave: settings.features?.autoSave || true,
   *         darkMode: settings.features?.darkMode || false
   *       },
   *       advanced: {
   *         debugMode: false,
   *         analytics: true,
   *         crashReporting: true
   *       },
   *       lastModified: Date.now()
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: 'app.settings',
   *       _vValue: appSettings
   *     });
   *
   *     console.log('앱 설정 저장 완료');
   *   }
   * }
   *
   * @example
   * // 캐시 데이터 저장 (만료 시간 포함)
   * class CacheManager {
   *   static setCache(key, data, ttlMinutes = 60) {
   *     const cacheData = {
   *       data: data,
   *       timestamp: Date.now(),
   *       expireTime: Date.now() + (ttlMinutes * 60 * 1000),
   *       version: '1.0'
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: `cache.${key}`,
   *       _vValue: cacheData
   *     });
   *
   *     console.log(`캐시 저장: ${key}, 만료: ${ttlMinutes}분 후`);
   *   }
   *
   *   static setCacheWithMetadata(key, data, metadata = {}) {
   *     const cacheEntry = {
   *       data: data,
   *       metadata: {
   *         createdAt: new Date().toISOString(),
   *         source: metadata.source || 'unknown',
   *         version: metadata.version || '1.0',
   *         tags: metadata.tags || [],
   *         priority: metadata.priority || 'normal'
   *       },
   *       stats: {
   *         accessCount: 0,
   *         lastAccessed: null,
   *         dataSize: JSON.stringify(data).length
   *       }
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: `cache.${key}`,
   *       _vValue: cacheEntry
   *     });
   *
   *     console.log(`메타데이터 포함 캐시 저장: ${key}`);
   *   }
   *
   *   static setBulkCache(dataMap, defaultTTL = 30) {
   *     Object.entries(dataMap).forEach(([key, data]) => {
   *       this.setCache(key, data, defaultTTL);
   *     });
   *
   *     console.log(`${Object.keys(dataMap).length}개 캐시 항목 일괄 저장`);
   *   }
   * }
   *
   * @example
   * // 데이터 검증 및 안전한 저장
   * class SafeDataStorage {
   *   static safeSet(key, value, options = {}) {
   *     try {
   *       // 1. 키 검증
   *       if (!key || typeof key !== 'string' || key.trim() === '') {
   *         throw new Error('유효하지 않은 키입니다.');
   *       }
   *
   *       // 2. 데이터 크기 검증
   *       const serializedData = JSON.stringify(value);
   *       const dataSize = serializedData.length;
   *       const maxSize = options.maxSize || 1024 * 1024; // 기본 1MB
   *
   *       if (dataSize > maxSize) {
   *         throw new Error(`데이터 크기가 제한을 초과했습니다. (${dataSize}/${maxSize} bytes)`);
   *       }
   *
   *       // 3. 순환 참조 검사
   *       if (this.hasCircularReference(value)) {
   *         throw new Error('순환 참조가 있는 객체는 저장할 수 없습니다.');
   *       }
   *
   *       // 4. 백업 생성 (옵션)
   *       if (options.createBackup) {
   *         const existingData = bizMOB.Storage.get({ _sKey: key });
   *         if (existingData !== null) {
   *           const backupKey = `backup.${key}.${Date.now()}`;
   *           bizMOB.Storage.set({
   *             _sKey: backupKey,
   *             _vValue: existingData
   *           });
   *         }
   *       }
   *
   *       // 5. 실제 저장
   *       bizMOB.Storage.set({
   *         _sKey: key,
   *         _vValue: value
   *       });
   *
   *       console.log(`안전 저장 완료: ${key} (${dataSize} bytes)`);
   *       return true;
   *     } catch (error) {
   *       console.error(`저장 실패 (${key}):`, error);
   *
   *       if (options.fallbackValue !== undefined) {
   *         console.log('대체값으로 저장 시도');
   *         bizMOB.Storage.set({
   *           _sKey: key,
   *           _vValue: options.fallbackValue
   *         });
   *         return true;
   *       }
   *
   *       return false;
   *     }
   *   }
   *
   *   static hasCircularReference(obj, seen = new WeakSet()) {
   *     if (obj === null || typeof obj !== 'object') {
   *       return false;
   *     }
   *
   *     if (seen.has(obj)) {
   *       return true;
   *     }
   *
   *     seen.add(obj);
   *
   *     for (const key in obj) {
   *       if (obj.hasOwnProperty(key)) {
   *         if (this.hasCircularReference(obj[key], seen)) {
   *           return true;
   *         }
   *       }
   *     }
   *
   *     seen.delete(obj);
   *     return false;
   *   }
   *
   *   static setWithExpiry(key, value, expiryMinutes = 60) {
   *     const expiryData = {
   *       value: value,
   *       expiry: Date.now() + (expiryMinutes * 60 * 1000)
   *     };
   *
   *     return this.safeSet(key, expiryData, {
   *       maxSize: 512 * 1024 // 512KB 제한
   *     });
   *   }
   * }
   *
   * @example
   * // 상태 관리 및 데이터 동기화
   * class StateManager {
   *   static saveApplicationState(state) {
   *     const appState = {
   *       currentPage: state.currentPage || 'home',
   *       navigation: {
   *         history: state.navigation?.history || [],
   *         currentIndex: state.navigation?.currentIndex || 0
   *       },
   *       user: {
   *         isLoggedIn: state.user?.isLoggedIn || false,
   *         userId: state.user?.userId || null,
   *         permissions: state.user?.permissions || []
   *       },
   *       ui: {
   *         theme: state.ui?.theme || 'light',
   *         sidebarOpen: state.ui?.sidebarOpen || false,
   *         modalStack: state.ui?.modalStack || []
   *       },
   *       data: {
   *         lastSync: state.data?.lastSync || null,
   *         pendingChanges: state.data?.pendingChanges || [],
   *         cacheVersion: state.data?.cacheVersion || '1.0'
   *       },
   *       timestamp: Date.now()
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: 'app.state',
   *       _vValue: appState
   *     });
   *
   *     console.log('애플리케이션 상태 저장 완료');
   *   }
   *
   *   static saveFormData(formId, formData) {
   *     // 폼 데이터 자동 저장 (사용자가 실수로 나갈 때 복원용)
   *     const formSaveData = {
   *       formId: formId,
   *       data: formData,
   *       savedAt: new Date().toISOString(),
   *       version: '1.0'
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: `form.draft.${formId}`,
   *       _vValue: formSaveData
   *     });
   *
   *     console.log(`폼 데이터 임시 저장: ${formId}`);
   *   }
   *
   *   static saveUserPreferences(preferences) {
   *     // 사용자 개인화 설정 저장
   *     const userPrefs = {
   *       ...preferences,
   *       lastUpdated: Date.now(),
   *       version: '2.0'
   *     };
   *
   *     bizMOB.Storage.set({
   *       _sKey: 'user.preferences',
   *       _vValue: userPrefs
   *     });
   *
   *     console.log('사용자 설정 저장 완료');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static set(arg: {
    _sKey: string, // Storage 에 저장할 키 값
    _vValue: any, // Storage 에 저장할 값
  }): void {
    window.bizMOB.Storage.set({
      ...arg,
    });
  }

  /**
   * Storage에 데이터를 저장합니다 (복수).
   *
   * sessionStorage와 동일한 방식으로 동작하는 키-값 기반 저장소에 여러 데이터를 한 번에 저장하는 API입니다.
   * 대량의 데이터를 효율적으로 저장하거나 관련된 데이터들을 일괄 처리할 때 사용됩니다.
   *
   * @description
   * - 앱: 네이티브 임시 저장소에 여러 데이터 일괄 저장
   * - 웹: sessionStorage에 여러 데이터 일괄 저장
   *
   * @purpose 일괄 데이터 저장, 성능 최적화, 원자적 저장 작업, 관련 데이터 동기화
   *
   * @param {Object} arg - Storage 일괄 저장 설정 객체
   * @param {Array<Object>} arg._aList - 저장할 키-값 쌍의 배열
   * @param {string} arg._aList[]._sKey - Storage에 저장할 키 값
   *   - 데이터를 식별하는 고유 키
   *   - 배열 내에서 중복된 키가 있을 경우 마지막 값으로 저장
   * @param {any} arg._aList[]._vValue - Storage에 저장할 값
   *   - 문자열, 숫자, 불린, 객체, 배열 등 모든 JavaScript 타입 지원
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 저장 중 오류가 발생해도 이전에 저장된 항목들은 유지됩니다
   * - 배열 내 중복된 키가 있을 경우 마지막 값으로 덮어씁니다
   * - 대량 저장 시 성능에 영향을 줄 수 있습니다
   * - 개별 항목의 저장 실패가 전체 작업을 중단시키지 않습니다
   *
   * @example
   * // 기본 일괄 저장
   * bizMOB.Storage.setList({
   *   _aList: [
   *     { _sKey: 'user.name', _vValue: '홍길동' },
   *     { _sKey: 'user.age', _vValue: 25 },
   *     { _sKey: 'user.email', _vValue: 'hong@example.com' },
   *     { _sKey: 'user.isActive', _vValue: true }
   *   ]
   * });
   *
   * console.log('사용자 정보 일괄 저장 완료');
   *
   * @example
   * // 앱 초기화 시 기본 설정 일괄 저장
   * class AppInitializer {
   *   static initializeDefaultSettings() {
   *     const defaultSettings = [
   *       { _sKey: 'app.version', _vValue: '1.0.0' },
   *       { _sKey: 'app.theme', _vValue: 'light' },
   *       { _sKey: 'app.language', _vValue: 'ko' },
   *       { _sKey: 'app.isFirstLaunch', _vValue: true },
   *       { _sKey: 'app.features', _vValue: {
   *         pushNotifications: true,
   *         autoSave: true,
   *         analytics: true,
   *         crashReporting: true
   *       }},
   *       { _sKey: 'app.lastUpdate', _vValue: new Date().toISOString() },
   *       { _sKey: 'app.installDate', _vValue: Date.now() }
   *     ];
   *
   *     bizMOB.Storage.setList({
   *       _aList: defaultSettings
   *     });
   *
   *     console.log('기본 설정 초기화 완료');
   *   }
   *
   *   static initializeUserDefaults(userId) {
   *     const userDefaults = [
   *       { _sKey: 'user.id', _vValue: userId },
   *       { _sKey: 'user.preferences', _vValue: {
   *         theme: 'light',
   *         language: 'ko',
   *         notifications: {
   *           push: true,
   *           email: false,
   *           sms: false
   *         }
   *       }},
   *       { _sKey: 'user.settings', _vValue: {
   *         autoLogin: false,
   *         rememberPassword: false,
   *         enableBiometric: false
   *       }},
   *       { _sKey: 'user.activity', _vValue: {
   *         loginCount: 0,
   *         lastLogin: null,
   *         firstLogin: new Date().toISOString()
   *       }},
   *       { _sKey: 'user.data', _vValue: {
   *         favorites: [],
   *         recent: [],
   *         bookmarks: []
   *       }}
   *     ];
   *
   *     bizMOB.Storage.setList({
   *       _aList: userDefaults
   *     });
   *
   *     console.log(`사용자 ${userId} 기본값 설정 완료`);
   *   }
   * }
   *
   * @example
   * // 캐시 데이터 일괄 저장
   * class CacheBatchManager {
   *   static saveBatchCache(cacheData, ttlMinutes = 60) {
   *     const timestamp = Date.now();
   *     const expireTime = timestamp + (ttlMinutes * 60 * 1000);
   *
   *     const cacheList = Object.entries(cacheData).map(([key, data]) => ({
   *       _sKey: `cache.${key}`,
   *       _vValue: {
   *         data: data,
   *         timestamp: timestamp,
   *         expireTime: expireTime,
   *         version: '1.0'
   *       }
   *     }));
   *
   *     bizMOB.Storage.setList({
   *       _aList: cacheList
   *     });
   *
   *     console.log(`${cacheList.length}개 캐시 항목 일괄 저장 (TTL: ${ttlMinutes}분)`);
   *   }
   *
   *   static saveApiResponseCache(responses) {
   *     const cacheEntries = responses.map(response => ({
   *       _sKey: `api.cache.${response.endpoint}`,
   *       _vValue: {
   *         data: response.data,
   *         headers: response.headers,
   *         status: response.status,
   *         timestamp: Date.now(),
   *         endpoint: response.endpoint,
   *         params: response.params
   *       }
   *     }));
   *
   *     bizMOB.Storage.setList({
   *       _aList: cacheEntries
   *     });
   *
   *     console.log(`${cacheEntries.length}개 API 응답 캐시 저장`);
   *   }
   *
   *   static saveUserDataBatch(userData) {
   *     const userEntries = [
   *       { _sKey: 'user.profile', _vValue: userData.profile },
   *       { _sKey: 'user.preferences', _vValue: userData.preferences },
   *       { _sKey: 'user.permissions', _vValue: userData.permissions },
   *       { _sKey: 'user.session', _vValue: {
   *         sessionId: userData.sessionId,
   *         loginTime: userData.loginTime,
   *         expiresAt: userData.expiresAt
   *       }},
   *       { _sKey: 'user.activity', _vValue: userData.activity }
   *     ];
   *
   *     bizMOB.Storage.setList({
   *       _aList: userEntries
   *     });
   *
   *     console.log('사용자 데이터 일괄 저장 완료');
   *   }
   * }
   *
   * @example
   * // 폼 데이터 및 상태 정보 일괄 저장
   * class FormStateManager {
   *   static saveFormProgress(formId, formData, metadata = {}) {
   *     const formEntries = [
   *       { _sKey: `form.data.${formId}`, _vValue: formData },
   *       { _sKey: `form.meta.${formId}`, _vValue: {
   *         savedAt: new Date().toISOString(),
   *         currentStep: metadata.currentStep || 1,
   *         totalSteps: metadata.totalSteps || 1,
   *         validationErrors: metadata.validationErrors || {},
   *         isComplete: metadata.isComplete || false,
   *         version: '1.0'
   *       }},
   *       { _sKey: `form.state.${formId}`, _vValue: {
   *         isDirty: true,
   *         hasUnsavedChanges: true,
   *         autoSaveEnabled: true,
   *         lastAutoSave: Date.now()
   *       }}
   *     ];
   *
   *     bizMOB.Storage.setList({
   *       _aList: formEntries
   *     });
   *
   *     console.log(`폼 ${formId} 진행 상황 저장 완료`);
   *   }
   *
   *   static saveMultiStepFormData(formId, steps) {
   *     const stepEntries = steps.map((stepData, index) => ({
   *       _sKey: `form.step.${formId}.${index}`,
   *       _vValue: {
   *         stepIndex: index,
   *         data: stepData,
   *         isValid: this.validateStepData(stepData, index),
   *         completedAt: stepData.isCompleted ? new Date().toISOString() : null
   *       }
   *     }));
   *
   *     // 전체 폼 상태도 함께 저장
   *     stepEntries.push({
   *       _sKey: `form.overview.${formId}`,
   *       _vValue: {
   *         totalSteps: steps.length,
   *         completedSteps: steps.filter(step => step.isCompleted).length,
   *         currentStep: steps.findIndex(step => !step.isCompleted),
   *         lastModified: Date.now()
   *       }
   *     });
   *
   *     bizMOB.Storage.setList({
   *       _aList: stepEntries
   *     });
   *
   *     console.log(`다단계 폼 ${formId} 데이터 저장 (${steps.length}단계)`);
   *   }
   * }
   *
   * @example
   * // 설정 및 환경 정보 일괄 저장
   * class ConfigurationManager {
   *   static saveEnvironmentConfig(environment, config) {
   *     const configEntries = [
   *       { _sKey: 'env.current', _vValue: environment },
   *       { _sKey: 'env.apiBaseUrl', _vValue: config.apiBaseUrl },
   *       { _sKey: 'env.features', _vValue: config.features },
   *       { _sKey: 'env.limits', _vValue: {
   *         maxFileSize: config.limits.maxFileSize,
   *         maxRequestSize: config.limits.maxRequestSize,
   *         timeout: config.limits.timeout
   *       }},
   *       { _sKey: 'env.security', _vValue: {
   *         enableSSL: config.security.enableSSL,
   *         tokenExpiry: config.security.tokenExpiry,
   *         maxLoginAttempts: config.security.maxLoginAttempts
   *       }},
   *       { _sKey: 'env.debug', _vValue: {
   *         enabled: config.debug.enabled,
   *         logLevel: config.debug.logLevel,
   *         verboseLogging: config.debug.verboseLogging
   *       }}
   *     ];
   *
   *     bizMOB.Storage.setList({
   *       _aList: configEntries
   *     });
   *
   *     console.log(`환경 설정 저장 완료: ${environment}`);
   *   }
   *
   *   static saveAppMetrics(metrics) {
   *     const metricsEntries = Object.entries(metrics).map(([category, data]) => ({
   *       _sKey: `metrics.${category}`,
   *       _vValue: {
   *         ...data,
   *         timestamp: Date.now(),
   *         category: category
   *       }
   *     }));
   *
   *     // 전체 메트릭스 요약도 저장
   *     metricsEntries.push({
   *       _sKey: 'metrics.summary',
   *       _vValue: {
   *         totalCategories: Object.keys(metrics).length,
   *         lastUpdate: Date.now(),
   *         version: '1.0'
   *       }
   *     });
   *
   *     bizMOB.Storage.setList({
   *       _aList: metricsEntries
   *     });
   *
   *     console.log(`앱 메트릭스 저장: ${Object.keys(metrics).length}개 카테고리`);
   *   }
   * }
   *
   * @example
   * // 오류 처리 및 안전한 일괄 저장
   * class SafeBatchStorage {
   *   static safeSetList(dataList, options = {}) {
   *     const results = [];
   *     let successCount = 0;
   *     let failureCount = 0;
   *
   *     console.log(`안전한 일괄 저장 시작: ${dataList.length}개 항목`);
   *
   *     // 사전 검증
   *     const validatedList = dataList.filter((item, index) => {
   *       if (!item._sKey || typeof item._sKey !== 'string') {
   *         console.warn(`잘못된 키 (인덱스 ${index}):`, item._sKey);
   *         results.push({ index, status: 'invalid_key', key: item._sKey });
   *         failureCount++;
   *         return false;
   *       }
   *
   *       try {
   *         JSON.stringify(item._vValue);
   *         return true;
   *       } catch (error) {
   *         console.warn(`직렬화 불가능한 값 (인덱스 ${index}):`, error);
   *         results.push({ index, status: 'serialization_error', key: item._sKey, error: error.message });
   *         failureCount++;
   *         return false;
   *       }
   *     });
   *
   *     if (validatedList.length > 0) {
   *       try {
   *         // 실제 저장
   *         bizMOB.Storage.setList({
   *           _aList: validatedList
   *         });
   *
   *         successCount = validatedList.length;
   *         validatedList.forEach((item, index) => {
   *           results.push({ index, status: 'success', key: item._sKey });
   *         });
   *
   *       } catch (error) {
   *         console.error('일괄 저장 중 오류:', error);
   *         validatedList.forEach((item, index) => {
   *           results.push({ index, status: 'storage_error', key: item._sKey, error: error.message });
   *         });
   *         failureCount += validatedList.length;
   *         successCount = 0;
   *       }
   *     }
   *
   *     console.log(`일괄 저장 완료: 성공 ${successCount}, 실패 ${failureCount}`);
   *
   *     return {
   *       total: dataList.length,
   *       success: successCount,
   *       failure: failureCount,
   *       results: results
   *     };
   *   }
   *
   *   static setListWithTransaction(dataList, transactionId = null) {
   *     const txId = transactionId || `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   *
   *     try {
   *       // 트랜잭션 시작 로그
   *       bizMOB.Storage.set({
   *         _sKey: `transaction.${txId}.start`,
   *         _vValue: {
   *           startTime: Date.now(),
   *           itemCount: dataList.length,
   *           status: 'started'
   *         }
   *       });
   *
   *       // 일괄 저장 실행
   *       bizMOB.Storage.setList({
   *         _aList: dataList
   *       });
   *
   *       // 트랜잭션 완료 로그
   *       bizMOB.Storage.set({
   *         _sKey: `transaction.${txId}.complete`,
   *         _vValue: {
   *           completeTime: Date.now(),
   *           status: 'completed',
   *           itemCount: dataList.length
   *         }
   *       });
   *
   *       console.log(`트랜잭션 ${txId} 완료: ${dataList.length}개 항목`);
   *       return { success: true, transactionId: txId };
   *
   *     } catch (error) {
   *       // 트랜잭션 실패 로그
   *       bizMOB.Storage.set({
   *         _sKey: `transaction.${txId}.error`,
   *         _vValue: {
   *           errorTime: Date.now(),
   *           status: 'failed',
   *           error: error.message,
   *           itemCount: dataList.length
   *         }
   *       });
   *
   *       console.error(`트랜잭션 ${txId} 실패:`, error);
   *       return { success: false, transactionId: txId, error: error.message };
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static setList(arg: {
    _aList: {
      _sKey: string, // Storage 에 저장할 키 값
      _vValue: any, // Storage 에 저장할 값
    }[]
  }): void {
    window.bizMOB.Storage.setList({
      ...arg,
    });
  }
}
