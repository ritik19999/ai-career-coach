const { test, expect } = require("@playwright/test");

test("AI Interview Report Full Flow", async ({ page }) => {

    // 1. Open app
    await page.goto("/");

    // 2. Fill job description
    await page.fill("textarea[name='jobDescription']",
        "MERN Stack Developer with AI experience"
    );

    // 3. Fill self description
    await page.fill("textarea[name='selfDescription']",
        "Full stack developer working with React, Node, MongoDB"
    );

    // 4. Upload resume
    await page.setInputFiles(
        "input[type='file']",
        "tests/fixtures/sample.pdf"
    );

    // 5. Click generate
    await page.click("button[type='submit']");

    // 6. Wait for loader to disappear
    await page.waitForSelector(".loader", { state: "hidden" });

    // 7. Wait for report
    await page.waitForSelector(".interview-report", {
        timeout: 120000
    });

    // 8. Assertions
    await expect(page.locator(".interview-report")).toContainText("matchScore");
    await expect(page.locator(".interview-report")).toBeVisible();
});