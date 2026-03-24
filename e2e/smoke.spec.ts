import { test, expect } from "@playwright/test";

/**
 * Smoke tests — verify the app is alive and functional at a high level.
 * Must run in under 30 seconds total.
 * These are "is it on fire?" checks, not feature correctness checks.
 */

test.describe("Smoke", () => {
  test("should return HTTP 200", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("should render without critical JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    // Wait for auth state to resolve (login page appears)
    await page.waitForSelector("text=Sign in to access your tasks");
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("firebase") &&
        !e.includes("Firebase") &&
        !e.includes("firestore") &&
        !e.includes("network") &&
        !e.includes("CORS")
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test("should show login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sign in to access your tasks")).toBeVisible({
      timeout: 10000,
    });
  });

  test("should display primary CTA button", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: /Continue with Google/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("should have correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Task Tracker/);
  });

  test("should apply dark theme on initial load", async ({ page }) => {
    await page.goto("/");
    const bgColor = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });
});
