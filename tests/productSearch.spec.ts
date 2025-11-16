import { test } from "@playwright/test";
import { ProductSearchPage } from "../pages/productSearch.page";
import * as searchData from "../test-data/productSearch.data.json";

// ✅ Test Suite
test.describe("Product Search Functionality - Wendesi (Data Driven)", () => {
  let productSearch: ProductSearchPage;

  test.beforeEach(async ({ page }) => {
    productSearch = new ProductSearchPage(page);
    await productSearch.gotoHome();
  });

  // ✅ TC001 - Valid Product Search
  test("TC001 - Valid Product Search", async () => {
    const { productName } = searchData.validSearch;
    await productSearch.searchProduct(productName);
    await productSearch.verifySearchResults(productName);
  });

  // ✅ TC002 - Invalid Product Search
  test("TC002 - Invalid Product Search", async () => {
    const { productName } = searchData.invalidSearch;
    await productSearch.searchProduct(productName);
    await productSearch.verifyNoResults();
  });

  // ✅ TC003 - Partial Keyword Search
  test("TC003 - Partial Keyword Search", async () => {
    const { productName } = searchData.partialSearch;
    await productSearch.searchProduct(productName);
    await productSearch.verifySearchResults(productName);
  });
});
