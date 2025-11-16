import { Page, expect } from "@playwright/test";

export class ProductSearchPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // 🔹 Correct Locators for Wendesi
  get searchInput() {
    return this.page.locator('input[name="s"]');
  }

  get searchButton() {
    return this.page.locator('form.search-form button[type="submit"]');
  }

  get productTitles() {
    return this.page.locator('.woocommerce-loop-product__title');
  }

  get noResultsMessage() {
    return this.page.locator('.woocommerce-info');
  }

  async gotoHome() {
    await this.page.goto("https://wendesi.lk/");
    await this.searchInput.waitFor({ state: "visible", timeout: 10000 });
  }

  async searchProduct(productName: string) {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async verifySearchResults(productName: string) {
    const products = await this.productTitles.allInnerTexts();
    expect(
      products.some((name) =>
        name.toLowerCase().includes(productName.toLowerCase())
      ),
      `❌ Expected to find product matching: ${productName}`
    ).toBeTruthy();
  }

  async verifyNoResults() {
    await expect(this.noResultsMessage).toBeVisible();
    await expect(this.noResultsMessage).toContainText("No products were found");
  }
}
