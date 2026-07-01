import { hashPassword, verifyPassword } from './password.util';

describe('password utilities', () => {
  it('hashes and verifies passwords without storing plaintext', async () => {
    const hash = await hashPassword('ChangeMeAuren2026!');

    expect(hash).not.toBe('ChangeMeAuren2026!');
    await expect(verifyPassword('ChangeMeAuren2026!', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });
});

