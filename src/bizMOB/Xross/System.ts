export default class System {
  /**
   * 단말기의 브라우저를 호출합니다.
   *
   * 디바이스의 기본 브라우저 앱을 통해 외부 URL을 여는 API입니다.
   * 앱 내부가 아닌 시스템 브라우저에서 웹페이지를 열어 보여줍니다.
   *
   * @description
   * - 앱: 디바이스 기본 브라우저(Safari, Chrome 등)로 URL 열기
   * - 웹: 새 탭에서 URL 열기
   *
   * @purpose 외부 링크 열기, 공식 웹사이트 연결, 결제 페이지 이동, 도움말 페이지 표시
   *
   * @param {Object} arg - 브라우저 호출 설정 객체
   * @param {string} arg._sURL - 호출할 URL
   *   - 완전한 URL 형식이어야 함 (http:// 또는 https://)
   *   - 예: 'https://www.example.com', 'https://help.myapp.com'
   *   - 상대 경로나 프로토콜이 없는 URL은 지원하지 않음
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<vo    /**
   * 디바이스의 사진앨범(갤러리)를 호출합니다.
   *
   * 디바이스에 저장된 미디어 파일(사진, 동영상)을 선택할 수 있는 갤러리 앱을 실행하는 API입니다.
   * 단일 또는 다중 선택이 가능하며, 미디어 타입별로 필터링할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 갤러리 앱을 통한 미디어 선택
   * - 웹: 브라우저의 파일 선택 다이얼로그를 통한 미디어 선택
   *
   * @purpose 프로필 이미지 선택, 파일 업로드, 미디어 컨텐츠 공유, 첨부 파일 선택
   *
   * @param {Object} arg - 갤러리 호출 설정 객체
   * @param {'all' | 'image' | 'video'} arg._sType - 갤러리에서 불러올 미디어 타입
   *   - 'all': 모든 미디어 타입 (이미지 + 동영상)
   *   - 'image': 이미지만 (JPEG, PNG, GIF 등)
   *   - 'video': 동영상만 (MP4, MOV, AVI 등)
   * @param {number} [arg._nMaxCount] - 선택 가능 개수
   *   - 1: 단일 선택
   *   - 2 이상: 다중 선택 (최대 선택 개수)
   *   - 미지정 시 단일 선택
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 갤러리 선택 결과를 담은 Promise
   * @returns {boolean} return._bResult - 선택 성공 여부 (true: 성공, false: 실패/취소)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '6001': 선택 취소)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 선택된 미디어 정보
   * @returns {Array<Object>} return._oData.selectedFiles - 선택된 파일 목록
   * @returns {string} return._oData.selectedFiles[].filePath - 파일 경로
   * @returns {string} return._oData.selectedFiles[].fileName - 파일명
   * @returns {number} return._oData.selectedFiles[].fileSize - 파일 크기 (bytes)
   * @returns {string} return._oData.selectedFiles[].mimeType - MIME 타입
   * @returns {string} return._oData.selectedFiles[].mediaType - 미디어 타입 ('image', 'video')
   * @returns {number} return._oData.selectedFiles[].width - 이미지/동영상 너비 (pixels)
   * @returns {number} return._oData.selectedFiles[].height - 이미지/동영상 높이 (pixels)
   * @returns {number} return._oData.selectedFiles[].duration - 동영상 길이 (초, 동영상인 경우)
   * @returns {number} return._oData.totalCount - 선택된 파일 총 개수
   * @returns {number} return._oData.totalSize - 선택된 파일 총 크기 (bytes)
   *
   * @caution
   * - 갤러리 접근 권한이 필요합니다
   * - 사용자가 선택을 취소할 수 있습니다
   * - 대용량 파일 선택 시 처리 시간이 길어질 수 있습니다
   * - 일부 파일 형식은 지원되지 않을 수 있습니다
   * - 다중 선택 시 성능에 영향을 줄 수 있습니다
   *
   * @example
   * // 기본 이미지 선택
   * const galleryResult = await bizMOB.System.callGallery({
   *   _sType: 'image',
   *   _nMaxCount: 1
   * });
   *
   * if (galleryResult._bResult) {
   *   const selectedImage = galleryResult._oData.selectedFiles[0];
   *   console.log('선택된 이미지:', selectedImage.fileName);
   *   console.log('파일 크기:', selectedImage.fileSize, 'bytes');
   *
   *   // 선택된 이미지 표시
   *   displaySelectedImage(selectedImage);
   * } else {
   *   console.log('이미지 선택이 취소되었습니다.');
   * }
   *
   * @example
   * // 프로필 이미지 업데이트
   * class ProfileImageManager {
   *   static async updateProfileImage(userId) {
   *     try {
   *       console.log('프로필 이미지 선택 시작');
   *
   *       const result = await bizMOB.System.callGallery({
   *         _sType: 'image',
   *         _nMaxCount: 1
   *       });
   *
   *       if (result._bResult) {
   *         const selectedImage = result._oData.selectedFiles[0];
   *
   *         // 이미지 유효성 검사
   *         const validation = await this.validateProfileImage(selectedImage);
   *         if (!validation.isValid) {
   *           throw new Error(validation.reason);
   *         }
   *
   *         // 이미지 리사이징 및 최적화
   *         const optimizedImage = await this.optimizeImage(selectedImage);
   *
   *         // 이전 프로필 이미지 백업
   *         await this.backupCurrentProfile(userId);
   *
   *         // 새 프로필 이미지 저장
   *         const profileData = await this.saveProfileImage(userId, optimizedImage);
   *
   *         // 썸네일 생성
   *         const thumbnail = await this.generateProfileThumbnail(profileData);
   *
   *         // 프로필 정보 업데이트
   *         const profileInfo = {
   *           userId: userId,
   *           imagePath: profileData.filePath,
   *           thumbnailPath: thumbnail.filePath,
   *           originalSize: selectedImage.fileSize,
   *           optimizedSize: optimizedImage.fileSize,
   *           dimensions: {
   *             width: optimizedImage.width,
   *             height: optimizedImage.height
   *           },
   *           updatedAt: new Date().toISOString()
   *         };
   *
   *         await this.updateProfileData(userId, profileInfo);
   *
   *         console.log('프로필 이미지 업데이트 완료');
   *         return profileInfo;
   *       } else {
   *         console.log('사용자가 이미지 선택을 취소했습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('프로필 이미지 업데이트 실패:', error);
   *
   *       // 오류 시 대안 제공
   *       const useCamera = confirm('갤러리에서 선택에 실패했습니다. 카메라로 촬영하시겠습니까?');
   *       if (useCamera) {
   *         return await this.captureProfilePhoto(userId);
   *       }
   *
   *       throw error;
   *     }
   *   }
   *
   *   static async validateProfileImage(imageFile) {
   *     // 파일 크기 검사 (최대 5MB)
   *     const maxSize = 5 * 1024 * 1024;
   *     if (imageFile.fileSize > maxSize) {
   *       return {
   *         isValid: false,
   *         reason: '이미지 파일이 너무 큽니다. (최대 5MB)'
   *       };
   *     }
   *
   *     // 최소 해상도 검사
   *     const minDimension = 100;
   *     if (imageFile.width < minDimension || imageFile.height < minDimension) {
   *       return {
   *         isValid: false,
   *         reason: `이미지 해상도가 너무 낮습니다. (최소 ${minDimension}x${minDimension})`
   *       };
   *     }
   *
   *     // 지원 포맷 검사
   *     const supportedTypes = ['image/jpeg', 'image/png', 'image/gif'];
   *     if (!supportedTypes.includes(imageFile.mimeType)) {
   *       return {
   *         isValid: false,
   *         reason: '지원하지 않는 이미지 형식입니다.'
   *       };
   *     }
   *
   *     return { isValid: true };
   *   }
   * }
   *
   * @example
   * // 다중 미디어 파일 선택 및 업로드
   * class MediaUploadManager {
   *   static async selectMultipleMedia(maxCount = 5, allowedTypes = 'all') {
   *     try {
   *       console.log(`최대 ${maxCount}개의 ${allowedTypes} 파일 선택`);
   *
   *       const result = await bizMOB.System.callGallery({
   *         _sType: allowedTypes,
   *         _nMaxCount: maxCount
   *       });
   *
   *       if (result._bResult) {
   *         const selectedFiles = result._oData.selectedFiles;
   *         console.log(`${selectedFiles.length}개 파일 선택됨`);
   *
   *         // 선택된 파일들 검증
   *         const validationResults = await this.validateSelectedFiles(selectedFiles);
   *
   *         // 유효한 파일들만 필터링
   *         const validFiles = selectedFiles.filter((file, index) =>
   *           validationResults[index].isValid
   *         );
   *
   *         // 무효한 파일이 있으면 사용자에게 알림
   *         const invalidFiles = validationResults.filter(result => !result.isValid);
   *         if (invalidFiles.length > 0) {
   *           const invalidReasons = invalidFiles.map(result => result.reason).join('\n');
   *           alert(`다음 파일들이 제외되었습니다:\n${invalidReasons}`);
   *         }
   *
   *         if (validFiles.length === 0) {
   *           throw new Error('선택된 파일 중 유효한 파일이 없습니다.');
   *         }
   *
   *         // 파일 처리 및 업로드 준비
   *         const processedFiles = await this.processSelectedFiles(validFiles);
   *
   *         return {
   *           files: processedFiles,
   *           totalCount: validFiles.length,
   *           totalSize: validFiles.reduce((sum, file) => sum + file.fileSize, 0)
   *         };
   *       } else {
   *         console.log('파일 선택이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('미디어 파일 선택 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async validateSelectedFiles(files) {
   *     return Promise.all(files.map(async (file, index) => {
   *       try {
   *         // 파일 크기 검사
   *         const maxSize = file.mediaType === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024; // 동영상 100MB, 이미지 10MB
   *         if (file.fileSize > maxSize) {
   *           return {
   *             isValid: false,
   *             reason: `${file.fileName}: 파일 크기 초과`
   *           };
   *         }
   *
   *         // 동영상 길이 검사
   *         if (file.mediaType === 'video' && file.duration > 300) { // 5분 제한
   *           return {
   *             isValid: false,
   *             reason: `${file.fileName}: 동영상이 너무 깁니다 (최대 5분)`
   *           };
   *         }
   *
   *         return { isValid: true };
   *       } catch (error) {
   *         return {
   *           isValid: false,
   *           reason: `${file.fileName}: 검증 중 오류 발생`
   *         };
   *       }
   *     }));
   *   }
   * }
   *
   * @example
   * // 미디어 타입별 전문 처리
   * class TypeSpecificMediaHandler {
   *   static async selectProfileImages() {
   *     // 프로필용 이미지만 선택
   *     const result = await bizMOB.System.callGallery({
   *       _sType: 'image',
   *       _nMaxCount: 1
   *     });
   *
   *     if (result._bResult) {
   *       const image = result._oData.selectedFiles[0];
   *
   *       // 정사각형 비율 확인 (프로필 이미지 특성)
   *       const aspectRatio = image.width / image.height;
   *       if (Math.abs(aspectRatio - 1) > 0.2) { // 1:1 비율에서 20% 이상 차이
   *         const cropImage = confirm('프로필 이미지는 정사각형이 권장됩니다. 자동으로 자르시겠습니까?');
   *         if (cropImage) {
   *           return await this.cropImageToSquare(image);
   *         }
   *       }
   *
   *       return image;
   *     }
   *
   *     return null;
   *   }
   *
   *   static async selectDocumentImages(maxCount = 5) {
   *     // 문서용 이미지 선택
   *     const result = await bizMOB.System.callGallery({
   *       _sType: 'image',
   *       _nMaxCount: maxCount
   *     });
   *
   *     if (result._bResult) {
   *       const images = result._oData.selectedFiles;
   *
   *       // 문서 이미지 최적화
   *       const optimizedImages = await Promise.all(
   *         images.map(image => this.optimizeDocumentImage(image))
   *       );
   *
   *       return optimizedImages;
   *     }
   *
   *     return [];
   *   }
   *
   *   static async selectVideoForSharing() {
   *     // 공유용 동영상 선택
   *     const result = await bizMOB.System.callGallery({
   *       _sType: 'video',
   *       _nMaxCount: 1
   *     });
   *
   *     if (result._bResult) {
   *       const video = result._oData.selectedFiles[0];
   *
   *       // 동영상 길이 확인
   *       if (video.duration > 60) { // 1분 초과
   *         const trimVideo = confirm('동영상이 1분을 초과합니다. 편집하시겠습니까?');
   *         if (trimVideo) {
   *           return await this.trimVideo(video, 60);
   *         }
   *       }
   *
   *       // 해상도 확인 및 압축
   *       if (video.width > 1920 || video.height > 1080) {
   *         console.log('고해상도 동영상 압축 중...');
   *         return await this.compressVideo(video);
   *       }
   *
   *       return video;
   *     }
   *
   *     return null;
   *   }
   * }
   *
   * @example
   * // 갤러리 선택 결과 미리보기 및 관리
   * class MediaPreviewManager {
   *   static async selectWithPreview(options = {}) {
   *     try {
   *       const result = await bizMOB.System.callGallery({
   *         _sType: options.type || 'all',
   *         _nMaxCount: options.maxCount || 5
   *       });
   *
   *       if (result._bResult) {
   *         const selectedFiles = result._oData.selectedFiles;
   *
   *         // 미리보기 생성
   *         const previews = await this.generatePreviews(selectedFiles);
   *
   *         // 사용자에게 미리보기 보여주고 확인 받기
   *         const confirmed = await this.showPreviewDialog(previews);
   *
   *         if (confirmed) {
   *           // 최종 처리
   *           const processedFiles = await this.processConfirmedFiles(selectedFiles);
   *
   *           return {
   *             success: true,
   *             files: processedFiles,
   *             previews: previews
   *           };
   *         } else {
   *           console.log('사용자가 미리보기에서 취소했습니다.');
   *           return { success: false, reason: 'cancelled_in_preview' };
   *         }
   *       } else {
   *         return { success: false, reason: 'cancelled_in_gallery' };
   *       }
   *     } catch (error) {
   *       console.error('미리보기 선택 실패:', error);
   *       return { success: false, reason: 'error', error: error.message };
   *     }
   *   }
   *
   *   static async generatePreviews(files) {
   *     return Promise.all(files.map(async (file) => {
   *       if (file.mediaType === 'image') {
   *         return await this.generateImagePreview(file);
   *       } else if (file.mediaType === 'video') {
   *         return await this.generateVideoPreview(file);
   *       }
   *
   *       return {
   *         fileName: file.fileName,
   *         type: 'unknown',
   *         previewUrl: null
   *       };
   *     }));
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  /**
   * 디바이스의 사진앨범(갤러리)를 호출합니다.
   *
   * 디바이스에 저장된 미디어 파일(사진, 동영상)을 선택할 수 있는 갤러리 앱을 실행하는 API입니다.
   * 단일 또는 다중 선택이 가능하며, 미디어 타입별로 필터링할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 갤러리 앱을 통한 미디어 선택
   * - 웹: 브라우저의 파일 선택 다이얼로그를 통한 미디어 선택
   *
   * @purpose 프로필 이미지 선택, 파일 업로드, 미디어 컨텐츠 공유, 첨부 파일 선택
   *
   * @param {Object} arg - 갤러리 호출 설정 객체
   * @param {'all' | 'image' | 'video'} arg._sType - 갤러리에서 불러올 미디어 타입
   *   - 'all': 모든 미디어 타입 (이미지 + 동영상)
   *   - 'image': 이미지만 (JPEG, PNG, GIF 등)
   *   - 'video': 동영상만 (MP4, MOV, AVI 등)
   * @param {number} [arg._nMaxCount] - 선택 가능 개수
   *   - 1: 단일 선택
   *   - 2 이상: 다중 선택 (최대 선택 개수)
   *   - 미지정 시 단일 선택
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 갤러리 선택 결과를 담은 Promise
   * @returns {boolean} return._bResult - 선택 성공 여부 (true: 성공, false: 실패/취소)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '6001': 선택 취소)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 선택된 미디어 정보
   * @returns {Array<Object>} return._oData.selectedFiles - 선택된 파일 목록
   * @returns {string} return._oData.selectedFiles[].filePath - 파일 경로
   * @returns {string} return._oData.selectedFiles[].fileName - 파일명
   * @returns {number} return._oData.selectedFiles[].fileSize - 파일 크기 (bytes)
   * @returns {string} return._oData.selectedFiles[].mimeType - MIME 타입
   * @returns {string} return._oData.selectedFiles[].mediaType - 미디어 타입 ('image', 'video')
   * @returns {number} return._oData.selectedFiles[].width - 이미지/동영상 너비 (pixels)
   * @returns {number} return._oData.selectedFiles[].height - 이미지/동영상 높이 (pixels)
   * @returns {number} return._oData.selectedFiles[].duration - 동영상 길이 (초, 동영상인 경우)
   * @returns {number} return._oData.totalCount - 선택된 파일 총 개수
   * @returns {number} return._oData.totalSize - 선택된 파일 총 크기 (bytes)
   *
   * @caution
   * - 갤러리 접근 권한이 필요합니다
   * - 사용자가 선택을 취소할 수 있습니다
   * - 대용량 파일 선택 시 처리 시간이 길어질 수 있습니다
   * - 일부 파일 형식은 지원되지 않을 수 있습니다
   * - 다중 선택 시 성능에 영향을 줄 수 있습니다
   *
   * @example
   * // 기본 이미지 선택
   * const galleryResult = await bizMOB.System.callGallery({
   *   _sType: 'image',
   *   _nMaxCount: 1
   * });
   *
   * if (galleryResult._bResult) {
   *   const selectedImage = galleryResult._oData.selectedFiles[0];
   *   console.log('선택된 이미지:', selectedImage.fileName);
   *   console.log('파일 크기:', selectedImage.fileSize, 'bytes');
   *
   *   // 선택된 이미지 표시
   *   displaySelectedImage(selectedImage);
   * } else {
   *   console.log('이미지 선택이 취소되었습니다.');
   * }
   *
   * @since bizMOB 4.0.0
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

  /** 지도 서비스를 호출합니다. */
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

  /** SMS 발송 앱을 호출합니다. */
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

  /** 전화 걸기 앱을 호출합니다. */
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

  /** 디바이스의 GPS 정보를 조회합니다. */
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

  /**
   * 디바이스의 카메라를 이용하여 사진을 찍습니다.
   *
   * 디바이스의 내장 카메라 앱을 실행하여 사진을 촬영하고 지정된 위치에 저장하는 API입니다.
   * 촬영된 이미지는 자동 회전 및 품질 조정 옵션을 제공합니다.
   *
   * @description
   * - 앱: 네이티브 카메라 앱을 통한 사진 촬영
   * - 웹: 브라우저의 카메라 API를 통한 사진 촬영
   *
   * @purpose 프로필 사진 촬영, 문서 스캔, 증명 사진 업로드, 현장 사진 기록
   *
   * @param {Object} arg - 카메라 촬영 설정 객체
   * @param {string} [arg._sFileName] - 찍은 이미지를 저장할 이름
   *   - 파일 확장자는 자동으로 추가됨 (.jpg, .png 등)
   *   - 예: 'profile_photo', 'document_scan_20240322'
   *   - 미지정 시 자동으로 타임스탬프 기반 이름 생성
   * @param {string} [arg._sDirectory] - 찍은 이미지를 저장할 경로
   *   - 앱 내부 저장소의 상대 경로
   *   - 예: 'photos/profile', 'documents/scans'
   *   - 미지정 시 기본 저장 위치 사용
   * @param {boolean} arg._bAutoVerticalHorizontal - 찍은 이미지를 화면에 맞게 자동으로 회전시켜 저장할지를 설정하는 값
   *   - true: 디바이스 방향에 맞게 자동 회전
   *   - false: 원본 방향 유지
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 사진 촬영 결과를 담은 Promise
   * @returns {boolean} return._bResult - 촬영 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '5001': 카메라 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 촬영된 이미지 정보
   * @returns {string} return._oData.filePath - 저장된 이미지 파일 경로
   * @returns {string} return._oData.fileName - 저장된 이미지 파일명
   * @returns {number} return._oData.fileSize - 이미지 파일 크기 (bytes)
   * @returns {number} return._oData.imageWidth - 이미지 너비 (pixels)
   * @returns {number} return._oData.imageHeight - 이미지 높이 (pixels)
   * @returns {string} return._oData.capturedTime - 촬영 시간 (ISO 8601)
   * @returns {string} return._oData.format - 이미지 포맷 ('JPEG', 'PNG' 등)
   * @returns {boolean} return._oData.isRotated - 자동 회전 적용 여부
   *
   * @caution
   * - 카메라 권한이 필요합니다
   * - 사용자가 촬영을 취소할 수 있습니다
   * - 저장 공간이 부족한 경우 실패할 수 있습니다
   * - 일부 기기에서는 카메라 앱이 느리게 실행될 수 있습니다
   * - 웹에서는 HTTPS 환경에서만 작동합니다
   *
   * @example
   * // 기본 사진 촬영
   * const cameraResult = await bizMOB.System.callCamera({
   *   _bAutoVerticalHorizontal: true
   * });
   *
   * if (cameraResult._bResult) {
   *   console.log('사진 촬영 성공');
   *   console.log('저장 경로:', cameraResult._oData.filePath);
   *   console.log('파일 크기:', cameraResult._oData.fileSize, 'bytes');
   *
   *   // 촬영된 이미지 표시
   *   displayCapturedImage(cameraResult._oData);
   * } else {
   *   console.error('사진 촬영 실패:', cameraResult._sResultMessage);
   * }
   *
   * @example
   * // 프로필 사진 촬영 및 관리
   * class ProfilePhotoManager {
   *   static async captureProfilePhoto(userId) {
   *     try {
   *       console.log('프로필 사진 촬영 시작');
   *
   *       const result = await bizMOB.System.callCamera({
   *         _sFileName: `profile_${userId}_${Date.now()}`,
   *         _sDirectory: 'photos/profile',
   *         _bAutoVerticalHorizontal: true
   *       });
   *
   *       if (result._bResult) {
   *         const photoData = result._oData;
   *
   *         // 이미지 품질 검증
   *         const qualityCheck = await this.validatePhotoQuality(photoData);
   *         if (!qualityCheck.isValid) {
   *           throw new Error(qualityCheck.reason);
   *         }
   *
   *         // 썸네일 생성
   *         const thumbnail = await this.generateThumbnail(photoData);
   *
   *         // 프로필 사진 정보 저장
   *         const profilePhoto = {
   *           userId: userId,
   *           originalPath: photoData.filePath,
   *           thumbnailPath: thumbnail.filePath,
   *           capturedTime: photoData.capturedTime,
   *           dimensions: {
   *             width: photoData.imageWidth,
   *             height: photoData.imageHeight
   *           },
   *           fileSize: photoData.fileSize,
   *           format: photoData.format
   *         };
   *
   *         await this.saveProfilePhotoInfo(userId, profilePhoto);
   *
   *         console.log('프로필 사진 저장 완료');
   *         return profilePhoto;
   *       } else {
   *         throw new Error(result._sResultMessage);
   *       }
   *     } catch (error) {
   *       console.error('프로필 사진 촬영 실패:', error);
   *
   *       // 대안 제공
   *       const useGallery = confirm('카메라 촬영에 실패했습니다. 갤러리에서 선택하시겠습니까?');
   *       if (useGallery) {
   *         return await this.selectFromGallery(userId);
   *       }
   *
   *       throw error;
   *     }
   *   }
   *
   *   static async validatePhotoQuality(photoData) {
   *     // 최소 해상도 검사
   *     const minWidth = 200;
   *     const minHeight = 200;
   *
   *     if (photoData.imageWidth < minWidth || photoData.imageHeight < minHeight) {
   *       return {
   *         isValid: false,
   *         reason: `이미지 해상도가 너무 낮습니다. (최소: ${minWidth}x${minHeight})`
   *       };
   *     }
   *
   *     // 파일 크기 검사
   *     const maxFileSize = 10 * 1024 * 1024; // 10MB
   *     if (photoData.fileSize > maxFileSize) {
   *       return {
   *         isValid: false,
   *         reason: '파일 크기가 너무 큽니다. (최대: 10MB)'
   *       };
   *     }
   *
   *     // 지원 포맷 검사
   *     const supportedFormats = ['JPEG', 'PNG', 'JPG'];
   *     if (!supportedFormats.includes(photoData.format.toUpperCase())) {
   *       return {
   *         isValid: false,
   *         reason: `지원하지 않는 이미지 포맷입니다. (지원: ${supportedFormats.join(', ')})`
   *       };
   *     }
   *
   *     return { isValid: true };
   *   }
   * }
   *
   * @example
   * // 문서 스캔 기능
   * class DocumentScanner {
   *   static async scanDocument(documentType = 'general') {
   *     try {
   *       const scanConfig = this.getScanConfig(documentType);
   *
   *       console.log(`문서 스캔 시작: ${documentType}`);
   *
   *       const result = await bizMOB.System.callCamera({
   *         _sFileName: `scan_${documentType}_${this.generateScanId()}`,
   *         _sDirectory: 'documents/scans',
   *         _bAutoVerticalHorizontal: scanConfig.autoRotate
   *       });
   *
   *       if (result._bResult) {
   *         const scanData = result._oData;
   *
   *         // 문서 스캔 후처리
   *         const processedScan = await this.processScannedDocument(scanData, scanConfig);
   *
   *         // OCR 처리 (텍스트 추출)
   *         if (scanConfig.enableOCR) {
   *           const ocrResult = await this.performOCR(processedScan);
   *           processedScan.extractedText = ocrResult.text;
   *           processedScan.confidence = ocrResult.confidence;
   *         }
   *
   *         // 스캔 메타데이터 저장
   *         await this.saveScanMetadata(processedScan, documentType);
   *
   *         console.log('문서 스캔 완료:', processedScan.filePath);
   *         return processedScan;
   *       } else {
   *         throw new Error(result._sResultMessage);
   *       }
   *     } catch (error) {
   *       console.error('문서 스캔 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static getScanConfig(documentType) {
   *     const configs = {
   *       id_card: {
   *         autoRotate: true,
   *         enableOCR: true,
   *         quality: 'high',
   *         expectedRatio: '1.586:1' // 신분증 비율
   *       },
   *       business_card: {
   *         autoRotate: true,
   *         enableOCR: true,
   *         quality: 'high',
   *         expectedRatio: '1.75:1' // 명함 비율
   *       },
   *       receipt: {
   *         autoRotate: true,
   *         enableOCR: true,
   *         quality: 'medium',
   *         expectedRatio: 'any'
   *       },
   *       general: {
   *         autoRotate: true,
   *         enableOCR: false,
   *         quality: 'medium',
   *         expectedRatio: 'any'
   *       }
   *     };
   *
   *     return configs[documentType] || configs.general;
   *   }
   *
   *   static generateScanId() {
   *     return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
   *   }
   * }
   *
   * @example
   * // 다중 사진 촬영 및 배치 처리
   * class BatchPhotoCapture {
   *   static async captureMultiplePhotos(count, options = {}) {
   *     const results = [];
   *     const errors = [];
   *
   *     console.log(`${count}장의 사진 촬영 시작`);
   *
   *     for (let i = 0; i < count; i++) {
   *       try {
   *         const photoIndex = i + 1;
   *
   *         // 사용자에게 진행 상황 알림
   *         if (options.showProgress) {
   *           alert(`${photoIndex}/${count}번째 사진을 촬영해주세요.`);
   *         }
   *
   *         const result = await bizMOB.System.callCamera({
   *           _sFileName: `batch_${Date.now()}_${photoIndex}`,
   *           _sDirectory: options.directory || 'photos/batch',
   *           _bAutoVerticalHorizontal: options.autoRotate !== false
   *         });
   *
   *         if (result._bResult) {
   *           results.push({
   *             index: photoIndex,
   *             success: true,
   *             data: result._oData
   *           });
   *
   *           console.log(`${photoIndex}번째 사진 촬영 완료`);
   *         } else {
   *           throw new Error(result._sResultMessage);
   *         }
   *       } catch (error) {
   *         console.error(`${i + 1}번째 사진 촬영 실패:`, error);
   *
   *         errors.push({
   *           index: i + 1,
   *           error: error.message
   *         });
   *
   *         // 실패 시 재시도 옵션
   *         if (options.allowRetry) {
   *           const retry = confirm(`${i + 1}번째 사진 촬영에 실패했습니다. 다시 시도하시겠습니까?`);
   *           if (retry) {
   *             i--; // 현재 인덱스를 다시 시도
   *             continue;
   *           }
   *         }
   *       }
   *
   *       // 촬영 간 지연 (연속 촬영 시 카메라 안정화)
   *       if (i < count - 1 && options.delay) {
   *         await new Promise(resolve => setTimeout(resolve, options.delay));
   *       }
   *     }
   *
   *     console.log(`배치 촬영 완료: 성공 ${results.length}, 실패 ${errors.length}`);
   *
   *     return {
   *       total: count,
   *       successful: results,
   *       failed: errors,
   *       successCount: results.length,
   *       failureCount: errors.length
   *     };
   *   }
   *
   *   static async captureTimeLapse(intervalSeconds, totalCount, options = {}) {
   *     console.log(`타임랩스 촬영 시작: ${intervalSeconds}초 간격, ${totalCount}장`);
   *
   *     const results = [];
   *     let captureCount = 0;
   *
   *     const captureInterval = setInterval(async () => {
   *       try {
   *         captureCount++;
   *
   *         const result = await bizMOB.System.callCamera({
   *           _sFileName: `timelapse_${Date.now()}_${captureCount}`,
   *           _sDirectory: options.directory || 'photos/timelapse',
   *           _bAutoVerticalHorizontal: true
   *         });
   *
   *         if (result._bResult) {
   *           results.push(result._oData);
   *           console.log(`타임랩스 ${captureCount}/${totalCount} 촬영 완료`);
   *         }
   *
   *         if (captureCount >= totalCount) {
   *           clearInterval(captureInterval);
   *           console.log('타임랩스 촬영 완료');
   *
   *           if (options.onComplete) {
   *             options.onComplete(results);
   *           }
   *         }
   *       } catch (error) {
   *         console.error(`타임랩스 ${captureCount} 촬영 실패:`, error);
   *       }
   *     }, intervalSeconds * 1000);
   *
   *     return {
   *       stop: () => {
   *         clearInterval(captureInterval);
   *         console.log('타임랩스 촬영 중단');
   *         return results;
   *       }
   *     };
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
}
