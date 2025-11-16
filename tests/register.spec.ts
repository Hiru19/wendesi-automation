import { test } from '@playwright/test';
import { RegisterPage } from '../pages/registerPage';
import * as registerData from '../test-data/registerData.json';

test.describe('Register Page Tests - Wendesi', () => {
  
  test('Valid registration email shows confirmation message', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(registerData.validUser.email);
    await registerPage.assertSuccessMessage();
  });

  test('Invalid registration email shows error', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(registerData.invalidUser.email);
    await registerPage.assertErrorMessage();
  });

});
