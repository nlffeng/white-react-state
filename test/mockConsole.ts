export function mockConsoleError() {
  let originalError: any
  let originalWarn: any

  beforeAll(() => {
    originalError = global.console.error;
    originalWarn = global.console.warn;
    // 用 jest.fn() 替换，方便模拟
    global.console.error = jest.fn();
    global.console.warn = jest.fn();
  });

  afterAll(() => {
    global.console.error = originalError;
    global.console.warn = originalWarn;
  });
}
