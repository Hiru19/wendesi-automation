import { Page, expect } from '@playwright/test';

export class ContactUs {
  readonly page: Page;
  readonly firstNameInput;
  readonly lastNameInput;
  readonly emailInput;
  readonly commentInput;
  readonly sendMessageButton;
  

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="wpforms[fields][0][first]"]');
    this.lastNameInput = page.locator('input[name="wpforms[fields][0][last]"]');
    this.emailInput = page.locator('//input[@id="wpforms-5222-field_1"]');
    this.commentInput = page.locator('//textarea[@id="wpforms-5222-field_2"]');
    this.sendMessageButton = page.locator('//button[@id="wpforms-submit-5222"]');
  }

  async goto() {
    await this.page.goto('https://wendesi.lk/contact-us/'); // 🔹 Replace with your contact us page URL
  }


  async contactUs(firstName: string, lastName: string, email: string, comment: string) {
    await this.firstNameInput.fill(firstName,{ timeout: 5000 });
    await this.lastNameInput.fill(lastName, { timeout: 5000 });
    await this.emailInput.fill(email, { timeout: 5000 });
    await this.commentInput.fill(comment, { timeout: 5000 });
    await this.sendMessageButton.click({ timeout: 5000 });
  }
  

  async assertThankingMessage() {
    await expect(this.page.getByText("Thanks for contacting us! We will be in touch with you shortly.")).toBeVisible({ timeout: 5000 }); // Title
  }

  async assertStayInContactUsPage() {
    await expect(this.page).toHaveURL("https://wendesi.lk/contact-us/", { timeout: 10000 }); // Title
  }
}
