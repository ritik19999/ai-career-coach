import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Email Password' }).click();
    await page.getByRole('textbox', { name: 'Email Password' }).fill('test@test.com');
    await page.getByRole('textbox', { name: 'Enter password' }).click();
    await page.getByRole('textbox', { name: 'Enter password' }).fill('test');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click()
    await page.waitForSelector(".loader", { state: "hidden" });

    await page.setInputFiles(
        "input[type='file']",
        "tests/fixtures/Resume-Sample-1-Software-Engineer.pdf"
    );

    await page.getByRole('textbox', { name: 'Paste the full job' }).fill('"MERN Stack Developer with AI experience"');
    await page.getByRole('textbox', { name: 'Quick Self-Description' }).click();
    await page.getByRole('textbox', { name: 'Quick Self-Description' }).fill(' "Full stack developer working with React, Node, MongoDB"');

    await expect(page.getByRole('button', { name: 'Generate My Interview Strategy' })).toBeVisible();
    await page.getByRole('button', { name: 'Generate My Interview Strategy' }).click();
    await page.waitForSelector(".loader", { state: "hidden" });

})
