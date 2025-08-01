# bizMOB 라이브러리 구조 분석 리포트

## 📊 전체 요약
- **총 파일 수**: 108개
- **JavaScript 파일**: 12개
- **TypeScript 파일**: 41개
- **JSON 파일**: 53개
- **Markdown 파일**: 2개

## 📁 카테고리별 분류
### bundles
- JS: 10개, TS: 0개
- 파일: public\bizMOB\bizMOB-xross4.js, public\bizMOB\bizMOB-polyfill.js, public\bizMOB\bizMOB-locale.js, public\bizMOB\bizMOB-core.js, public\bizMOB\bizMOB-core-web.js, public\bizMOB\bizMOB-xross4.js, public\bizMOB\bizMOB-polyfill.js, public\bizMOB\bizMOB-locale.js, public\bizMOB\bizMOB-core.js, public\bizMOB\bizMOB-core-web.js

### externals
- JS: 2개, TS: 0개
- 파일: public\extlib\forge.min.js, public\extlib\crypto-js.min.js

### core
- JS: 0개, TS: 32개
- 파일: src\bizMOB\Xross\Window.ts, src\bizMOB\Xross\System.ts, src\bizMOB\Xross\Storage.ts, src\bizMOB\Xross\Push.ts, src\bizMOB\Xross\Properties.ts, src\bizMOB\Xross\Network.ts, src\bizMOB\Xross\Logger.ts, src\bizMOB\Xross\Localization.ts, src\bizMOB\Xross\index.ts, src\bizMOB\Xross\File.ts, src\bizMOB\Xross\Event.ts, src\bizMOB\Xross\Device.ts, src\bizMOB\Xross\Database.ts, src\bizMOB\Xross\Contacts.ts, src\bizMOB\Xross\Config.ts, src\bizMOB\Xross\App.ts, src\bizMOB\Xross\Window.ts, src\bizMOB\Xross\System.ts, src\bizMOB\Xross\Storage.ts, src\bizMOB\Xross\Push.ts, src\bizMOB\Xross\Properties.ts, src\bizMOB\Xross\Network.ts, src\bizMOB\Xross\Logger.ts, src\bizMOB\Xross\Localization.ts, src\bizMOB\Xross\index.ts, src\bizMOB\Xross\File.ts, src\bizMOB\Xross\Event.ts, src\bizMOB\Xross\Device.ts, src\bizMOB\Xross\Database.ts, src\bizMOB\Xross\Contacts.ts, src\bizMOB\Xross\Config.ts, src\bizMOB\Xross\App.ts

### classes
- JS: 0개, TS: 6개
- 파일: src\bizMOB\BzClass\BzToken.ts, src\bizMOB\BzClass\BzLocale.ts, src\bizMOB\BzClass\BzCrypto.ts, src\bizMOB\BzClass\BzToken.ts, src\bizMOB\BzClass\BzLocale.ts, src\bizMOB\BzClass\BzCrypto.ts

### i18n
- JS: 0개, TS: 2개
- 파일: src\bizMOB\i18n\index.ts, src\bizMOB\i18n\index.ts

### types
- JS: 0개, TS: 1개
- 파일: src\bizMOB\bizmob.d.ts


## 🔄 마이그레이션 계획

### JavaScript 파일 이전
- `public\bizMOB\bizMOB-xross4.js` → `libs/javascript/bundles/bizMOB-xross4.js`
- `public\bizMOB\bizMOB-polyfill.js` → `libs/javascript/bundles/bizMOB-polyfill.js`
- `public\bizMOB\bizMOB-locale.js` → `libs/javascript/bundles/bizMOB-locale.js`
- `public\bizMOB\bizMOB-core.js` → `libs/javascript/bundles/bizMOB-core.js`
- `public\bizMOB\bizMOB-core-web.js` → `libs/javascript/bundles/bizMOB-core-web.js`
- `public\extlib\forge.min.js` → `libs/javascript/externals/forge.min.js`
- `public\extlib\crypto-js.min.js` → `libs/javascript/externals/crypto-js.min.js`
- `public\bizMOB\bizMOB-xross4.js` → `libs/javascript/bundles/bizMOB-xross4.js`
- `public\bizMOB\bizMOB-polyfill.js` → `libs/javascript/bundles/bizMOB-polyfill.js`
- `public\bizMOB\bizMOB-locale.js` → `libs/javascript/bundles/bizMOB-locale.js`
- `public\bizMOB\bizMOB-core.js` → `libs/javascript/bundles/bizMOB-core.js`
- `public\bizMOB\bizMOB-core-web.js` → `libs/javascript/bundles/bizMOB-core-web.js`

### TypeScript 파일 이전
- `src\bizMOB\Xross\Window.ts` → `libs/typescript/core/Window.ts`
- `src\bizMOB\Xross\System.ts` → `libs/typescript/core/System.ts`
- `src\bizMOB\Xross\Storage.ts` → `libs/typescript/core/Storage.ts`
- `src\bizMOB\Xross\Push.ts` → `libs/typescript/core/Push.ts`
- `src\bizMOB\Xross\Properties.ts` → `libs/typescript/core/Properties.ts`
- `src\bizMOB\Xross\Network.ts` → `libs/typescript/core/Network.ts`
- `src\bizMOB\Xross\Logger.ts` → `libs/typescript/core/Logger.ts`
- `src\bizMOB\Xross\Localization.ts` → `libs/typescript/core/Localization.ts`
- `src\bizMOB\Xross\index.ts` → `libs/typescript/core/index.ts`
- `src\bizMOB\Xross\File.ts` → `libs/typescript/core/File.ts`
- `src\bizMOB\Xross\Event.ts` → `libs/typescript/core/Event.ts`
- `src\bizMOB\Xross\Device.ts` → `libs/typescript/core/Device.ts`
- `src\bizMOB\Xross\Database.ts` → `libs/typescript/core/Database.ts`
- `src\bizMOB\Xross\Contacts.ts` → `libs/typescript/core/Contacts.ts`
- `src\bizMOB\Xross\Config.ts` → `libs/typescript/core/Config.ts`
- `src\bizMOB\Xross\App.ts` → `libs/typescript/core/App.ts`
- `src\bizMOB\BzClass\BzToken.ts` → `libs/typescript/classes/BzToken.ts`
- `src\bizMOB\BzClass\BzLocale.ts` → `libs/typescript/classes/BzLocale.ts`
- `src\bizMOB\BzClass\BzCrypto.ts` → `libs/typescript/classes/BzCrypto.ts`
- `src\bizMOB\i18n\index.ts` → `libs/typescript/i18n/index.ts`
- `src\bizMOB\bizmob.d.ts` → `libs/typescript/types/bizmob.d.ts`
- `src\bizMOB\Xross\Window.ts` → `libs/typescript/core/Window.ts`
- `src\bizMOB\Xross\System.ts` → `libs/typescript/core/System.ts`
- `src\bizMOB\Xross\Storage.ts` → `libs/typescript/core/Storage.ts`
- `src\bizMOB\Xross\Push.ts` → `libs/typescript/core/Push.ts`
- `src\bizMOB\Xross\Properties.ts` → `libs/typescript/core/Properties.ts`
- `src\bizMOB\Xross\Network.ts` → `libs/typescript/core/Network.ts`
- `src\bizMOB\Xross\Logger.ts` → `libs/typescript/core/Logger.ts`
- `src\bizMOB\Xross\Localization.ts` → `libs/typescript/core/Localization.ts`
- `src\bizMOB\Xross\index.ts` → `libs/typescript/core/index.ts`
- `src\bizMOB\Xross\File.ts` → `libs/typescript/core/File.ts`
- `src\bizMOB\Xross\Event.ts` → `libs/typescript/core/Event.ts`
- `src\bizMOB\Xross\Device.ts` → `libs/typescript/core/Device.ts`
- `src\bizMOB\Xross\Database.ts` → `libs/typescript/core/Database.ts`
- `src\bizMOB\Xross\Contacts.ts` → `libs/typescript/core/Contacts.ts`
- `src\bizMOB\Xross\Config.ts` → `libs/typescript/core/Config.ts`
- `src\bizMOB\Xross\App.ts` → `libs/typescript/core/App.ts`
- `src\bizMOB\i18n\index.ts` → `libs/typescript/i18n/index.ts`
- `src\bizMOB\BzClass\BzToken.ts` → `libs/typescript/classes/BzToken.ts`
- `src\bizMOB\BzClass\BzLocale.ts` → `libs/typescript/classes/BzLocale.ts`
- `src\bizMOB\BzClass\BzCrypto.ts` → `libs/typescript/classes/BzCrypto.ts`

### JSON 파일 이전
- `public\mock\DM0002.json` → `libs/samples/legacy/DM0002.json`
- `public\mock\DM0001.json` → `libs/samples/legacy/DM0001.json`
- `public\mock\bizMOB\Window\openSignPad.json` → `libs/samples/window/openSignPad.json`
- `public\mock\bizMOB\Window\openImageViewer.json` → `libs/samples/window/openImageViewer.json`
- `public\mock\bizMOB\Window\openFileExplorer.json` → `libs/samples/window/openFileExplorer.json`
- `public\mock\bizMOB\Window\openCodeReader.json` → `libs/samples/window/openCodeReader.json`
- `public\mock\bizMOB\System\getGPS.json` → `libs/samples/system/getGPS.json`
- `public\mock\bizMOB\System\callTEL.json` → `libs/samples/system/callTEL.json`
- `public\mock\bizMOB\System\callSMS.json` → `libs/samples/system/callSMS.json`
- `public\mock\bizMOB\System\callMap.json` → `libs/samples/system/callMap.json`
- `public\mock\bizMOB\System\callGallery.json` → `libs/samples/system/callGallery.json`
- `public\mock\bizMOB\System\callCamera.json` → `libs/samples/system/callCamera.json`
- `public\mock\bizMOB\System\callBrowser.json` → `libs/samples/system/callBrowser.json`
- `public\mock\bizMOB\Push\setBadgeCount.json` → `libs/samples/push/setBadgeCount.json`
- `public\mock\bizMOB\Push\setAlarm.json` → `libs/samples/push/setAlarm.json`
- `public\mock\bizMOB\Push\sendMessage.json` → `libs/samples/push/sendMessage.json`
- `public\mock\bizMOB\Push\reset.json` → `libs/samples/push/reset.json`
- `public\mock\bizMOB\Push\registerToServer.json` → `libs/samples/push/registerToServer.json`
- `public\mock\bizMOB\Push\readReceiptMessage.json` → `libs/samples/push/readReceiptMessage.json`
- `public\mock\bizMOB\Push\readMessage.json` → `libs/samples/push/readMessage.json`
- `public\mock\bizMOB\Push\getUnreadCount.json` → `libs/samples/push/getUnreadCount.json`
- `public\mock\bizMOB\Push\getPushKey.json` → `libs/samples/push/getPushKey.json`
- `public\mock\bizMOB\Push\getMessageList.json` → `libs/samples/push/getMessageList.json`
- `public\mock\bizMOB\Push\getAlarm.json` → `libs/samples/push/getAlarm.json`
- `public\mock\bizMOB\File\zip.json` → `libs/samples/file/zip.json`
- `public\mock\bizMOB\File\upload.json` → `libs/samples/file/upload.json`
- `public\mock\bizMOB\File\unzip.json` → `libs/samples/file/unzip.json`
- `public\mock\bizMOB\File\rotateImage.json` → `libs/samples/file/rotateImage.json`
- `public\mock\bizMOB\File\resizeImage.json` → `libs/samples/file/resizeImage.json`
- `public\mock\bizMOB\File\remove.json` → `libs/samples/file/remove.json`
- `public\mock\bizMOB\File\open.json` → `libs/samples/file/open.json`
- `public\mock\bizMOB\File\move.json` → `libs/samples/file/move.json`
- `public\mock\bizMOB\File\getInfo.json` → `libs/samples/file/getInfo.json`
- `public\mock\bizMOB\File\exist.json` → `libs/samples/file/exist.json`
- `public\mock\bizMOB\File\download.json` → `libs/samples/file/download.json`
- `public\mock\bizMOB\File\directory.json` → `libs/samples/file/directory.json`
- `public\mock\bizMOB\File\copy.json` → `libs/samples/file/copy.json`
- `public\mock\bizMOB\Database\rollbackTransaction.json` → `libs/samples/database/rollbackTransaction.json`
- `public\mock\bizMOB\Database\openDatabase.json` → `libs/samples/database/openDatabase.json`
- `public\mock\bizMOB\Database\executeSql.json` → `libs/samples/database/executeSql.json`
- `public\mock\bizMOB\Database\executeSelect.json` → `libs/samples/database/executeSelect.json`
- `public\mock\bizMOB\Database\executeBatchSql.json` → `libs/samples/database/executeBatchSql.json`
- `public\mock\bizMOB\Database\commitTransaction.json` → `libs/samples/database/commitTransaction.json`
- `public\mock\bizMOB\Database\closeDatabase.json` → `libs/samples/database/closeDatabase.json`
- `public\mock\bizMOB\Database\beginTransaction.json` → `libs/samples/database/beginTransaction.json`
- `public\mock\bizMOB\Contacts\get.json` → `libs/samples/contacts/get.json`
- `public\mock\bizMOB\App\setTimeout.json` → `libs/samples/app/setTimeout.json`
- `public\mock\bizMOB\App\getTimeout.json` → `libs/samples/app/getTimeout.json`
- `public\mock\bizMOB\App\exit.json` → `libs/samples/app/exit.json`
- `public\mock\bizMOB\App\callPlugIn\APP_UPDATE_CHECK.json` → `libs/samples/app/APP_UPDATE_CHECK.json`
- `tsconfig.json` → `libs/config/tsconfig.json`
- `package.json` → `libs/config/package.json`
- `package-lock.json` → `libs/config/package-lock.json`

---
*생성 일시: 2025-07-23T16:18:03.361Z*
