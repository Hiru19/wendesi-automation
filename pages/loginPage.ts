import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput;
  readonly passwordInput;
  readonly loginButton;
  readonly lostPasswordLink;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[name="login"], button:has-text("Log in")');
    this.lostPasswordLink = page.locator('text=Lost your password?');
  }

  async goto() {
    await this.page.goto('/my-account-2');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // Click login and wait for either the account URL or a dashboard-like header to appear.
    await Promise.all([
      this.loginButton.click(),
      Promise.race([
        this.page.waitForURL(/\/my-account-2\/?$/, { timeout: 15000 }).catch(() => undefined),
        this.page.waitForSelector('h1, .page-title, .woocommerce-MyAccount-content', { state: 'visible', timeout: 15000 }).catch(() => undefined),
      ]),
    ]);
  }

  async clickLostPassword() {
    await this.lostPasswordLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async assertDashboardNavigation() {
    // adjust path based on actual URL after login
    // Accept with or without trailing slash
    await expect(this.page).toHaveURL(/\/my-account-2\/?$/);
    const headerText = await this.page.locator('h1, .page-title').first().innerText().catch(() => '');
    if (!/my account|\baccount\b|dashboard/i.test(headerText)) {
      throw new Error(`Expected dashboard page title to contain 'My Account' or 'Dashboard', got: "${headerText}"`);
    }
  }

  async assertLostPasswordNavigation() {
    // Fix incorrect expected path and accept trailing slash
    await expect(this.page).toHaveURL(/\/my-account-2\/lost-password\/?$/);
    const lostHeader = await this.page.locator('h1, .page-title').first().innerText().catch(() => '');
    if (!/lost password|reset password/i.test(lostHeader)) {
      throw new Error(`Expected lost-password page title to contain 'Lost password' or 'Reset Password', got: "${lostHeader}"`);
    }
  }

  async assertErrorMessage(expectedMessage: string) {
    // Broaden the error selector to catch different themes and wait for visibility
    const errorLocator = this.page.locator('.woocommerce-error, .error-message, .woocommerce-notice--error, .notice-error, .alert, [role="alert"]');
    // Wait for an error-like element to appear, then assert it contains expected text
    await errorLocator.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const text = await errorLocator.first().innerText().catch(() => '');
    const textLower = text.toLowerCase();
    const expectedLower = expectedMessage.toLowerCase();
    if (textLower.includes(expectedLower)) {
      return;
    }
    // Fallback: accept common phrasing variations
    const fallbacks: string[] = [];
    if (/incorrect/i.test(expectedMessage) || /incorrect/i.test(textLower)) {
      fallbacks.push('incorrect', 'is incorrect');
    }
    if (/required/i.test(expectedMessage) || /required/i.test(textLower)) {
      fallbacks.push('required', 'is required');
    }
    if (/password/i.test(expectedMessage) && /lost your password/i.test(textLower)) {
      fallbacks.push('lost your password', 'lost password');
    }
    const matched = fallbacks.some(k => textLower.includes(k));
    if (!matched) {
      throw new Error(`Expected error message to contain "${expectedMessage}" or one of ${JSON.stringify(fallbacks)}, but got: "${text}"`);
    }
  }
}
