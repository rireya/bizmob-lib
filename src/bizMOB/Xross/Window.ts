export default class Window {
  /**
   * SignPad(서명) Window 띄우기
   *
   * @param {Object} arg - 사인패드 설정 객체
   * @param {string} arg._sTargetPath - 사인패드에서 서명한 이미지를 저장할 File Path
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,       // 성공 여부
   *   sign_data: string,     // 서명 데이터 (Base64 인코딩)
   *   file_path: string      // 서명 이미지 파일 경로
   * }>} 서명 패드 결과를 담은 Promise 객체
   * @example
   * import { Window } from '@bizMOB';
   * // 기본 서명패드 사용
   * const signResult = await Window.openSignPad({
   *   _sTargetPath: '{external}/contract/signature.png'
   * });
   *
   * if (signResult.result) {
   *   console.log('서명이 저장되었습니다:', signResult.file_path);
   *   console.log('서명 데이터:', signResult.sign_data);
   *
   * } else {
   *   console.log('서명이 취소되었습니다.');
   * }
   */
  static openSignPad(arg: {
    _sTargetPath: string, // 사인패드 이미지 저장 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openSignPad({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * CodeReader( BarCode, QRCode )  띄우기
   *
   * @param {Object} [arg] - 코드 리더 설정 객체 (선택사항)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   result_value: string    // 인식된 코드 값
   * }>} 코드 리더 결과를 담은 Promise 객체
   * @example
   * import { Window, System } from '@bizMOB';
   * // 기본 바코드/QR코드 스캔
   * const scanResult = await Window.openCodeReader();
   *
   * if (scanResult.result) {
   *   console.log('스캔된 코드:', scanResult.result_value);
   *
   *   // URL인 경우 브라우저로 열기
   *   if (response.result_value.startsWith('http')) {
   *     System.callBrowser({
   *       _sURL: response.result_value
   *     });
   *   }
   * } else {
   *   console.log('스캔이 취소되었습니다.');
   * }
   */
  static openCodeReader(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openCodeReader({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * FileExplorer 띄우기
   *
   * @param {Object} [arg] - 파일 탐색기 설정 객체 (선택사항)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,         // 성공 여부
   *   file_path: Array,        // 선택된 파일 경로 목록
   *   uri_path: Array,         // 선택된 파일 URI 경로 목록
   * }>} 파일 탐색기 결과를 담은 Promise 객체
   * @example
   * import { Window } from '@bizMOB';
   * // 기본 파일 선택
   * const fileResult = await Window.openFileExplorer();
   *
   * if (fileResult.result) {
   *   console.log('선택된 파일:', fileResult.file_path);
   * } else {
   *   console.log('파일 선택이 취소되었습니다.');
   * }
   */
  static openFileExplorer(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openFileExplorer({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * ImageViewer 띄우기
   *
   * @param {Object} arg - 이미지 뷰어 설정 객체
   * @param {string} arg._sImagePath - 이미지 뷰어로 열 이미지 File Path
   * @returns {Promise<{
   *   result: boolean,      // 성공 여부
   *   file_path: string     // 이미지 파일 경로
   * }>} 이미지 뷰어 결과를 담은 Promise 객체
   * @example
   * import { Window } from '@bizMOB';
   * // 기본 이미지 뷰어 사용
   * const viewerResult = await Window.openImageViewer({
   *   _sImagePath: '{internal}/photos/image001.jpg'
   * });
   *
   * if (viewerResult.result) {
   *   console.log('이미지 뷰어 실행 성공');
   * } 
   */
  static openImageViewer(arg: {
    _sImagePath: string, // 이미지 뷰어로 열 이미지 경로
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Window.openImageViewer({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
