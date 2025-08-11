// localStorage와 동일
export default class Properties {
  /**
   * Properties 데이터 조회
   *
   * @description 앱 환경에서는 FStorage 메모리 캐시를 통해 빠른 조회가 가능하며,
   * 웹 환경에서는 로컬스토리지에서 데이터를 조회합니다.
   * 
   * @param {Object} arg - Properties 조회 설정 객체
   * @param {string} arg._sKey - 조회할 Property의 키 값
   * @returns {*} 저장된 데이터 값. 키가 존재하지 않으면 null 반환
   * @example
   * import { Properties } from '@bizMOB';
   * // 기본 값 조회
   * const theme = Properties.get({
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
   */
  static get(arg: {
    _sKey: string, // Property에서 가져올 키 값
  }): any {
    return window.bizMOB.Properties.get({
      ...arg,
    });
  }

  /**
   * Properties 데이터 삭제
   *
   * @param {Object} arg - Properties 삭제 설정 객체
   * @param {string} arg._sKey - 삭제할 Property의 키 값
   * @example
   * import { Properties } from '@bizMOB';
   * // 기본 데이터 삭제
   * Properties.remove({
   *   _sKey: 'temp.formData'
   * });
   * console.log('임시 폼 데이터가 삭제되었습니다.');
   *
   */
  static remove(arg: {
    _sKey: string, // Property에서 삭제할 키 값
  }): void {
    window.bizMOB.Properties.remove({
      ...arg,
    });
  }

  /**
   * Properties 데이터 저장
   *
   * @param {Object} arg - Properties 저장 설정 객체
   * @param {string} arg._sKey - 저장할 Property의 키 값
   * @param {any} arg._vValue - 저장할 값
   * @example
   * import { Properties } from '@bizMOB';
   * // 기본 값 저장
   * Properties.set({
   *   _sKey: 'user.settings.theme',
   *   _vValue: 'dark'
   * });
   * console.log('테마 설정이 저장되었습니다.');
   *
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
   * Properties 복수 데이터 저장
   *
   * @param {Object} arg - Properties 배치 저장 설정 객체
   * @param {Array} arg._aList - 저장할 키-값 쌍의 배열
   * @param {string} arg._aList[]._sKey - 각 항목의 키 값
   * @param {any} arg._aList[]._vValue - 각 항목의 저장할 값
   * @example
   * import { Properties } from '@bizMOB';
   * // 기본 설정값들 일괄 저장
   * Properties.setList({
   *   _aList: [
   *     { _sKey: 'app.settings.theme', _vValue: 'dark' },
   *     { _sKey: 'app.settings.language', _vValue: 'ko' },
   *     { _sKey: 'app.settings.autoSave', _vValue: true },
   *     { _sKey: 'app.settings.saveInterval', _vValue: 30 }
   *   ]
   * });
   * console.log('앱 기본 설정이 저장되었습니다.');
   *
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
