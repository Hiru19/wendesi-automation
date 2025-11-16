import { test } from '@playwright/test';
import { addToCart } from '../pages/addToCart';

test.describe('Login Page Tests', () => {
  test('Valid user should navigate to dashboard', async ({ page }) => {
    const addToCartPage = new addToCart(page);

    await addToCartPage.goto();
    await addToCartPage.clickAddToCart();
    await addToCartPage.clickCartButton();
    await addToCartPage.clickViewCartButton();
    await addToCartPage.assertItemAvailability();
  });

});