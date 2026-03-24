import { test, expect } from "@playwright/test";

/**
 * Task Tracker E2E Tests
 *
 * These tests verify the core acceptance criteria from the PRD.
 * Note: Firebase Auth Google sign-in cannot be fully automated in headless tests.
 * Tests that require auth check the login page is accessible and functional.
 * Tests that require task CRUD use a mock or stub if auth state can be injected.
 */

test.describe("Login page", () => {
  test("should display login page for unauthenticated users", async ({ page }) => {
    await page.goto("/");
    // The loading state shows first, then login page
    await expect(page.getByText("Task Tracker")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("Continue with Google")).toBeVisible({ timeout: 10000 });
  });

  test("should show sign-in description text", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Sign in to access your tasks")).toBeVisible({ timeout: 10000 });
  });

  test("should have correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Task Tracker/);
  });

  test("should render Continue with Google button", async ({ page }) => {
    await page.goto("/");
    const googleBtn = page.getByRole("button", { name: /Continue with Google/i });
    await expect(googleBtn).toBeVisible({ timeout: 10000 });
    await expect(googleBtn).toBeEnabled();
  });

  test("should show privacy message", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Your tasks are private")).toBeVisible({ timeout: 10000 });
  });
});

test.describe("App shell", () => {
  test("should not show white screen on initial load", async ({ page }) => {
    await page.goto("/");
    // Background should be dark (not white)
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    // rgb(10, 10, 10) = #0a0a0a
    expect(bgColor).not.toBe("rgb(255, 255, 255)");
  });

  test("should load without JS errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.goto("/");
    await page.waitForTimeout(2000);
    // Firebase connection errors are expected in test env without auth
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
});

test.describe("Responsive layout", () => {
  test("should render correctly at 375px (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByText("Task Tracker")).toBeVisible({ timeout: 10000 });
    // Ensure no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });
});
