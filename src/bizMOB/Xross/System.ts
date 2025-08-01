export default class System {
  /**
   * 단말기 설치된 브라우져 열기
   *
   * @param {Object} arg - 브라우저 호출 설정 객체
   * @param {string} arg._sURL - 호출할 URL
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @example
   * import { System } from '@bizMOB';
   * const browserResult = await System.callBrowser({
   *   _sURL: 'https://www.google.com'
   * });
   */

  static callBrowser(arg: {
    _sURL: string, // 호출할 URL
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<void> {
    return new Promise(resolve => {
      window.bizMOB.System.callBrowser({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
  /**
   * 단말기 카메라 촬영
   *
   * @param {Object} arg - 카메라 촬영 설정 객체
   * @param {string} [arg._sFileName] - 찍은 이미지를 저장할 이름
   * @param {string} [arg._sDirectory] - 찍은 이미지를 저장할 경로
   * @param {boolean} arg._bAutoVerticalHorizontal - (Default : true) 찍은 이미지를 화면에 맞게 자동으로 회전시켜 저장할지를 설정 값
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,   // 성공 여부
   *   path: string       // 촬영된 이미지 파일 경로
   * }>} 카메라 촬영 결과를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 기본 사진 촬영
   * const cameraResult = await System.callCamera({
   *   _sFileName: 'photo_' + new Date().getTime() + '.jpg',
   *   _sDirectory: '{internal}/photos/'
   * });
   *
   * if (cameraResult.result) {
   *   console.log('촬영된 이미지 경로:', cameraResult.path);
   * } else {
   *   console.log('촬영이 취소되었습니다');
   * }
   */
  static callCamera(arg: {
    _sFileName?: string, // 찍은 이미지를 저장할 이름
    _sDirectory?: string, // 찍은 이미지를 저장할 경로
    _bAutoVerticalHorizontal: boolean, // 찍은 이미지를 화면에 맞게 자동으로 회전시켜 저장할지를 설정하는 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callCamera({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 단말기 디바이스의 갤러리(사진앨범) 보기
   *
   * @param {Object} arg - 갤러리 호출 설정 객체
   * @param {string} arg._sType String (Default : all) 갤러리에서 불러올 미디어 타입( all, image, video )가 있습니다.
   * @param {number} [arg._nMaxCount] - 선택 가능 개수
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   error: Object,          // 에러 정보
   *   images: Array<{
   *     filename: string,     // 파일명
   *     uri: string,          // 파일 URI
   *     size: string,         // 파일 크기 (bytes) 
   *     index: number         // 인덱스
   *   }>
   * }>} 갤러리 선택 결과를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 기본 이미지 선택
   * const galleryResult = await System.callGallery({
   *   _sType: 'image',
   *   _nMaxCount: 1
   * });
   *
   * if (galleryResult.result) {
   *   const selectedImage = galleryResult.images[0];
   *   console.log('선택된 이미지:', selectedImage.filename);
   *   console.log('파일 크기:', selectedImage.size, 'bytes');
   *
   *   // 선택된 이미지 표시
   *   displaySelectedImage(selectedImage);
   * } else {
   *   console.log('이미지 선택이 취소되었습니다.');
   * }
   */
  static callGallery(arg: {
    _sType: 'all' | 'image' | 'video', // 갤러리에서 불러올 미디어 타입
    _nMaxCount?: number, // 선택 가능 개수
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callGallery({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 단말기 지도 실행
   *
   * @param {Object} arg - 갤러리 지도 실행 객체
   * @param {string} arg._sLocation 위치 정보(주소, 위경도값)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,  // 성공 여부
   *   data: string,     // 응답 데이터
   * }>} 단말기 지도 실행 결과를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 주소로 지도 열기
   * const mapResult = await System.callMap({
   *   _sLocation: '서울특별시 강남구 테헤란로 152'
   * });
   *
   * if (mapResult.result) {
   *   console.log('지도 앱이 실행되었습니다');
   * } 
   */
  static callMap(arg: {
    _sLocation: string, // 위치 정보 값 (Ex. "37.541, 126.986")
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callMap({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 문자보내기
   *
   * @param {Object} arg - 문자보내기 실행 객체
   * @param {Array} arg._aNumber 메세지를 보낼 전화번호 배열
   * @param {string} arg._sMessage 보낼 메세지
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,  // 성공 여부
   *   data: string,     // 응답 데이터
   * }>} 문자보내기 결과를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 여러 수신자에게 문자 발송
   * const sendResult = await System.callSMS({
   *   _aNumber: ['01011112222', '01033334444'],
   *   _sMessage: '회의 알림: 오늘 오후 2시 회의실에서 회의가 있습니다.'
   * });
   *
   * if (sendResult.result) {
   *   console.log('문자를 발송했습니다.');
   * } 
   */
  static callSMS(arg: {
    _aNumber: string[], // 문자보낼 전화번호 목록 (Ex. ["01012345678", "01012345679"])
    _sMessage?: string, // 문자 메세지 내용 (문자 발송 화면에서 미리 입력되어 있을 문구)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callSMS({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 전화걸기
   *
   * @param {Object} arg - 전화걸기 실행 객체
   * @param {String} arg._sNumber 전화번호
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,  // 성공 여부
   *   data: string,     // 응답 데이터
   * }>} 전화걸기 결과를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 여러 수신자에게 문자 발송
   * const tellResult = awaitSystem.callTEL({
   *   _sNumber: '01012345678'
   * });
   *
   * if (tellResult.result) {
   *   console.log('전화 앱이 실행되었습니다');
   * } 
   */
  static callTEL(arg: {
    _sNumber: string, // 전화할 전화번호 (Ex. "01012345678")
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.callTEL({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 위치 정보 조회
   *
   * @param {Object} arg - 위치 조회 실행 객체
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,        // 성공 여부
   *   latitude: number,       // 위도
   *   longitude: number,      // 경도
   *   address: string,        // 주소
   *   gps_enabled: boolean,   // GPS 활성화 여부
   *   provider: string        // GPS 제공자 (예: "fused")
   * }>} GPS 위치 정보를 담은 Promise 객체
   * @example
   * import { System } from '@bizMOB';
   * // 현재 위치 정보 조회
   * const gpsResult = await System.getGPS();
   *
   * if (gpsResult.result) {
   *   console.log('현재 위치:', gpsResult.latitude, gpsResult.longitude);
   * } 
   */
  static getGPS(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.System.getGPS({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
