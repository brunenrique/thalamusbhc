import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

beforeAll(() => {
  jest.spyOn(console, 'info').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.info as jest.Mock).mockRestore();
  (console.warn as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});
