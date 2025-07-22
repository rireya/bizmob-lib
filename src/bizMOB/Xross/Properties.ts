// localStorage와 동일
export default class Properties {
  /**
   * Properties에서 지정된 키에 해당하는 값을 조회합니다.
   *
   * 애플리케이션의 설정값, 사용자 기본 설정, 캐시된 데이터 등을 안전하게 조회하는 API입니다.
   * localStorage와 동일한 동작을 하지만 크로스 플랫폼 호환성을 제공합니다.
   *
   * @description
   * - 앱: 네이티브 Properties 저장소에서 데이터 조회
   * - 웹: localStorage에서 데이터 조회 및 자동 JSON 파싱
   *
   * @purpose 설정값 조회, 사용자 기본설정 로드, 캐시 데이터 조회, 임시 데이터 조회
   *
   * @param {Object} arg - Properties 조회 설정 객체
   * @param {string} arg._sKey - 조회할 Property의 키 값
   *   - 일반적인 키 네이밍 규칙: `category.subcategory.item` 형식 권장
   *   - 예: `'user.settings.theme'`, `'app.cache.userList'`, `'temp.formData'`
   *
   * @returns {any} 저장된 값 (문자열, 숫자, 객체, 배열 등)
   *   - 키가 존재하지 않는 경우: `null` 반환
   *   - 저장된 값이 JSON 형식인 경우: 자동으로 파싱된 객체 반환
   *   - 원시 데이터 타입인 경우: 해당 타입 그대로 반환
   *
   * @caution
   * - 존재하지 않는 키 조회 시 null이 반환되므로 null 체크가 필요합니다
   * - 대용량 데이터 조회 시 성능에 영향을 줄 수 있습니다
   * - 민감한 정보는 암호화된 상태로 저장/조회해야 합니다
   * - 키 이름에 특수문자 사용 시 주의가 필요합니다
   *
   * @example
   * // 기본 값 조회
   * const theme = bizMOB.Properties.get({
   *   _sKey: 'user.settings.theme'
   * });
   *
   * if (theme) {
   *   console.log('현재 테마:', theme); // 'dark' 또는 'light'
   *   applyTheme(theme);
   * } else {
   *   console.log('테마 설정이 없습니다. 기본값 사용');
   *   applyTheme('light'); // 기본값 적용
   * }
   *
   * @example
   * // 사용자 정보 조회
   * const userInfo = bizMOB.Properties.get({
   *   _sKey: 'user.profile'
   * });
   *
   * if (userInfo) {
   *   console.log('사용자 이름:', userInfo.name);
   *   console.log('이메일:', userInfo.email);
   *   console.log('마지막 로그인:', userInfo.lastLogin);
   *
   *   // UI에 사용자 정보 표시
   *   updateUserProfile(userInfo);
   * } else {
   *   console.log('사용자 프로필 정보가 없습니다.');
   *   redirectToProfileSetup();
   * }
   *
   * @example
   * // 앱 설정값 조회 및 기본값 처리
   * function getAppSetting(key, defaultValue = null) {
   *   const value = bizMOB.Properties.get({
   *     _sKey: `app.settings.${key}`
   *   });
   *
   *   return value !== null ? value : defaultValue;
   * }
   *
   * // 사용 예시
   * const autoSave = getAppSetting('autoSave', true);
   * const saveInterval = getAppSetting('saveInterval', 30); // 초 단위
   * const language = getAppSetting('language', 'ko');
   *
   * console.log('자동 저장:', autoSave);
   * console.log('저장 간격:', saveInterval, '초');
   * console.log('언어 설정:', language);
   *
   * @example
   * // 캐시된 데이터 조회
   * function getCachedData(cacheKey, maxAge = 300000) { // 5분 기본값
   *   const cacheItem = bizMOB.Properties.get({
   *     _sKey: `cache.${cacheKey}`
   *   });
   *
   *   if (cacheItem) {
   *     const now = Date.now();
   *     const cacheAge = now - cacheItem.timestamp;
   *
   *     if (cacheAge < maxAge) {
   *       console.log('캐시된 데이터 사용:', cacheKey);
   *       return cacheItem.data;
   *     } else {
   *       console.log('캐시 만료:', cacheKey);
   *       // 만료된 캐시 삭제
   *       bizMOB.Properties.remove({
   *         _sKey: `cache.${cacheKey}`
   *       });
   *       return null;
   *     }
   *   } else {
   *     console.log('캐시 없음:', cacheKey);
   *     return null;
   *   }
   * }
   *
   * // 사용 예시
   * const userList = getCachedData('userList', 600000); // 10분 캐시
   * if (userList) {
   *   displayUserList(userList);
   * } else {
   *   // 서버에서 새로운 데이터 로드
   *   loadUserListFromServer();
   * }
   *
   * @example
   * // 배열 데이터 조회 및 처리
   * const recentSearches = bizMOB.Properties.get({
   *   _sKey: 'user.recentSearches'
   * });
   *
   * if (recentSearches && Array.isArray(recentSearches)) {
   *   console.log('최근 검색어 개수:', recentSearches.length);
   *
   *   // 최근 5개만 표시
   *   const displaySearches = recentSearches.slice(0, 5);
   *   displayRecentSearches(displaySearches);
   * } else {
   *   console.log('최근 검색어가 없습니다.');
   *   hideRecentSearches();
   * }
   *
   * @example
   * // 복잡한 객체 데이터 조회
   * const appState = bizMOB.Properties.get({
   *   _sKey: 'app.state'
   * });
   *
   * if (appState) {
   *   // 각 속성 개별 처리
   *   const {
   *     currentView = 'home',
   *     selectedItems = [],
   *     filters = {},
   *     sortOrder = 'asc'
   *   } = appState;
   *
   *   console.log('현재 화면:', currentView);
   *   console.log('선택된 항목:', selectedItems);
   *   console.log('적용된 필터:', filters);
   *   console.log('정렬 순서:', sortOrder);
   *
   *   // 앱 상태 복원
   *   restoreAppState({
   *     currentView,
   *     selectedItems,
   *     filters,
   *     sortOrder
   *   });
   * } else {
   *   console.log('저장된 앱 상태가 없습니다. 초기 상태로 시작');
   *   initializeAppState();
   * }
   *
   * @since bizMOB 4.0.0
   */
  static get(arg: {
    _sKey: string, // Property에서 가져올 키 값
  }): any {
    return window.bizMOB.Properties.get({
      ...arg,
    });
  }

  /**
   * Properties에서 지정된 키에 해당하는 데이터를 삭제합니다.
   *
   * 불필요한 설정값, 만료된 캐시 데이터, 임시 저장 데이터 등을 안전하게 제거하는 API입니다.
   * localStorage의 removeItem과 동일한 동작을 하지만 크로스 플랫폼 호환성을 제공합니다.
   *
   * @description
   * - 앱: 네이티브 Properties 저장소에서 데이터 삭제
   * - 웹: localStorage에서 데이터 삭제
   *
   * @purpose 불필요한 데이터 정리, 캐시 삭제, 임시 데이터 제거, 사용자 데이터 초기화
   *
   * @param {Object} arg - Properties 삭제 설정 객체
   * @param {string} arg._sKey - 삭제할 Property의 키 값
   *   - 정확한 키 이름을 입력해야 합니다
   *   - 존재하지 않는 키를 삭제해도 오류가 발생하지 않습니다
   *   - 와일드카드나 패턴 매칭은 지원하지 않습니다
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 삭제된 데이터는 복구할 수 없으므로 신중하게 사용하세요
   * - 중요한 설정값 삭제 전에는 백업을 고려하세요
   * - 존재하지 않는 키 삭제 시에도 오류가 발생하지 않습니다
   * - 다른 모듈에서 사용 중인 데이터 삭제 시 주의가 필요합니다
   *
   * @example
   * // 기본 데이터 삭제
   * bizMOB.Properties.remove({
   *   _sKey: 'temp.formData'
   * });
   * console.log('임시 폼 데이터가 삭제되었습니다.');
   *
   * @example
   * // 캐시 데이터 삭제
   * function clearCache(cacheKey) {
   *   bizMOB.Properties.remove({
   *     _sKey: `cache.${cacheKey}`
   *   });
   *   console.log(`캐시 삭제됨: ${cacheKey}`);
   * }
   *
   * // 사용 예시
   * clearCache('userList');
   * clearCache('productList');
   * clearCache('notifications');
   *
   * @example
   * // 사용자 로그아웃 시 개인 데이터 정리
   * function clearUserData() {
   *   // 사용자 프로필 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: 'user.profile'
   *   });
   *
   *   // 사용자 설정 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: 'user.settings'
   *   });
   *
   *   // 최근 검색어 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: 'user.recentSearches'
   *   });
   *
   *   // 임시 저장된 작업 데이터 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: 'temp.workData'
   *   });
   *
   *   console.log('사용자 데이터가 모두 삭제되었습니다.');
   * }
   *
   * @example
   * // 조건부 데이터 삭제
   * function clearExpiredData() {
   *   const sessionData = bizMOB.Properties.get({
   *     _sKey: 'user.session'
   *   });
   *
   *   if (sessionData) {
   *     const now = Date.now();
   *     const sessionAge = now - sessionData.timestamp;
   *     const maxAge = 24 * 60 * 60 * 1000; // 24시간
   *
   *     if (sessionAge > maxAge) {
   *       bizMOB.Properties.remove({
   *         _sKey: 'user.session'
   *       });
   *       console.log('만료된 세션 데이터가 삭제되었습니다.');
   *       return true;
   *     } else {
   *       console.log('세션 데이터가 유효합니다.');
   *       return false;
   *     }
   *   } else {
   *     console.log('세션 데이터가 없습니다.');
   *     return false;
   *   }
   * }
   *
   * @example
   * // 설정 초기화 (삭제 후 기본값 설정)
   * function resetAppSettings() {
   *   // 기존 설정 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: 'app.settings'
   *   });
   *
   *   // 기본 설정값 설정
   *   const defaultSettings = {
   *     theme: 'light',
   *     language: 'ko',
   *     autoSave: true,
   *     saveInterval: 30,
   *     notifications: true
   *   };
   *
   *   bizMOB.Properties.set({
   *     _sKey: 'app.settings',
   *     _vValue: defaultSettings
   *   });
   *
   *   console.log('앱 설정이 초기화되었습니다.');
   *   return defaultSettings;
   * }
   *
   * @example
   * // 안전한 데이터 삭제 (백업 후 삭제)
   * function safeRemove(key, createBackup = false) {
   *   if (createBackup) {
   *     const data = bizMOB.Properties.get({
   *       _sKey: key
   *     });
   *
   *     if (data) {
   *       // 백업 생성
   *       const backupKey = `backup.${key}.${Date.now()}`;
   *       bizMOB.Properties.set({
   *         _sKey: backupKey,
   *         _vValue: {
   *           originalKey: key,
   *           data: data,
   *           deletedAt: new Date().toISOString()
   *         }
   *       });
   *       console.log(`데이터 백업 생성: ${backupKey}`);
   *     }
   *   }
   *
   *   // 원본 데이터 삭제
   *   bizMOB.Properties.remove({
   *     _sKey: key
   *   });
   *   console.log(`데이터 삭제 완료: ${key}`);
   * }
   *
   * // 사용 예시
   * safeRemove('user.temporaryData', true); // 백업 생성 후 삭제
   * safeRemove('cache.oldData', false); // 백업 없이 삭제
   *
   * @example
   * // 대량 데이터 정리
   * function cleanupStorageByPattern(pattern) {
   *   // 주의: 실제로는 모든 키를 조회해서 패턴 매칭해야 함
   *   // 이 예시는 일반적인 정리 작업을 보여줍니다
   *
   *   const keysToRemove = [
   *     'temp.formData',
   *     'temp.uploadProgress',
   *     'temp.searchResults',
   *     'cache.expiredData'
   *   ];
   *
   *   let removedCount = 0;
   *   keysToRemove.forEach(key => {
   *     const data = bizMOB.Properties.get({ _sKey: key });
   *     if (data) {
   *       bizMOB.Properties.remove({ _sKey: key });
   *       removedCount++;
   *       console.log(`삭제됨: ${key}`);
   *     }
   *   });
   *
   *   console.log(`총 ${removedCount}개의 항목이 삭제되었습니다.`);
   *   return removedCount;
   * }
   *
   * @since bizMOB 4.0.0
   */
  static remove(arg: {
    _sKey: string, // Property에서 삭제할 키 값
  }): void {
    window.bizMOB.Properties.remove({
      ...arg,
    });
  }

  /**
   * Properties에 단일 키-값 쌍을 저장합니다.
   *
   * 애플리케이션 설정값, 사용자 기본 설정, 캐시 데이터, 임시 데이터 등을 안전하게 저장하는 API입니다.
   * localStorage의 setItem과 동일한 동작을 하지만 크로스 플랫폼 호환성과 자동 직렬화를 제공합니다.
   *
   * @description
   * - 앱: 네이티브 Properties 저장소에 데이터 저장 (자동 직렬화)
   * - 웹: localStorage에 데이터 저장 (자동 JSON 직렬화)
   *
   * @purpose 설정값 저장, 사용자 기본설정 저장, 캐시 데이터 저장, 임시 데이터 저장
   *
   * @param {Object} arg - Properties 저장 설정 객체
   * @param {string} arg._sKey - 저장할 Property의 키 값
   *   - 계층적 구조 권장: `category.subcategory.item` 형식
   *   - 고유한 키 이름을 사용하여 충돌 방지
   *   - 예: `'user.settings.theme'`, `'app.cache.data'`, `'temp.formData'`
   * @param {any} arg._vValue - 저장할 값
   *   - 원시 타입: string, number, boolean
   *   - 복합 타입: object, array
   *   - 자동으로 JSON 직렬화되어 저장됨
   *   - null, undefined도 저장 가능
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 대용량 데이터 저장 시 성능에 영향을 줄 수 있습니다
   * - 순환 참조가 있는 객체는 저장할 수 없습니다
   * - 민감한 정보는 암호화하여 저장하세요
   * - 기존 키가 있을 경우 덮어쓰게 됩니다
   *
   * @example
   * // 기본 값 저장
   * bizMOB.Properties.set({
   *   _sKey: 'user.settings.theme',
   *   _vValue: 'dark'
   * });
   * console.log('테마 설정이 저장되었습니다.');
   *
   * @example
   * // 숫자 값 저장
   * bizMOB.Properties.set({
   *   _sKey: 'app.settings.autoSaveInterval',
   *   _vValue: 30
   * });
   *
   * bizMOB.Properties.set({
   *   _sKey: 'user.stats.loginCount',
   *   _vValue: 42
   * });
   *
   * @example
   * // 불린 값 저장
   * bizMOB.Properties.set({
   *   _sKey: 'user.settings.notifications',
   *   _vValue: true
   * });
   *
   * bizMOB.Properties.set({
   *   _sKey: 'app.flags.firstRun',
   *   _vValue: false
   * });
   *
   * @example
   * // 객체 저장
   * const userProfile = {
   *   id: 'user123',
   *   name: '홍길동',
   *   email: 'hong@example.com',
   *   age: 30,
   *   preferences: {
   *     language: 'ko',
   *     timezone: 'Asia/Seoul',
   *     newsletter: true
   *   },
   *   lastLogin: new Date().toISOString()
   * };
   *
   * bizMOB.Properties.set({
   *   _sKey: 'user.profile',
   *   _vValue: userProfile
   * });
   * console.log('사용자 프로필이 저장되었습니다.');
   *
   * @example
   * // 배열 저장
   * const recentSearches = [
   *   { keyword: '검색어1', timestamp: Date.now() },
   *   { keyword: '검색어2', timestamp: Date.now() - 60000 },
   *   { keyword: '검색어3', timestamp: Date.now() - 120000 }
   * ];
   *
   * bizMOB.Properties.set({
   *   _sKey: 'user.recentSearches',
   *   _vValue: recentSearches
   * });
   *
   * @example
   * // 캐시 데이터 저장 (타임스탬프 포함)
   * function setCacheData(key, data, ttl = 300000) { // 5분 기본 TTL
   *   const cacheItem = {
   *     data: data,
   *     timestamp: Date.now(),
   *     ttl: ttl,
   *     expiresAt: Date.now() + ttl
   *   };
   *
   *   bizMOB.Properties.set({
   *     _sKey: `cache.${key}`,
   *     _vValue: cacheItem
   *   });
   *
   *   console.log(`캐시 저장: ${key}, 만료 시간: ${new Date(cacheItem.expiresAt).toLocaleString()}`);
   * }
   *
   * // 사용 예시
   * setCacheData('userList', userListData, 600000); // 10분 캐시
   * setCacheData('productList', productData, 1800000); // 30분 캐시
   *
   * @example
   * // 앱 상태 저장
   * function saveAppState(currentView, selectedItems, filters) {
   *   const appState = {
   *     currentView: currentView,
   *     selectedItems: selectedItems,
   *     filters: filters,
   *     sortOrder: 'desc',
   *     savedAt: new Date().toISOString(),
   *     version: '1.0'
   *   };
   *
   *   bizMOB.Properties.set({
   *     _sKey: 'app.state',
   *     _vValue: appState
   *   });
   *
   *   console.log('앱 상태가 저장되었습니다:', currentView);
   * }
   *
   * @example
   * // 폼 데이터 임시 저장
   * function saveFormData(formId, formData) {
   *   const tempData = {
   *     formId: formId,
   *     data: formData,
   *     savedAt: Date.now(),
   *     source: 'autoSave'
   *   };
   *
   *   bizMOB.Properties.set({
   *     _sKey: `temp.form.${formId}`,
   *     _vValue: tempData
   *   });
   *
   *   console.log(`폼 데이터 임시 저장: ${formId}`);
   * }
   *
   * // 사용 예시
   * const formData = {
   *   title: '제목 입력중...',
   *   content: '내용 작성중...',
   *   category: 'notice',
   *   tags: ['중요', '공지']
   * };
   * saveFormData('post-create', formData);
   *
   * @example
   * // 설정값 업데이트 (기존 값과 병합)
   * function updateUserSettings(newSettings) {
   *   // 기존 설정 조회
   *   const currentSettings = bizMOB.Properties.get({
   *     _sKey: 'user.settings'
   *   }) || {};
   *
   *   // 새 설정과 병합
   *   const updatedSettings = {
   *     ...currentSettings,
   *     ...newSettings,
   *     updatedAt: new Date().toISOString()
   *   };
   *
   *   // 업데이트된 설정 저장
   *   bizMOB.Properties.set({
   *     _sKey: 'user.settings',
   *     _vValue: updatedSettings
   *   });
   *
   *   console.log('사용자 설정이 업데이트되었습니다.');
   *   return updatedSettings;
   * }
   *
   * // 사용 예시
   * updateUserSettings({
   *   theme: 'dark',
   *   notifications: false,
   *   language: 'en'
   * });
   *
   * @example
   * // 버전 관리가 포함된 데이터 저장
   * function saveVersionedData(key, data) {
   *   const versionedData = {
   *     version: '1.0',
   *     schema: 'user-data-v1',
   *     data: data,
   *     metadata: {
   *       createdAt: new Date().toISOString(),
   *       platform: navigator.platform,
   *       userAgent: navigator.userAgent
   *     }
   *   };
   *
   *   bizMOB.Properties.set({
   *     _sKey: key,
   *     _vValue: versionedData
   *   });
   *
   *   console.log(`버전 관리 데이터 저장: ${key} (v${versionedData.version})`);
   * }
   *
   * @example
   * // 암호화된 데이터 저장 (가상의 암호화 함수 사용)
   * async function saveSecureData(key, sensitiveData) {
   *   try {
   *     // 민감한 데이터 암호화
   *     const encryptedData = await encryptData(JSON.stringify(sensitiveData));
   *
   *     bizMOB.Properties.set({
   *       _sKey: `secure.${key}`,
   *       _vValue: {
   *         encrypted: true,
   *         data: encryptedData,
   *         algorithm: 'AES-256',
   *         timestamp: Date.now()
   *       }
   *     });
   *
   *     console.log('암호화된 데이터가 저장되었습니다.');
   *   } catch (error) {
   *     console.error('데이터 암호화 실패:', error);
   *     throw error;
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static set(arg: {
    _sKey: string, // Property에 저장할 키 값
    _vValue: any, // Property에 저장할 값
  }): void {
    window.bizMOB.Properties.set({
      ...arg,
    });
  }

  /**
   * Properties에 여러 개의 키-값 쌍을 일괄적으로 저장합니다.
   *
   * 다수의 설정값이나 관련된 데이터들을 한 번에 효율적으로 저장하는 API입니다.
   * 개별 저장보다 성능상 이점이 있으며, 원자적 연산으로 일관성을 보장합니다.
   *
   * @description
   * - 앱: 네이티브 Properties 저장소에 배치 저장 수행
   * - 웹: localStorage에 여러 아이템을 순차적으로 저장
   *
   * @purpose 초기 설정 저장, 대량 캐시 데이터 저장, 앱 상태 복원, 배치 데이터 처리
   *
   * @param {Object} arg - Properties 배치 저장 설정 객체
   * @param {Array} arg._aList - 저장할 키-값 쌍의 배열
   * @param {string} arg._aList[]._sKey - 각 항목의 키 값
   * @param {any} arg._aList[]._vValue - 각 항목의 저장할 값
   *
   * @returns {void} 반환값 없음
   *
   * @caution
   * - 배열의 모든 항목이 순차적으로 저장되므로 중간에 오류가 발생하면 일부만 저장될 수 있습니다
   * - 동일한 키가 배열 내에 중복되면 마지막 값으로 덮어쓰게 됩니다
   * - 대량 데이터 저장 시 메모리 사용량과 처리 시간을 고려하세요
   * - 빈 배열이나 null 배열 전달 시 아무 동작하지 않습니다
   *
   * @example
   * // 기본 설정값들 일괄 저장
   * bizMOB.Properties.setList({
   *   _aList: [
   *     { _sKey: 'app.settings.theme', _vValue: 'dark' },
   *     { _sKey: 'app.settings.language', _vValue: 'ko' },
   *     { _sKey: 'app.settings.autoSave', _vValue: true },
   *     { _sKey: 'app.settings.saveInterval', _vValue: 30 }
   *   ]
   * });
   * console.log('앱 기본 설정이 저장되었습니다.');
   *
   * @example
   * // 사용자 프로필 관련 데이터 일괄 저장
   * const userProfile = {
   *   id: 'user123',
   *   name: '홍길동',
   *   email: 'hong@example.com'
   * };
   *
   * const userSettings = {
   *   theme: 'light',
   *   notifications: true,
   *   language: 'ko'
   * };
   *
   * const userPreferences = {
   *   timezone: 'Asia/Seoul',
   *   dateFormat: 'YYYY-MM-DD',
   *   currency: 'KRW'
   * };
   *
   * bizMOB.Properties.setList({
   *   _aList: [
   *     { _sKey: 'user.profile', _vValue: userProfile },
   *     { _sKey: 'user.settings', _vValue: userSettings },
   *     { _sKey: 'user.preferences', _vValue: userPreferences },
   *     { _sKey: 'user.lastLogin', _vValue: new Date().toISOString() }
   *   ]
   * });
   * console.log('사용자 데이터가 일괄 저장되었습니다.');
   *
   * @example
   * // 앱 초기화 시 기본 데이터 설정
   * function initializeApp() {
   *   const initData = [
   *     { _sKey: 'app.version', _vValue: '1.0.0' },
   *     { _sKey: 'app.initialized', _vValue: true },
   *     { _sKey: 'app.firstRun', _vValue: true },
   *     { _sKey: 'app.installDate', _vValue: new Date().toISOString() },
   *     { _sKey: 'app.settings.theme', _vValue: 'light' },
   *     { _sKey: 'app.settings.language', _vValue: 'ko' },
   *     { _sKey: 'app.features.tutorial', _vValue: true },
   *     { _sKey: 'app.features.analytics', _vValue: false }
   *   ];
   *
   *   bizMOB.Properties.setList({
   *     _aList: initData
   *   });
   *
   *   console.log('앱 초기화가 완료되었습니다.');
   * }
   *
   * @example
   * // 캐시 데이터 일괄 저장
   * function batchCacheData(cacheItems) {
   *   const timestamp = Date.now();
   *   const ttl = 300000; // 5분
   *
   *   const cacheList = cacheItems.map((item, index) => ({
   *     _sKey: `cache.${item.key}`,
   *     _vValue: {
   *       data: item.data,
   *       timestamp: timestamp,
   *       ttl: ttl,
   *       expiresAt: timestamp + ttl,
   *       index: index
   *     }
   *   }));
   *
   *   bizMOB.Properties.setList({
   *     _aList: cacheList
   *   });
   *
   *   console.log(`${cacheItems.length}개의 캐시 항목이 저장되었습니다.`);
   * }
   *
   * // 사용 예시
   * batchCacheData([
   *   { key: 'userList', data: userListData },
   *   { key: 'productList', data: productData },
   *   { key: 'categoryList', data: categoryData }
   * ]);
   *
   * @example
   * // 폼 데이터 여러 단계 저장
   * function saveMultiStepForm(formData) {
   *   const saveList = [
   *     { _sKey: 'form.step1', _vValue: formData.personalInfo },
   *     { _sKey: 'form.step2', _vValue: formData.addressInfo },
   *     { _sKey: 'form.step3', _vValue: formData.preferences },
   *     { _sKey: 'form.metadata', _vValue: {
   *       currentStep: formData.currentStep,
   *       totalSteps: formData.totalSteps,
   *       startedAt: formData.startedAt,
   *       lastModified: Date.now(),
   *       isComplete: formData.isComplete
   *     }}
   *   ];
   *
   *   bizMOB.Properties.setList({
   *     _aList: saveList
   *   });
   *
   *   console.log('다단계 폼 데이터가 저장되었습니다.');
   * }
   *
   * @example
   * // 설정 프리셋 저장
   * function saveSettingsPreset(presetName, settings) {
   *   const presetData = [
   *     { _sKey: `preset.${presetName}.theme`, _vValue: settings.theme },
   *     { _sKey: `preset.${presetName}.language`, _vValue: settings.language },
   *     { _sKey: `preset.${presetName}.notifications`, _vValue: settings.notifications },
   *     { _sKey: `preset.${presetName}.privacy`, _vValue: settings.privacy },
   *     { _sKey: `preset.${presetName}.metadata`, _vValue: {
   *       name: presetName,
   *       createdAt: new Date().toISOString(),
   *       description: settings.description || '',
   *       version: '1.0'
   *     }}
   *   ];
   *
   *   bizMOB.Properties.setList({
   *     _aList: presetData
   *   });
   *
   *   console.log(`설정 프리셋 '${presetName}'이 저장되었습니다.`);
   * }
   *
   * @example
   * // 상태 백업 생성
   * function createStateBackup(backupId) {
   *   // 현재 상태 수집
   *   const userProfile = bizMOB.Properties.get({ _sKey: 'user.profile' });
   *   const userSettings = bizMOB.Properties.get({ _sKey: 'user.settings' });
   *   const appState = bizMOB.Properties.get({ _sKey: 'app.state' });
   *
   *   const backupData = [
   *     { _sKey: `backup.${backupId}.userProfile`, _vValue: userProfile },
   *     { _sKey: `backup.${backupId}.userSettings`, _vValue: userSettings },
   *     { _sKey: `backup.${backupId}.appState`, _vValue: appState },
   *     { _sKey: `backup.${backupId}.metadata`, _vValue: {
   *       backupId: backupId,
   *       createdAt: new Date().toISOString(),
   *       source: 'manual',
   *       itemCount: 3
   *     }}
   *   ];
   *
   *   bizMOB.Properties.setList({
   *     _aList: backupData
   *   });
   *
   *   console.log(`상태 백업이 생성되었습니다: ${backupId}`);
   * }
   *
   * @example
   * // 객체를 개별 키로 분할 저장
   * function saveObjectAsKeys(prefix, obj) {
   *   const keyValuePairs = Object.entries(obj).map(([key, value]) => ({
   *     _sKey: `${prefix}.${key}`,
   *     _vValue: value
   *   }));
   *
   *   // 메타데이터 추가
   *   keyValuePairs.push({
   *     _sKey: `${prefix}._metadata`,
   *     _vValue: {
   *       keys: Object.keys(obj),
   *       count: Object.keys(obj).length,
   *       savedAt: new Date().toISOString()
   *     }
   *   });
   *
   *   bizMOB.Properties.setList({
   *     _aList: keyValuePairs
   *   });
   *
   *   console.log(`객체가 ${keyValuePairs.length}개의 개별 키로 저장되었습니다.`);
   * }
   *
   * // 사용 예시
   * const gameSettings = {
   *   difficulty: 'normal',
   *   sound: true,
   *   music: true,
   *   vibration: false,
   *   language: 'ko'
   * };
   * saveObjectAsKeys('game.settings', gameSettings);
   *
   * @example
   * // 조건부 배치 저장 (기존 값 확인 후 저장)
   * function conditionalBatchSave(items, overwrite = false) {
   *   const saveList = [];
   *
   *   items.forEach(item => {
   *     const existing = bizMOB.Properties.get({ _sKey: item._sKey });
   *
   *     if (!existing || overwrite) {
   *       saveList.push(item);
   *     } else {
   *       console.log(`키 '${item._sKey}'는 이미 존재하므로 건너뜁니다.`);
   *     }
   *   });
   *
   *   if (saveList.length > 0) {
   *     bizMOB.Properties.setList({
   *       _aList: saveList
   *     });
   *     console.log(`${saveList.length}개 항목이 저장되었습니다.`);
   *   } else {
   *     console.log('저장할 새로운 항목이 없습니다.');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static setList(arg: {
    _aList: {
      _sKey: string, // Property에 저장할 키 값
      _vValue: any, // Property에 저장할 값
    }[]
  }): void {
    window.bizMOB.Properties.setList({
      ...arg,
    });
  }
}
