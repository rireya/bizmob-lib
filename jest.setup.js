// Jest 테스트 환경 설정

// 글로벌 테스트 설정
global.console = {
  ...console,
  // 테스트 중 불필요한 로그 제거
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// 모든 테스트에서 사용할 수 있는 설정들
beforeEach(() => {
  // 각 테스트 전에 실행할 설정
});

afterEach(() => {
  // 각 테스트 후에 실행할 정리 작업
  jest.clearAllMocks();
});