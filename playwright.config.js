const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests/e2e",
    timeout: 120000,

    globalSetup: require.resolve("./global-setup"),
    globalTeardown: require.resolve("./global-teardown"),

    use: {
        baseURL: "http://localhost:5173",
        headless: false,
        trace: "on-first-retry",
        screenshot: "only-on-failure",
        video: "retain-on-failure",
    },

    reporter: [
        ["html"],
        ["list"]
    ],

    retries: 1,
});