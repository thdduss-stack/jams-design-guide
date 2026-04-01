import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// VITEST_FILTER_MODE일 때만 불필요한 로그 필터링
const isFilterMode = process.env.VITEST_FILTER_MODE === 'true';
const originalError = console.error;
const originalLog = console.log;

beforeAll(() => {
  if (isFilterMode) {
    // React act() 경고 필터링
    console.error = (...args: unknown[]) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (message.includes('An update to') && message.includes('inside a test was not wrapped in act')) {
        return;
      }
      originalError.call(console, ...args);
    };

    // API Proxy 파싱 오류 로그 필터링
    console.log = (...args: unknown[]) => {
      const message = typeof args[0] === 'string' ? args[0] : '';
      if (message.includes('[API Proxy] 요청 바디 파싱 오류')) {
        return;
      }
      originalLog.call(console, ...args);
    };
  }
});

afterAll(() => {
  if (isFilterMode) {
    console.error = originalError;
    console.log = originalLog;
  }
});

// 각 테스트 후 cleanup
afterEach(() => {
  cleanup();
});

// ResizeObserver mock
const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// IntersectionObserver mock
const IntersectionObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

// matchMedia mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
