export default class Localization {
  /**
   * 현재 설정된 로케일(언어/지역) 정보를 조회합니다.
   *
   * 앱에서 현재 사용 중인 언어 및 지역 설정 정보를 가져오는 API입니다.
   * 다국어 지원, 지역별 콘텐츠 표시, 언어 설정 확인 등에 활용됩니다.
   *
   * @description
   * - 앱: 시스템 언어 설정과 앱 내 언어 설정을 모두 고려한 정보 제공
   * - 웹: 브라우저 언어 설정 기반 정보 제공
   *
   * @purpose 다국어 지원, 언어별 콘텐츠 제공, 지역화 설정 확인, UI 언어 동기화
   *
   * @param {Object} [arg] - 로케일 조회 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 로케일 정보 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 조회 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1001': 조회 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 로케일 정보
   * @returns {string} return._oData.currentLocale - 현재 설정된 로케일 코드 (예: 'ko', 'en', 'ja')
   * @returns {string} return._oData.systemLocale - 시스템 기본 로케일 코드
   * @returns {string} return._oData.language - 언어 코드 (ISO 639-1)
   * @returns {string} return._oData.country - 국가 코드 (ISO 3166-1 alpha-2)
   * @returns {string} return._oData.languageName - 언어명 (한국어, English, 日本語 등)
   * @returns {string} return._oData.countryName - 국가명
   * @returns {string} return._oData.displayName - 표시명 (한국어 (대한민국))
   * @returns {Array<string>} return._oData.supportedLocales - 지원하는 로케일 목록
   * @returns {boolean} return._oData.isRTL - 우측에서 좌측 읽기 여부 (Arabic, Hebrew 등)
   * @returns {string} return._oData.dateFormat - 날짜 형식 (YYYY-MM-DD, MM/DD/YYYY 등)
   * @returns {string} return._oData.timeFormat - 시간 형식 (24H, 12H)
   * @returns {string} return._oData.numberFormat - 숫자 형식 (쉼표, 소수점 구분자)
   * @returns {string} return._oData.currency - 통화 코드 (KRW, USD, JPY 등)
   *
   * @caution
   * - 시스템 언어와 앱 언어 설정이 다를 수 있습니다
   * - 일부 로케일은 완전히 지원되지 않을 수 있습니다
   * - 웹 환경에서는 브라우저 설정에 의존적입니다
   *
   * @example
   * // 현재 언어 설정 확인
   * const result = await bizMOB.Localization.getLocale();
   *
   * if (result._bResult) {
   *   const locale = result._oData;
   *   console.log(`현재 언어: ${locale.languageName} (${locale.currentLocale})`);
   *   console.log(`국가: ${locale.countryName}`);
   *   console.log(`날짜 형식: ${locale.dateFormat}`);
   *
   *   // 언어별 처리
   *   if (locale.currentLocale === 'ko') {
   *     loadKoreanContent();
   *   } else if (locale.currentLocale === 'en') {
   *     loadEnglishContent();
   *   } else {
   *     loadDefaultContent();
   *   }
   * }
   *
   * @example
   * // 언어별 UI 구성
   * async function setupLanguageSpecificUI() {
   *   const localeResult = await bizMOB.Localization.getLocale();
   *
   *   if (localeResult._bResult) {
   *     const locale = localeResult._oData;
   *
   *     // RTL 언어 처리
   *     if (locale.isRTL) {
   *       document.body.dir = 'rtl';
   *       document.body.classList.add('rtl-layout');
   *     } else {
   *       document.body.dir = 'ltr';
   *       document.body.classList.add('ltr-layout');
   *     }
   *
   *     // 날짜/시간 형식 설정
   *     setDateTimeFormat(locale.dateFormat, locale.timeFormat);
   *
   *     // 숫자 형식 설정
   *     setNumberFormat(locale.numberFormat);
   *
   *     // 언어별 폰트 적용
   *     applyLanguageFont(locale.language);
   *
   *     console.log(`UI가 ${locale.languageName}로 구성되었습니다.`);
   *   }
   * }
   *
   * @example
   * // 지원 언어 목록 표시
   * async function showLanguageSelector() {
   *   const localeResult = await bizMOB.Localization.getLocale();
   *
   *   if (localeResult._bResult) {
   *     const supportedLocales = localeResult._oData.supportedLocales;
   *     const currentLocale = localeResult._oData.currentLocale;
   *
   *     const languageSelector = document.getElementById('language-selector');
   *     languageSelector.innerHTML = '';
   *
   *     supportedLocales.forEach(localeCode => {
   *       const option = document.createElement('option');
   *       option.value = localeCode;
   *       option.textContent = getLanguageName(localeCode);
   *       option.selected = localeCode === currentLocale;
   *       languageSelector.appendChild(option);
   *     });
   *
   *     // 언어 변경 이벤트 리스너
   *     languageSelector.addEventListener('change', async (e) => {
   *       const newLocale = e.target.value;
   *       await changeAppLanguage(newLocale);
   *     });
   *   }
   * }
   *
   * @example
   * // 콘텐츠 지역화
   * async function localizeContent() {
   *   const localeResult = await bizMOB.Localization.getLocale();
   *
   *   if (localeResult._bResult) {
   *     const locale = localeResult._oData;
   *
   *     // 언어별 리소스 로드
   *     const translations = await loadTranslations(locale.currentLocale);
   *
   *     // 텍스트 번역 적용
   *     document.querySelectorAll('[data-i18n]').forEach(element => {
   *       const key = element.getAttribute('data-i18n');
   *       if (translations[key]) {
   *         element.textContent = translations[key];
   *       }
   *     });
   *
   *     // 통화 형식 적용
   *     document.querySelectorAll('.currency').forEach(element => {
   *       const amount = parseFloat(element.getAttribute('data-amount'));
   *       element.textContent = formatCurrency(amount, locale.currency);
   *     });
   *
   *     // 날짜 형식 적용
   *     document.querySelectorAll('.date').forEach(element => {
   *       const dateString = element.getAttribute('data-date');
   *       element.textContent = formatDate(dateString, locale.dateFormat);
   *     });
   *
   *     console.log(`콘텐츠가 ${locale.languageName}로 지역화되었습니다.`);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static getLocale(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.getLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }

  /**
   * 앱의 로케일(언어/지역) 설정을 변경합니다.
   *
   * 앱에서 사용할 언어와 지역 설정을 변경하는 API입니다.
   * 사용자 언어 선택, 다국어 지원, 지역별 콘텐츠 제공을 위해 사용됩니다.
   *
   * @description
   * - 앱: 앱 전체의 언어 설정을 즉시 변경하고 UI 새로고침
   * - 웹: 앱 내 언어 설정 변경 (브라우저 언어와 독립적)
   *
   * @purpose 언어 전환, 다국어 지원, 사용자 언어 선택, 지역화 설정
   *
   * @param {Object} arg - 로케일 설정 객체
   * @param {string} arg._sLocaleCd - 설정할 언어 코드
   *   - `'ko'`: 한국어
   *   - `'en'`: 영어
   *   - `'ja'`: 일본어
   *   - `'zh'`: 중국어 (간체)
   *   - `'zh-TW'`: 중국어 (번체)
   *   - `'es'`: 스페인어
   *   - `'fr'`: 프랑스어
   *   - `'de'`: 독일어
   *   - `'pt'`: 포르투갈어
   *   - `'ru'`: 러시아어
   *   - `'ar'`: 아랍어
   *   - `'hi'`: 힌디어
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 로케일 설정 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 설정 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1002': 설정 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 로케일 설정 결과 정보
   * @returns {string} return._oData.previousLocale - 이전 로케일 코드
   * @returns {string} return._oData.newLocale - 새로 설정된 로케일 코드
   * @returns {string} return._oData.languageName - 설정된 언어명
   * @returns {boolean} return._oData.requiresRestart - 변경 적용을 위한 앱 재시작 필요 여부
   * @returns {Array<string>} return._oData.changedComponents - 변경이 적용된 컴포넌트 목록
   * @returns {string} return._oData.appliedAt - 설정 적용 시간
   * @returns {Object} return._oData.localeInfo - 새로운 로케일 상세 정보
   * @returns {string} return._oData.localeInfo.dateFormat - 날짜 형식
   * @returns {string} return._oData.localeInfo.timeFormat - 시간 형식
   * @returns {string} return._oData.localeInfo.numberFormat - 숫자 형식
   * @returns {boolean} return._oData.localeInfo.isRTL - 우측에서 좌측 읽기 여부
   *
   * @caution
   * - 언어 변경 후 UI 업데이트가 필요할 수 있습니다
   * - 일부 변경사항은 앱 재시작 후 완전히 적용됩니다
   * - 지원하지 않는 언어 코드 설정 시 오류가 발생할 수 있습니다
   * - 언어 변경 중 사용자 데이터는 보존됩니다
   *
   * @example
   * // 한국어로 언어 변경
   * const result = await bizMOB.Localization.setLocale({
   *   _sLocaleCd: 'ko'
   * });
   *
   * if (result._bResult) {
   *   console.log(`언어가 ${result._oData.languageName}로 변경되었습니다.`);
   *
   *   // UI 업데이트
   *   await updateUILanguage(result._oData.newLocale);
   *
   *   // 사용자 설정 저장
   *   await saveUserLanguagePreference(result._oData.newLocale);
   *
   *   if (result._oData.requiresRestart) {
   *     showRestartConfirmation('언어 변경을 완전히 적용하려면 앱을 재시작해야 합니다.');
   *   }
   * } else {
   *   console.error('언어 변경 실패:', result._sResultMessage);
   * }
   *
   * @example
   * // 언어 선택 다이얼로그
   * async function showLanguageSelectionDialog() {
   *   const languages = [
   *     { code: 'ko', name: '한국어', nativeName: '한국어' },
   *     { code: 'en', name: 'English', nativeName: 'English' },
   *     { code: 'ja', name: 'Japanese', nativeName: '日本語' },
   *     { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文' },
   *     { code: 'es', name: 'Spanish', nativeName: 'Español' },
   *     { code: 'fr', name: 'French', nativeName: 'Français' }
   *   ];
   *
   *   // 현재 언어 확인
   *   const currentLocaleResult = await bizMOB.Localization.getLocale();
   *   const currentLocale = currentLocaleResult._oData?.currentLocale || 'en';
   *
   *   // 언어 선택 UI 생성
   *   const dialog = createLanguageDialog(languages, currentLocale);
   *   document.body.appendChild(dialog);
   *
   *   // 언어 선택 이벤트 처리
   *   dialog.addEventListener('languageSelected', async (event) => {
   *     const selectedLanguage = event.detail.languageCode;
   *
   *     if (selectedLanguage !== currentLocale) {
   *       showLoadingSpinner('언어를 변경하고 있습니다...');
   *
   *       try {
   *         const setResult = await bizMOB.Localization.setLocale({
   *           _sLocaleCd: selectedLanguage
   *         });
   *
   *         if (setResult._bResult) {
   *           // 즉시 적용 가능한 UI 변경
   *           await applyLanguageChanges(setResult._oData);
   *
   *           showSuccessMessage(`언어가 ${setResult._oData.languageName}로 변경되었습니다.`);
   *
   *           // 재시작 필요 시 안내
   *           if (setResult._oData.requiresRestart) {
   *             setTimeout(() => {
   *               if (confirm('모든 변경사항을 적용하려면 앱을 재시작해야 합니다. 지금 재시작하시겠습니까?')) {
   *                 bizMOB.App.exit();
   *               }
   *             }, 2000);
   *           }
   *         } else {
   *           showErrorMessage('언어 변경에 실패했습니다: ' + setResult._sResultMessage);
   *         }
   *       } catch (error) {
   *         console.error('언어 변경 중 오류:', error);
   *         showErrorMessage('언어 변경 중 오류가 발생했습니다.');
   *       } finally {
   *         hideLoadingSpinner();
   *         dialog.remove();
   *       }
   *     } else {
   *       dialog.remove();
   *     }
   *   });
   * }
   *
   * @example
   * // 자동 언어 감지 및 설정
   * async function autoDetectAndSetLanguage() {
   *   try {
   *     // 현재 시스템 언어 확인
   *     const currentLocaleResult = await bizMOB.Localization.getLocale();
   *
   *     if (currentLocaleResult._bResult) {
   *       const systemLocale = currentLocaleResult._oData.systemLocale;
   *       const currentAppLocale = currentLocaleResult._oData.currentLocale;
   *       const supportedLocales = currentLocaleResult._oData.supportedLocales;
   *
   *       // 시스템 언어와 앱 언어가 다르고, 시스템 언어가 지원되는 경우
   *       if (systemLocale !== currentAppLocale && supportedLocales.includes(systemLocale)) {
   *         const shouldChange = confirm(
   *           `시스템 언어(${getLanguageName(systemLocale)})로 변경하시겠습니까?`
   *         );
   *
   *         if (shouldChange) {
   *           const setResult = await bizMOB.Localization.setLocale({
   *             _sLocaleCd: systemLocale
   *           });
   *
   *           if (setResult._bResult) {
   *             console.log('언어가 시스템 언어로 자동 설정되었습니다.');
   *             await reloadAppWithNewLanguage();
   *           }
   *         }
   *       }
   *     }
   *   } catch (error) {
   *     console.warn('자동 언어 감지 실패:', error);
   *   }
   * }
   *
   * @example
   * // 언어별 리소스 전환
   * async function switchLanguageResources(newLocaleCode) {
   *   const setResult = await bizMOB.Localization.setLocale({
   *     _sLocaleCd: newLocaleCode
   *   });
   *
   *   if (setResult._bResult) {
   *     const localeInfo = setResult._oData.localeInfo;
   *
   *     // 번역 파일 로드
   *     const translations = await loadTranslationFile(newLocaleCode);
   *
   *     // 텍스트 번역 적용
   *     applyTranslations(translations);
   *
   *     // 날짜/시간 형식 변경
   *     updateDateTimeFormat(localeInfo.dateFormat, localeInfo.timeFormat);
   *
   *     // 숫자 형식 변경
   *     updateNumberFormat(localeInfo.numberFormat);
   *
   *     // RTL 레이아웃 처리
   *     if (localeInfo.isRTL) {
   *       document.body.classList.add('rtl');
   *       document.body.classList.remove('ltr');
   *     } else {
   *       document.body.classList.add('ltr');
   *       document.body.classList.remove('rtl');
   *     }
   *
   *     // 언어별 폰트 적용
   *     applyLanguageSpecificFont(newLocaleCode);
   *
   *     // 변경된 컴포넌트 새로고침
   *     setResult._oData.changedComponents.forEach(component => {
   *       refreshComponent(component);
   *     });
   *
   *     console.log(`모든 리소스가 ${setResult._oData.languageName}로 전환되었습니다.`);
   *   }
   * }
   *
   * @since bizMOB 4.0.0
   */
  static setLocale(arg: {
    _sLocaleCd: string, // 언어코드 (ko, en, ...)
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Localization.setLocale({
        ...arg,
        _fCallback: (res: any) => resolve(res)
      });
    });
  }
}
