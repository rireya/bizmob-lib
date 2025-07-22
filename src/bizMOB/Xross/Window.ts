export default class Window {
  /**
   * 사인패드(전자서명) 창을 열어 사용자의 서명을 입력받습니다.
   *
   * 터치스크린 기반의 서명 입력 인터페이스를 제공하여 사용자가 손가락이나 스타일러스로
   * 서명을 작성할 수 있습니다. 작성된 서명은 이미지 파일로 저장됩니다.
   *
   * @description
   * - 앱: 네이티브 사인패드 UI를 통한 전자서명 입력
   * - 웹: Canvas 기반 서명 입력 인터페이스
   *
   * @purpose 계약서 서명, 동의서 작성, 영수증 확인, 배송 확인, 전자문서 승인
   *
   * @param {Object} arg - 사인패드 설정 객체
   * @param {string} arg._sTargetPath - 서명 이미지가 저장될 파일 경로
   *   - 상대경로 또는 절대경로 모두 지원
   *   - 파일 확장자는 자동으로 .png 추가 (미지정 시)
   *   - 예: "signatures/contract_001", "/documents/sign.png"
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 서명 입력 결과를 담은 Promise
   * @returns {boolean} return._bResult - 서명 성공 여부 (true: 성공, false: 실패/취소)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '6001': 취소, '9999': 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 서명 정보 (성공 시)
   * @returns {string} return._oData.filePath - 저장된 서명 이미지 파일 경로
   * @returns {string} return._oData.fileName - 저장된 파일명
   * @returns {number} return._oData.fileSize - 저장된 파일 크기 (bytes)
   * @returns {number} return._oData.width - 서명 이미지 너비 (pixels)
   * @returns {number} return._oData.height - 서명 이미지 높이 (pixels)
   * @returns {string} return._oData.timestamp - 서명 생성 시간 (ISO 8601 형식)
   * @returns {string} return._oData.checksum - 서명 이미지 체크섬 (무결성 검증용)
   *
   * @caution
   * - 서명패드 사용 시 충분한 화면 공간이 필요합니다
   * - 저장 경로에 쓰기 권한이 있어야 합니다
   * - 사용자가 서명을 취소할 수 있습니다
   * - 생성된 서명 파일은 투명 배경의 PNG 형식입니다
   * - 서명 품질은 디바이스의 터치 감도에 영향을 받습니다
   *
   * @example
   * // 기본 서명패드 사용
   * const signResult = await bizMOB.Window.openSignPad({
   *   _sTargetPath: 'signatures/contract_001'
   * });
   *
   * if (signResult._bResult) {
   *   console.log('서명 완료:', signResult._oData.filePath);
   *   console.log('파일 크기:', signResult._oData.fileSize, 'bytes');
   *
   *   // 서명 이미지 표시
   *   displaySignatureImage(signResult._oData.filePath);
   * } else {
   *   console.log('서명이 취소되었습니다.');
   * }
   *
   * @example
   * // 계약서 전자서명 시스템
   * class ContractSignatureManager {
   *   static async signContract(contractId, signerId) {
   *     try {
   *       console.log('계약서 서명 프로세스 시작');
   *
   *       // 서명자 정보 검증
   *       const signerInfo = await this.validateSigner(signerId);
   *       if (!signerInfo.isValid) {
   *         throw new Error('서명 권한이 없는 사용자입니다.');
   *       }
   *
   *       // 계약서 상태 확인
   *       const contractStatus = await this.getContractStatus(contractId);
   *       if (contractStatus !== 'ready_for_signature') {
   *         throw new Error('서명할 수 없는 계약서 상태입니다.');
   *       }
   *
   *       // 서명 파일 경로 생성
   *       const signaturePath = `contracts/${contractId}/signatures/${signerId}_${Date.now()}`;
   *
   *       // 사인패드 열기
   *       const signResult = await bizMOB.Window.openSignPad({
   *         _sTargetPath: signaturePath
   *       });
   *
   *       if (signResult._bResult) {
   *         // 서명 데이터 검증
   *         const validation = await this.validateSignature(signResult._oData);
   *         if (!validation.isValid) {
   *           throw new Error(validation.reason);
   *         }
   *
   *         // 서명 정보 저장
   *         const signatureData = {
   *           contractId: contractId,
   *           signerId: signerId,
   *           signerName: signerInfo.name,
   *           signatureFilePath: signResult._oData.filePath,
   *           signatureChecksum: signResult._oData.checksum,
   *           signedAt: signResult._oData.timestamp,
   *           deviceInfo: await this.getDeviceInfo(),
   *           ipAddress: await this.getClientIP(),
   *           location: await this.getCurrentLocation()
   *         };
   *
   *         // 데이터베이스에 서명 정보 저장
   *         const saveResult = await this.saveSignatureData(signatureData);
   *
   *         // 계약서 상태 업데이트
   *         await this.updateContractStatus(contractId, 'signed');
   *
   *         // 서명 완료 알림 발송
   *         await this.sendSignatureNotification(contractId, signerInfo);
   *
   *         // 감사 로그 기록
   *         await this.logSignatureActivity(signatureData);
   *
   *         console.log('계약서 서명 완료');
   *         return {
   *           success: true,
   *           signatureId: saveResult.signatureId,
   *           signatureData: signatureData
   *         };
   *       } else {
   *         console.log('사용자가 서명을 취소했습니다.');
   *
   *         // 취소 로깅
   *         await this.logSignatureCancellation(contractId, signerId);
   *
   *         return {
   *           success: false,
   *           reason: 'cancelled_by_user'
   *         };
   *       }
   *     } catch (error) {
   *       console.error('계약서 서명 실패:', error);
   *
   *       // 오류 로깅
   *       await this.logSignatureError(contractId, signerId, error);
   *
   *       throw error;
   *     }
   *   }
   *
   *   static async validateSignature(signatureData) {
   *     // 서명 이미지 크기 검증
   *     if (signatureData.fileSize < 1000) { // 1KB 미만
   *       return {
   *         isValid: false,
   *         reason: '서명이 너무 간단합니다. 다시 서명해주세요.'
   *       };
   *     }
   *
   *     // 서명 이미지 해상도 검증
   *     const minDimension = 100;
   *     if (signatureData.width < minDimension || signatureData.height < minDimension) {
   *       return {
   *         isValid: false,
   *         reason: '서명 이미지가 너무 작습니다.'
   *       };
   *     }
   *
   *     // 체크섬 검증
   *     const calculatedChecksum = await this.calculateImageChecksum(signatureData.filePath);
   *     if (calculatedChecksum !== signatureData.checksum) {
   *       return {
   *         isValid: false,
   *         reason: '서명 이미지가 손상되었습니다.'
   *       };
   *     }
   *
   *     return { isValid: true };
   *   }
   * }
   *
   * @example
   * // 배송 확인 서명 시스템
   * class DeliverySignatureManager {
   *   static async captureDeliverySignature(deliveryId, recipientInfo) {
   *     try {
   *       console.log('배송 확인 서명 시작');
   *
   *       // 배송 정보 확인
   *       const deliveryInfo = await this.getDeliveryInfo(deliveryId);
   *
   *       // 서명 캡처
   *       const signaturePath = `deliveries/${deliveryId}/signature_${Date.now()}`;
   *       const signResult = await bizMOB.Window.openSignPad({
   *         _sTargetPath: signaturePath
   *       });
   *
   *       if (signResult._bResult) {
   *         // 배송 완료 처리
   *         const deliveryCompletion = {
   *           deliveryId: deliveryId,
   *           recipientName: recipientInfo.name,
   *           recipientPhone: recipientInfo.phone,
   *           signatureFilePath: signResult._oData.filePath,
   *           deliveredAt: new Date().toISOString(),
   *           delivererId: await this.getCurrentDelivererId(),
   *           location: await this.getCurrentGPS()
   *         };
   *
   *         // 배송 완료 데이터 저장
   *         await this.completeDelivery(deliveryCompletion);
   *
   *         // 고객에게 배송 완료 알림
   *         await this.sendDeliveryCompletionNotification(deliveryCompletion);
   *
   *         // 서명 이미지를 영수증에 첨부
   *         await this.attachSignatureToReceipt(deliveryId, signResult._oData.filePath);
   *
   *         console.log('배송 확인 완료');
   *         return deliveryCompletion;
   *       } else {
   *         console.log('배송 확인이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('배송 확인 서명 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @example
   * // 서명 품질 관리 시스템
   * class SignatureQualityManager {
   *   static async captureQualitySignature(context, options = {}) {
   *     const maxAttempts = options.maxAttempts || 3;
   *     let attempt = 0;
   *
   *     while (attempt < maxAttempts) {
   *       attempt++;
   *
   *       try {
   *         console.log(`서명 시도 ${attempt}/${maxAttempts}`);
   *
   *         const signaturePath = `${context.basePath}/attempt_${attempt}_${Date.now()}`;
   *         const signResult = await bizMOB.Window.openSignPad({
   *           _sTargetPath: signaturePath
   *         });
   *
   *         if (!signResult._bResult) {
   *           console.log('서명이 취소되었습니다.');
   *           return null;
   *         }
   *
   *         // 서명 품질 평가
   *         const qualityScore = await this.evaluateSignatureQuality(signResult._oData);
   *
   *         if (qualityScore.score >= (options.minQualityScore || 70)) {
   *           console.log(`서명 품질 양호 (점수: ${qualityScore.score})`);
   *
   *           // 이전 시도 파일들 정리
   *           await this.cleanupPreviousAttempts(context.basePath, attempt);
   *
   *           return {
   *             signatureData: signResult._oData,
   *             qualityScore: qualityScore,
   *             attempts: attempt
   *           };
   *         } else {
   *           console.log(`서명 품질 부족 (점수: ${qualityScore.score})`);
   *
   *           if (attempt < maxAttempts) {
   *             const retry = confirm(
   *               `서명 품질이 부족합니다 (${qualityScore.reason}).\n` +
   *               `다시 서명하시겠습니까? (${attempt}/${maxAttempts})`
   *             );
   *
   *             if (!retry) {
   *               break;
   *             }
   *           } else {
   *             console.log('최대 시도 횟수에 도달했습니다.');
   *           }
   *         }
   *       } catch (error) {
   *         console.error(`서명 시도 ${attempt} 실패:`, error);
   *
   *         if (attempt >= maxAttempts) {
   *           throw error;
   *         }
   *       }
   *     }
   *
   *     throw new Error('서명 품질 기준을 충족하지 못했습니다.');
   *   }
   *
   *   static async evaluateSignatureQuality(signatureData) {
   *     let score = 0;
   *     const reasons = [];
   *
   *     // 파일 크기 평가 (복잡도)
   *     if (signatureData.fileSize > 5000) {
   *       score += 30;
   *     } else if (signatureData.fileSize > 2000) {
   *       score += 20;
   *     } else {
   *       reasons.push('서명이 너무 간단함');
   *     }
   *
   *     // 이미지 크기 평가
   *     const aspectRatio = signatureData.width / signatureData.height;
   *     if (aspectRatio >= 2 && aspectRatio <= 4) {
   *       score += 20; // 적절한 가로세로 비율
   *     } else {
   *       reasons.push('부적절한 서명 비율');
   *     }
   *
   *     // 최소 크기 평가
   *     if (signatureData.width >= 200 && signatureData.height >= 50) {
   *       score += 25;
   *     } else {
   *       reasons.push('서명 크기가 너무 작음');
   *     }
   *
   *     // 기본 점수
   *     score += 25;
   *
   *     return {
   *       score: Math.min(score, 100),
   *       reason: reasons.length > 0 ? reasons.join(', ') : '양호한 서명'
   *     };
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 바코드 및 QR코드 리더를 열어 코드를 스캔합니다.
   *
   * 디바이스의 카메라를 이용하여 1D 바코드(EAN, UPC 등)와 2D 코드(QR, DataMatrix 등)를
   * 실시간으로 인식하고 디코딩하는 스캐너 인터페이스를 제공합니다.
   *
   * @description
   * - 앱: 네이티브 카메라 스캐너를 통한 실시간 코드 인식
   * - 웹: WebRTC 기반 브라우저 카메라 스캐너
   *
   * @purpose 상품 정보 조회, QR 결제, 재고 관리, 출입 통제, URL 접속, 연락처 등록
   *
   * @param {Object} [arg] - 코드 리더 설정 객체 (선택사항)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 코드 스캔 결과를 담은 Promise
   * @returns {boolean} return._bResult - 스캔 성공 여부 (true: 성공, false: 실패/취소)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '6001': 취소, '9999': 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 스캔된 코드 정보 (성공 시)
   * @returns {string} return._oData.codeData - 스캔된 코드 데이터 (원본 텍스트)
   * @returns {string} return._oData.codeType - 코드 타입 ('QR_CODE', 'EAN_13', 'CODE_128' 등)
   * @returns {string} return._oData.format - 코드 포맷 ('1D', '2D')
   * @returns {number} return._oData.width - 스캔된 코드 이미지 너비
   * @returns {number} return._oData.height - 스캔된 코드 이미지 높이
   * @returns {string} return._oData.timestamp - 스캔 시간 (ISO 8601 형식)
   * @returns {Object} return._oData.boundingBox - 코드 위치 정보 (x, y, width, height)
   * @returns {number} return._oData.confidence - 인식 신뢰도 (0-100)
   *
   * @caution
   * - 카메라 접근 권한이 필요합니다
   * - 충분한 조명과 안정된 촬영이 필요합니다
   * - 손상된 코드는 인식되지 않을 수 있습니다
   * - 사용자가 스캔을 취소할 수 있습니다
   * - 지원되지 않는 코드 형식이 있을 수 있습니다
   *
   * @example
   * // 기본 바코드/QR코드 스캔
   * const scanResult = await bizMOB.Window.openCodeReader();
   *
   * if (scanResult._bResult) {
   *   const codeData = scanResult._oData.codeData;
   *   const codeType = scanResult._oData.codeType;
   *
   *   console.log('스캔 성공:', codeData);
   *   console.log('코드 타입:', codeType);
   *
   *   // 코드 타입별 처리
   *   handleScannedCode(codeData, codeType);
   * } else {
   *   console.log('스캔이 취소되었습니다.');
   * }
   *
   * @example
   * // 상품 정보 조회 시스템
   * class ProductScanManager {
   *   static async scanProductBarcode() {
   *     try {
   *       console.log('상품 바코드 스캔 시작');
   *
   *       const scanResult = await bizMOB.Window.openCodeReader();
   *
   *       if (scanResult._bResult) {
   *         const barcode = scanResult._oData.codeData;
   *         const codeType = scanResult._oData.codeType;
   *
   *         // 바코드 형식 검증
   *         if (!this.isValidProductBarcode(barcode, codeType)) {
   *           throw new Error('올바른 상품 바코드가 아닙니다.');
   *         }
   *
   *         // 상품 정보 조회
   *         console.log('상품 정보 조회 중...');
   *         const productInfo = await this.getProductInfo(barcode);
   *
   *         if (productInfo) {
   *           // 재고 확인
   *           const stockInfo = await this.checkStock(barcode);
   *
   *           // 가격 정보 조회
   *           const priceInfo = await this.getPriceInfo(barcode);
   *
   *           // 상품 상세 정보 구성
   *           const productDetails = {
   *             barcode: barcode,
   *             codeType: codeType,
   *             name: productInfo.name,
   *             brand: productInfo.brand,
   *             category: productInfo.category,
   *             description: productInfo.description,
   *             price: priceInfo.currentPrice,
   *             originalPrice: priceInfo.originalPrice,
   *             discountRate: priceInfo.discountRate,
   *             stockQuantity: stockInfo.quantity,
   *             stockStatus: stockInfo.status,
   *             imageUrl: productInfo.imageUrl,
   *             specifications: productInfo.specifications,
   *             scanTimestamp: scanResult._oData.timestamp
   *           };
   *
   *           // 스캔 이력 저장
   *           await this.saveScanHistory(productDetails);
   *
   *           // 상품 정보 표시
   *           await this.displayProductInfo(productDetails);
   *
   *           console.log('상품 정보 조회 완료');
   *           return productDetails;
   *         } else {
   *           throw new Error('등록되지 않은 상품입니다.');
   *         }
   *       } else {
   *         console.log('상품 스캔이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('상품 바코드 스캔 실패:', error);
   *
   *       // 사용자에게 오류 알림
   *       alert(`상품 조회 실패: ${error.message}`);
   *
   *       // 대안 제공
   *       const useManualInput = confirm('바코드를 직접 입력하시겠습니까?');
   *       if (useManualInput) {
   *         return await this.manualBarcodeInput();
   *       }
   *
   *       throw error;
   *     }
   *   }
   *
   *   static isValidProductBarcode(barcode, codeType) {
   *     // EAN-13 검증
   *     if (codeType === 'EAN_13') {
   *       return /^\d{13}$/.test(barcode);
   *     }
   *
   *     // UPC-A 검증
   *     if (codeType === 'UPC_A') {
   *       return /^\d{12}$/.test(barcode);
   *     }
   *
   *     // Code 128 검증
   *     if (codeType === 'CODE_128') {
   *       return barcode.length >= 6 && barcode.length <= 48;
   *     }
   *
   *     return false;
   *   }
   * }
   *
   * @example
   * // QR코드 기반 결제 시스템
   * class QRPaymentManager {
   *   static async scanPaymentQR() {
   *     try {
   *       console.log('QR 결제 스캔 시작');
   *
   *       const scanResult = await bizMOB.Window.openCodeReader();
   *
   *       if (scanResult._bResult) {
   *         const qrData = scanResult._oData.codeData;
   *
   *         // QR코드 형식 검증
   *         if (scanResult._oData.codeType !== 'QR_CODE') {
   *           throw new Error('QR코드가 아닙니다. 결제용 QR코드를 스캔해주세요.');
   *         }
   *
   *         // 결제 QR 데이터 파싱
   *         const paymentData = this.parsePaymentQR(qrData);
   *         if (!paymentData.isValid) {
   *           throw new Error('올바른 결제 QR코드가 아닙니다.');
   *         }
   *
   *         // 가맹점 정보 확인
   *         const merchantInfo = await this.getMerchantInfo(paymentData.merchantId);
   *         if (!merchantInfo.isActive) {
   *           throw new Error('현재 사용할 수 없는 가맹점입니다.');
   *         }
   *
   *         // 결제 정보 구성
   *         const paymentInfo = {
   *           merchantId: paymentData.merchantId,
   *           merchantName: merchantInfo.name,
   *           amount: paymentData.amount,
   *           currency: paymentData.currency || 'KRW',
   *           transactionId: paymentData.transactionId,
   *           description: paymentData.description,
   *           qrData: qrData,
   *           scannedAt: scanResult._oData.timestamp
   *         };
   *
   *         // 결제 확인 화면 표시
   *         const userConfirmed = await this.showPaymentConfirmation(paymentInfo);
   *
   *         if (userConfirmed) {
   *           // 결제 처리
   *           const paymentResult = await this.processPayment(paymentInfo);
   *
   *           if (paymentResult.success) {
   *             // 결제 영수증 표시
   *             await this.showPaymentReceipt(paymentResult);
   *
   *             console.log('QR 결제 완료');
   *             return paymentResult;
   *           } else {
   *             throw new Error(paymentResult.errorMessage);
   *           }
   *         } else {
   *           console.log('사용자가 결제를 취소했습니다.');
   *           return null;
   *         }
   *       } else {
   *         console.log('QR 스캔이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('QR 결제 실패:', error);
   *       alert(`결제 실패: ${error.message}`);
   *       throw error;
   *     }
   *   }
   *
   *   static parsePaymentQR(qrData) {
   *     try {
   *       // JSON 형식 QR 데이터 파싱
   *       if (qrData.startsWith('{')) {
   *         const data = JSON.parse(qrData);
   *         return {
   *           isValid: true,
   *           merchantId: data.merchant_id,
   *           amount: data.amount,
   *           currency: data.currency,
   *           transactionId: data.transaction_id,
   *           description: data.description
   *         };
   *       }
   *
   *       // URL 형식 QR 데이터 파싱
   *       if (qrData.startsWith('http')) {
   *         const url = new URL(qrData);
   *         return {
   *           isValid: true,
   *           merchantId: url.searchParams.get('merchant'),
   *           amount: parseFloat(url.searchParams.get('amount')),
   *           currency: url.searchParams.get('currency'),
   *           transactionId: url.searchParams.get('txid'),
   *           description: url.searchParams.get('desc')
   *         };
   *       }
   *
   *       return { isValid: false };
   *     } catch (error) {
   *       return { isValid: false };
   *     }
   *   }
   * }
   *
   * @example
   * // 재고 관리 시스템
   * class InventoryManager {
   *   static async scanForInventory(operation = 'check') {
   *     try {
   *       console.log(`재고 ${operation} 작업 시작`);
   *
   *       const scanResult = await bizMOB.Window.openCodeReader();
   *
   *       if (scanResult._bResult) {
   *         const code = scanResult._oData.codeData;
   *         const codeType = scanResult._oData.codeType;
   *
   *         // 재고 아이템 정보 조회
   *         const itemInfo = await this.getItemInfo(code);
   *         if (!itemInfo) {
   *           throw new Error('등록되지 않은 상품입니다.');
   *         }
   *
   *         // 작업 타입별 처리
   *         switch (operation) {
   *           case 'check':
   *             return await this.checkInventory(itemInfo, scanResult);
   *
   *           case 'in':
   *             return await this.processInventoryIn(itemInfo, scanResult);
   *
   *           case 'out':
   *             return await this.processInventoryOut(itemInfo, scanResult);
   *
   *           case 'move':
   *             return await this.processInventoryMove(itemInfo, scanResult);
   *
   *           default:
   *             throw new Error('지원하지 않는 재고 작업입니다.');
   *         }
   *       } else {
   *         console.log('재고 스캔이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('재고 관리 스캔 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async batchScanInventory(maxItems = 100) {
   *     const scannedItems = [];
   *     let scanCount = 0;
   *
   *     console.log(`일괄 재고 스캔 시작 (최대 ${maxItems}개)`);
   *
   *     while (scanCount < maxItems) {
   *       try {
   *         const continueScanning = scanCount === 0 || confirm(
   *           `${scanCount}개 스캔 완료. 계속 스캔하시겠습니까?`
   *         );
   *
   *         if (!continueScanning) break;
   *
   *         const scanResult = await bizMOB.Window.openCodeReader();
   *
   *         if (scanResult._bResult) {
   *           const code = scanResult._oData.codeData;
   *
   *           // 중복 스캔 확인
   *           const isDuplicate = scannedItems.some(item => item.code === code);
   *           if (isDuplicate) {
   *             alert('이미 스캔된 상품입니다.');
   *             continue;
   *           }
   *
   *           // 상품 정보 조회
   *           const itemInfo = await this.getItemInfo(code);
   *           if (itemInfo) {
   *             scannedItems.push({
   *               code: code,
   *               codeType: scanResult._oData.codeType,
   *               itemInfo: itemInfo,
   *               scannedAt: scanResult._oData.timestamp,
   *               scanOrder: scanCount + 1
   *             });
   *
   *             scanCount++;
   *             console.log(`스캔 완료 (${scanCount}/${maxItems}): ${itemInfo.name}`);
   *           } else {
   *             alert('등록되지 않은 상품입니다.');
   *           }
   *         } else {
   *           break; // 스캔 취소
   *         }
   *       } catch (error) {
   *         console.error('스캔 중 오류:', error);
   *         const continueOnError = confirm('오류가 발생했습니다. 계속하시겠습니까?');
   *         if (!continueOnError) break;
   *       }
   *     }
   *
   *     console.log(`일괄 스캔 완료: ${scannedItems.length}개 상품`);
   *     return scannedItems;
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 파일 탐색기를 열어 파일을 선택하거나 탐색합니다.
   *
   * 디바이스의 파일 시스템에 접근하여 파일과 폴더를 탐색하고 선택할 수 있는
   * 네이티브 파일 관리자 인터페이스를 제공합니다.
   *
   * @description
   * - 앱: 플랫폼별 네이티브 파일 매니저 실행
   * - 웹: 브라우저의 파일 선택 다이얼로그 실행
   *
   * @purpose 파일 첨부, 문서 선택, 이미지 업로드, 백업 파일 관리, 데이터 가져오기
   *
   * @param {Object} [arg] - 파일 탐색기 설정 객체 (선택사항)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 파일 선택 결과를 담은 Promise
   * @returns {boolean} return._bResult - 선택 성공 여부 (true: 성공, false: 실패/취소)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '6001': 취소, '9999': 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 선택된 파일 정보 (성공 시)
   * @returns {string} return._oData.filePath - 선택된 파일의 전체 경로
   * @returns {string} return._oData.fileName - 선택된 파일명 (확장자 포함)
   * @returns {string} return._oData.fileBaseName - 파일명 (확장자 제외)
   * @returns {string} return._oData.fileExtension - 파일 확장자
   * @returns {number} return._oData.fileSize - 파일 크기 (bytes)
   * @returns {string} return._oData.mimeType - MIME 타입
   * @returns {string} return._oData.lastModified - 최종 수정 시간 (ISO 8601 형식)
   * @returns {string} return._oData.parentDirectory - 상위 디렉토리 경로
   * @returns {boolean} return._oData.isReadable - 읽기 가능 여부
   * @returns {boolean} return._oData.isWritable - 쓰기 가능 여부
   *
   * @caution
   * - 파일 시스템 접근 권한이 필요합니다
   * - 선택한 파일의 읽기 권한을 확인해야 합니다
   * - 대용량 파일 처리 시 성능에 영향을 줄 수 있습니다
   * - 사용자가 파일 선택을 취소할 수 있습니다
   * - 플랫폼별로 지원하는 파일 시스템이 다를 수 있습니다
   *
   * @example
   * // 기본 파일 선택
   * const fileResult = await bizMOB.Window.openFileExplorer();
   *
   * if (fileResult._bResult) {
   *   const selectedFile = fileResult._oData;
   *   console.log('선택된 파일:', selectedFile.fileName);
   *   console.log('파일 크기:', selectedFile.fileSize, 'bytes');
   *   console.log('MIME 타입:', selectedFile.mimeType);
   *
   *   // 파일 처리
   *   await processSelectedFile(selectedFile);
   * } else {
   *   console.log('파일 선택이 취소되었습니다.');
   * }
   *
   * @example
   * // 문서 업로드 시스템
   * class DocumentUploadManager {
   *   static async uploadDocument(uploadConfig = {}) {
   *     try {
   *       console.log('문서 업로드 시작');
   *
   *       // 파일 선택
   *       const fileResult = await bizMOB.Window.openFileExplorer();
   *
   *       if (fileResult._bResult) {
   *         const selectedFile = fileResult._oData;
   *
   *         // 파일 검증
   *         const validation = await this.validateUploadFile(selectedFile, uploadConfig);
   *         if (!validation.isValid) {
   *           throw new Error(validation.reason);
   *         }
   *
   *         // 파일 정보 분석
   *         const fileInfo = await this.analyzeFile(selectedFile);
   *
   *         // 업로드 진행률 표시
   *         const progressDialog = this.showUploadProgress();
   *
   *         try {
   *           // 파일 업로드 실행
   *           const uploadResult = await this.uploadFileToServer(selectedFile, {
   *             onProgress: (progress) => {
   *               progressDialog.updateProgress(progress);
   *             },
   *             metadata: {
   *               originalName: selectedFile.fileName,
   *               mimeType: selectedFile.mimeType,
   *               size: selectedFile.fileSize,
   *               uploadedAt: new Date().toISOString(),
   *               fileInfo: fileInfo
   *             }
   *           });
   *
   *           // 업로드 완료 처리
   *           progressDialog.close();
   *
   *           // 문서 메타데이터 저장
   *           const documentData = {
   *             id: uploadResult.documentId,
   *             fileName: selectedFile.fileName,
   *             filePath: uploadResult.serverPath,
   *             fileSize: selectedFile.fileSize,
   *             mimeType: selectedFile.mimeType,
   *             uploadedAt: uploadResult.uploadedAt,
   *             checksum: uploadResult.checksum,
   *             metadata: fileInfo,
   *             tags: await this.generateFileTags(selectedFile, fileInfo)
   *           };
   *
   *           await this.saveDocumentMetadata(documentData);
   *
   *           // 썸네일 생성 (이미지/문서인 경우)
   *           if (this.isThumbnailSupported(selectedFile.mimeType)) {
   *             await this.generateThumbnail(documentData);
   *           }
   *
   *           // 전문 검색 인덱싱 (텍스트 문서인 경우)
   *           if (this.isTextDocument(selectedFile.mimeType)) {
   *             await this.indexDocumentContent(documentData);
   *           }
   *
   *           console.log('문서 업로드 완료');
   *           return documentData;
   *         } finally {
   *           progressDialog.close();
   *         }
   *       } else {
   *         console.log('파일 선택이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('문서 업로드 실패:', error);
   *       alert(`업로드 실패: ${error.message}`);
   *       throw error;
   *     }
   *   }
   *
   *   static async validateUploadFile(file, config) {
   *     // 파일 크기 검증
   *     const maxSize = config.maxSize || 10 * 1024 * 1024; // 기본 10MB
   *     if (file.fileSize > maxSize) {
   *       return {
   *         isValid: false,
   *         reason: `파일 크기가 너무 큽니다. (최대 ${this.formatFileSize(maxSize)})`
   *       };
   *     }
   *
   *     // 파일 타입 검증
   *     const allowedTypes = config.allowedTypes || [
   *       'application/pdf',
   *       'application/msword',
   *       'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
   *       'image/jpeg',
   *       'image/png',
   *       'text/plain'
   *     ];
   *
   *     if (!allowedTypes.includes(file.mimeType)) {
   *       return {
   *         isValid: false,
   *         reason: '지원하지 않는 파일 형식입니다.'
   *       };
   *     }
   *
   *     // 파일명 검증
   *     if (file.fileName.length > 255) {
   *       return {
   *         isValid: false,
   *         reason: '파일명이 너무 깁니다.'
   *       };
   *     }
   *
   *     // 위험한 파일 확장자 확인
   *     const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs'];
   *     const fileExtension = file.fileExtension.toLowerCase();
   *     if (dangerousExtensions.includes(fileExtension)) {
   *       return {
   *         isValid: false,
   *         reason: '보안상 업로드할 수 없는 파일 형식입니다.'
   *       };
   *     }
   *
   *     return { isValid: true };
   *   }
   * }
   *
   * @example
   * // 설정 파일 가져오기 시스템
   * class ConfigurationImporter {
   *   static async importConfiguration() {
   *     try {
   *       console.log('설정 파일 가져오기 시작');
   *
   *       const fileResult = await bizMOB.Window.openFileExplorer();
   *
   *       if (fileResult._bResult) {
   *         const configFile = fileResult._oData;
   *
   *         // 설정 파일 형식 확인
   *         if (!this.isValidConfigFile(configFile)) {
   *           throw new Error('올바른 설정 파일이 아닙니다. JSON 또는 XML 파일을 선택해주세요.');
   *         }
   *
   *         // 파일 내용 읽기
   *         const fileContent = await this.readFileContent(configFile);
   *
   *         // 설정 데이터 파싱
   *         const configData = this.parseConfigurationFile(fileContent, configFile.fileExtension);
   *
   *         // 설정 유효성 검증
   *         const validation = this.validateConfiguration(configData);
   *         if (!validation.isValid) {
   *           throw new Error(`설정 파일 오류: ${validation.errors.join(', ')}`);
   *         }
   *
   *         // 기존 설정 백업
   *         await this.backupCurrentConfiguration();
   *
   *         // 새 설정 적용
   *         await this.applyConfiguration(configData);
   *
   *         // 설정 가져오기 이력 저장
   *         await this.logConfigurationImport({
   *           fileName: configFile.fileName,
   *           filePath: configFile.filePath,
   *           importedAt: new Date().toISOString(),
   *           configData: configData
   *         });
   *
   *         console.log('설정 파일 가져오기 완료');
   *         return {
   *           success: true,
   *           configData: configData,
   *           appliedSettings: Object.keys(configData).length
   *         };
   *       } else {
   *         console.log('설정 파일 선택이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('설정 파일 가져오기 실패:', error);
   *
   *       // 오류 시 기존 설정 복원
   *       await this.restoreConfiguration();
   *
   *       throw error;
   *     }
   *   }
   *
   *   static isValidConfigFile(file) {
   *     const validExtensions = ['.json', '.xml', '.config', '.ini'];
   *     return validExtensions.includes(file.fileExtension.toLowerCase());
   *   }
   *
   *   static parseConfigurationFile(content, extension) {
   *     switch (extension.toLowerCase()) {
   *       case '.json':
   *         return JSON.parse(content);
   *
   *       case '.xml':
   *         return this.parseXMLConfig(content);
   *
   *       case '.ini':
   *         return this.parseINIConfig(content);
   *
   *       default:
   *         throw new Error('지원하지 않는 설정 파일 형식입니다.');
   *     }
   *   }
   * }
   *
   * @example
   * // 데이터 내보내기/가져오기 시스템
   * class DataExchangeManager {
   *   static async importDataFile(dataType = 'general') {
   *     try {
   *       console.log(`${dataType} 데이터 가져오기 시작`);
   *
   *       const fileResult = await bizMOB.Window.openFileExplorer();
   *
   *       if (fileResult._bResult) {
   *         const dataFile = fileResult._oData;
   *
   *         // 파일 형식별 처리
   *         const importResult = await this.processImportFile(dataFile, dataType);
   *
   *         if (importResult.success) {
   *           // 가져오기 성공 알림
   *           alert(`데이터 가져오기 완료\\n` +
   *                 `처리된 레코드: ${importResult.processedCount}개\\n` +
   *                 `성공: ${importResult.successCount}개\\n` +
   *                 `실패: ${importResult.failureCount}개`);
   *
   *           return importResult;
   *         } else {
   *           throw new Error(importResult.errorMessage);
   *         }
   *       } else {
   *         console.log('데이터 파일 선택이 취소되었습니다.');
   *         return null;
   *       }
   *     } catch (error) {
   *       console.error('데이터 가져오기 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async processImportFile(file, dataType) {
   *     const extension = file.fileExtension.toLowerCase();
   *
   *     switch (extension) {
   *       case '.csv':
   *         return await this.importCSVData(file, dataType);
   *
   *       case '.json':
   *         return await this.importJSONData(file, dataType);
   *
   *       case '.xlsx':
   *       case '.xls':
   *         return await this.importExcelData(file, dataType);
   *
   *       case '.xml':
   *         return await this.importXMLData(file, dataType);
   *
   *       default:
   *         throw new Error('지원하지 않는 파일 형식입니다.');
   *     }
   *   }
   *
   *   static async importCSVData(file, dataType) {
   *     // CSV 파일 내용 읽기
   *     const csvContent = await this.readFileContent(file);
   *
   *     // CSV 파싱
   *     const csvData = this.parseCSV(csvContent);
   *
   *     // 데이터 검증 및 변환
   *     const validationResults = csvData.map(row => this.validateDataRow(row, dataType));
   *
   *     // 유효한 데이터만 필터링
   *     const validRows = csvData.filter((row, index) => validationResults[index].isValid);
   *
   *     // 데이터 일괄 저장
   *     const saveResults = await Promise.allSettled(
   *       validRows.map(row => this.saveDataRow(row, dataType))
   *     );
   *
   *     const successCount = saveResults.filter(result => result.status === 'fulfilled').length;
   *     const failureCount = saveResults.filter(result => result.status === 'rejected').length;
   *
   *     return {
   *       success: true,
   *       processedCount: csvData.length,
   *       successCount: successCount,
   *       failureCount: failureCount,
   *       validationErrors: validationResults.filter(result => !result.isValid)
   *     };
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
   * 이미지 뷰어를 열어 이미지를 전체화면으로 표시합니다.
   *
   * 지정된 이미지 파일을 전용 뷰어에서 확대/축소, 회전, 이동 등의 기능과 함께
   * 전체화면으로 볼 수 있는 인터페이스를 제공합니다.
   *
   * @description
   * - 앱: 네이티브 이미지 뷰어를 통한 고화질 이미지 표시
   * - 웹: 브라우저 기반 이미지 뷰어 모달 표시
   *
   * @purpose 이미지 미리보기, 사진 갤러리, 문서 스캔 결과 확인, 서명 이미지 검토
   *
   * @param {Object} arg - 이미지 뷰어 설정 객체
   * @param {string} arg._sImagePath - 표시할 이미지 파일의 경로
   *   - 로컬 파일 경로 또는 URL 모두 지원
   *   - 상대경로, 절대경로 모두 지원
   *   - 예: "images/photo.jpg", "/storage/pictures/scan.png", "https://example.com/image.jpg"
   *
   * @returns {Promise<Object>} 이미지 뷰어 실행 결과를 담은 Promise
   * @returns {boolean} return._bResult - 실행 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '9999': 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 뷰어 실행 정보 (성공 시)
   * @returns {string} return._oData.imagePath - 표시된 이미지 경로
   * @returns {string} return._oData.imageFormat - 이미지 포맷 (JPEG, PNG, GIF 등)
   * @returns {number} return._oData.imageWidth - 이미지 원본 너비 (pixels)
   * @returns {number} return._oData.imageHeight - 이미지 원본 높이 (pixels)
   * @returns {number} return._oData.fileSize - 이미지 파일 크기 (bytes)
   * @returns {string} return._oData.openedAt - 뷰어 실행 시간 (ISO 8601 형식)
   * @returns {boolean} return._oData.isLocal - 로컬 파일 여부
   * @returns {string} return._oData.viewerMode - 뷰어 모드 ('fullscreen', 'modal')
   *
   * @caution
   * - 이미지 파일이 존재하고 읽기 가능해야 합니다
   * - 지원하지 않는 이미지 형식은 표시되지 않을 수 있습니다
   * - 대용량 이미지는 로딩 시간이 길어질 수 있습니다
   * - 네트워크 이미지는 인터넷 연결이 필요합니다
   * - 사용자가 뷰어를 닫을 때까지 대기하지 않습니다
   *
   * @example
   * // 기본 이미지 뷰어 사용
   * const viewerResult = await bizMOB.Window.openImageViewer({
   *   _sImagePath: 'photos/vacation.jpg'
   * });
   *
   * if (viewerResult._bResult) {
   *   console.log('이미지 뷰어 실행 성공');
   *   console.log('이미지 크기:', viewerResult._oData.imageWidth, 'x', viewerResult._oData.imageHeight);
   * } else {
   *   console.log('이미지 뷰어 실행 실패:', viewerResult._sResultMessage);
   * }
   *
   * @example
   * // 갤러리 뷰어 시스템
   * class GalleryViewerManager {
   *   static async showImageGallery(imageList, startIndex = 0) {
   *     try {
   *       console.log('이미지 갤러리 표시 시작');
   *
   *       if (!imageList || imageList.length === 0) {
   *         throw new Error('표시할 이미지가 없습니다.');
   *       }
   *
   *       let currentIndex = Math.max(0, Math.min(startIndex, imageList.length - 1));
   *       const viewHistory = [];
   *
   *       // 첫 번째 이미지 표시
   *       const firstImage = imageList[currentIndex];
   *       await this.displayImageWithInfo(firstImage, currentIndex, imageList.length);
   *
   *       // 갤러리 네비게이션 설정
   *       const galleryControls = await this.setupGalleryControls({
   *         currentIndex: currentIndex,
   *         totalImages: imageList.length,
   *         onNext: async () => {
   *           if (currentIndex < imageList.length - 1) {
   *             currentIndex++;
   *             await this.displayImageWithInfo(imageList[currentIndex], currentIndex, imageList.length);
   *             viewHistory.push({ index: currentIndex, viewedAt: new Date().toISOString() });
   *           }
   *         },
   *         onPrevious: async () => {
   *           if (currentIndex > 0) {
   *             currentIndex--;
   *             await this.displayImageWithInfo(imageList[currentIndex], currentIndex, imageList.length);
   *             viewHistory.push({ index: currentIndex, viewedAt: new Date().toISOString() });
   *           }
   *         },
   *         onJumpTo: async (targetIndex) => {
   *           if (targetIndex >= 0 && targetIndex < imageList.length) {
   *             currentIndex = targetIndex;
   *             await this.displayImageWithInfo(imageList[currentIndex], currentIndex, imageList.length);
   *             viewHistory.push({ index: currentIndex, viewedAt: new Date().toISOString() });
   *           }
   *         },
   *         onClose: () => {
   *           this.logGallerySession(viewHistory);
   *         }
   *       });
   *
   *       console.log('갤러리 뷰어 설정 완료');
   *       return {
   *         success: true,
   *         totalImages: imageList.length,
   *         startIndex: startIndex,
   *         controls: galleryControls
   *       };
   *     } catch (error) {
   *       console.error('갤러리 뷰어 실행 실패:', error);
   *       throw error;
   *     }
   *   }
   *
   *   static async displayImageWithInfo(imageInfo, currentIndex, totalCount) {
   *     // 이미지 뷰어 실행
   *     const viewerResult = await bizMOB.Window.openImageViewer({
   *       _sImagePath: imageInfo.path
   *     });
   *
   *     if (viewerResult._bResult) {
   *       // 이미지 정보 오버레이 표시
   *       await this.showImageInfoOverlay({
   *         position: `${currentIndex + 1} / ${totalCount}`,
   *         fileName: imageInfo.name,
   *         fileSize: this.formatFileSize(imageInfo.size),
   *         dimensions: `${viewerResult._oData.imageWidth} x ${viewerResult._oData.imageHeight}`,
   *         format: viewerResult._oData.imageFormat,
   *         createdAt: imageInfo.createdAt,
   *         location: imageInfo.location,
   *         tags: imageInfo.tags
   *       });
   *
   *       return viewerResult;
   *     } else {
   *       throw new Error(`이미지 표시 실패: ${viewerResult._sResultMessage}`);
   *     }
   *   }
   * }
   *
   * @example
   * // 문서 스캔 결과 뷰어
   * class DocumentScanViewer {
   *   static async reviewScannedDocument(scanResults) {
   *     try {
   *       console.log('스캔 문서 검토 시작');
   *
   *       const scanPages = scanResults.pages || [];
   *       if (scanPages.length === 0) {
   *         throw new Error('검토할 스캔 페이지가 없습니다.');
   *       }
   *
   *       const reviewResults = {
   *         documentId: scanResults.documentId,
   *         totalPages: scanPages.length,
   *         reviewedPages: [],
   *         approvedPages: [],
   *         rejectedPages: [],
   *         comments: []
   *       };
   *
   *       // 각 페이지 검토
   *       for (let pageIndex = 0; pageIndex < scanPages.length; pageIndex++) {
   *         const page = scanPages[pageIndex];
   *
   *         console.log(`페이지 ${pageIndex + 1}/${scanPages.length} 검토 중`);
   *
   *         // 스캔 이미지 표시
   *         const viewerResult = await bizMOB.Window.openImageViewer({
   *           _sImagePath: page.imagePath
   *         });
   *
   *         if (viewerResult._bResult) {
   *           // 페이지 검토 UI 표시
   *           const reviewDecision = await this.showPageReviewDialog({
   *             pageNumber: pageIndex + 1,
   *             totalPages: scanPages.length,
   *             imagePath: page.imagePath,
   *             scanQuality: page.quality,
   *             ocrText: page.ocrText,
   *             detectedText: page.detectedText
   *           });
   *
   *           // 검토 결과 기록
   *           reviewResults.reviewedPages.push({
   *             pageIndex: pageIndex,
   *             imagePath: page.imagePath,
   *             decision: reviewDecision.approved ? 'approved' : 'rejected',
   *             comment: reviewDecision.comment,
   *             reviewedAt: new Date().toISOString()
   *           });
   *
   *           if (reviewDecision.approved) {
   *             reviewResults.approvedPages.push(pageIndex);
   *           } else {
   *             reviewResults.rejectedPages.push(pageIndex);
   *             reviewResults.comments.push({
   *               pageIndex: pageIndex,
   *               comment: reviewDecision.comment
   *             });
   *           }
   *
   *           // 재스캔 요청 처리
   *           if (reviewDecision.rescan) {
   *             const rescanResult = await this.rescanPage(pageIndex);
   *             if (rescanResult.success) {
   *               // 재스캔된 페이지로 교체
   *               scanPages[pageIndex] = rescanResult.newPage;
   *               pageIndex--; // 다시 검토하기 위해 인덱스 되돌리기
   *               continue;
   *             }
   *           }
   *         } else {
   *           console.error(`페이지 ${pageIndex + 1} 표시 실패:`, viewerResult._sResultMessage);
   *         }
   *       }
   *
   *       // 전체 문서 검토 완료 처리
   *       await this.finalizeDocumentReview(reviewResults);
   *
   *       console.log('문서 검토 완료');
   *       return reviewResults;
   *     } catch (error) {
   *       console.error('문서 검토 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @example
   * // 서명 이미지 검증 뷰어
   * class SignatureVerificationViewer {
   *   static async verifySignatureImage(signatureData, referenceSignature = null) {
   *     try {
   *       console.log('서명 이미지 검증 시작');
   *
   *       // 서명 이미지 표시
   *       const viewerResult = await bizMOB.Window.openImageViewer({
   *         _sImagePath: signatureData.imagePath
   *       });
   *
   *       if (viewerResult._bResult) {
   *         // 서명 분석 정보 수집
   *         const signatureAnalysis = {
   *           imagePath: signatureData.imagePath,
   *           imageWidth: viewerResult._oData.imageWidth,
   *           imageHeight: viewerResult._oData.imageHeight,
   *           fileSize: viewerResult._oData.fileSize,
   *           aspectRatio: viewerResult._oData.imageWidth / viewerResult._oData.imageHeight,
   *           createdAt: signatureData.createdAt,
   *           signerInfo: signatureData.signerInfo
   *         };
   *
   *         // 서명 품질 분석
   *         const qualityAnalysis = await this.analyzeSignatureQuality(signatureAnalysis);
   *
   *         // 참조 서명과 비교 (있는 경우)
   *         let comparisonResult = null;
   *         if (referenceSignature) {
   *           comparisonResult = await this.compareSignatures(signatureData, referenceSignature);
   *         }
   *
   *         // 검증 결과 UI 표시
   *         const verificationResult = await this.showSignatureVerificationDialog({
   *           signatureAnalysis: signatureAnalysis,
   *           qualityAnalysis: qualityAnalysis,
   *           comparisonResult: comparisonResult,
   *           onApprove: () => ({ verified: true, comment: '서명이 승인되었습니다.' }),
   *           onReject: (reason) => ({ verified: false, comment: reason }),
   *           onRequestNewSignature: () => ({ verified: false, comment: '새로운 서명 요청', needNewSignature: true })
   *         });
   *
   *         // 검증 결과 저장
   *         const verificationRecord = {
   *           signatureId: signatureData.id,
   *           verificationResult: verificationResult,
   *           qualityScore: qualityAnalysis.score,
   *           comparisonScore: comparisonResult?.similarityScore || null,
   *           verifiedAt: new Date().toISOString(),
   *           verifierInfo: await this.getCurrentVerifierInfo()
   *         };
   *
   *         await this.saveVerificationRecord(verificationRecord);
   *
   *         console.log('서명 검증 완료');
   *         return verificationRecord;
   *       } else {
   *         throw new Error(`서명 이미지 표시 실패: ${viewerResult._sResultMessage}`);
   *       }
   *     } catch (error) {
   *       console.error('서명 검증 실패:', error);
   *       throw error;
   *     }
   *   }
   * }
   *
   * @since bizMOB 4.0.0
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
