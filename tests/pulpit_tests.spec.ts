import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";

test.describe("Pulpit tests", () => {
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);

    const loginPage = new LoginPage(page);

    loginPage.login(username, userpassword);
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

  test("correct balance after successful mobile top-up", async ({ page }) => {
    // Arrange
    const receiverOption = "500 xxx xxx";
    const amount = "50";
    const initialBalance = await page.locator("#money_value").innerText();
    const expectedBalance = Number(initialBalance) - Number(amount);

    // Act
    await page.locator("#widget_1_topup_receiver").selectOption(receiverOption);
    await page.locator(".number").nth(1).fill(amount);
    await page.locator("#uniform-widget_1_topup_agreement span").click();
    await page.getByRole("button", { name: "doładuj telefon" }).click();
    await page.getByTestId("close-button").click();

    // Assert
    await expect(page.locator("#money_value")).toContainText(
      `${expectedBalance}`
    );
  });
});
