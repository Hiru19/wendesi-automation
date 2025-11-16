import { Page, expect } from '@playwright/test';

export class addToCart {
  readonly page: Page;
  readonly addToCartButton;
  readonly cartButton;
  readonly viewCartButton;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator('//button[normalize-space()="Add to cart"]');
    this.cartButton = page.locator('//div[@class="header-icon header-icon__cart animate-dropdown dropdown"]//a[@class="dropdown-toggle"]');
    this.viewCartButton = page.locator('//a[normalize-space()="View cart"]');
  }

  async goto() {
    await this.page.goto('https://wendesi.lk/product/tcl-a-c-inverter-18000btu/'); // 🔹 Replace with your product URL
  }


  async clickAddToCart() {
    await this.addToCartButton.click({ timeout: 10000 });
  }

  async clickCartButton() {
    await this.cartButton.click({ timeout: 10000 });
  }

  async clickViewCartButton() {
    await this.viewCartButton.click({ timeout: 20000 });
  }

  async assertItemAvailability() {
    await expect(this.page.getByText("TCL A/C -Inverter-18000btu")).toBeVisible({ timeout: 5000 }); // Text of product name
  }

}
