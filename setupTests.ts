import '@testing-library/jest-dom';
import './src/tests/__mocks__/test-utils';

declare global {
  interface Window {
    ResizeObserver: any;
  }
}

if (typeof window.ResizeObserver === 'undefined') {
  window.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
