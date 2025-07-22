export default class Database {
  /**
   * 데이터베이스 트랜잭션을 시작합니다.
   *
   * 여러 SQL 작업을 하나의 논리적 단위로 묶어서 실행하기 위한 트랜잭션을 시작하는 API입니다.
   * 모든 작업이 성공하면 커밋하고, 하나라도 실패하면 모든 변경사항을 롤백할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 트랜잭션 관리 시스템 사용
   * - 웹: 웹 SQL 또는 SQLite WASM 트랜잭션 지원
   *
   * @purpose 데이터 일관성 보장, 복합 작업 처리, 성능 최적화, 데이터 무결성 유지
   *
   * @param {Object} [arg] - 트랜잭션 시작 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 트랜잭션 시작 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 시작 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1005': 트랜잭션 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 트랜잭션 정보
   * @returns {string} return._oData.transactionId - 트랜잭션 고유 ID
   * @returns {string} return._oData.startedAt - 트랜잭션 시작 시간
   * @returns {string} return._oData.isolationLevel - 격리 수준
   *
   * @caution
   * - 트랜잭션 시작 후 반드시 commit 또는 rollback으로 종료해야 합니다
   * - 중첩 트랜잭션은 지원되지 않을 수 있습니다
   * - 장시간 트랜잭션 유지 시 데이터베이스 락이 발생할 수 있습니다
   * - 트랜잭션 중 앱이 종료되면 자동으로 롤백됩니다
   *
   * @see public/mock/bizMOB/Database/beginTransaction.json - Mock 응답 데이터 예제
   *
   * @example
   * // 기본 트랜잭션 사용
   * const transactionResult = await bizMOB.Database.beginTransaction();
   *
   * if (transactionResult._bResult) {
   *   console.log(`트랜잭션 시작됨: ${transactionResult._oData.transactionId}`);
   *
   *   try {
   *     // 여러 SQL 작업 수행
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO orders (user_id, total) VALUES (?, ?)',
   *       _aBindingValues: ['123', '50000']
   *     });
   *
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?',
   *       _aBindingValues: ['1', '456']
   *     });
   *
   *     // 모든 작업 성공 시 커밋
   *     await bizMOB.Database.commitTransaction();
   *     console.log('주문 처리 완료');
   *
   *   } catch (error) {
   *     // 오류 발생 시 롤백
   *     await bizMOB.Database.rollbackTransaction();
   *     console.error('주문 처리 실패:', error);
   *   }
   * }
   *
   * // 복잡한 비즈니스 로직 처리
   * const processUserRegistration = async (userData) => {
   *   try {
   *     await bizMOB.Database.beginTransaction();
   *
   *     // 1. 사용자 생성
   *     const userResult = await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
   *       _aBindingValues: [userData.name, userData.email, userData.passwordHash]
   *     });
   *
   *     const userId = userResult._oData.insertId;
   *
   *     // 2. 사용자 프로필 생성
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO profiles (user_id, bio, avatar_url) VALUES (?, ?, ?)',
   *       _aBindingValues: [userId.toString(), userData.bio || '', userData.avatarUrl || '']
   *     });
   *
   *     // 3. 기본 설정 생성
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO user_settings (user_id, theme, language) VALUES (?, ?, ?)',
   *       _aBindingValues: [userId.toString(), 'light', 'ko']
   *     });
   *
   *     // 4. 기본 역할 할당
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)',
   *       _aBindingValues: [userId.toString(), '1'] // 기본 사용자 역할
   *     });
   *
   *     await bizMOB.Database.commitTransaction();
   *     console.log('사용자 등록 완료:', userId);
   *     return userId;
   *
   *   } catch (error) {
   *     await bizMOB.Database.rollbackTransaction();
   *     console.error('사용자 등록 실패:', error);
   *     throw error;
   *   }
   * };
   *
   * // 재시도 로직이 포함된 트랜잭션
   * const safeTransactionExecute = async (operations, maxRetries = 3) => {
   *   for (let attempt = 1; attempt <= maxRetries; attempt++) {
   *     try {
   *       await bizMOB.Database.beginTransaction();
   *
   *       // 사용자 정의 작업들 실행
   *       for (const operation of operations) {
   *         await operation();
   *       }
   *
   *       await bizMOB.Database.commitTransaction();
   *       console.log(`트랜잭션 성공 (시도 ${attempt}회)`);
   *       return true;
   *
   *     } catch (error) {
   *       await bizMOB.Database.rollbackTransaction();
   *       console.warn(`트랜잭션 실패 (시도 ${attempt}/${maxRetries}):`, error.message);
   *
   *       if (attempt === maxRetries) {
   *         console.error('최대 재시도 횟수 초과');
   *         throw error;
   *       }
   *
   *       // 재시도 전 대기
   *       await new Promise(resolve => setTimeout(resolve, 100 * attempt));
   *     }
   *   }
   * };
   *
   * // 배치 처리를 위한 트랜잭션
   * const batchInsertUsers = async (userList) => {
   *   const batchSize = 100; // 100개씩 배치 처리
   *
   *   for (let i = 0; i < userList.length; i += batchSize) {
   *     const batch = userList.slice(i, i + batchSize);
   *
   *     try {
   *       await bizMOB.Database.beginTransaction();
   *
   *       for (const user of batch) {
   *         await bizMOB.Database.executeSql({
   *           _sQuery: 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
   *           _aBindingValues: [user.name, user.email, user.age.toString()]
   *         });
   *       }
   *
   *       await bizMOB.Database.commitTransaction();
   *       console.log(`배치 ${Math.floor(i/batchSize) + 1} 처리 완료 (${batch.length}개)`);
   *
   *     } catch (error) {
   *       await bizMOB.Database.rollbackTransaction();
   *       console.error(`배치 ${Math.floor(i/batchSize) + 1} 처리 실패:`, error);
   *       throw error;
   *     }
   *   }
   * };
   *
   * @since bizMOB 4.0.0
   */
  static beginTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.beginTransaction({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 현재 사용 중인 SQLite 데이터베이스 연결을 닫습니다.
   *
   * 열린 데이터베이스 연결을 안전하게 종료하고 리소스를 해제하는 API입니다.
   * 모든 트랜잭션이 완료된 후 호출해야 하며, 앱 종료 시나 데이터베이스 사용 완료 시 반드시 호출해야 합니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 연결 종료 및 파일 핸들 해제
   * - 웹: 웹 데이터베이스 연결 종료 및 메모리 정리
   *
   * @purpose 리소스 정리, 메모리 절약, 안전한 데이터베이스 종료, 앱 성능 최적화
   *
   * @param {Object} [arg] - 데이터베이스 닫기 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 데이터베이스 닫기 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 닫기 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1002': 닫기 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 닫기 처리 결과
   * @returns {string} return._oData.closedAt - 데이터베이스 닫힌 시간
   * @returns {boolean} return._oData.hasOpenTransactions - 미완료 트랜잭션 존재 여부
   * @returns {number} return._oData.connectionCount - 남은 연결 수
   *
   * @caution
   * - 진행 중인 트랜잭션이 있으면 자동으로 롤백됩니다
   * - 닫힌 후에는 해당 데이터베이스에 대한 모든 작업이 실패합니다
   * - 여러 번 호출해도 오류가 발생하지 않지만 의미가 없습니다
   * - 앱 종료 전 반드시 호출하여 데이터 손실을 방지하세요
   *
   * @see public/mock/bizMOB/Database/closeDatabase.json - Mock 응답 데이터 예제
   *
   * @example
   * // 기본 데이터베이스 닫기
   * const closeResult = await bizMOB.Database.closeDatabase();
   *
   * if (closeResult._bResult) {
   *   console.log('데이터베이스 연결이 안전하게 종료되었습니다.');
   * } else {
   *   console.error('데이터베이스 닫기 실패:', closeResult._sResultMessage);
   * }
   *
   * // 트랜잭션 완료 후 데이터베이스 닫기
   * const completeTransaction = async () => {
   *   try {
   *     await bizMOB.Database.beginTransaction();
   *
   *     // 여러 SQL 작업 수행
   *     await bizMOB.Database.executeSql({
   *       _sQuery: 'INSERT INTO users (name, email) VALUES (?, ?)',
   *       _aBindingValues: ['홍길동', 'hong@example.com']
   *     });
   *
   *     await bizMOB.Database.commitTransaction();
   *     console.log('트랜잭션 완료');
   *
   *   } catch (error) {
   *     await bizMOB.Database.rollbackTransaction();
   *     console.error('트랜잭션 실패:', error);
   *   } finally {
   *     // 작업 완료 후 데이터베이스 닫기
   *     await bizMOB.Database.closeDatabase();
   *   }
   * };
   *
   * // 앱 종료 시 정리 작업
   * const cleanupOnExit = async () => {
   *   try {
   *     // 모든 진행 중인 작업 완료 대기
   *     await waitForPendingOperations();
   *
   *     // 데이터베이스 연결 종료
   *     const result = await bizMOB.Database.closeDatabase();
   *
   *     if (result._bResult) {
   *       if (result._oData.hasOpenTransactions) {
   *         console.warn('미완료 트랜잭션이 롤백되었습니다.');
   *       }
   *       console.log('정리 작업 완료');
   *     }
   *   } catch (error) {
   *     console.error('정리 작업 중 오류:', error);
   *   }
   * };
   *
   * // 안전한 데이터베이스 작업 래퍼
   * const safeDbOperation = async (operation) => {
   *   let dbOpened = false;
   *
   *   try {
   *     // 데이터베이스 열기
   *     const openResult = await bizMOB.Database.openDatabase({
   *       _sDbName: 'temp_work.db'
   *     });
   *
   *     if (!openResult._bResult) {
   *       throw new Error('데이터베이스 열기 실패');
   *     }
   *
   *     dbOpened = true;
   *
   *     // 사용자 작업 실행
   *     const result = await operation();
   *     return result;
   *
   *   } finally {
   *     // 반드시 데이터베이스 닫기
   *     if (dbOpened) {
   *       await bizMOB.Database.closeDatabase();
   *     }
   *   }
   * };
   *
   * @since bizMOB 4.0.0
   */
  static closeDatabase(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.closeDatabase({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 진행 중인 트랜잭션을 커밋하여 변경사항을 영구적으로 저장합니다.
   *
   * beginTransaction()으로 시작된 트랜잭션의 모든 변경사항을 데이터베이스에 영구적으로 반영하는 API입니다.
   * 커밋이 성공하면 트랜잭션이 종료되고 모든 변경사항이 확정됩니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 트랜잭션 커밋 처리
   * - 웹: 웹 SQL 또는 SQLite WASM 트랜잭션 커밋
   *
   * @purpose 데이터 변경사항 확정, 트랜잭션 정상 종료, 데이터 일관성 보장
   *
   * @param {Object} [arg] - 트랜잭션 커밋 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 트랜잭션 커밋 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 커밋 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1006': 커밋 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 커밋 결과 정보
   * @returns {string} return._oData.committedAt - 커밋 완료 시간
   * @returns {number} return._oData.changedRows - 변경된 총 행 수
   * @returns {number} return._oData.executionTime - 커밋 실행 시간 (밀리초)
   *
   * @caution
   * - 활성화된 트랜잭션이 없으면 오류가 발생합니다
   * - 커밋 실패 시 트랜잭션이 롤백될 수 있습니다
   * - 커밋 후에는 해당 트랜잭션을 더 이상 사용할 수 없습니다
   *
   * @see public/mock/bizMOB/Database/commitTransaction.json - Mock 응답 데이터 예제
   *
   * @example
   * // 기본 커밋 사용
   * try {
   *   await bizMOB.Database.beginTransaction();
   *
   *   await bizMOB.Database.executeSql({
   *     _sQuery: 'INSERT INTO products (name, price) VALUES (?, ?)',
   *     _aBindingValues: ['새 상품', '25000']
   *   });
   *
   *   const commitResult = await bizMOB.Database.commitTransaction();
   *
   *   if (commitResult._bResult) {
   *     console.log('상품 등록이 완료되었습니다.');
   *     console.log(`변경된 행 수: ${commitResult._oData.changedRows}`);
   *   }
   * } catch (error) {
   *   await bizMOB.Database.rollbackTransaction();
   *   console.error('상품 등록 실패:', error);
   * }
   *
   * @since bizMOB 4.0.0
   */
  static commitTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.commitTransaction({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 배치 SQL 쿼리문을 일괄적으로 실행합니다.
   *
   * 대량의 데이터 처리나 관련된 여러 SQL 문을 효율적으로 처리할 때 사용하는 배치 실행 API입니다.
   * 트랜잭션과 함께 사용하여 여러 INSERT, UPDATE, DELETE 문을 안전하고 빠르게 실행할 수 있습니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 배치 실행으로 고성능 처리
   * - 웹: 웹 SQL 또는 SQLite WASM을 통한 순차 실행
   *
   * @purpose 대량 데이터 삽입, 일괄 업데이트, 관련 테이블 동시 처리, 성능 최적화
   *
   * @param {Object} arg - 배치 SQL 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SQL 쿼리문 (배치 처리용)
   * @param {string} [arg._aBindingValues] - SQL 쿼리문의 바인딩 값 (JSON 문자열 형태)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 배치 실행 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 실행 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1008': 배치 실행 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 배치 실행 결과 정보
   * @returns {number} return._oData.totalQueries - 전체 실행한 SQL 문 수
   * @returns {number} return._oData.successfulQueries - 성공한 SQL 문 수
   * @returns {number} return._oData.failedQueries - 실패한 SQL 문 수
   * @returns {number} return._oData.totalAffectedRows - 전체 영향받은 행 수
   * @returns {number} return._oData.executionTime - 배치 실행 시간 (밀리초)
   *
   * @caution
   * - 배치 실행 중 오류 발생 시 전체 또는 일부가 롤백될 수 있습니다
   * - 대량 데이터 처리 시 메모리 사용량에 주의해야 합니다
   * - SQL 문법 오류 시 전체 배치가 실패할 수 있습니다
   * - SELECT 문보다는 INSERT, UPDATE, DELETE에 적합합니다
   *
   * @see public/mock/bizMOB/Database/executeBatchSql.json - Mock 응답 데이터 예제
   *
   * @example
   * // 대량 데이터 삽입
   * const batchInsertQuery = `
   *   INSERT INTO users (name, email, age) VALUES
   *   ('홍길동', 'hong@example.com', 30),
   *   ('김철수', 'kim@example.com', 25),
   *   ('이영희', 'lee@example.com', 28)
   * `;
   *
   * const result = await bizMOB.Database.executeBatchSql({
   *   _sQuery: batchInsertQuery
   * });
   *
   * console.log(`${result._oData.totalAffectedRows}개의 레코드가 삽입되었습니다.`);
   *
   * @example
   * // 트랜잭션과 함께 배치 실행
   * try {
   *   await bizMOB.Database.beginTransaction();
   *
   *   const batchResult = await bizMOB.Database.executeBatchSql({
   *     _sQuery: `
   *       UPDATE orders SET status = 'shipped' WHERE id IN (1001, 1002, 1003);
   *       UPDATE inventory SET quantity = quantity - 1 WHERE product_id IN ('P001', 'P002', 'P003');
   *       INSERT INTO shipping_log (order_id, shipped_at) VALUES
   *       (1001, datetime('now')), (1002, datetime('now')), (1003, datetime('now'));
   *     `
   *   });
   *
   *   if (batchResult._bResult) {
   *     await bizMOB.Database.commitTransaction();
   *     console.log('배치 처리 완료');
   *   } else {
   *     await bizMOB.Database.rollbackTransaction();
   *     console.error('배치 처리 실패');
   *   }
   * } catch (error) {
   *   await bizMOB.Database.rollbackTransaction();
   *   console.error('배치 처리 중 오류:', error);
   * }
   *
   * @since bizMOB 4.0.0
   */
  static executeBatchSql(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeBatchSql({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * SELECT SQL 쿼리문을 실행하여 데이터를 조회합니다.
   *
   * 데이터베이스에서 데이터를 조회하는 전용 API로, SELECT 문을 안전하게 실행하고 결과를 반환합니다.
   * 매개변수 바인딩을 통해 SQL 인젝션을 방지하고 효율적인 쿼리 실행을 지원합니다.
   *
   * @description
   * - 앱: 네이티브 SQLite SELECT 실행 및 결과셋 반환
   * - 웹: 웹 SQL 또는 SQLite WASM을 통한 SELECT 실행
   *
   * @purpose 데이터 조회, 검색 기능, 리포트 생성, 데이터 분석
   *
   * @param {Object} arg - SELECT 쿼리 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SELECT SQL 쿼리문
   * @param {Array<string>} [arg._aBindingValues] - SQL 쿼리의 매개변수 바인딩 값 배열
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} SELECT 실행 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 실행 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1003': SQL 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 조회 결과 데이터
   * @returns {Array<Object>} return._oData.rows - 조회된 데이터 행 배열
   * @returns {number} return._oData.rowCount - 조회된 행의 개수
   * @returns {Array<string>} return._oData.columns - 컬럼명 배열
   * @returns {string} return._oData.executedQuery - 실행된 SQL 쿼리문
   * @returns {number} return._oData.executionTime - 쿼리 실행 시간 (밀리초)
   *
   * @caution
   * - SELECT 문만 실행 가능하며, INSERT/UPDATE/DELETE는 사용할 수 없습니다
   * - 대용량 결과셋 조회 시 메모리 사용량을 고려하여 LIMIT를 사용하세요
   * - 바인딩 값과 쿼리의 ? 개수가 일치해야 합니다
   * - 복잡한 조인 쿼리는 성능에 영향을 줄 수 있습니다
   *
   * @see public/mock/bizMOB/Database/executeSelect.json - Mock 응답 데이터 예제
   *
   * @example
   * // 기본 SELECT 쿼리
   * const selectResult = await bizMOB.Database.executeSelect({
   *   _sQuery: 'SELECT * FROM users WHERE age > 18'
   * });
   *
   * if (selectResult._bResult) {
   *   console.log(`총 ${selectResult._oData.rowCount}개의 사용자를 찾았습니다.`);
   *   selectResult._oData.rows.forEach(user => {
   *     console.log(`이름: ${user.name}, 나이: ${user.age}`);
   *   });
   * }
   *
   * // 매개변수 바인딩을 사용한 안전한 쿼리
   * const searchUsers = async (searchName, minAge) => {
   *   const result = await bizMOB.Database.executeSelect({
   *     _sQuery: 'SELECT id, name, email, age FROM users WHERE name LIKE ? AND age >= ? ORDER BY name',
   *     _aBindingValues: [`%${searchName}%`, minAge.toString()]
   *   });
   *
   *   if (result._bResult) {
   *     return result._oData.rows;
   *   } else {
   *     console.error('사용자 검색 실패:', result._sResultMessage);
   *     return [];
   *   }
   * };
   *
   * // 페이징 처리
   * const getUsersWithPaging = async (page = 1, pageSize = 10) => {
   *   const offset = (page - 1) * pageSize;
   *
   *   const result = await bizMOB.Database.executeSelect({
   *     _sQuery: 'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
   *     _aBindingValues: [pageSize.toString(), offset.toString()]
   *   });
   *
   *   if (result._bResult) {
   *     return {
   *       users: result._oData.rows,
   *       totalCount: result._oData.rowCount,
   *       currentPage: page,
   *       pageSize: pageSize
   *     };
   *   }
   *
   *   return null;
   * };
   *
   * // 조인 쿼리 예제
   * const getUsersWithProfiles = async () => {
   *   const result = await bizMOB.Database.executeSelect({
   *     _sQuery: `
   *       SELECT u.id, u.name, u.email, p.bio, p.avatar_url
   *       FROM users u
   *       LEFT JOIN profiles p ON u.id = p.user_id
   *       WHERE u.active = 1
   *     `
   *   });
   *
   *   if (result._bResult) {
   *     return result._oData.rows.map(row => ({
   *       id: row.id,
   *       name: row.name,
   *       email: row.email,
   *       profile: {
   *         bio: row.bio || '',
   *         avatarUrl: row.avatar_url || ''
   *       }
   *     }));
   *   }
   *
   *   return [];
   * };
   *
   * // 집계 함수 사용
   * const getUserStatistics = async () => {
   *   const result = await bizMOB.Database.executeSelect({
   *     _sQuery: `
   *       SELECT
   *         COUNT(*) as total_users,
   *         AVG(age) as avg_age,
   *         MIN(age) as min_age,
   *         MAX(age) as max_age
   *       FROM users
   *       WHERE active = 1
   *     `
   *   });
   *
   *   if (result._bResult && result._oData.rows.length > 0) {
   *     return result._oData.rows[0];
   *   }
   *
   *   return null;
   * };
   *
   * // 동적 쿼리 생성
   * const searchUsersAdvanced = async (filters) => {
   *   let query = 'SELECT * FROM users WHERE 1=1';
   *   let bindingValues = [];
   *
   *   if (filters.name) {
   *     query += ' AND name LIKE ?';
   *     bindingValues.push(`%${filters.name}%`);
   *   }
   *
   *   if (filters.minAge) {
   *     query += ' AND age >= ?';
   *     bindingValues.push(filters.minAge.toString());
   *   }
   *
   *   if (filters.department) {
   *     query += ' AND department = ?';
   *     bindingValues.push(filters.department);
   *   }
   *
   *   query += ' ORDER BY name LIMIT 100';
   *
   *   const result = await bizMOB.Database.executeSelect({
   *     _sQuery: query,
   *     _aBindingValues: bindingValues
   *   });
   *
   *   return result._bResult ? result._oData.rows : [];
   * };
   *
   * @since bizMOB 4.0.0
   */
  static executeSelect(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeSelect({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * SQL 쿼리문을 실행합니다 (INSERT, UPDATE, DELETE, DDL).
   *
   * 데이터 수정, 삭제, 테이블 생성 등의 SQL 문을 실행하는 범용 API입니다.
   * SELECT를 제외한 모든 종류의 SQL 문을 처리할 수 있으며, 매개변수 바인딩을 통해 안전한 실행을 보장합니다.
   *
   * @description
   * - 앱: 네이티브 SQLite의 모든 SQL 문 실행 지원
   * - 웹: 웹 SQL 또는 SQLite WASM을 통한 SQL 실행
   *
   * @purpose 데이터 입력/수정/삭제, 테이블 생성/수정, 인덱스 관리, 스키마 변경
   *
   * @param {Object} arg - SQL 쿼리 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SQL 쿼리문 (INSERT/UPDATE/DELETE/CREATE/ALTER/DROP 등)
   * @param {Array<string>} [arg._aBindingValues] - SQL 쿼리의 매개변수 바인딩 값 배열
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} SQL 실행 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 실행 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1004': SQL 실행 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 실행 결과 데이터
   * @returns {number} return._oData.affectedRows - 영향받은 행의 개수
   * @returns {number} return._oData.insertId - 마지막 INSERT된 행의 ID (AUTO_INCREMENT인 경우)
   * @returns {string} return._oData.executedQuery - 실행된 SQL 쿼리문
   * @returns {number} return._oData.executionTime - 쿼리 실행 시간 (밀리초)
   *
   * @caution
   * - 트랜잭션 내에서 실행하는 것을 권장합니다 (데이터 일관성 보장)
   * - 대용량 데이터 작업 시 배치 처리를 고려하세요
   * - DDL 문(CREATE, ALTER, DROP)은 트랜잭션과 별도로 즉시 실행됩니다
   * - 바인딩 값과 쿼리의 ? 개수가 일치해야 합니다
   *
   * @see public/mock/bizMOB/Database/executeSql.json - Mock 응답 데이터 예제
   *
   * @example
   * // 테이블 생성 (DDL)
   * const createResult = await bizMOB.Database.executeSql({
   *   _sQuery: `
   *     CREATE TABLE IF NOT EXISTS users (
   *       id INTEGER PRIMARY KEY AUTOINCREMENT,
   *       name TEXT NOT NULL,
   *       email TEXT UNIQUE,
   *       age INTEGER,
   *       created_at DATETIME DEFAULT CURRENT_TIMESTAMP
   *     )
   *   `
   * });
   *
   * if (createResult._bResult) {
   *   console.log('사용자 테이블이 생성되었습니다.');
   * }
   *
   * // 데이터 입력 (INSERT)
   * const insertUser = async (name, email, age) => {
   *   const result = await bizMOB.Database.executeSql({
   *     _sQuery: 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
   *     _aBindingValues: [name, email, age.toString()]
   *   });
   *
   *   if (result._bResult) {
   *     console.log(`사용자 추가 완료. ID: ${result._oData.insertId}`);
   *     return result._oData.insertId;
   *   } else {
   *     console.error('사용자 추가 실패:', result._sResultMessage);
   *     return null;
   *   }
   * };
   *
   * // 데이터 수정 (UPDATE)
   * const updateUser = async (userId, updatedData) => {
   *   const result = await bizMOB.Database.executeSql({
   *     _sQuery: 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
   *     _aBindingValues: [
   *       updatedData.name,
   *       updatedData.email,
   *       updatedData.age.toString(),
   *       userId.toString()
   *     ]
   *   });
   *
   *   if (result._bResult) {
   *     console.log(`${result._oData.affectedRows}개의 사용자 정보가 업데이트되었습니다.`);
   *     return result._oData.affectedRows > 0;
   *   }
   *
   *   return false;
   * };
   *
   * // 데이터 삭제 (DELETE)
   * const deleteUser = async (userId) => {
   *   const result = await bizMOB.Database.executeSql({
   *     _sQuery: 'DELETE FROM users WHERE id = ?',
   *     _aBindingValues: [userId.toString()]
   *   });
   *
   *   if (result._bResult) {
   *     if (result._oData.affectedRows > 0) {
   *       console.log('사용자가 삭제되었습니다.');
   *       return true;
   *     } else {
   *       console.log('삭제할 사용자를 찾을 수 없습니다.');
   *       return false;
   *     }
   *   }
   *
   *   return false;
   * };
   *
   * // 인덱스 생성
   * const createIndexes = async () => {
   *   const indexes = [
   *     'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
   *     'CREATE INDEX IF NOT EXISTS idx_users_age ON users(age)',
   *     'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)'
   *   ];
   *
   *   for (const indexQuery of indexes) {
   *     const result = await bizMOB.Database.executeSql({
   *       _sQuery: indexQuery
   *     });
   *
   *     if (!result._bResult) {
   *       console.error('인덱스 생성 실패:', indexQuery);
   *     }
   *   }
   * };
   *
   * // 트랜잭션과 함께 사용
   * const transferData = async (fromUserId, toUserId, amount) => {
   *   try {
   *     await bizMOB.Database.beginTransaction();
   *
   *     // 출금
   *     const withdrawResult = await bizMOB.Database.executeSql({
   *       _sQuery: 'UPDATE accounts SET balance = balance - ? WHERE user_id = ?',
   *       _aBindingValues: [amount.toString(), fromUserId.toString()]
   *     });
   *
   *     if (!withdrawResult._bResult || withdrawResult._oData.affectedRows === 0) {
   *       throw new Error('출금 실패');
   *     }
   *
   *     // 입금
   *     const depositResult = await bizMOB.Database.executeSql({
   *       _sQuery: 'UPDATE accounts SET balance = balance + ? WHERE user_id = ?',
   *       _aBindingValues: [amount.toString(), toUserId.toString()]
   *     });
   *
   *     if (!depositResult._bResult || depositResult._oData.affectedRows === 0) {
   *       throw new Error('입금 실패');
   *     }
   *
   *     await bizMOB.Database.commitTransaction();
   *     console.log('이체 완료');
   *     return true;
   *
   *   } catch (error) {
   *     await bizMOB.Database.rollbackTransaction();
   *     console.error('이체 실패:', error.message);
   *     return false;
   *   }
   * };
   *
   * // 테이블 스키마 수정
   * const addColumnToUsers = async () => {
   *   const result = await bizMOB.Database.executeSql({
   *     _sQuery: 'ALTER TABLE users ADD COLUMN phone TEXT'
   *   });
   *
   *   if (result._bResult) {
   *     console.log('사용자 테이블에 전화번호 컬럼이 추가되었습니다.');
   *   } else {
   *     console.error('컬럼 추가 실패:', result._sResultMessage);
   *   }
   * };
   *
   * @since bizMOB 4.0.0
   */
  static executeSql(arg: {
    _sQuery: string, // SQL 쿼리문
    _aBindingValues?: string, // SQL 쿼리문의 바인딩 값
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.executeSql({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * SQLite 데이터베이스를 열고 사용 준비를 합니다.
   *
   * SQLite 데이터베이스 파일을 열어서 SQL 쿼리를 실행할 수 있는 상태로 만드는 API입니다.
   * 데이터베이스가 존재하지 않으면 새로 생성하고, 이미 열려있는 경우 기존 연결을 재사용합니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 엔진을 통한 로컬 데이터베이스 접근
   * - 웹: Web SQL Database 또는 IndexedDB 기반 SQLite 에뮬레이션
   *
   * @purpose 로컬 데이터 저장소 초기화, 오프라인 데이터 관리, 앱 데이터베이스 설정
   *
   * @param {Object} arg - 데이터베이스 오픈 설정 객체
   * @param {string} arg._sDbName - 열 데이터베이스 파일 이름 (확장자 포함 권장: .db, .sqlite)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 데이터베이스 오픈 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 오픈 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1001': 파일 오류)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 데이터베이스 정보
   * @returns {string} return._oData.dbName - 연결된 데이터베이스 이름
   * @returns {string} return._oData.dbPath - 데이터베이스 파일 경로
   * @returns {string} return._oData.version - SQLite 버전
   * @returns {boolean} return._oData.isNewDatabase - 새로 생성된 데이터베이스 여부
   *
   * @caution
   * - 동시에 여러 데이터베이스를 열 수 있지만 성능에 영향을 줄 수 있습니다
   * - 데이터베이스 사용 후 반드시 closeDatabase()로 연결을 닫아야 합니다
   * - 파일명에 특수문자나 공백이 포함되면 오류가 발생할 수 있습니다
   * - 웹에서는 브라우저별로 SQLite 지원 정도가 다를 수 있습니다
   *
   * @see public/mock/bizMOB/Database/openDatabase.json - Mock 응답 데이터 예제
   *
   * @example
   * // 기본 데이터베이스 열기
   * const openResult = await bizMOB.Database.openDatabase({
   *   _sDbName: 'app_data.db'
   * });
   *
   * if (openResult._bResult) {
   *   console.log('데이터베이스 연결 성공:', openResult._oData.dbName);
   *
   *   if (openResult._oData.isNewDatabase) {
   *     console.log('새 데이터베이스가 생성되었습니다.');
   *     // 초기 테이블 생성 로직 실행
   *     await createInitialTables();
   *   }
   * } else {
   *   console.error('데이터베이스 연결 실패:', openResult._sResultMessage);
   * }
   *
   * // 사용자별 데이터베이스 열기
   * const userId = await bizMOB.Storage.get({ _sKey: 'currentUserId' });
   * const userDbResult = await bizMOB.Database.openDatabase({
   *   _sDbName: `user_${userId}_data.db`
   * });
   *
   * // 데이터베이스 초기화 함수
   * const initializeDatabase = async (dbName) => {
   *   try {
   *     const result = await bizMOB.Database.openDatabase({
   *       _sDbName: dbName
   *     });
   *
   *     if (result._bResult) {
   *       // 새 데이터베이스인 경우 초기 스키마 생성
   *       if (result._oData.isNewDatabase) {
   *         await createTables();
   *         await insertInitialData();
   *       }
   *       return true;
   *     }
   *     return false;
   *   } catch (error) {
   *     console.error('데이터베이스 초기화 실패:', error);
   *     return false;
   *   }
   * };
   *
   * // 앱 시작 시 데이터베이스 준비
   * const setupAppDatabase = async () => {
   *   const dbInitialized = await initializeDatabase('main_app.db');
   *
   *   if (dbInitialized) {
   *     console.log('앱 데이터베이스 준비 완료');
   *   } else {
   *     console.error('앱 데이터베이스 초기화 실패');
   *     // 대체 방안 또는 오류 처리
   *   }
   * };
   *
   * @since bizMOB 4.0.0
   */
  static openDatabase(arg: {
    _sDbName: string, // 오픈할 대상 데이터베이스 이름
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.openDatabase({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }

  /**
   * 진행 중인 트랜잭션을 롤백하여 모든 변경사항을 취소합니다.
   *
   * beginTransaction()으로 시작된 트랜잭션의 모든 변경사항을 취소하고 원래 상태로 되돌리는 API입니다.
   * 오류 발생 시나 조건에 맞지 않을 때 데이터를 안전하게 원상복구할 때 사용합니다.
   *
   * @description
   * - 앱: 네이티브 SQLite 트랜잭션 롤백 처리
   * - 웹: 웹 SQL 또는 SQLite WASM 트랜잭션 롤백
   *
   * @purpose 데이터 원상복구, 오류 상황 처리, 조건부 작업 취소, 데이터 무결성 보호
   *
   * @param {Object} [arg] - 트랜잭션 롤백 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   *
   * @returns {Promise<Object>} 트랜잭션 롤백 결과 객체를 담은 Promise
   * @returns {boolean} return._bResult - 롤백 성공 여부 (true: 성공, false: 실패)
   * @returns {string} return._sResultCode - 결과 코드 ('0000': 성공, '1007': 롤백 실패)
   * @returns {string} return._sResultMessage - 결과 메시지
   * @returns {Object} return._oData - 롤백 결과 정보
   * @returns {string} return._oData.rolledBackAt - 롤백 완료 시간
   * @returns {number} return._oData.discardedRows - 취소된 변경 행 수
   * @returns {number} return._oData.executionTime - 롤백 실행 시간 (밀리초)
   *
   * @caution
   * - 활성화된 트랜잭션이 없으면 오류가 발생할 수 있습니다
   * - 롤백 후에는 해당 트랜잭션을 더 이상 사용할 수 없습니다
   * - 롤백된 변경사항은 복구할 수 없습니다
   *
   * @see public/mock/bizMOB/Database/rollbackTransaction.json - Mock 응답 데이터 예제
   *
   * @example
   * // 오류 발생 시 롤백
   * try {
   *   await bizMOB.Database.beginTransaction();
   *
   *   await bizMOB.Database.executeSql({
   *     _sQuery: 'UPDATE accounts SET balance = balance - ? WHERE id = ?',
   *     _aBindingValues: ['1000', '123']
   *   });
   *
   *   // 잔액 확인
   *   const balanceCheck = await bizMOB.Database.executeSelect({
   *     _sQuery: 'SELECT balance FROM accounts WHERE id = ?',
   *     _aBindingValues: ['123']
   *   });
   *
   *   if (balanceCheck._oData.rows[0].balance < 0) {
   *     // 잔액 부족 시 롤백
   *     await bizMOB.Database.rollbackTransaction();
   *     console.log('잔액이 부족하여 거래가 취소되었습니다.');
   *   } else {
   *     await bizMOB.Database.commitTransaction();
   *     console.log('거래가 완료되었습니다.');
   *   }
   * } catch (error) {
   *   await bizMOB.Database.rollbackTransaction();
   *   console.error('거래 처리 중 오류 발생:', error);
   * }
   *
   * @since bizMOB 4.0.0
   */
  static rollbackTransaction(arg?: {
    _bMock?: boolean, // Mock 데이터 사용 여부
  }): Promise<Record<string, any>> {
    return new Promise(resolve => {
      window.bizMOB.Database.rollbackTransaction({
        ...arg,
        _fCallback: function (res: any) {
          resolve(res);
        }
      });
    });
  }
}
