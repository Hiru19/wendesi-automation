import { test } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import * as credentials from '../test-data/credentials.json';

test.describe('Login Page Tests - Wendesi', () => {

  test('Valid login navigates to dashboard', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.validUser.username, credentials.validUser.password);
    await loginPage.assertDashboardNavigation();
  });

  test('"Lost your password?" navigates to reset page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.clickLostPassword();
    await loginPage.assertLostPasswordNavigation();
  });

  test('Invalid login shows error message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.invalidUser.username, credentials.invalidUser.password);
    await loginPage.assertErrorMessage('Incorrect username or password.');
  });

  test('Empty fields show validation message', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(credentials.emptyUser.username, credentials.emptyUser.password);
    await loginPage.assertErrorMessage('Username is required.');
  });

});
