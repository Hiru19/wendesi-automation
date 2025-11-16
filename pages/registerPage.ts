import { Page, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly emailInput;
  readonly registerButton;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.registerButton = page.locator('button[name="register"]');
  }

  async goto() {
    await this.page.goto('/my-account-2');
  }

  async register(email: string) {
    await this.emailInput.fill(email);
    await this.registerButton.click();
  }

  async assertSuccessMessage() {
    await expect(this.page.locator('.woocommerce-message, .woocommerce-notices-wrapper')).toContainText(
      'Your account with Wendesi.lk is using a temporary password. We emailed you a link to change your password.'
    );
  }

  async assertErrorMessage() {
    await expect(this.page.locator('.woocommerce-notices-wrapper')).toBeVisible();
  }
}
