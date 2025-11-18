import { test } from '@playwright/test';

// increase default timeout for this file
test.setTimeout(10 * 60 * 1000);

const categories = [
  'https://wendesi.lk/product-category/refrigerator/',
  'https://wendesi.lk/product-category/washing-machine/',
  'https://wendesi.lk/product-category/smart-tv/',
  'https://wendesi.lk/product-category/air-conditioner/',
  'https://wendesi.lk/product-category/air-fryer/',
  'https://wendesi.lk/product-category/smart-phone/',
  'https://wendesi.lk/product-category/projector/',
  'https://wendesi.lk/product-category/kettle/',
  'https://wendesi.lk/product-category/iron/',
  'https://wendesi.lk/product-category/fan/',
  'https://wendesi.lk/product-category/blender/',
  'https://wendesi.lk/product-category/burner/',
];

test(
  'Verify product descriptions for multiple categories on Wendesi.lk',
  async ({ page }: { page: any }) => {
    const duplicateProducts: Set<string> = new Set();
    const allProducts: Set<string> = new Set();
    const missingDescriptions: string[] = [];
    const onlyReviewProducts: string[] = [];
    const failedProducts: string[] = [];
    const failedCategories: string[] = [];

    for (const category of categories) {
      console.log(`\n🔎 Checking Category: ${category}`);

      try {
        await page.goto(category, { waitUntil: 'domcontentloaded', timeout: 120000 });
        await page.waitForTimeout(1000);

        const productLinks: string[] = await page.$$eval(
          'ul.products li a.woocommerce-LoopProduct-link',
          (links: Element[]) => links.map((link: Element) => (link as HTMLAnchorElement).href)
        );

        // Normalize URLs (trim trailing slashes) and deduplicate per category to avoid
        // counting the same anchor twice (image/title anchors, duplicates in markup, etc.).
        const normalize = (u: string) => u.replace(/\/+$/g, '');
        const uniqueProductLinks = Array.from(
          new Map(productLinks.map((p) => [normalize(p), p])).values()
        );

        console.log(`🟦 Total products found: ${productLinks.length} (unique: ${uniqueProductLinks.length})`);

        // Check duplicates
  // Check duplicates against previously-seen products (global across categories)
  const duplicatesInCategory = uniqueProductLinks.filter((link) => allProducts.has(normalize(link)));
  duplicatesInCategory.forEach((link) => duplicateProducts.add(link));
  uniqueProductLinks.forEach((link) => allProducts.add(normalize(link)));

        // Check each product
  // Iterate unique product links only
  for (const link of uniqueProductLinks) {
          console.log(`➡️ Checking product: ${link}`);
          try {
            await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 120000 });
            await page.waitForTimeout(500);

            const descLocator = page.locator(
              '.woocommerce-Tabs-panel--description, #tab-description, .product-description'
            );
            const reviewLocator = page.locator(
              '.woocommerce-Tabs-panel--reviews, #tab-reviews'
            );

            const descriptionCount = await descLocator.count();
            const reviewCount = await reviewLocator.count();

              if (descriptionCount === 0) {
              if (reviewCount > 0) {
                console.log(`ℹ️ Only review section present for: ${link}`);
                  if (!onlyReviewProducts.includes(link)) onlyReviewProducts.push(link);
              } else {
                console.log(`❌ Missing description: ${link}`);
                  if (!missingDescriptions.includes(link)) missingDescriptions.push(link);
              }
              continue;
            }

            // Check if description has actual text
            let hasText = false;
            for (let i = 0; i < descriptionCount; i++) {
              const text = await descLocator.nth(i).textContent();
              if (text && text.trim().length > 0) {
                hasText = true;
                break;
              }
            }

              if (!hasText) {
              if (reviewCount > 0) {
                console.log(`ℹ️ Only review section present for: ${link}`);
                  if (!onlyReviewProducts.includes(link)) onlyReviewProducts.push(link);
              } else {
                console.log(`❌ Description section empty: ${link}`);
                  if (!missingDescriptions.includes(link)) missingDescriptions.push(link);
              }
            } else {
              console.log(`✅ Description present for: ${link}`);
            }
          } catch (err) {
            console.log(`❌ FAILED to load product page: ${link}`);
            if (!failedProducts.includes(link)) failedProducts.push(link);
          }
        }
      } catch (err) {
        console.log(`❌ Failed to load category page: ${category}`);
        failedCategories.push(category);
      }
    }

    // FINAL SUMMARY
    console.log('\n===========================');
    console.log('        FINAL SUMMARY       ');
    console.log('===========================');

    if (failedCategories.length > 0) {
      console.log(`❌ Failed categories (${failedCategories.length}):`);
      failedCategories.forEach((cat) => console.log(` - ${cat}`));
    }

    if (duplicateProducts.size > 0) {
      console.log(`⚠️ Duplicate Product URLs Found (${duplicateProducts.size}):`);
      duplicateProducts.forEach((url) => console.log(` - ${url}`));
    }

    if (missingDescriptions.length > 0) {
      console.log(`❌ Products Missing Descriptions (${missingDescriptions.length}):`);
      missingDescriptions.forEach((url) => console.log(` - ${url}`));
    }

    if (onlyReviewProducts.length > 0) {
      console.log(`ℹ️ Products with Only Review Section (${onlyReviewProducts.length}):`);
      onlyReviewProducts.forEach((url) => console.log(` - ${url}`));
    }

    if (failedProducts.length > 0) {
      console.log(`❌ Products Failed to Load (${failedProducts.length}):`);
      failedProducts.forEach((url) => console.log(` - ${url}`));
    }

    console.log('\n✅ Test completed for all categories and products.');
  }
);
