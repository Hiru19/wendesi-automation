import { test } from '@playwright/test';
import {ContactUs} from '../pages/contactUs';
import * as contactDetails from '../test-data/contactUSFormDetails.json';

test.describe('Login Page Tests', () => {
  test('Valid details should complete contact data sending', async ({ page }) => {
    const contactUs = new ContactUs(page);

    await contactUs.goto();
    await contactUs.contactUs(contactDetails.validAllDeatils.firstName, contactDetails.validAllDeatils.lastName, contactDetails.validAllDeatils.email, contactDetails.validAllDeatils.comment,);
    await contactUs.assertThankingMessage();
  });

  test('Empty details (firstName) should not complete contact data sending', async ({ page }) => {
    const contactUs = new ContactUs(page);

    await contactUs.goto();
    await contactUs.contactUs(contactDetails.emptyFirstName.firstName, contactDetails.emptyFirstName.lastName, contactDetails.emptyFirstName.email, contactDetails.emptyFirstName.comment,);
    await contactUs.assertStayInContactUsPage();
  });

  test('Empty details (lastName) should not complete contact data sending', async ({ page }) => {
    const contactUs = new ContactUs(page);

    await contactUs.goto();
    await contactUs.contactUs(contactDetails.emptyLastName.firstName, contactDetails.emptyLastName.lastName, contactDetails.emptyLastName.email, contactDetails.emptyLastName.comment,);
    await contactUs.assertStayInContactUsPage();
  });

  test('Empty details (email) should not complete contact data sending', async ({ page }) => {
    const contactUs = new ContactUs(page);

    await contactUs.goto();
    await contactUs.contactUs(contactDetails.emptyEmail.firstName, contactDetails.emptyEmail.lastName, contactDetails.emptyEmail.email, contactDetails.emptyEmail.comment,);
    await contactUs.assertStayInContactUsPage();
  });

  test('Empty details (comment) should not complete contact data sending', async ({ page }) => {
    const contactUs = new ContactUs(page);

    await contactUs.goto();
    await contactUs.contactUs(contactDetails.emptyComment.firstName, contactDetails.emptyComment.lastName, contactDetails.emptyComment.email, contactDetails.emptyComment.comment,);
    await contactUs.assertStayInContactUsPage();
  });

});
