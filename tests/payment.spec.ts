import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";

test.describe("Payment tests", () => {
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);

    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill(userpassword);
    await page.getByTestId("login-button").click();
    await page.getByRole("link", { name: "płatności" }).click();
  });

  test("simple payment", async ({ page }) => {
    // Arrange
    const transferReceiver = "Jan Nowak";
    const transferAmount = "222";
    const transferAccount = "12 3456 7890 1234 5678 9012 35679";
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN`;

    // Act
    await page.getByTestId("transfer_receiver").fill(transferReceiver);
    await page.getByTestId("form_account_to").fill(transferAccount);
    await page.getByTestId("form_amount").fill(transferAmount);
    await page.getByRole("button", { name: "wykonaj przelew" }).click();
    await page.getByTestId("close-button").click();

    //Assert
    await expect(page.locator("#show_messages")).toContainText(expectedMessage);
  });
});
