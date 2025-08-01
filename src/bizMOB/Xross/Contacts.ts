export default class Contacts {
  /**
   * Contacts - 디바이스 주소록 접근 및 연락처 관리 시스템
   *
   * @description 모바일 디바이스의 주소록(연락처)에 접근하여 연락처 정보를 검색하고
   * 조회하는 시스템입니다. 앱 환경에서는 Native 주소록 API를 통해 완전한 기능을 지원하며,
   * 웹 환경에서는 보안상의 이유로 기본 구조만 제공됩니다.
   *
   * **주요 기능:**
   * - 디바이스 주소록 전체 조회
   * - 이름/전화번호 기반 연락처 검색
   * - 연락처 상세 정보 조회
   * - 연락처 권한 관리 및 접근 제어
   *
   * **환경별 동작:**
   * - **앱 환경**: Native 주소록 API 완전 지원, 연락처 권한 관리 연동
   * - **웹 환경**: 기본 구조만 제공, 브라우저 보안 정책으로 인한 접근 제한
   *  
   * Contacts.get - 전화번호부 검색
   * 
   * @param {Object} arg - 연락처 조회 설정 객체
   * @param {string} arg._sSearchType - (Default : "", 전체조회) 주소록 검색 대상 필드(name 또는 phone)
   * @param {string} [arg._sSearchText] - (Default : "") 주소록 검색어
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,           // 요청 처리 성공 여부
   *   total_count: number,       // 전체 연락처 수
   *   contacts_count: number,    // 검색된 연락처 수
   *   list: Array<{              // 연락처 목록
   *     fax_number: string,      // 팩스 번호
   *     department: string,      // 부서
   *     concurrent: string,      // 동시 연락처
   *     company_telphone: string,// 회사 전화번호
   *     title: string,           // 직책
   *     full_name: string,       // 이름
   *     email: string,           // 이메일
   *     mobile_number: string,   // 휴대폰 번호
   *     company_name: string,    // 회사명
   *     contact_uid: string,     // 연락처 UID
   *     contact_box_id: string   // 연락처 박스 ID
   *   }>
   * }>} - 연락처 조회 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Contacts/get.json - Mock 응답 데이터 예제
   * @example
   * import { Contacts } from '@bizMOB';
   * // 전체 연락처 조회
   * const allContacts = await Contacts.get({
   *   _sSearchType: ''
   * });
   *
   * if (allContacts.total_count) {
   *   console.log('전체 연락처 수:', allContacts.total_count);
   * }
   *
   * // 이름으로 연락처 검색
   * const nameSearchResult = await Contacts.get({
   *   _sSearchType: 'name',
   *   _sSearchText: '홍길동'
   * });
   *
   * if (nameSearchResult.contacts_count > 0) {
   *   const contact = nameSearchResult.list[0];
   *   console.log('찾은 연락처:', contact.mobile_number);
   * }
   *
   * // 전화번호로 연락처 검색
   * const phoneSearchResult = await Contacts.get({
   *   _sSearchType: 'phone',
   *   _sSearchText: '010-1234-5678'
   * });
   *
   * if (phoneSearchResult.contacts_count > 0) {
   *   console.log('010으로 시작하는 연락처 수:', phoneSearchResult.contacts_count);
   * }
   *
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
