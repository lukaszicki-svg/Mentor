import { expect, test } from "@playwright/test";

test("home page loads and renders the starter heading", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Your Next.js app is ready.");
});
