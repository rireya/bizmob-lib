export default class File {
  /**
   * 파일 복사
   *
   * @param {Object} arg - 파일 복사 설정 객체
   * @param {string} arg._sSourcePath - 복사할 원본 파일의 절대 경로 (파일명 포함)
   * @param {string} arg._sTargetPath - 복사될 대상 파일의 절대 경로 (파일명 포함)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,     // 파일 복사 성공 여부
   *   file_path: string    // 복사된 파일의 경로
   * }>} 파일 복사 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/copy.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 이미지 파일 백업
   * const fileCopy = await File.copy({
   *   _sSourcePath: '{external}/temp.png',
   *   _sTargetPath: '{internal}/images/copy.png'
   * });
   *
   * if (fileCopy.result) {
   *   console.log('파일이 성공적으로 백업되었습니다. ', fileCopy.file_path);
   * } else {
   *   console.log('파일 복사 실패');
   * }
   */
  static copy(arg: {
    _sSourcePath: string, // 복사할 파일의 경로
    _sTargetPath: string, // 복사될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.copy({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 디렉토리 정보 읽기
   *
   * @param {Object} arg - 디렉토리 조회 설정 객체
   * @param {string} arg._sDirectory - 조회할 디렉토리의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,                         // 성공 여부
   *   directory_info: Array<{                  // 디렉토리 내 파일/폴더 목록
   *     file_path: string,                     // 파일/폴더 경로
   *     is_directory: boolean                  // 디렉토리 여부
   *   }>
   * }>} 디렉토리 조회 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/directory.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 디렉토리 내용 조회
   * const dirResult = await File.directory({
   *   _sDirectory: '{internal}/photos/'
   * });
   *
   * if (dirResult.result) {
   *   console.log(`총 ${dirResult.directory_info.length}개의 파일이 있습니다.`);
   * }
   */
  static directory(arg: {
    _sDirectory: string, // 디렉토리 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.directory({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 다운로드
   *
   * @param {Object} arg - 파일 다운로드 설정 객체
   * @param {Array<Object>} arg._aFileList - 다운로드할 파일 목록
   * @param {string} arg._aFileList[]._sURI - 다운로드할 파일의 HTTP/HTTPS URL
   * @param {boolean} arg._aFileList[]._bOverwrite - 기존 파일 덮어쓰기 여부
   * @param {string} arg._aFileList[]._sFileName - 저장될 파일명 (확장자 포함)
   * @param {string} arg._aFileList[]._sDirectory - 파일이 저장될 로컬 디렉토리 경로
   * @param {string} arg._sMode - 다운로드 모드
   *   - `'foreground'`: 포그라운드 다운로드 (앱 활성 상태에서만)
   *   - `'background'`: 백그라운드 다운로드 (앱 비활성 상태에서도 계속)
   * @param {string} arg._sProgressBar - 진행률 표시 설정
   *   - `'off'`: 진행률 표시 안함
   *   - `'each'`: 각 파일별 진행률 표시
   *   - `'full'`: 전체 다운로드 진행률 표시
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,                  // 전체 다운로드 성공 여부
   *   file_path: string,                // 다운로드된 파일 경로
   *   message: string,                  // 메시지
   *   file_id: number,                  // 파일 ID
   *   total_count: number,              // 전체 파일 수
   *   current_count: number             // 현재 다운로드된 파일 수
   * }>} 다운로드 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/download.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 이미지 파일 다운로드
   * const fileDown = await File.download({
   *   _aFileList: [
   *     {
   *       _sURI: 'https://example.com/images/photo1.png',
   *       _bOverwrite: true,
   *       _sFileName: 'downloaded_photo1.jpg',
   *       _sDirectory: '{external}/download/Images'
   *     },
   *     {
   *       _sURI: 'https://example.com/images/photo2.png',
   *       _bOverwrite: false,
   *       _sFileName: 'downloaded_photo2.png',
   *       _sDirectory: '{external}/download/Images'
   *     }
   *   ],
   *   _sMode: 'foreground',
   *   _sProgressBar: 'each'
   * });
   *
   * if (fileDown.result) {
   *   console.log(`${fileDown.total_count}개 파일 다운로드 완료`);
   *   console.log(`다운로드된 파일 경로: ${fileDown.file_path}`);
   * }
   */
  static download(arg: {
    _aFileList: {
      _sURI: string, // 다운로드 URI
      _bOverwrite: boolean, // 덮어쓰기 여부
      _sFileName: string, // 파일 이름
      _sDirectory: string, // 다운로드 경로
    }[],
    _sMode: 'foreground' | 'background', // 파일 다운로드 모드(foreground, background)
    _sProgressBar: 'off' | 'each' | 'full', // 다운로드할 때 프로그래스바 설정 값(off , each, full)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.download({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 존재 여부 확인
   *
   * @param {Object} arg - 파일 존재 확인 설정 객체
   * @param {string} arg._sSourcePath - 존재 여부를 확인할 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,       // 성공 여부 (파일 존재 시 true, 없으면 false)
   *   file_path: string      // 확인한 파일 경로
   * }>} 파일 존재 여부 확인 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/exist.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 설정 파일 존재 확인 
   * const existResult = await File.exist({
   *   _sSourcePath: '/app/config/settings.json'
   * });
   *
   * if (existResult.result) {
   *   console.log('설정 파일이 존재합니다.');
   * } else {
   *   console.log('설정 파일이 없습니다.');
   * }
   */
  static exist(arg: {
    _sSourcePath: string, // 존재 여부를 확인할 파일 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.exist({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 정보 가져오기
   *
   * @param {Object} arg - 파일 정보 조회 설정 객체
   * @param {Array<Object>} arg._aFileList - 정보를 조회할 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 조회할 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,      // 전체 조회 성공 여부
   *   list: Array<{
   *     result: boolean,    // 개별 파일 조회 성공 여부
   *     path: string,       // 파일 경로
   *     file_size: number,  // 파일 크기 (bytes)
   *     index: string,      // 파일 인덱스
   *     detail: { width: number, height: number }  // 파일 상세 정보
   *   }>
   * }>>} 파일 정보 배열을 담은 Promise 객체
   * @see public/mock/bizMOB/File/getInfo.json - Mock 응답 데이터 예제
   * @example
   * // 미디어 파일 정보 조회
   * import { File } from '@bizMOB';
   * const fileInfos = await File.getInfo({
   *   _aFileList: [
   *     { _sSourcePath: '/storage/photos/image1.jpg' },
   *     { _sSourcePath: '/storage/documents/report.pdf' }
   *   ]
   * });
   *
   * fileInfos.list.forEach(info => {
   *  if (info.result) {
   *    console.log(`   파일: ${info.path}`);
   *    console.log(`   크기: ${info.file_size} bytes`);
   *  } else {
   *    console.log(`파일 정보 조회 실패`);
   *  }
   *});
   */
  static getInfo(arg: {
    _aFileList: {
      _sSourcePath: string, // 파일의 경로
    }[],
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>[]> {
    return new Promise(resolve => {
      window.bizMOB.File.getInfo({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 이동
   *
   * @param {Object} arg - 파일 이동 설정 객체
   * @param {string} arg._sSourcePath - 이동할 원본 파일의 절대 경로
   * @param {string} arg._sTargetPath - 이동될 대상 파일의 절대 경로 (파일명 포함)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,    // 성공 여부
   *   file_path: string   // 이동된 파일의 경로
   * }>}
   * @see public/mock/bizMOB/File/move.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 파일 이동
   * const fileMove = await File.move({
   *   _sSourcePath: '{external}/download/temp.pdf',
   *   _sTargetPath: '{internal}/documents/moved.pdf'
   * });
   *
   * if (fileMove.result) {
   *   console.log('파일 이름이 성공적으로 변경되었습니다.');
   *   console.log(`→ ${fileMove.file_path}`);
   * } else {
   *   console.log('파일 이름 변경 실패');
   * }
   */
  static move(arg: {
    _sSourcePath: string, // 이동할 파일의 경로
    _sTargetPath: string, // 이동될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.move({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 열기
   *
   * @param {Object} arg - 파일 열기 설정 객체
   * @param {string} arg._sSourcePath - 열어볼 파일 경로. 기본 설치App으로 연결.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,    // 성공 여부
   *   file_path: string   // 열린 파일의 경로
   * }>}
   * @see public/mock/bizMOB/File/open.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // PDF 문서 열기
   * const fileOpen = await File.open({
   *   _sSourcePath: '{internal}/documents/manual.pdf'
   * });
   *
   * if (fileOpen.result) {
   *   console.log('PDF 문서가 성공적으로 열렸습니다.');
   *   console.log('파일이 열렸습니다:', fileOpen.file_path);
   * } else {
   *   console.log('문서 열기 실패');
   * }
   */
  static open(arg: {
    _sSourcePath: string, // 열어서 보여줄 대상 파일 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.open({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 삭제
   *
   * @param {Object} arg - 파일 삭제 설정 객체
   * @param {string[]} arg._aSourcePath - 삭제할 파일 경로 목록
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,      // 전체 삭제 성공 여부
   *   list: Array<{         // 삭제된 파일 목록
   *     result: boolean,    // 개별 파일 삭제 성공 여부
   *     file_path: string   // 삭제된 파일 경로
   *   }>
   * }>} 파일 삭제 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/remove.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 임시 파일들 삭제
   * const fileRemove = await File.remove({
   *   _aSourcePath: [
   *     '{internal}/temp/file1.tmp',
   *     '{internal}/temp/file2.tmp',
   *     '{internal}/temp/file3.tmp'
   *   ]
   * });
   *
   * if (fileRemove.result) {
   *   fileRemove.list.forEach(item => {
   *     if (!item.result) {
   *       console.log(`삭제 실패: ${item.file_path}`);
   *     }
   *   });
   * } else {
   *   console.log('파일 삭제 실패');
   * }
   */
  static remove(arg: {
    _aSourcePath: string[], // 삭제할 파일목록
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.remove({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 이미지 파일 리사이즈
   *
   * @param {Object} arg - 이미지 리사이징 설정 객체
   * @param {Array<Object>} arg._aFileList - 리사이징할 이미지 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 원본 이미지 파일 경로
   * @param {boolean} arg._bIsCopy - (Default : false) 원본 파일 유지 여부. (true 또는 false)
   * @param {string} arg._sTargetDirectory - _bIsCopy가 true일 경우 복사본이 저장될 디렉토리 경로.
   * @param {number} arg._nCompressRate - Number X (Default : 1.0) 파일의 압축률 값( 0.0부터 1.0까지 값 지정가능 )
   * @param {number} arg._nFileSize - 리사이즈 된 파일 용량의 최대값 (bytes)
   * @param {number} arg._nWidth - 파일의 가로 크기를 설정.
   * @param {number} arg._nHeight - 파일의 세로 크기를 설정.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,           // 전체 리사이즈 성공 여부
   *   list: Array<{              // 리사이즈된 이미지 목록
   *     origin_path: string,     // 원본 이미지 파일 경로
   *     target_path: string      // 리사이즈된 이미지 파일 경로
   *   }>
   * }>} 이미지 리사이즈 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/resizeImage.json - Mock 응답 데이터 예제
   *
   * @example
   * import { File } from '@bizMOB';
   * // 사진 썸네일 생성
   * const resizeImage = await File.resizeImage({
   *   _aFileList: [{ _sSourcePath: '/storage/photos/original.jpg' }],
   *   _bIsCopy: true, // 원본 보존
   *   _sTargetDirectory: '/storage/thumbnails',
   *   _nCompressRate: 0.8, // 고품질 유지
   *   _nFileSize: 102400, // 100KB 최대
   *   _nWidth: 300,
   *   _nHeight: 300
   * });
   *
   * if (resizeImage.result) {
   *   resizeImage.list.forEach(item => {
   *      console.log('썸네일 생성 완료: ' + item.target_path);
   *   });
   * }
   */
  static resizeImage(arg: {
    _aFileList: {
      _sSourcePath: string
    }[],
    _bIsCopy: boolean, // 파일 Copy 여부
    _sTargetDirectory: string, // 리사이즈 파일 경로
    _nCompressRate: number, // 파일 축소 비율
    _nWidth: number, // width 변경 값
    _nFileSize: number, // 리사이즈 된 파일 용량의 최대값 (bytes)
    _nHeight: number, // height 변경 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.resizeImage({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 이미지 파일 회전
   * 
   * @param {Object} arg - 이미지 회전 설정 객체
   * @param {string} arg._sSourcePath - 이미지 File Path.
   * @param {string} arg._sTargetPath - 회전된 이미지가 저장될 Path.
   * @param {number} arg._nOrientation - 회전 시킬 각도(EXIF_Orientation)값.(1, 2, 3, 4, 5, 6, 7, 8 )
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,   // 성공 여부
   *   path: string       // 회전된 이미지 파일의 저장 경로
   * }>} 이미지 회전 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/rotateImage.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 카메라 사진 방향 보정
   * const rotateImage = await File.rotateImage({
   *   _sSourcePath: '/storage/camera/IMG_001.jpg',
   *   _sTargetPath: '/storage/camera/IMG_001_corrected.jpg',
   *   _nOrientation: 6 // 90도 시계방향 회전
   * });
   *
   * if (rotateImage.result) {
   *   console.log('이미지 회전 완료: ' + rotateImage.path);
   * }
   */
  static rotateImage(arg: {
    _sSourcePath: string, // 회전시킬 이미지 파일 경로
    _sTargetPath: string, // 회전된 이미지가 저장될 파일 경로
    _nOrientation: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8, // 회전 시킬 각도(EXIF_Orientation)값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.rotateImage({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 압축해제
   * 
   * @param {Object} arg - 압축 해제 설정 객체
   * @param {string} arg._sSourcePath - 소스 File Path.
   * @param {string} arg._sDirectory - 압축 해제할 Directory Path.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,    // 성공 여부
   *   file_path: string   // 압축해제된 파일들이 저장된 디렉토리 경로
   * }>}
   * @see public/mock/bizMOB/File/unzip.json - Mock 응답 데이터 예제
   *
   * @example
   * import { File } from '@bizMOB';
   * // ZIP 파일 압축해제
   * const unzipResult = await File.unzip({
   *   _sSourcePath: '{external}/download/data.zip',
   *   _sDirectory: '{internal}/extracted/'
   * });
   *
   * if (unzipResult.result) {
   *   console.log('압축해제 완료:', unzipResult.file_path);
   * }
   */
  static unzip(arg: {
    _sSourcePath: string, // 회전시킬 이미지 파일 경로
    _sDirectory: string, // 디렉토리 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.unzip({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 업로드
   *
   * @param {Object} arg - 파일 업로드 설정 객체
   * @param {Array<Object>} arg._aFileList - 업로드할 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 업로드할 파일의 경로
   * @param {string} arg._aFileList[]._sFileName - 업로드할 파일의 이름
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,                  // 전체 업로드 성공 여부
   *   exception_msg: string,            // 예외 메시지 
   *   list: Array<{
   *     result: boolean,                // 개별 파일 업로드 성공 여부
   *     uid: string,                    // 업로드된 파일의 고유 ID
   *     file_name: string               // 업로드된 파일명
   *   }>
   * }>} 업로드 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/upload.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 사진 업로드
   * const photos = [
   *   {
   *     _sSourcePath: '/storage/photos/vacation1.jpg',
   *     _sFileName: 'vacation_photo_1.jpg'
   *   },
   *   {
   *     _sSourcePath: '/storage/photos/vacation2.jpg',
   *     _sFileName: 'vacation_photo_2.jpg'
   *   }
   * ];
   *
   * const uploadResult = await File.upload({
   *   _aFileList: photos
   * });
   *
   * if (uploadResult.result) {
   *   uploadResult.list.forEach(file => {
   *     if (file.result) {
   *       console.log(file.file_name, file.uid);
   *     }
   *   });
   * }
   */
  static upload(arg: {
    _aFileList: {
      _sSourcePath: string, // 업로드할 파일의 경로
      _sFileName: string, // 업로드할 파일의 이름
    }[],
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.upload({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 파일 압축
   * 
   * @param {Object} arg - 파일 압축 설정 객체
   * @param {string} arg._sSourcePath - 소스 File Path.
   * @param {string} arg._sTargetPath - 결과 File Path.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,     // 파일 복사 성공 여부
   *   file_path: string    // 복사된 파일의 경로
   * }>} 파일 압축 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/File/zip.json - Mock 응답 데이터 예제
   * @example
   * import { File } from '@bizMOB';
   * // 폴더를 ZIP 파일로 압축
   * const zipResult = await File.zip({
   *   _sSourcePath: '{internal}/documents/',
   *   _sTargetPath: '{external}/backup/documents.zip'
   * });
   *
   * if (zipResult.result) {
   *   console.log('압축 완료:', zipResult.file_path);
   * }
   */
  static zip(arg: {
    _sSourcePath: string, // 압축할 파일의 경로
    _sTargetPath: string, // 압축된 파일이 저장될 경로
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.File.zip({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
