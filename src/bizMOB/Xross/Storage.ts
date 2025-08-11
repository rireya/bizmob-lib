// sessionStorage와 동일
export default class Storage {
  /**
   * Storage 데이터 조회
   *
   * @param {Object} arg - Storage 조회 설정 객체
   * @param {string} arg._sKey - 저장 값의 키
   * @returns {*} 저장된 데이터 값. 키가 존재하지 않으면 null 반환
   * @example
   * import { Storage } from '@bizMOB';
   * // 기본 사용법
   * const userData = Storage.get({ _sKey: 'user_info' });
   * if (userData) {
   *   console.log('사용자 정보:', userData);
   * }
   */
  static get(arg: {
    _sKey: string, // Storage 에서 가져올 키 값
  }): any {
    return window.bizMOB.Storage.get({
      ...arg,
    });
  }
  /**
   * Storage 데이터 삭제
   *
   * @param {Object} arg - Storage 제거 설정 객체
   * @param {string} arg._sKey - Storage에서 삭제할 키 값
   * @example
   * import { Storage } from '@bizMOB';
   * // 사용자 정보 삭제
   * Storage.remove({ _sKey: 'user_session' });
   *
   */
  static remove(arg: {
    _sKey: string, // Storage 에서 삭제할 키 값
  }): void {
    window.bizMOB.Storage.remove({
      ...arg,
    });
  }

  /**
   * Storage에 데이터 저장
   *
   * @param {Object} arg - Storage 저장 설정 객체
   * @param {string} arg._sKey - Storage에 저장할 키 값
   * @param {any} arg._vValue - Storage에 저장할 값
   * @example
   * import { Storage } from '@bizMOB';
   * // 기본 데이터 저장
   * Storage.set({
   *   _sKey: 'user.name',
   *   _vValue: '홍길동'
   * });
   * console.log('사용자 정보 저장 완료');
   *
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
   * Storage에 데이터 저장 (복수)
   * 
   * @param {Object} arg - Storage 일괄 저장 설정 객체
   * @param {Array<Object>} arg._aList - 저장할 키-값 쌍의 배열
   * @param {string} arg._aList[]._sKey - Storage에 저장할 키 값
   * @param {any} arg._aList[]._vValue - Storage에 저장할 값
   * @example
   * import { Storage } from '@bizMOB';
   * // 기본 일괄 저장
   * Storage.setList({
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
