import { setTokens, hasTokens, clearTokens } from '../src/services/googleCalendar';
import '../tests/setupLocalStorage';

describe('google calendar token persistence', () => {
  const userId = 'test-user';

  it('stores and clears tokens', () => {
    clearTokens(userId);
    expect(hasTokens(userId)).toBe(false);

    setTokens(userId, { access_token: 'token' });
    expect(hasTokens(userId)).toBe(true);

    clearTokens(userId);
    expect(hasTokens(userId)).toBe(false);
  });
});
