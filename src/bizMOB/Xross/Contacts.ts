export default class Contacts {
  /**
   * 디바이스의 연락처 정보를 조회합니다.
   *
   * 사용자의 디바이스에 저장된 연락처 목록을 검색하고 조회하는 API입니다.
   * 이름이나 전화번호를 기준으로 필터링하여 원하는 연락처 정보를 찾을 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 연락처 데이터베이스 접근 (권한 필요)
   * - 웹: 브라우저 연락처 API 또는 제한된 접근 (보안 정책에 따라 제한)
   *
   * @purpose 연락처 선택 기능, 전화걸기 연동, 주소록 동기화, 사용자 검색
   *
   * @param {Object} arg - 연락처 조회 설정 객체
   * @param {''|'name'|'phone'} arg._sSearchType - 검색 타입
   * @param {''} arg._sSearchType - 전체 연락처 조회 (검색 조건 없음)
   * @param {'name'} arg._sSearchType - 이름으로 검색
   * @param {'phone'} arg._sSearchType - 전화번호로 검색
   * @param {string} [arg._sSearchText] - 검색어 (SearchType이 설정된 경우 필수)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 연락처 조회 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '9999': 권한 거부)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 연락처 데이터
   * @returns {Array} return._oData.contacts - 연락처 목록
   * @returns {Object} return._oData.contacts[] - 개별 연락처 정보
   * @returns {string} return._oData.contacts[].id - 연락처 고유 ID
   * @returns {string} return._oData.contacts[].name - 연락처 이름
   * @returns {string} return._oData.contacts[].displayName - 표시 이름
   * @returns {Array} return._oData.contacts[].phoneNumbers - 전화번호 목록
   * @returns {string} return._oData.contacts[].phoneNumbers[].type - 전화번호 타입 (mobile, home, work)
   * @returns {string} return._oData.contacts[].phoneNumbers[].value - 전화번호
   * @returns {Array} return._oData.contacts[].emails - 이메일 목록
   * @returns {string} return._oData.contacts[].emails[].type - 이메일 타입
   * @returns {string} return._oData.contacts[].emails[].value - 이메일 주소
   * @returns {number} return._oData.totalCount - 총 연락처 개수
   * @returns {number} return._oData.searchCount - 검색된 연락처 개수
   *
   * @caution
   * - 연락처 접근 권한이 필요합니다 (앱 설치 시 또는 런타임 권한 요청)
   * - 대량의 연락처 조회 시 성능에 영향을 줄 수 있습니다
   * - 개인정보 보호를 위해 필요한 경우에만 사용하세요
   * - 웹에서는 브라우저 보안 정책에 따라 제한될 수 있습니다
   * - 검색어에 특수문자가 포함된 경우 정확한 결과가 나오지 않을 수 있습니다
   *
   * @see public/mock/bizMOB/Contacts/get.json - Mock 응답 데이터 예제
   *
   * @example
   * // 전체 연락처 조회
   * const allContacts = await bizMOB.Contacts.get({
   *   _sSearchType: ''
   * });
   *
   * if (allContacts._bResult) {
   *   console.log('총 연락처 수:', allContacts._oData.totalCount);
   *   allContacts._oData.contacts.forEach(contact => {
   *     console.log(`이름: ${contact.name}, 전화번호: ${contact.phoneNumbers[0]?.value}`);
   *   });
   * }
   *
   * // 이름으로 연락처 검색
   * const nameSearchResult = await bizMOB.Contacts.get({
   *   _sSearchType: 'name',
   *   _sSearchText: '홍길동'
   * });
   *
   * if (nameSearchResult._bResult && nameSearchResult._oData.searchCount > 0) {
   *   const contact = nameSearchResult._oData.contacts[0];
   *   console.log('찾은 연락처:', contact.displayName);
   *
   *   // 첫 번째 전화번호로 통화
   *   if (contact.phoneNumbers.length > 0) {
   *     const phoneNumber = contact.phoneNumbers[0].value;
   *     await bizMOB.System.callPhone({
   *       _sPhoneNumber: phoneNumber
   *     });
   *   }
   * }
   *
   * // 전화번호로 연락처 검색
   * const phoneSearchResult = await bizMOB.Contacts.get({
   *   _sSearchType: 'phone',
   *   _sSearchText: '010-1234-5678'
   * });
   *
   * if (phoneSearchResult._bResult) {
   *   console.log('해당 번호의 연락처:', phoneSearchResult._oData.contacts);
   * }
   *
   * // 연락처 선택 UI 구현
   * const showContactPicker = async () => {
   *   try {
   *     const result = await bizMOB.Contacts.get({
   *       _sSearchType: ''
   *     });
   *
   *     if (result._bResult) {
   *       const contacts = result._oData.contacts;
   *
   *       // 연락처 목록을 UI에 표시
   *       const contactList = contacts.map(contact => ({
   *         id: contact.id,
   *         name: contact.displayName || contact.name,
   *         phone: contact.phoneNumbers[0]?.value || '번호 없음',
   *         email: contact.emails[0]?.value || '이메일 없음'
   *       }));
   *
   *       return contactList;
   *     }
   *   } catch (error) {
   *     if (error.code === '9999') {
   *       alert('연락처 접근 권한이 필요합니다.');
   *     } else {
   *       console.error('연락처 조회 실패:', error);
   *     }
   *   }
   * };
   *
   * // 부분 검색 구현
   * const searchContacts = async (searchTerm) => {
   *   if (searchTerm.length < 2) {
   *     return []; // 최소 2글자 이상 입력 시 검색
   *   }
   *
   *   // 이름으로 먼저 검색
   *   const nameResult = await bizMOB.Contacts.get({
   *     _sSearchType: 'name',
   *     _sSearchText: searchTerm
   *   });
   *
   *   // 전화번호로도 검색
   *   const phoneResult = await bizMOB.Contacts.get({
   *     _sSearchType: 'phone',
   *     _sSearchText: searchTerm
   *   });
   *
   *   // 결과 합치기 (중복 제거)
   *   const allContacts = [];
   *   if (nameResult._bResult) {
   *     allContacts.push(...nameResult._oData.contacts);
   *   }
   *   if (phoneResult._bResult) {
   *     phoneResult._oData.contacts.forEach(contact => {
   *       if (!allContacts.find(c => c.id === contact.id)) {
   *         allContacts.push(contact);
   *       }
   *     });
   *   }
   *
   *   return allContacts;
   * };
   *
   * @since bizMOB 4.0.0
   */
  static get(arg: {
    _sSearchType: '' | 'name' | 'phone', // 주소록 검색 타입. "" or name or phone
    _sSearchText?: string, // 주소록 검색어
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Contacts.get({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
