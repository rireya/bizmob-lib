export default class File {
  /**
   * 파일을 지정된 위치로 복사합니다.
   *
   * 원본 파일을 유지하면서 다른 위치에 동일한 파일을 생성하는 API입니다.
   * 백업, 파일 배포, 임시 파일 생성 등 다양한 목적으로 사용할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템을 통한 고성능 파일 복사
   * - 웹: File API를 활용한 제한적 파일 조작
   *
   * @purpose 파일 백업, 데이터 복제, 임시 파일 생성, 파일 배포
   *
   * @param {Object} arg - 파일 복사 설정 객체
   * @param {string} arg._sSourcePath - 복사할 원본 파일의 절대 경로
   * @param {string} arg._sTargetPath - 복사될 대상 파일의 절대 경로 (파일명 포함)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 복사 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 복사 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1001': 복사 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 복사 결과 정보
   * @returns {string} return._oData.sourcePath - 원본 파일 경로
   * @returns {string} return._oData.targetPath - 복사된 파일 경로
   * @returns {number} return._oData.fileSize - 복사된 파일 크기 (바이트)
   * @returns {string} return._oData.copiedAt - 복사 완료 시간
   *
   * @caution
   * - 대상 경로에 동일한 파일이 있으면 덮어쓰기됩니다
   * - 대상 디렉토리가 존재하지 않으면 오류가 발생할 수 있습니다
   * - 대용량 파일 복사 시 시간이 오래 걸릴 수 있습니다
   * - 파일 권한에 따라 복사가 제한될 수 있습니다
   *
   * @see public/mock/bizMOB/File/copy.json - Mock 응답 데이터 예제
   *
   * @example
   * // 이미지 파일 백업
   * const result = await bizMOB.File.copy({
   *   _sSourcePath: '/storage/photos/original.jpg',
   *   _sTargetPath: '/storage/backup/original_backup.jpg'
   * });
   *
   * if (result._bResult) {
   *   console.log('파일이 성공적으로 백업되었습니다.');
   *   console.log('백업 파일 크기:', result._oData.fileSize, '바이트');
   * } else {
   *   console.error('백업 실패:', result._sResultMessage);
   * }
   *
   * @example
   * // 설정 파일 복사 (템플릿 → 사용자 설정)
   * try {
   *   const copyResult = await bizMOB.File.copy({
   *     _sSourcePath: '/app/templates/default_config.json',
   *     _sTargetPath: '/app/user_data/user_config.json'
   *   });
   *
   *   if (copyResult._bResult) {
   *     console.log('기본 설정이 복사되었습니다.');
   *
   *     // 복사된 파일 수정
   *     await modifyUserConfig('/app/user_data/user_config.json');
   *   }
   * } catch (error) {
   *   console.error('설정 파일 복사 중 오류:', error);
   * }
   *
   * @example
   * // 로그 파일 일별 백업
   * async function createDailyLogBackup() {
   *   const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
   *
   *   const backupResult = await bizMOB.File.copy({
   *     _sSourcePath: '/app/logs/current.log',
   *     _sTargetPath: `/app/logs/backup/log_${today}.log`
   *   });
   *
   *   if (backupResult._bResult) {
   *     console.log(`${today} 날짜의 로그 백업 완료`);
   *
   *     // 원본 로그 파일 초기화
   *     await clearLogFile('/app/logs/current.log');
   *   } else {
   *     console.error('로그 백업 실패:', backupResult._sResultMessage);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 디렉토리의 상세 정보와 포함된 파일 목록을 조회합니다.
   *
   * 지정된 디렉토리의 메타데이터와 하위 파일/폴더 목록을 가져오는 API입니다.
   * 파일 탐색기, 미디어 갤러리, 파일 관리 기능 구현에 필수적인 기능입니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템 접근으로 전체 디렉토리 정보 제공
   * - 웹: 제한된 범위 내에서 디렉토리 정보 제공
   *
   * @purpose 파일 탐색, 미디어 목록 조회, 디렉토리 관리, 파일 검색
   *
   * @param {Object} arg - 디렉토리 조회 설정 객체
   * @param {string} arg._sDirectory - 조회할 디렉토리의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 디렉토리 정보 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1002': 조회 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 디렉토리 정보
   * @returns {string} return._oData.directoryPath - 조회된 디렉토리 경로
   * @returns {number} return._oData.totalFiles - 총 파일 개수
   * @returns {number} return._oData.totalFolders - 총 폴더 개수
   * @returns {number} return._oData.totalSize - 전체 크기 (바이트)
   * @returns {Array<Object>} return._oData.files - 파일 목록
   * @returns {string} return._oData.files[].name - 파일명
   * @returns {string} return._oData.files[].path - 파일 전체 경로
   * @returns {number} return._oData.files[].size - 파일 크기 (바이트)
   * @returns {string} return._oData.files[].type - 파일 유형 (image, video, document 등)
   * @returns {string} return._oData.files[].lastModified - 최종 수정 시간
   * @returns {Array<Object>} return._oData.folders - 폴더 목록
   * @returns {string} return._oData.folders[].name - 폴더명
   * @returns {string} return._oData.folders[].path - 폴더 전체 경로
   *
   * @caution
   * - 큰 디렉토리 조회 시 성능 이슈가 있을 수 있습니다
   * - 권한이 없는 디렉토리는 접근할 수 없습니다
   * - 존재하지 않는 경로를 조회하면 오류가 발생합니다
   *
   * @see public/mock/bizMOB/File/directory.json - Mock 응답 데이터 예제
   *
   * @example
   * // 사진 폴더 내용 조회
   * const result = await bizMOB.File.directory({
   *   _sDirectory: '/storage/DCIM/Camera'
   * });
   *
   * if (result._bResult) {
   *   console.log(`총 ${result._oData.totalFiles}개의 파일이 있습니다.`);
   *
   *   // 이미지 파일만 필터링
   *   const imageFiles = result._oData.files.filter(file =>
   *     file.type === 'image' ||
   *     /\.(jpg|jpeg|png|gif)$/i.test(file.name)
   *   );
   *
   *   console.log(`이미지 파일: ${imageFiles.length}개`);
   *
   *   // 이미지 목록 표시
   *   imageFiles.forEach(image => {
   *     console.log(`- ${image.name} (${formatFileSize(image.size)})`);
   *   });
   * }
   *
   * @example
   * // 파일 탐색기 구현
   * async function buildFileExplorer(directoryPath) {
   *   try {
   *     const dirInfo = await bizMOB.File.directory({
   *       _sDirectory: directoryPath
   *     });
   *
   *     if (dirInfo._bResult) {
   *       const fileListElement = document.getElementById('file-list');
   *       fileListElement.innerHTML = '';
   *
   *       // 폴더 목록 추가
   *       dirInfo._oData.folders.forEach(folder => {
   *         const folderElement = createFolderElement(folder);
   *         folderElement.onclick = () => buildFileExplorer(folder.path);
   *         fileListElement.appendChild(folderElement);
   *       });
   *
   *       // 파일 목록 추가
   *       dirInfo._oData.files.forEach(file => {
   *         const fileElement = createFileElement(file);
   *         fileElement.onclick = () => openFile(file.path);
   *         fileListElement.appendChild(fileElement);
   *       });
   *
   *       // 상태 정보 업데이트
   *       updateStatusBar(dirInfo._oData);
   *     }
   *   } catch (error) {
   *     console.error('디렉토리 조회 실패:', error);
   *     showErrorMessage('폴더를 읽을 수 없습니다.');
   *   }
   * }
   *
   * @example
   * // 미디어 갤러리 구성
   * async function createMediaGallery() {
   *   const mediaDirs = [
   *     '/storage/DCIM/Camera',
   *     '/storage/Pictures',
   *     '/storage/Movies'
   *   ];
   *
   *   const allMediaFiles = [];
   *
   *   for (const dir of mediaDirs) {
   *     try {
   *       const dirResult = await bizMOB.File.directory({ _sDirectory: dir });
   *
   *       if (dirResult._bResult) {
   *         const mediaFiles = dirResult._oData.files.filter(file =>
   *           ['image', 'video'].includes(file.type)
   *         );
   *
   *         allMediaFiles.push(...mediaFiles);
   *       }
   *     } catch (error) {
   *       console.warn(`${dir} 디렉토리 조회 실패:`, error);
   *     }
   *   }
   *
   *   // 최신순으로 정렬
   *   allMediaFiles.sort((a, b) =>
   *     new Date(b.lastModified) - new Date(a.lastModified)
   *   );
   *
   *   // 갤러리 UI 구성
   *   renderMediaGallery(allMediaFiles);
   * }
   *
   * @since bizMOB 4.0.0
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
   * 원격 서버에서 파일을 다운로드합니다.
   *
   * HTTP/HTTPS URL에서 파일을 로컬 저장소로 다운로드하는 API입니다.
   * 다중 파일 동시 다운로드, 진행 상황 모니터링, 백그라운드 다운로드를 지원합니다.
   *
   * @description
   * - 앱: 네이티브 다운로드 매니저를 통한 고성능 다운로드
   * - 웹: Fetch API 또는 XMLHttpRequest를 통한 다운로드
   *
   * @purpose 콘텐츠 다운로드, 오프라인 캐싱, 미디어 저장, 파일 동기화
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
   *
   * @returns {Promise<Object>} 파일 다운로드 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 다운로드 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1003': 다운로드 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 다운로드 결과 정보
   * @returns {number} return._oData.totalFiles - 총 다운로드 파일 수
   * @returns {number} return._oData.successCount - 성공한 파일 수
   * @returns {number} return._oData.failedCount - 실패한 파일 수
   * @returns {Array<Object>} return._oData.results - 각 파일별 다운로드 결과
   * @returns {string} return._oData.results[].fileName - 파일명
   * @returns {string} return._oData.results[].localPath - 저장된 로컬 경로
   * @returns {number} return._oData.results[].fileSize - 다운로드된 파일 크기
   * @returns {boolean} return._oData.results[].success - 개별 파일 다운로드 성공 여부
   * @returns {number} return._oData.totalDownloadTime - 총 다운로드 시간 (밀리초)
   *
   * @caution
   * - 네트워크 연결 상태에 따라 다운로드가 실패할 수 있습니다
   * - 대용량 파일 다운로드 시 저장 공간을 충분히 확보해야 합니다
   * - 동시 다운로드 수가 많으면 성능에 영향을 줄 수 있습니다
   * - URL에 인증이 필요한 경우 추가 설정이 필요할 수 있습니다
   *
   * @see public/mock/bizMOB/File/download.json - Mock 응답 데이터 예제
   *
   * @example
   * // 이미지 파일 다운로드
   * const result = await bizMOB.File.download({
   *   _aFileList: [
   *     {
   *       _sURI: 'https://example.com/images/photo1.jpg',
   *       _bOverwrite: true,
   *       _sFileName: 'downloaded_photo1.jpg',
   *       _sDirectory: '/storage/Downloads/Images'
   *     },
   *     {
   *       _sURI: 'https://example.com/images/photo2.png',
   *       _bOverwrite: false,
   *       _sFileName: 'downloaded_photo2.png',
   *       _sDirectory: '/storage/Downloads/Images'
   *     }
   *   ],
   *   _sMode: 'foreground',
   *   _sProgressBar: 'each'
   * });
   *
   * if (result._bResult) {
   *   console.log(`${result._oData.successCount}/${result._oData.totalFiles} 파일 다운로드 완료`);
   *
   *   result._oData.results.forEach(file => {
   *     if (file.success) {
   *       console.log(`✅ ${file.fileName} - ${formatFileSize(file.fileSize)}`);
   *     } else {
   *       console.log(`❌ ${file.fileName} - 다운로드 실패`);
   *     }
   *   });
   * }
   *
   * @example
   * // 앱 콘텐츠 백그라운드 다운로드
   * async function downloadAppContent() {
   *   showLoadingSpinner('콘텐츠를 다운로드하고 있습니다...');
   *
   *   try {
   *     const downloadResult = await bizMOB.File.download({
   *       _aFileList: [
   *         {
   *           _sURI: 'https://api.example.com/content/data.json',
   *           _bOverwrite: true,
   *           _sFileName: 'app_data.json',
   *           _sDirectory: '/app/cache'
   *         },
   *         {
   *           _sURI: 'https://api.example.com/assets/images.zip',
   *           _bOverwrite: true,
   *           _sFileName: 'images.zip',
   *           _sDirectory: '/app/assets'
   *         }
   *       ],
   *       _sMode: 'background',
   *       _sProgressBar: 'full'
   *     });
   *
   *     if (downloadResult._bResult) {
   *       // 다운로드 완료 후 압축 해제
   *       await bizMOB.File.unzip({
   *         _sSourcePath: '/app/assets/images.zip',
   *         _sDirectory: '/app/assets/images'
   *       });
   *
   *       console.log('앱 콘텐츠 다운로드 및 설치 완료');
   *       showSuccessMessage('최신 콘텐츠가 준비되었습니다.');
   *     }
   *   } catch (error) {
   *     console.error('콘텐츠 다운로드 실패:', error);
   *     showErrorMessage('콘텐츠 다운로드에 실패했습니다.');
   *   } finally {
   *     hideLoadingSpinner();
   *   }
   * }
   *
   * @example
   * // 진행률 모니터링이 있는 다운로드
   * async function downloadWithProgress(fileList) {
   *   const progressDialog = showProgressDialog('파일 다운로드 중...');
   *
   *   try {
   *     // 진행률 업데이트를 위한 이벤트 리스너 등록
   *     bizMOB.Event.setEvent('downloadProgress', (progress) => {
   *       updateProgressDialog(progressDialog, progress.percentage);
   *     });
   *
   *     const result = await bizMOB.File.download({
   *       _aFileList: fileList,
   *       _sMode: 'foreground',
   *       _sProgressBar: 'full'
   *     });
   *
   *     if (result._bResult) {
   *       console.log('모든 파일 다운로드 완료');
   *
   *       // 다운로드 통계 표시
   *       const totalSize = result._oData.results.reduce(
   *         (sum, file) => sum + file.fileSize, 0
   *       );
   *
   *       showCompletionMessage(
   *         `${result._oData.successCount}개 파일 (${formatFileSize(totalSize)}) 다운로드 완료`
   *       );
   *     }
   *   } finally {
   *     closeProgressDialog(progressDialog);
   *     bizMOB.Event.clearEvent('downloadProgress');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 지정된 경로에 파일이 존재하는지 확인합니다.
   *
   * 파일의 존재 여부를 빠르고 안전하게 확인하는 API입니다.
   * 파일 작업 전 사전 검증, 조건부 로직 처리, 오류 방지에 필수적인 기능입니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템을 통한 빠른 존재 확인
   * - 웹: File API를 활용한 제한적 파일 확인
   *
   * @purpose 파일 검증, 조건부 처리, 오류 방지, 파일 상태 확인
   *
   * @param {Object} arg - 파일 존재 확인 설정 객체
   * @param {string} arg._sSourcePath - 존재 여부를 확인할 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 존재 확인 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 확인 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1004': 확인 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 파일 존재 정보
   * @returns {string} return._oData.filePath - 확인한 파일 경로
   * @returns {boolean} return._oData.exists - 파일 존재 여부 (true: 존재, false: 없음)
   * @returns {string} return._oData.type - 파일 유형 ('file', 'directory', 'unknown')
   * @returns {number} return._oData.lastChecked - 확인한 시간 (타임스탬프)
   *
   * @caution
   * - 파일 존재 확인과 실제 사용 사이에 파일 상태가 변경될 수 있습니다
   * - 권한이 없는 경로는 존재해도 false를 반환할 수 있습니다
   * - 심볼릭 링크의 경우 원본 파일 기준으로 판단합니다
   *
   * @see public/mock/bizMOB/File/exist.json - Mock 응답 데이터 예제
   *
   * @example
   * // 설정 파일 존재 확인 후 처리
   * const configPath = '/app/config/settings.json';
   * const existResult = await bizMOB.File.exist({
   *   _sSourcePath: configPath
   * });
   *
   * if (existResult._bResult && existResult._oData.exists) {
   *   console.log('설정 파일이 존재합니다.');
   *
   *   // 기존 설정 파일 로드
   *   const config = await loadConfigFile(configPath);
   *   applySettings(config);
   * } else {
   *   console.log('설정 파일이 없습니다. 기본 설정을 생성합니다.');
   *
   *   // 기본 설정 파일 생성
   *   await createDefaultConfig(configPath);
   * }
   *
   * @example
   * // 파일 덮어쓰기 전 확인
   * async function safeFileCopy(sourcePath, targetPath) {
   *   // 대상 파일 존재 확인
   *   const existCheck = await bizMOB.File.exist({
   *     _sSourcePath: targetPath
   *   });
   *
   *   if (existCheck._oData.exists) {
   *     const overwrite = confirm(`파일 '${targetPath}'가 이미 존재합니다. 덮어쓰시겠습니까?`);
   *
   *     if (!overwrite) {
   *       console.log('파일 복사가 취소되었습니다.');
   *       return false;
   *     }
   *   }
   *
   *   // 파일 복사 실행
   *   const copyResult = await bizMOB.File.copy({
   *     _sSourcePath: sourcePath,
   *     _sTargetPath: targetPath
   *   });
   *
   *   return copyResult._bResult;
   * }
   *
   * @example
   * // 캐시 파일 검증 시스템
   * async function validateCacheFiles() {
   *   const cacheFiles = [
   *     '/app/cache/user_data.json',
   *     '/app/cache/app_config.json',
   *     '/app/cache/media_index.json'
   *   ];
   *
   *   const validationResults = [];
   *
   *   for (const filePath of cacheFiles) {
   *     const existResult = await bizMOB.File.exist({
   *       _sSourcePath: filePath
   *     });
   *
   *     validationResults.push({
   *       path: filePath,
   *       exists: existResult._oData.exists,
   *       isValid: existResult._bResult
   *     });
   *   }
   *
   *   // 누락된 캐시 파일 처리
   *   const missingFiles = validationResults.filter(result => !result.exists);
   *
   *   if (missingFiles.length > 0) {
   *     console.log('누락된 캐시 파일:', missingFiles.map(f => f.path));
   *
   *     // 캐시 재생성
   *     await regenerateCacheFiles(missingFiles.map(f => f.path));
   *   } else {
   *     console.log('모든 캐시 파일이 정상적으로 존재합니다.');
   *   }
   * }
   *
   * @example
   * // 조건부 파일 처리
   * async function processFileIfExists(filePath, processor) {
   *   const existCheck = await bizMOB.File.exist({
   *     _sSourcePath: filePath
   *   });
   *
   *   if (existCheck._bResult && existCheck._oData.exists) {
   *     console.log(`파일 처리 시작: ${filePath}`);
   *
   *     try {
   *       await processor(filePath);
   *       console.log(`파일 처리 완료: ${filePath}`);
   *       return true;
   *     } catch (error) {
   *       console.error(`파일 처리 실패: ${filePath}`, error);
   *       return false;
   *     }
   *   } else {
   *     console.warn(`파일이 존재하지 않습니다: ${filePath}`);
   *     return false;
   *   }
   * }
   *
   * // 사용 예제
   * await processFileIfExists('/storage/data.csv', async (path) => {
   *   const data = await parseCSVFile(path);
   *   await saveProcessedData(data);
   * });
   *
   * @since bizMOB 4.0.0
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
   * 지정된 파일들의 상세 정보를 조회합니다.
   *
   * 파일의 크기, 생성/수정 시간, 유형 등 메타데이터를 일괄적으로 가져오는 API입니다.
   * 파일 관리, 통계 분석, 미디어 정보 표시 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템을 통한 정확한 메타데이터 제공
   * - 웹: File API를 활용한 제한적 정보 제공
   *
   * @purpose 파일 관리, 메타데이터 분석, 파일 통계, 미디어 정보 표시
   *
   * @param {Object} arg - 파일 정보 조회 설정 객체
   * @param {Array<Object>} arg._aFileList - 정보를 조회할 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 조회할 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Array<Object>>} 파일 정보 결과 배열을 담은 Promise
   * @returns {boolean} return[]._bResult - 개별 파일 조회 성공 여부
   * @returns {string} return[]._sResultCode - 개별 파일 결과 코드
   * @returns {string} return[]._sResultMessage - 개별 파일 결과 메시지
   * @returns {Object} return[]._oData - 파일 상세 정보
   * @returns {string} return[]._oData.filePath - 파일 경로
   * @returns {string} return[]._oData.fileName - 파일명 (확장자 포함)
   * @returns {string} return[]._oData.fileExtension - 파일 확장자
   * @returns {number} return[]._oData.fileSize - 파일 크기 (바이트)
   * @returns {string} return[]._oData.fileType - 파일 유형 (image, video, document, audio 등)
   * @returns {string} return[]._oData.mimeType - MIME 타입
   * @returns {string} return[]._oData.createdAt - 파일 생성 시간 (ISO 8601)
   * @returns {string} return[]._oData.modifiedAt - 파일 수정 시간 (ISO 8601)
   * @returns {string} return[]._oData.accessedAt - 파일 접근 시간 (ISO 8601)
   * @returns {Object} return[]._oData.permissions - 파일 권한 정보
   * @returns {boolean} return[]._oData.permissions.readable - 읽기 권한
   * @returns {boolean} return[]._oData.permissions.writable - 쓰기 권한
   * @returns {boolean} return[]._oData.permissions.executable - 실행 권한
   * @returns {Object} [return[]._oData.imageInfo] - 이미지 파일인 경우 추가 정보
   * @returns {number} [return[]._oData.imageInfo.width] - 이미지 가로 크기
   * @returns {number} [return[]._oData.imageInfo.height] - 이미지 세로 크기
   * @returns {Object} [return[]._oData.videoInfo] - 비디오 파일인 경우 추가 정보
   * @returns {number} [return[]._oData.videoInfo.duration] - 비디오 재생 시간 (초)
   * @returns {string} [return[]._oData.videoInfo.codec] - 비디오 코덱
   *
   * @caution
   * - 큰 파일 목록 조회 시 성능 이슈가 있을 수 있습니다
   * - 존재하지 않는 파일은 오류 정보를 반환합니다
   * - 권한이 없는 파일은 제한된 정보만 제공됩니다
   *
   * @see public/mock/bizMOB/File/getInfo.json - Mock 응답 데이터 예제
   *
   * @example
   * // 미디어 파일 정보 조회
   * const mediaFiles = [
   *   { _sSourcePath: '/storage/photos/photo1.jpg' },
   *   { _sSourcePath: '/storage/videos/video1.mp4' },
   *   { _sSourcePath: '/storage/documents/report.pdf' }
   * ];
   *
   * const fileInfos = await bizMOB.File.getInfo({
   *   _aFileList: mediaFiles
   * });
   *
   * fileInfos.forEach(info => {
   *   if (info._bResult) {
   *     const file = info._oData;
   *     console.log(`📁 ${file.fileName}`);
   *     console.log(`   크기: ${formatFileSize(file.fileSize)}`);
   *     console.log(`   유형: ${file.fileType}`);
   *     console.log(`   수정일: ${formatDate(file.modifiedAt)}`);
   *
   *     // 이미지 파일 추가 정보
   *     if (file.imageInfo) {
   *       console.log(`   해상도: ${file.imageInfo.width}x${file.imageInfo.height}`);
   *     }
   *
   *     // 비디오 파일 추가 정보
   *     if (file.videoInfo) {
   *       console.log(`   재생시간: ${formatDuration(file.videoInfo.duration)}`);
   *     }
   *   } else {
   *     console.error(`파일 정보 조회 실패: ${info._sResultMessage}`);
   *   }
   * });
   *
   * @example
   * // 파일 크기별 통계 분석
   * async function analyzeFileStats(directoryPath) {
   *   // 디렉토리 내 파일 목록 조회
   *   const dirResult = await bizMOB.File.directory({
   *     _sDirectory: directoryPath
   *   });
   *
   *   if (dirResult._bResult) {
   *     const fileList = dirResult._oData.files.map(file => ({
   *       _sSourcePath: file.path
   *     }));
   *
   *     // 파일 정보 일괄 조회
   *     const fileInfos = await bizMOB.File.getInfo({
   *       _aFileList: fileList
   *     });
   *
   *     // 통계 계산
   *     const stats = {
   *       totalFiles: 0,
   *       totalSize: 0,
   *       fileTypes: {},
   *       largestFile: null,
   *       oldestFile: null,
   *       newestFile: null
   *     };
   *
   *     fileInfos.forEach(info => {
   *       if (info._bResult) {
   *         const file = info._oData;
   *         stats.totalFiles++;
   *         stats.totalSize += file.fileSize;
   *
   *         // 파일 유형별 카운트
   *         stats.fileTypes[file.fileType] = (stats.fileTypes[file.fileType] || 0) + 1;
   *
   *         // 가장 큰 파일
   *         if (!stats.largestFile || file.fileSize > stats.largestFile.fileSize) {
   *           stats.largestFile = file;
   *         }
   *
   *         // 가장 오래된/새로운 파일
   *         const modifiedDate = new Date(file.modifiedAt);
   *         if (!stats.oldestFile || modifiedDate < new Date(stats.oldestFile.modifiedAt)) {
   *           stats.oldestFile = file;
   *         }
   *         if (!stats.newestFile || modifiedDate > new Date(stats.newestFile.modifiedAt)) {
   *           stats.newestFile = file;
   *         }
   *       }
   *     });
   *
   *     // 통계 출력
   *     console.log('📊 파일 분석 결과:');
   *     console.log(`총 파일 수: ${stats.totalFiles}개`);
   *     console.log(`총 크기: ${formatFileSize(stats.totalSize)}`);
   *     console.log(`평균 크기: ${formatFileSize(stats.totalSize / stats.totalFiles)}`);
   *     console.log(`가장 큰 파일: ${stats.largestFile?.fileName} (${formatFileSize(stats.largestFile?.fileSize)})`);
   *
   *     return stats;
   *   }
   * }
   *
   * @example
   * // 미디어 갤러리 메타데이터 구성
   * async function buildMediaGallery(imagePaths) {
   *   const fileList = imagePaths.map(path => ({ _sSourcePath: path }));
   *
   *   const imageInfos = await bizMOB.File.getInfo({
   *     _aFileList: fileList
   *   });
   *
   *   const galleryItems = imageInfos
   *     .filter(info => info._bResult && info._oData.imageInfo)
   *     .map(info => {
   *       const file = info._oData;
   *       return {
   *         id: generateFileId(file.filePath),
   *         src: file.filePath,
   *         title: file.fileName,
   *         size: formatFileSize(file.fileSize),
   *         dimensions: `${file.imageInfo.width}x${file.imageInfo.height}`,
   *         date: formatDate(file.modifiedAt),
   *         aspectRatio: file.imageInfo.width / file.imageInfo.height
   *       };
   *     })
   *     .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬
   *
   *   // 갤러리 UI 렌더링
   *   renderGallery(galleryItems);
   *
   *   return galleryItems;
   * }
   *
   * @since bizMOB 4.0.0
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
   * 파일을 다른 위치로 이동합니다.
   *
   * 파일을 원본 위치에서 삭제하고 새로운 위치에 생성하는 API입니다.
   * 파일명 변경, 폴더 이동, 파일 정리 등의 목적으로 사용됩니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템을 통한 빠른 파일 이동
   * - 웹: 제한된 범위 내에서 파일 이동 (보안상 제약)
   *
   * @purpose 파일 정리, 폴더 구조 변경, 파일명 변경, 임시 파일 관리
   *
   * @param {Object} arg - 파일 이동 설정 객체
   * @param {string} arg._sSourcePath - 이동할 원본 파일의 절대 경로
   * @param {string} arg._sTargetPath - 이동될 대상 파일의 절대 경로 (파일명 포함)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 이동 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 이동 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1005': 이동 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 이동 결과 정보
   * @returns {string} return._oData.originalPath - 원본 파일 경로
   * @returns {string} return._oData.newPath - 새로운 파일 경로
   * @returns {number} return._oData.fileSize - 이동된 파일 크기 (바이트)
   * @returns {string} return._oData.movedAt - 이동 완료 시간
   * @returns {boolean} return._oData.isRenamed - 파일명 변경 여부
   *
   * @caution
   * - 이동 후 원본 파일은 삭제됩니다 (복사가 아닌 이동)
   * - 대상 경로에 동일한 파일이 있으면 덮어쓰기됩니다
   * - 대상 디렉토리가 존재하지 않으면 오류가 발생할 수 있습니다
   * - 이동 중 오류 발생 시 파일이 손실될 수 있으니 중요한 파일은 백업을 권장합니다
   *
   * @see public/mock/bizMOB/File/move.json - Mock 응답 데이터 예제
   *
   * @example
   * // 파일 이름 변경
   * const result = await bizMOB.File.move({
   *   _sSourcePath: '/storage/documents/old_name.pdf',
   *   _sTargetPath: '/storage/documents/new_name.pdf'
   * });
   *
   * if (result._bResult) {
   *   console.log('파일 이름이 성공적으로 변경되었습니다.');
   *   console.log(`${result._oData.originalPath} → ${result._oData.newPath}`);
   * } else {
   *   console.error('파일 이름 변경 실패:', result._sResultMessage);
   * }
   *
   * @example
   * // 파일을 다른 폴더로 이동
   * async function organizePhotosByDate() {
   *   // 카메라 폴더의 사진들 조회
   *   const dirResult = await bizMOB.File.directory({
   *     _sDirectory: '/storage/DCIM/Camera'
   *   });
   *
   *   if (dirResult._bResult) {
   *     const photoFiles = dirResult._oData.files.filter(file =>
   *       /\.(jpg|jpeg|png)$/i.test(file.name)
   *     );
   *
   *     for (const photo of photoFiles) {
   *       try {
   *         // 파일 정보로 날짜 확인
   *         const fileInfo = await bizMOB.File.getInfo({
   *           _aFileList: [{ _sSourcePath: photo.path }]
   *         });
   *
   *         if (fileInfo[0]._bResult) {
   *           const date = new Date(fileInfo[0]._oData.modifiedAt);
   *           const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
   *
   *           // 날짜별 폴더로 이동
   *           const targetDir = `/storage/Photos/${yearMonth}`;
   *           const targetPath = `${targetDir}/${photo.name}`;
   *
   *           // 대상 디렉토리 확인 및 생성 (필요시)
   *           await ensureDirectoryExists(targetDir);
   *
   *           const moveResult = await bizMOB.File.move({
   *             _sSourcePath: photo.path,
   *             _sTargetPath: targetPath
   *           });
   *
   *           if (moveResult._bResult) {
   *             console.log(`사진 정리 완료: ${photo.name} → ${yearMonth}/`);
   *           }
   *         }
   *       } catch (error) {
   *         console.error(`사진 이동 실패: ${photo.name}`, error);
   *       }
   *     }
   *   }
   * }
   *
   * @example
   * // 임시 파일을 최종 위치로 이동
   * async function finalizeUploadedFile(tempPath, userId, fileType) {
   *   const timestamp = Date.now();
   *   const fileName = `user_${userId}_${timestamp}.${fileType}`;
   *   const finalPath = `/storage/user_files/${userId}/${fileName}`;
   *
   *   try {
   *     // 사용자 디렉토리 확인
   *     await ensureDirectoryExists(`/storage/user_files/${userId}`);
   *
   *     // 임시 파일을 최종 위치로 이동
   *     const moveResult = await bizMOB.File.move({
   *       _sSourcePath: tempPath,
   *       _sTargetPath: finalPath
   *     });
   *
   *     if (moveResult._bResult) {
   *       console.log('파일 업로드가 완료되었습니다.');
   *
   *       // 데이터베이스에 파일 정보 저장
   *       await saveFileRecord({
   *         userId: userId,
   *         fileName: fileName,
   *         filePath: finalPath,
   *         fileSize: moveResult._oData.fileSize,
   *         uploadedAt: moveResult._oData.movedAt
   *       });
   *
   *       return finalPath;
   *     } else {
   *       throw new Error('파일 이동 실패: ' + moveResult._sResultMessage);
   *     }
   *   } catch (error) {
   *     console.error('파일 처리 중 오류:', error);
   *
   *     // 임시 파일 정리
   *     await bizMOB.File.remove({ _aSourcePath: [tempPath] });
   *     throw error;
   *   }
   * }
   *
   * @example
   * // 파일 백업 후 정리
   * async function archiveOldFiles(sourceDir, archiveDir, daysOld = 30) {
   *   const cutoffDate = new Date();
   *   cutoffDate.setDate(cutoffDate.getDate() - daysOld);
   *
   *   const dirResult = await bizMOB.File.directory({
   *     _sDirectory: sourceDir
   *   });
   *
   *   if (dirResult._bResult) {
   *     const oldFiles = [];
   *
   *     // 오래된 파일 찾기
   *     for (const file of dirResult._oData.files) {
   *       const fileInfos = await bizMOB.File.getInfo({
   *         _aFileList: [{ _sSourcePath: file.path }]
   *       });
   *
   *       if (fileInfos[0]._bResult) {
   *         const modifiedDate = new Date(fileInfos[0]._oData.modifiedAt);
   *         if (modifiedDate < cutoffDate) {
   *           oldFiles.push(file);
   *         }
   *       }
   *     }
   *
   *     // 아카이브로 이동
   *     await ensureDirectoryExists(archiveDir);
   *
   *     for (const file of oldFiles) {
   *       const archivePath = `${archiveDir}/${file.name}`;
   *
   *       const moveResult = await bizMOB.File.move({
   *         _sSourcePath: file.path,
   *         _sTargetPath: archivePath
   *       });
   *
   *       if (moveResult._bResult) {
   *         console.log(`아카이브 완료: ${file.name}`);
   *       }
   *     }
   *
   *     console.log(`${oldFiles.length}개의 파일이 아카이브되었습니다.`);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 파일을 기본 연결 프로그램으로 엽니다.
   *
   * 운영체제의 기본 연결 프로그램을 사용하여 파일을 여는 API입니다.
   * 문서 뷰어, 미디어 플레이어, 이미지 뷰어 등 적절한 앱으로 파일을 실행합니다.
   *
   * @description
   * - 앱: 네이티브 시스템의 기본 앱으로 파일 열기
   * - 웹: 브라우저의 기본 동작으로 파일 열기 (제한적)
   *
   * @purpose 문서 열람, 미디어 재생, 이미지 보기, 파일 실행
   *
   * @param {Object} arg - 파일 열기 설정 객체
   * @param {string} arg._sSourcePath - 열어서 보여줄 대상 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 열기 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 열기 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1006': 열기 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 파일 열기 결과 정보
   * @returns {string} return._oData.filePath - 열린 파일 경로
   * @returns {string} return._oData.openedWith - 사용된 앱 또는 프로그램 이름
   * @returns {string} return._oData.openedAt - 파일을 연 시간
   * @returns {boolean} return._oData.isSupported - 파일 형식 지원 여부
   *
   * @caution
   * - 파일 형식에 따라 적절한 앱이 설치되어 있어야 합니다
   * - 보안상 실행 파일은 열기가 제한될 수 있습니다
   * - 대용량 파일은 열기에 시간이 걸릴 수 있습니다
   * - 일부 파일 형식은 지원되지 않을 수 있습니다
   *
   * @see public/mock/bizMOB/File/open.json - Mock 응답 데이터 예제
   *
   * @example
   * // PDF 문서 열기
   * const result = await bizMOB.File.open({
   *   _sSourcePath: '/storage/documents/report.pdf'
   * });
   *
   * if (result._bResult) {
   *   console.log('PDF 문서가 성공적으로 열렸습니다.');
   *   console.log(`사용된 앱: ${result._oData.openedWith}`);
   * } else {
   *   console.error('문서 열기 실패:', result._sResultMessage);
   *
   *   // 대안 제시
   *   if (result._sResultCode === 'NO_APP') {
   *     alert('PDF 뷰어가 설치되어 있지 않습니다. 앱스토어에서 PDF 뷰어를 설치해주세요.');
   *   }
   * }
   *
   * @example
   * // 이미지 갤러리에서 이미지 열기
   * async function openImageInGallery(imagePath) {
   *   try {
   *     const openResult = await bizMOB.File.open({
   *       _sSourcePath: imagePath
   *     });
   *
   *     if (openResult._bResult) {
   *       console.log(`이미지가 ${openResult._oData.openedWith}에서 열렸습니다.`);
   *
   *       // 최근 열어본 파일 기록
   *       await addToRecentFiles({
   *         filePath: imagePath,
   *         openedAt: openResult._oData.openedAt,
   *         openedWith: openResult._oData.openedWith
   *       });
   *     } else {
   *       // 내장 이미지 뷰어로 대체
   *       showBuiltInImageViewer(imagePath);
   *     }
   *   } catch (error) {
   *     console.error('이미지 열기 중 오류:', error);
   *     showErrorDialog('이미지를 열 수 없습니다.');
   *   }
   * }
   *
   * @example
   * // 미디어 파일 재생
   * async function playMediaFile(mediaPath) {
   *   // 파일 정보 확인
   *   const fileInfos = await bizMOB.File.getInfo({
   *     _aFileList: [{ _sSourcePath: mediaPath }]
   *   });
   *
   *   if (fileInfos[0]._bResult) {
   *     const fileInfo = fileInfos[0]._oData;
   *
   *     if (['video', 'audio'].includes(fileInfo.fileType)) {
   *       const openResult = await bizMOB.File.open({
   *         _sSourcePath: mediaPath
   *       });
   *
   *       if (openResult._bResult) {
   *         console.log(`미디어 파일이 재생되었습니다: ${fileInfo.fileName}`);
   *
   *         // 재생 기록 저장
   *         await savePlayHistory({
   *           filePath: mediaPath,
   *           fileName: fileInfo.fileName,
   *           fileType: fileInfo.fileType,
   *           duration: fileInfo.videoInfo?.duration || fileInfo.audioInfo?.duration,
   *           playedAt: openResult._oData.openedAt
   *         });
   *       } else {
   *         console.warn('외부 플레이어로 열기 실패, 내장 플레이어 사용');
   *         openInBuiltInPlayer(mediaPath);
   *       }
   *     } else {
   *       console.error('지원되지 않는 미디어 형식입니다.');
   *     }
   *   }
   * }
   *
   * @example
   * // 파일 형식별 처리
   * async function openFileWithHandler(filePath) {
   *   // 파일 정보 조회
   *   const fileInfos = await bizMOB.File.getInfo({
   *     _aFileList: [{ _sSourcePath: filePath }]
   *   });
   *
   *   if (!fileInfos[0]._bResult) {
   *     throw new Error('파일 정보를 가져올 수 없습니다.');
   *   }
   *
   *   const fileInfo = fileInfos[0]._oData;
   *   const fileExtension = fileInfo.fileExtension.toLowerCase();
   *
   *   // 파일 형식별 처리
   *   switch (fileExtension) {
   *     case '.pdf':
   *     case '.doc':
   *     case '.docx':
   *     case '.xls':
   *     case '.xlsx':
   *     case '.ppt':
   *     case '.pptx':
   *       // 문서 파일 - 외부 앱으로 열기
   *       return await bizMOB.File.open({ _sSourcePath: filePath });
   *
   *     case '.jpg':
   *     case '.jpeg':
   *     case '.png':
   *     case '.gif':
   *       // 이미지 파일 - 갤러리 앱으로 열기
   *       return await bizMOB.File.open({ _sSourcePath: filePath });
   *
   *     case '.mp4':
   *     case '.avi':
   *     case '.mov':
   *     case '.mp3':
   *     case '.wav':
   *       // 미디어 파일 - 플레이어로 열기
   *       return await bizMOB.File.open({ _sSourcePath: filePath });
   *
   *     case '.txt':
   *     case '.log':
   *       // 텍스트 파일 - 내장 에디터 또는 외부 에디터
   *       const preference = await getUserPreference('textEditor');
   *       if (preference === 'builtin') {
   *         return await openInBuiltInTextEditor(filePath);
   *       } else {
   *         return await bizMOB.File.open({ _sSourcePath: filePath });
   *       }
   *
   *     default:
   *       // 기본 처리 - 시스템 기본 앱으로 열기 시도
   *       return await bizMOB.File.open({ _sSourcePath: filePath });
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 지정된 파일들을 삭제합니다.
   *
   * 여러 파일을 한 번에 삭제할 수 있는 API입니다.
   * 파일 정리, 캐시 삭제, 임시 파일 제거 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 파일 시스템을 통한 안전한 파일 삭제
   * - 웹: 제한된 범위 내에서 파일 삭제
   *
   * @purpose 파일 정리, 저장 공간 확보, 캐시 관리, 임시 파일 제거
   *
   * @param {Object} arg - 파일 삭제 설정 객체
   * @param {string[]} arg._aSourcePath - 삭제할 파일 경로 목록
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 삭제 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 삭제 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1007': 삭제 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 삭제 결과 정보
   * @returns {number} return._oData.totalFiles - 삭제 대상 파일 수
   * @returns {number} return._oData.deletedCount - 성공적으로 삭제된 파일 수
   * @returns {number} return._oData.failedCount - 삭제 실패한 파일 수
   * @returns {Array<Object>} return._oData.results - 각 파일별 삭제 결과
   * @returns {string} return._oData.results[].filePath - 파일 경로
   * @returns {boolean} return._oData.results[].success - 개별 파일 삭제 성공 여부
   * @returns {string} return._oData.results[].error - 실패 시 오류 메시지
   * @returns {number} return._oData.freedSpace - 확보된 저장 공간 (바이트)
   *
   * @caution
   * - 삭제된 파일은 복구할 수 없습니다 (휴지통 이동 아님)
   * - 시스템 파일이나 중요한 파일 삭제 시 주의가 필요합니다
   * - 권한이 없는 파일은 삭제할 수 없습니다
   * - 사용 중인 파일은 삭제가 실패할 수 있습니다
   *
   * @see public/mock/bizMOB/File/remove.json - Mock 응답 데이터 예제
   *
   * @example
   * // 임시 파일들 삭제
   * const tempFiles = [
   *   '/tmp/upload_temp_001.jpg',
   *   '/tmp/cache_data.json',
   *   '/tmp/resize_temp.png'
   * ];
   *
   * const result = await bizMOB.File.remove({
   *   _aSourcePath: tempFiles
   * });
   *
   * if (result._bResult) {
   *   console.log(`${result._oData.deletedCount}/${result._oData.totalFiles} 파일 삭제 완료`);
   *   console.log(`확보된 공간: ${formatFileSize(result._oData.freedSpace)}`);
   * } else {
   *   console.error('파일 삭제 실패:', result._sResultMessage);
   * }
   *
   * @example
   * // 오래된 캐시 파일 정리
   * async function clearOldCacheFiles(cacheDir, daysOld = 7) {
   *   try {
   *     // 캐시 디렉토리 조회
   *     const dirResult = await bizMOB.File.directory({
   *       _sDirectory: cacheDir
   *     });
   *
   *     if (dirResult._bResult) {
   *       const cutoffDate = new Date();
   *       cutoffDate.setDate(cutoffDate.getDate() - daysOld);
   *
   *       const filesToDelete = [];
   *
   *       // 파일 정보 조회하여 오래된 파일 찾기
   *       const fileList = dirResult._oData.files.map(file => ({
   *         _sSourcePath: file.path
   *       }));
   *
   *       const fileInfos = await bizMOB.File.getInfo({
   *         _aFileList: fileList
   *       });
   *
   *       fileInfos.forEach(info => {
   *         if (info._bResult) {
   *           const modifiedDate = new Date(info._oData.modifiedAt);
   *           if (modifiedDate < cutoffDate) {
   *             filesToDelete.push(info._oData.filePath);
   *           }
   *         }
   *       });
   *
   *       // 오래된 파일 삭제
   *       if (filesToDelete.length > 0) {
   *         const deleteResult = await bizMOB.File.remove({
   *           _aSourcePath: filesToDelete
   *         });
   *
   *         console.log(`캐시 정리 완료: ${deleteResult._oData.deletedCount}개 파일 삭제`);
   *         console.log(`확보된 공간: ${formatFileSize(deleteResult._oData.freedSpace)}`);
   *
   *         return deleteResult._oData.freedSpace;
   *       } else {
   *         console.log('삭제할 오래된 캐시 파일이 없습니다.');
   *         return 0;
   *       }
   *     }
   *   } catch (error) {
   *     console.error('캐시 정리 중 오류:', error);
   *     throw error;
   *   }
   * }
   *
   * @example
   * // 사용자 확인 후 파일 삭제
   * async function deleteFilesWithConfirmation(filePaths) {
   *   if (filePaths.length === 0) {
   *     console.log('삭제할 파일이 없습니다.');
   *     return;
   *   }
   *
   *   // 삭제할 파일 정보 조회
   *   const fileInfos = await bizMOB.File.getInfo({
   *     _aFileList: filePaths.map(path => ({ _sSourcePath: path }))
   *   });
   *
   *   const validFiles = fileInfos.filter(info => info._bResult);
   *   const totalSize = validFiles.reduce((sum, info) => sum + info._oData.fileSize, 0);
   *
   *   // 사용자 확인
   *   const confirmMessage = `${validFiles.length}개 파일 (${formatFileSize(totalSize)})을 삭제하시겠습니까?\n\n삭제된 파일은 복구할 수 없습니다.`;
   *
   *   if (confirm(confirmMessage)) {
   *     const deleteResult = await bizMOB.File.remove({
   *       _aSourcePath: filePaths
   *     });
   *
   *     if (deleteResult._bResult) {
   *       alert(`${deleteResult._oData.deletedCount}개 파일이 삭제되었습니다.`);
   *
   *       // 실패한 파일이 있다면 알림
   *       if (deleteResult._oData.failedCount > 0) {
   *         const failedFiles = deleteResult._oData.results
   *           .filter(result => !result.success)
   *           .map(result => result.filePath);
   *
   *         console.warn('삭제 실패한 파일:', failedFiles);
   *       }
   *     } else {
   *       alert('파일 삭제에 실패했습니다: ' + deleteResult._sResultMessage);
   *     }
   *   } else {
   *     console.log('파일 삭제가 취소되었습니다.');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 이미지 파일의 크기를 조정합니다.
   *
   * 이미지의 해상도를 변경하고 압축률을 조정하여 파일 크기를 최적화하는 API입니다.
   * 썸네일 생성, 업로드 최적화, 저장 공간 절약 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 이미지 처리 엔진을 통한 고품질 리사이징
   * - 웹: Canvas API 또는 WebAssembly를 통한 이미지 처리
   *
   * @purpose 썸네일 생성, 이미지 최적화, 업로드 크기 조정, 저장 공간 절약
   *
   * @param {Object} arg - 이미지 리사이징 설정 객체
   * @param {Array<Object>} arg._aFileList - 리사이징할 이미지 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 원본 이미지 파일 경로
   * @param {boolean} arg._bIsCopy - 원본 파일 보존 여부 (true: 복사본 생성, false: 원본 변경)
   * @param {string} arg._sTargetDirectory - 리사이징된 이미지가 저장될 디렉토리 경로
   * @param {number} arg._nCompressRate - 압축률 (0-100, 높을수록 고품질)
   * @param {number} arg._nWidth - 변경할 가로 크기 (픽셀)
   * @param {number} arg._nHeight - 변경할 세로 크기 (픽셀)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 이미지 리사이징 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 리사이징 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1008': 리사이징 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 리사이징 결과 정보
   * @returns {number} return._oData.totalImages - 총 처리된 이미지 수
   * @returns {number} return._oData.successCount - 성공한 이미지 수
   * @returns {number} return._oData.failedCount - 실패한 이미지 수
   * @returns {Array<Object>} return._oData.results - 각 이미지별 리사이징 결과
   * @returns {string} return._oData.results[].originalPath - 원본 이미지 경로
   * @returns {string} return._oData.results[].resizedPath - 리사이징된 이미지 경로
   * @returns {Object} return._oData.results[].originalSize - 원본 크기 정보
   * @returns {number} return._oData.results[].originalSize.width - 원본 가로 크기
   * @returns {number} return._oData.results[].originalSize.height - 원본 세로 크기
   * @returns {number} return._oData.results[].originalSize.fileSize - 원본 파일 크기 (바이트)
   * @returns {Object} return._oData.results[].resizedSize - 리사이징된 크기 정보
   * @returns {number} return._oData.results[].resizedSize.width - 리사이징된 가로 크기
   * @returns {number} return._oData.results[].resizedSize.height - 리사이징된 세로 크기
   * @returns {number} return._oData.results[].resizedSize.fileSize - 리사이징된 파일 크기 (바이트)
   * @returns {number} return._oData.totalSpaceSaved - 총 절약된 저장 공간 (바이트)
   *
   * @caution
   * - 원본보다 큰 크기로 리사이징하면 이미지 품질이 저하될 수 있습니다
   * - 압축률이 낮을수록 파일 크기는 작아지지만 품질이 떨어집니다
   * - 대량의 이미지 처리 시 시간이 오래 걸릴 수 있습니다
   * - 지원되지 않는 이미지 형식은 처리할 수 없습니다
   *
   * @see public/mock/bizMOB/File/resizeImage.json - Mock 응답 데이터 예제
   *
   * @example
   * // 사진 썸네일 생성
   * const photos = [
   *   { _sSourcePath: '/storage/photos/photo1.jpg' },
   *   { _sSourcePath: '/storage/photos/photo2.png' },
   *   { _sSourcePath: '/storage/photos/photo3.jpeg' }
   * ];
   *
   * const result = await bizMOB.File.resizeImage({
   *   _aFileList: photos,
   *   _bIsCopy: true, // 원본 보존
   *   _sTargetDirectory: '/storage/thumbnails',
   *   _nCompressRate: 80, // 고품질 유지
   *   _nWidth: 300,
   *   _nHeight: 300
   * });
   *
   * if (result._bResult) {
   *   console.log(`${result._oData.successCount}개의 썸네일이 생성되었습니다.`);
   *   console.log(`절약된 공간: ${formatFileSize(result._oData.totalSpaceSaved)}`);
   *
   *   // 썸네일 경로 저장
   *   result._oData.results.forEach(item => {
   *     if (item.success) {
   *       saveThumbnailPath(item.originalPath, item.resizedPath);
   *     }
   *   });
   * }
   *
   * @example
   * // 업로드용 이미지 최적화
   * async function optimizeForUpload(imagePaths, maxWidth = 1920, maxHeight = 1080) {
   *   const fileList = imagePaths.map(path => ({ _sSourcePath: path }));
   *
   *   const optimizeResult = await bizMOB.File.resizeImage({
   *     _aFileList: fileList,
   *     _bIsCopy: true,
   *     _sTargetDirectory: '/tmp/upload_optimized',
   *     _nCompressRate: 85, // 업로드 최적화
   *     _nWidth: maxWidth,
   *     _nHeight: maxHeight
   *   });
   *
   *   if (optimizeResult._bResult) {
   *     const optimizedPaths = optimizeResult._oData.results
   *       .filter(result => result.success)
   *       .map(result => result.resizedPath);
   *
   *     console.log(`${optimizedPaths.length}개 이미지가 업로드용으로 최적화되었습니다.`);
   *
   *     // 최적화된 이미지로 업로드 진행
   *     await uploadImages(optimizedPaths);
   *
   *     // 임시 파일 정리
   *     await bizMOB.File.remove({ _aSourcePath: optimizedPaths });
   *
   *     return optimizedPaths;
   *   } else {
   *     throw new Error('이미지 최적화 실패: ' + optimizeResult._sResultMessage);
   *   }
   * }
   *
   * @example
   * // 프로필 사진 크기 조정
   * async function createProfilePicture(originalImagePath, userId) {
   *   const sizes = [
   *     { width: 200, height: 200, suffix: '_large' },
   *     { width: 100, height: 100, suffix: '_medium' },
   *     { width: 50, height: 50, suffix: '_small' }
   *   ];
   *
   *   const profilePictures = {};
   *
   *   for (const size of sizes) {
   *     const resizeResult = await bizMOB.File.resizeImage({
   *       _aFileList: [{ _sSourcePath: originalImagePath }],
   *       _bIsCopy: true,
   *       _sTargetDirectory: `/storage/profiles/${userId}`,
   *       _nCompressRate: 90,
   *       _nWidth: size.width,
   *       _nHeight: size.height
   *     });
   *
   *     if (resizeResult._bResult && resizeResult._oData.results[0].success) {
   *       const resizedPath = resizeResult._oData.results[0].resizedPath;
   *
   *       // 파일명에 suffix 추가
   *       const newPath = resizedPath.replace(/(\.[^.]+)$/, `${size.suffix}$1`);
   *       await bizMOB.File.move({
   *         _sSourcePath: resizedPath,
   *         _sTargetPath: newPath
   *       });
   *
   *       profilePictures[size.suffix.replace('_', '')] = newPath;
   *       console.log(`프로필 사진 생성 완료: ${size.width}x${size.height}`);
   *     }
   *   }
   *
   *   return profilePictures;
   * }
   *
   * @since bizMOB 4.0.0
   */
  static resizeImage(arg: {
    _aFileList: {
      _sSourcePath: string
    }[],
    _bIsCopy: boolean, // 파일 Copy 여부
    _sTargetDirectory: string, // 리사이즈 파일 경로
    _nCompressRate: number, // 파일 축소 비율
    _nWidth: number, // width 변경 값
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
   * 이미지 파일을 회전시킵니다.
   *
   * EXIF 방향 정보에 따라 이미지를 올바른 방향으로 회전시키는 API입니다.
   * 카메라로 촬영한 사진의 방향 보정, 이미지 편집에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 이미지 처리 엔진을 통한 무손실 회전
   * - 웹: Canvas API를 통한 이미지 회전 처리
   *
   * @purpose 사진 방향 보정, 이미지 편집, EXIF 데이터 처리
   *
   * @param {Object} arg - 이미지 회전 설정 객체
   * @param {string} arg._sSourcePath - 회전시킬 이미지 파일의 절대 경로
   * @param {string} arg._sTargetPath - 회전된 이미지가 저장될 파일의 절대 경로
   * @param {number} arg._nOrientation - 회전할 방향 (EXIF Orientation 값)
   *   - 1: 정상 (회전 없음)
   *   - 2: 좌우 반전
   *   - 3: 180도 회전
   *   - 4: 상하 반전
   *   - 5: 90도 반시계방향 회전 + 좌우 반전
   *   - 6: 90도 시계방향 회전
   *   - 7: 90도 시계방향 회전 + 좌우 반전
   *   - 8: 90도 반시계방향 회전
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 이미지 회전 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 회전 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1009': 회전 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 회전 결과 정보
   * @returns {string} return._oData.originalPath - 원본 이미지 경로
   * @returns {string} return._oData.rotatedPath - 회전된 이미지 경로
   * @returns {number} return._oData.originalOrientation - 원본 방향값
   * @returns {number} return._oData.newOrientation - 새로운 방향값
   * @returns {number} return._oData.rotationAngle - 실제 회전 각도 (도)
   * @returns {Object} return._oData.dimensions - 이미지 크기 정보
   * @returns {number} return._oData.dimensions.width - 이미지 가로 크기
   * @returns {number} return._oData.dimensions.height - 이미지 세로 크기
   * @returns {string} return._oData.processedAt - 처리 완료 시간
   *
   * @caution
   * - JPEG 이미지에서 가장 정확하게 동작합니다
   * - 회전 시 이미지 품질이 약간 저하될 수 있습니다
   * - 큰 이미지 파일은 처리 시간이 오래 걸릴 수 있습니다
   * - 원본과 대상 경로가 같으면 원본 파일이 덮어쓰기됩니다
   *
   * @see public/mock/bizMOB/File/rotateImage.json - Mock 응답 데이터 예제
   *
   * @example
   * // 카메라 사진 방향 보정
   * const result = await bizMOB.File.rotateImage({
   *   _sSourcePath: '/storage/camera/IMG_001.jpg',
   *   _sTargetPath: '/storage/camera/IMG_001_corrected.jpg',
   *   _nOrientation: 6 // 90도 시계방향 회전
   * });
   *
   * if (result._bResult) {
   *   console.log('사진 방향이 보정되었습니다.');
   *   console.log(`회전 각도: ${result._oData.rotationAngle}도`);
   * }
   *
   * @example
   * // 갤러리 이미지 일괄 방향 보정
   * async function correctImageOrientations(imagePaths) {
   *   const correctedImages = [];
   *
   *   for (const imagePath of imagePaths) {
   *     try {
   *       // 이미지 정보 조회 (EXIF 데이터 포함)
   *       const fileInfos = await bizMOB.File.getInfo({
   *         _aFileList: [{ _sSourcePath: imagePath }]
   *       });
   *
   *       if (fileInfos[0]._bResult && fileInfos[0]._oData.imageInfo) {
   *         const exifOrientation = fileInfos[0]._oData.imageInfo.orientation || 1;
   *
   *         // 방향 보정이 필요한 경우만 처리
   *         if (exifOrientation !== 1) {
   *           const correctedPath = imagePath.replace(/(\.[^.]+)$/, '_corrected$1');
   *
   *           const rotateResult = await bizMOB.File.rotateImage({
   *             _sSourcePath: imagePath,
   *             _sTargetPath: correctedPath,
   *             _nOrientation: 1 // 정상 방향으로 보정
   *           });
   *
   *           if (rotateResult._bResult) {
   *             correctedImages.push(correctedPath);
   *             console.log(`방향 보정 완료: ${imagePath}`);
   *           }
   *         } else {
   *           console.log(`방향 보정 불필요: ${imagePath}`);
   *         }
   *       }
   *     } catch (error) {
   *       console.error(`이미지 처리 실패: ${imagePath}`, error);
   *     }
   *   }
   *
   *   return correctedImages;
   * }
   *
   * @since bizMOB 4.0.0
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
   * 압축 파일(ZIP)을 압축 해제합니다.
   *
   * ZIP 파일의 내용을 지정된 디렉토리에 압축 해제하는 API입니다.
   * 앱 업데이트, 콘텐츠 배포, 백업 복원 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 압축 해제 라이브러리를 통한 고성능 처리
   * - 웹: JavaScript 압축 해제 라이브러리 활용
   *
   * @purpose 앱 업데이트, 콘텐츠 설치, 백업 복원, 파일 배포
   *
   * @param {Object} arg - 압축 해제 설정 객체
   * @param {string} arg._sSourcePath - 압축 해제할 ZIP 파일의 절대 경로
   * @param {string} arg._sDirectory - 압축 해제될 대상 디렉토리의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 압축 해제 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 압축 해제 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1010': 압축 해제 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 압축 해제 결과 정보
   * @returns {string} return._oData.sourceZipPath - 원본 ZIP 파일 경로
   * @returns {string} return._oData.extractedToDirectory - 압축 해제된 디렉토리
   * @returns {number} return._oData.totalFiles - 압축 해제된 총 파일 수
   * @returns {number} return._oData.totalFolders - 압축 해제된 총 폴더 수
   * @returns {number} return._oData.originalSize - 원본 ZIP 파일 크기 (바이트)
   * @returns {number} return._oData.extractedSize - 압축 해제된 전체 크기 (바이트)
   * @returns {Array<string>} return._oData.extractedFiles - 압축 해제된 파일 목록
   * @returns {number} return._oData.processingTime - 처리 시간 (밀리초)
   * @returns {string} return._oData.extractedAt - 압축 해제 완료 시간
   *
   * @caution
   * - 대상 디렉토리에 동일한 파일이 있으면 덮어쓰기됩니다
   * - 충분한 저장 공간이 필요합니다
   * - 암호화된 ZIP 파일은 지원하지 않을 수 있습니다
   * - 대용량 파일 압축 해제 시 시간이 오래 걸릴 수 있습니다
   *
   * @see public/mock/bizMOB/File/unzip.json - Mock 응답 데이터 예제
   *
   * @example
   * // 앱 콘텐츠 업데이트 파일 압축 해제
   * const result = await bizMOB.File.unzip({
   *   _sSourcePath: '/downloads/app_update_v2.1.zip',
   *   _sDirectory: '/app/content'
   * });
   *
   * if (result._bResult) {
   *   console.log('앱 업데이트 설치 완료');
   *   console.log(`${result._oData.totalFiles}개 파일이 설치되었습니다.`);
   *   console.log(`설치 크기: ${formatFileSize(result._oData.extractedSize)}`);
   * }
   *
   * @example
   * // 백업 파일 복원
   * async function restoreBackup(backupZipPath, restoreDirectory) {
   *   try {
   *     showProgressDialog('백업을 복원하고 있습니다...');
   *
   *     const unzipResult = await bizMOB.File.unzip({
   *       _sSourcePath: backupZipPath,
   *       _sDirectory: restoreDirectory
   *     });
   *
   *     if (unzipResult._bResult) {
   *       console.log('백업 복원 완료');
   *       console.log(`복원된 파일: ${unzipResult._oData.totalFiles}개`);
   *       console.log(`복원된 폴더: ${unzipResult._oData.totalFolders}개`);
   *
   *       // 복원된 파일 검증
   *       const validationResult = await validateRestoredFiles(
   *         unzipResult._oData.extractedFiles
   *       );
   *
   *       if (validationResult.isValid) {
   *         showSuccessMessage('백업이 성공적으로 복원되었습니다.');
   *       } else {
   *         showWarningMessage('일부 파일 복원에 문제가 있을 수 있습니다.');
   *       }
   *
   *       return unzipResult._oData.extractedFiles;
   *     } else {
   *       throw new Error('백업 복원 실패: ' + unzipResult._sResultMessage);
   *     }
   *   } catch (error) {
   *     console.error('백업 복원 중 오류:', error);
   *     showErrorMessage('백업 복원에 실패했습니다.');
   *     throw error;
   *   } finally {
   *     hideProgressDialog();
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 파일을 서버로 업로드합니다.
   *
   * 로컬 파일을 원격 서버로 전송하는 API입니다.
   * 사용자 콘텐츠 업로드, 백업, 파일 공유 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 HTTP 클라이언트를 통한 멀티파트 업로드
   * - 웹: FormData와 XMLHttpRequest/Fetch를 통한 업로드
   *
   * @purpose 파일 업로드, 콘텐츠 공유, 클라우드 백업, 데이터 동기화
   *
   * @param {Object} arg - 파일 업로드 설정 객체
   * @param {Array<Object>} arg._aFileList - 업로드할 파일 목록
   * @param {string} arg._aFileList[]._sSourcePath - 업로드할 파일의 로컬 경로
   * @param {string} arg._aFileList[]._sFileName - 서버에 저장될 파일명
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 업로드 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 업로드 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1011': 업로드 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 업로드 결과 정보
   * @returns {number} return._oData.totalFiles - 총 업로드 파일 수
   * @returns {number} return._oData.successCount - 성공한 파일 수
   * @returns {number} return._oData.failedCount - 실패한 파일 수
   * @returns {Array<Object>} return._oData.results - 각 파일별 업로드 결과
   * @returns {string} return._oData.results[].localPath - 로컬 파일 경로
   * @returns {string} return._oData.results[].fileName - 업로드된 파일명
   * @returns {string} return._oData.results[].serverUrl - 서버 상의 파일 URL
   * @returns {number} return._oData.results[].fileSize - 업로드된 파일 크기
   * @returns {boolean} return._oData.results[].success - 개별 파일 업로드 성공 여부
   * @returns {number} return._oData.totalUploadTime - 총 업로드 시간 (밀리초)
   * @returns {number} return._oData.totalBytes - 총 업로드된 바이트 수
   *
   * @caution
   * - 네트워크 연결 상태에 따라 업로드가 실패할 수 있습니다
   * - 서버의 파일 크기 제한을 확인해야 합니다
   * - 대용량 파일 업로드 시 시간이 오래 걸릴 수 있습니다
   * - 업로드 중 앱이 종료되면 업로드가 중단될 수 있습니다
   *
   * @see public/mock/bizMOB/File/upload.json - Mock 응답 데이터 예제
   *
   * @example
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
   * const result = await bizMOB.File.upload({
   *   _aFileList: photos
   * });
   *
   * if (result._bResult) {
   *   console.log(`${result._oData.successCount}/${result._oData.totalFiles} 사진 업로드 완료`);
   *
   *   result._oData.results.forEach(file => {
   *     if (file.success) {
   *       console.log(`✅ ${file.fileName} - ${file.serverUrl}`);
   *     }
   *   });
   * }
   *
   * @example
   * // 프로그레스와 함께 파일 업로드
   * async function uploadWithProgress(fileList) {
   *   const progressDialog = showProgressDialog('파일을 업로드하고 있습니다...');
   *
   *   try {
   *     // 업로드 진행률 이벤트 리스너
   *     bizMOB.Event.setEvent('uploadProgress', (progress) => {
   *       updateProgressDialog(progressDialog, progress.percentage);
   *     });
   *
   *     const uploadResult = await bizMOB.File.upload({
   *       _aFileList: fileList
   *     });
   *
   *     if (uploadResult._bResult) {
   *       const successFiles = uploadResult._oData.results.filter(f => f.success);
   *
   *       showSuccessMessage(
   *         `${successFiles.length}개 파일이 성공적으로 업로드되었습니다.`
   *       );
   *
   *       // 업로드 완료 후 로컬 임시 파일 정리
   *       const tempPaths = fileList
   *         .filter(file => file._sSourcePath.includes('/tmp/'))
   *         .map(file => file._sSourcePath);
   *
   *       if (tempPaths.length > 0) {
   *         await bizMOB.File.remove({ _aSourcePath: tempPaths });
   *       }
   *
   *       return successFiles.map(f => f.serverUrl);
   *     } else {
   *       throw new Error('업로드 실패: ' + uploadResult._sResultMessage);
   *     }
   *   } catch (error) {
   *     console.error('파일 업로드 중 오류:', error);
   *     showErrorMessage('파일 업로드에 실패했습니다.');
   *     throw error;
   *   } finally {
   *     closeProgressDialog(progressDialog);
   *     bizMOB.Event.clearEvent('uploadProgress');
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 파일이나 폴더를 ZIP 형식으로 압축합니다.
   *
   * 지정된 파일이나 디렉토리를 ZIP 압축 파일로 생성하는 API입니다.
   * 백업 생성, 파일 전송, 저장 공간 절약 등에 활용됩니다.
   *
   * @description
   * - 앱: 네이티브 압축 라이브러리를 통한 고성능 압축
   * - 웹: JavaScript 압축 라이브러리를 통한 클라이언트 사이드 압축
   *
   * @purpose 파일 백업, 아카이브 생성, 전송 최적화, 저장 공간 절약
   *
   * @param {Object} arg - 파일 압축 설정 객체
   * @param {string} arg._sSourcePath - 압축할 파일 또는 폴더의 절대 경로
   * @param {string} arg._sTargetPath - 생성될 ZIP 파일의 절대 경로
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 압축 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 압축 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1012': 압축 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 압축 결과 정보
   * @returns {string} return._oData.sourcePath - 압축 대상 경로
   * @returns {string} return._oData.zipFilePath - 생성된 ZIP 파일 경로
   * @returns {number} return._oData.originalSize - 원본 파일/폴더 전체 크기 (바이트)
   * @returns {number} return._oData.compressedSize - 압축된 ZIP 파일 크기 (바이트)
   * @returns {number} return._oData.compressionRatio - 압축률 (0-1, 1에 가까울수록 높은 압축률)
   * @returns {number} return._oData.totalFiles - 압축된 총 파일 수
   * @returns {number} return._oData.totalFolders - 압축된 총 폴더 수
   * @returns {Array<string>} return._oData.compressedFiles - 압축된 파일 목록
   * @returns {number} return._oData.processingTime - 압축 처리 시간 (밀리초)
   * @returns {string} return._oData.createdAt - ZIP 파일 생성 시간
   *
   * @caution
   * - 압축 중인 파일은 수정하지 마세요
   * - 대용량 파일/폴더 압축 시 시간이 오래 걸릴 수 있습니다
   * - 충분한 저장 공간이 필요합니다
   * - 압축 중 앱이 종료되면 불완전한 ZIP 파일이 생성될 수 있습니다
   *
   * @see public/mock/bizMOB/File/zip.json - Mock 응답 데이터 예제
   *
   * @example
   * // 사진 폴더 백업
   * const result = await bizMOB.File.zip({
   *   _sSourcePath: '/storage/photos/2024',
   *   _sTargetPath: '/storage/backup/photos_2024_backup.zip'
   * });
   *
   * if (result._bResult) {
   *   console.log('사진 백업 완료');
   *   console.log(`원본 크기: ${formatFileSize(result._oData.originalSize)}`);
   *   console.log(`압축 크기: ${formatFileSize(result._oData.compressedSize)}`);
   *   console.log(`압축률: ${(result._oData.compressionRatio * 100).toFixed(1)}%`);
   *   console.log(`압축된 파일: ${result._oData.totalFiles}개`);
   * }
   *
   * @example
   * // 로그 파일 아카이브
   * async function archiveLogFiles() {
   *   const logDirectory = '/app/logs';
   *   const archivePath = `/app/archives/logs_${new Date().toISOString().split('T')[0]}.zip`;
   *
   *   try {
   *     const zipResult = await bizMOB.File.zip({
   *       _sSourcePath: logDirectory,
   *       _sTargetPath: archivePath
   *     });
   *
   *     if (zipResult._bResult) {
   *       console.log('로그 파일 아카이브 생성 완료');
   *       console.log(`아카이브 크기: ${formatFileSize(zipResult._oData.compressedSize)}`);
   *
   *       // 원본 로그 파일들 정리 (7일 이상 된 파일)
   *       await cleanupOldLogFiles(logDirectory, 7);
   *
   *       // 오래된 아카이브 파일 정리 (30일 이상)
   *       await cleanupOldArchives('/app/archives', 30);
   *
   *       return archivePath;
   *     } else {
   *       throw new Error('로그 아카이브 생성 실패: ' + zipResult._sResultMessage);
   *     }
   *   } catch (error) {
   *     console.error('로그 아카이브 중 오류:', error);
   *     throw error;
   *   }
   * }
   *
   * @example
   * // 사용자 데이터 백업
   * async function createUserDataBackup(userId) {
   *   const userDataPath = `/app/user_data/${userId}`;
   *   const backupPath = `/app/backups/user_${userId}_${Date.now()}.zip`;
   *
   *   // 백업 전 데이터 유효성 검사
   *   const dirResult = await bizMOB.File.directory({
   *     _sDirectory: userDataPath
   *   });
   *
   *   if (!dirResult._bResult || dirResult._oData.totalFiles === 0) {
   *     throw new Error('백업할 사용자 데이터가 없습니다.');
   *   }
   *
   *   showProgressDialog('사용자 데이터를 백업하고 있습니다...');
   *
   *   try {
   *     const zipResult = await bizMOB.File.zip({
   *       _sSourcePath: userDataPath,
   *       _sTargetPath: backupPath
   *     });
   *
   *     if (zipResult._bResult) {
   *       // 백업 메타데이터 저장
   *       const backupInfo = {
   *         userId: userId,
   *         backupPath: backupPath,
   *         originalSize: zipResult._oData.originalSize,
   *         compressedSize: zipResult._oData.compressedSize,
   *         fileCount: zipResult._oData.totalFiles,
   *         createdAt: zipResult._oData.createdAt,
   *         version: await getAppVersion()
   *       };
   *
   *       await saveBackupMetadata(backupInfo);
   *
   *       console.log('사용자 데이터 백업 완료');
   *       showSuccessMessage('데이터가 성공적으로 백업되었습니다.');
   *
   *       return backupInfo;
   *     } else {
   *       throw new Error('백업 생성 실패: ' + zipResult._sResultMessage);
   *     }
   *   } catch (error) {
   *     console.error('백업 생성 중 오류:', error);
   *     showErrorMessage('백업 생성에 실패했습니다.');
   *
   *     // 실패한 백업 파일 정리
   *     try {
   *       await bizMOB.File.remove({ _aSourcePath: [backupPath] });
   *     } catch (cleanupError) {
   *       console.warn('실패한 백업 파일 정리 실패:', cleanupError);
   *     }
   *
   *     throw error;
   *   } finally {
   *     hideProgressDialog();
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
