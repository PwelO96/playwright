import { test, expect } from "@playwright/test";

test.describe("Pulpit tests", () => {
  const URL = "https://demo-bank.vercel.app";
  const username = "tester12";
  const userpassword = "12345678";

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);

    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill(userpassword);
    await page.getByTestId("login-button").click();
  });

  test("quick payment with correct data", async ({ page }) => {
    await page.locator("#widget_1_transfer_receiver").selectOption("2");
    await page.locator("#widget_1_transfer_amount").fill("120");
    await page.locator("#widget_1_transfer_title").fill("zwrot");

    await page.getByRole("button", { name: "wykonaj" }).click();
    await page.getByTestId("close-button").click();

    await expect(page.locator("#show_messages")).toContainText(
      "Przelew wykonany"
    );
  });

  test("quick phone account update with correct data", async ({ page }) => {
    const receiverOption = "500 xxx xxx";
    const amount = "50";

    await page.locator("#widget_1_topup_receiver").selectOption(receiverOption);
    await page.locator(".number").nth(1).fill(amount);
    await page.locator("#uniform-widget_1_topup_agreement span").click();
    await page.getByRole("button", { name: "doładuj telefon" }).click();
    await page.getByTestId("close-button").click();

    await expect(page.locator("#show_messages")).toContainText(
      "Doładowanie wykonane"
    );
  });

  test.only("correct balance after successful mobile top-up", async ({
    page,
  }) => {
    const receiverOption = "500 xxx xxx";
    const amount = "50";
    const initialBalance = await page.locator("#money_value").innerText();
    const expectedBalance = Number(initialBalance) - Number(amount);

    await page.locator("#widget_1_topup_receiver").selectOption(receiverOption);
    await page.locator(".number").nth(1).fill(amount);
    await page.locator("#uniform-widget_1_topup_agreement span").click();
    await page.getByRole("button", { name: "doładuj telefon" }).click();
    await page.getByTestId("close-button").click();

    await expect(page.locator("#money_value")).toContainText(
      `${expectedBalance}`
    );
  });
});
