export default class Database {
  /**
   * DataBase Transaction 시작
   *
   * @param {Object} [arg] - 트랜잭션 시작 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,       // 트랜잭션 시작 결과 값
   *   error_message: string  // 트랜잭션 시작 실패시 오류 메세지
   * }>} 트랜잭션 시작 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Database/beginTransaction.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 기본 트랜잭션 사용
   * const transactionResult = await Database.beginTransaction();
   *
   * if (transactionResult.result) {
   *   console.log('트랜잭션 시작 성공');
   *
   *   try {
   *     // 여러 SQL 작업 수행
   *     await Database.executeSql({
   *       _sQuery: 'INSERT INTO orders (user_id, total) VALUES (?, ?)',
   *       _aBindingValues: ['123', '50000']
   *     });
   *
   *     await Database.executeSql({
   *       _sQuery: 'UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?',
   *       _aBindingValues: ['1', '456']
   *     });
   *
   *     // 모든 작업 성공 시 커밋
   *     await Database.commitTransaction();
   *     console.log('주문 처리 완료');
   *
   *   } catch (error) {
   *     // 오류 발생 시 롤백
   *     await Database.rollbackTransaction();
   *     console.log('주문 처리 실패:', error);
   *   }
   * }
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
   * DataBase Close
   * 
   * @param {Object} [arg] - 데이터베이스 닫기 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,      // 데이터베이스 닫기 결과 값
   *   error_message: string // 데이터베이스 닫기 실패시 오류 메세지
   * }>} 데이터베이스 닫기 결과 객체
   * @see public/mock/bizMOB/Database/closeDatabase.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 앱 종료 시 리소스 정리
   * const cleanupOnExit = async () => {
   *   try {
   *     // 모든 진행 중인 작업 완료 대기
   *     await waitForPendingOperations();
   *
   *     // 데이터베이스 연결 종료
   *     const closeDb = await Database.closeDatabase();
   *
   *     if (closeDb.result) {
   *       console.log('데이터베이스 정리 완료');
   *     }
   *   } catch (error) {
   *     console.log('정리 작업 중 오류:', error);
   *   }
   * };
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
   * DataBase Transaction Commit
   * 
   * @param {Object} [arg] - 트랜잭션 커밋 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,      // 트랜잭션 커밋 결과 값
   *   error_message: string // 트랜잭션 커밋 실패시 오류 메세지
   * }>} 트랜잭션 커밋 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Database/commitTransaction.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 트랜잭션 내 모든 작업 성공 시 커밋
   * const commitResult = await Database.commitTransaction();
   *
   * if (commitResult.result) {
   *   console.log('트랜잭션 커밋 성공 - 모든 변경사항이 저장되었습니다');
   * } else {
   *   console.log('트랜잭션 커밋 실패:', commitResult.error_message);
   * }
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
   * SQL쿼리문을 일괄 실행
   * 
   * @param {Object} arg - 배치 SQL 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SQL 쿼리문 (배치 처리용)
   * @param {Array} [arg._aBindingValues] - 쿼리문의 각 변수 위치에 대입해줄 값의 배열.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,              // SQL쿼리문 일괄 실행 결과 값
   *   error_message: string,        // SQL쿼리문 일괄 실행 실패 시 오류 메시지
   *   data: {
   *     affected_number: number,    // SQL쿼리문 일괄 실행 후 영향을 받은 레코드 수
   *     code: string                // 오류 코드 (오류 시에만 반환)
   *   }
   * }>} SQL 일괄 실행 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Database/executeBatchSql.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 여러 사용자 정보를 한 번에 삽입
   * var insertQuery = 'INSERT INTO users (name, email, department, created_at) VALUES (?, ?, ?, DATETIME("now"))';
   * var userList = [
   *   ['김철수', 'kim@company.com', '개발팀'],
   *   ['이영희', 'lee@company.com', '디자인팀'],
   *   ['박민수', 'park@company.com', '기획팀']
   * ];
   * const result = await Database.executeBatchSql({
   *   _sQuery: insertQuery,
   *   _aBindingValues: userList,
   * });
   *
   * console.log(`${result.data.affected_number}개의 레코드가 삽입되었습니다.`);
   *
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
   * SELECT SQL 쿼리문을 실행
   *
   * @param {Object} arg - SELECT 쿼리 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SELECT SQL 쿼리문
   * @param {Array} [arg._aBindingValues] - 쿼리문의 각 변수 위치에 대입해줄 값의 배열.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,               // SELECT SQL쿼리문 실행 결과 값
   *   error_message: string,         // SELECT SQL쿼리문 실행 실패시 오류 메세지
   *   data: {                        // SELECT 쿼리 응답 데이터
   *     result_set: {                // 쿼리 결과 집합
   *       rows: Array                // SELECT 쿼리 실행으로 반환된 레코드 배열
   *     }
   *   }
   * }>} SELECT 쿼리 실행 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Database/executeSelect.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 기본 SELECT 쿼리
   * const selectResult = await Database.executeSelect({
   *   _sQuery: 'SELECT * FROM users'
   * });
   *
   * if (selectResult.result) {
   *   console.log(`총 ${selectResult.data.result_set.rows.length}개의 사용자를 찾았습니다.`);
   *   selectResult.data.result_set.rows.forEach(user => {
   *     console.log(`이름: ${user.name}, 나이: ${user.age}`);
   *   });
   * }
   *
   * // 매개변수 바인딩을 사용한 쿼리
   * const searchUsers = async (searchName, minAge) => {
   *   const searchResult = await Database.executeSelect({
   *     _sQuery: 'SELECT id, name, email, age FROM users WHERE name LIKE ? AND age >= ? ORDER BY name',
   *     _aBindingValues: [`%${searchName}%`, minAge.toString()]
   *   });
   *
   *   if (searchResult.result) {
   *     return searchResult.data.result_set.rows;
   *   } else {
   *     console.log('사용자 검색 실패:', searchResult.error_message);
   *     return [];
   *   }
   * };
   *
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
   * SQL쿼리문을 실행
   * 
   * @param {Object} arg - SQL 쿼리 실행 설정 객체
   * @param {string} arg._sQuery - 실행할 SQL 쿼리문 (INSERT, UPDATE, DELETE 등)
   * @param {Array} [arg._aBindingValues] - 쿼리문의 각 변수 위치에 대입해줄 값의 배열.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,               // SQL 쿼리문 실행 결과 값
   *   error_message: string,         // SQL 쿼리문 실행 실패시 오류 메세지
   *   data: {                        // SQL 실행 응답 데이터
   *     affected_number: number      // SQL 실행 후 영향을 받은 레코드 수
   *   }
   * }>} SQL 실행 결과 객체를 담은 Promise
   * @see public/mock/bizMOB/Database/executeSql.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 데이터 입력 (INSERT)
   * const insertUser = async (name, email, age) => {
   *   const insertResult = await Database.executeSql({
   *     _sQuery: 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
   *     _aBindingValues: [name, email, age.toString()]
   *   });
   *
   *   if (insertResult.result) {
   *     console.log(`사용자 추가 완료. 영향받은 레코드: ${insertResult.data.affected_number}`);
   *     return insertResult.data.affected_number;
   *   } else {
   *     console.log('사용자 추가 실패:', insertResult.error_message);
   *     return null;
   *   }
   * };
   *
   * // 데이터 수정 (UPDATE)
   * const updateUser = async (userId, updatedData) => {
   *   const updateResult = await Database.executeSql({
   *     _sQuery: 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
   *     _aBindingValues: [
   *       updatedData.name,
   *       updatedData.email,
   *       updatedData.age.toString(),
   *       userId.toString()
   *     ]
   *   });
   *
   *   if (updateResult.result) {
   *     console.log(`${updateResult.data.affected_number}개의 사용자 정보가 업데이트되었습니다.`);
   *     return updateResult.data.affected_number > 0;
   *   }
   *
   *   return false;
   * };
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
   * DataBase Open
   * 
   * @param {Object} arg - 데이터베이스 오픈 설정 객체
   * @param {string} arg._sDbName - 오픈할 데이터베이스 명.
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,               // 데이터베이스 오픈 결과 값
   *   error_message: string          // 데이터베이스 오픈 실패 시 오류 메시지
   * }>} 데이터베이스 오픈 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Database/openDatabase.json - Mock 응답 데이터 예제
   * @example
   * import { Database, Storage } from '@bizMOB';
   * // 데이터베이스 연결
   * const openResult = await Database.openDatabase({
   *   _sDbName: 'app_data.db'
   * });
   *
   * if (openResult.result) {
   *   console.log('데이터베이스 연결 성공');
   * } else {
   *   console.log('데이터베이스 연결 실패:', openResult.error_message);
   * }
   *
   * // 사용자별 데이터베이스 연결
   * const userId = await Storage.get({ _sKey: 'currentUserId' });
   * const userDbResult = await Database.openDatabase({
   *   _sDbName: `user_${userId}_data.db`
   * });
   *
   * if (userDbResult.result) {
   *   console.log('데이터베이스 연결 성공');
   * } else {
   *   console.log('데이터베이스 연결 실패:', userDbResult.error_message);
   * }
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
   * DataBase Transaction Rollback
   *
   * @param {Object} [arg] - 트랜잭션 롤백 설정 객체 (선택적)
   * @param {boolean} [arg._bMock=false] - Mock 데이터 사용 여부 (개발용)
   * @returns {Promise<{
   *   result: boolean,               // 트랜잭션 롤백 결과 값
   *   error_message: string          // 트랜잭션 롤백 실패 시 오류 메시지
   * }>} 트랜잭션 롤백 결과를 담은 Promise 객체
   * @see public/mock/bizMOB/Database/rollbackTransaction.json - Mock 응답 데이터 예제
   * @example
   * import { Database } from '@bizMOB';
   * // 오류 발생 시 트랜잭션 롤백
   * try {
   *   await Database.beginTransaction();
   *
   *   await Database.executeSql({
   *     _sQuery: 'UPDATE accounts SET balance = balance - ? WHERE id = ?',
   *     _aBindingValues: ['1000', '123']
   *   });
   *
   *   // 잔액 확인
   *   const balanceCheck = await Database.executeSelect({
   *     _sQuery: 'SELECT balance FROM accounts WHERE id = ?',
   *     _aBindingValues: ['123']
   *   });
   *
   *   if (balanceCheck._oData.rows[0].balance < 0) {
   *     // 잔액 부족 시 롤백
   *     const rollbackResult = await Database.rollbackTransaction();
   *     if (!rollbackResult.result) {
   *       console.error('롤백 실패:', rollbackResult.error_message);
   *     } else {
   *       console.log('잔액이 부족하여 거래가 취소되었습니다.');
   *     }
   *   } else {
   *     await Database.commitTransaction();
   *     console.log('거래가 완료되었습니다.');
   *   }
   * } catch (error) {
   *   await Database.rollbackTransaction();
   *   console.error('거래 처리 중 오류 발생:', error);
   * }
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
