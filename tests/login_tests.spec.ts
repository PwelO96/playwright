import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";

test.describe("User login to Demobank", () => {
  // Arrange
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;

  test("successful login with correct credentials", async ({ page }) => {
    // Act
    await page.goto(URL);
    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill(userpassword);
    await page.getByTestId("login-button").click();

    // Assert
    await expect(page.getByTestId("user-name")).toHaveText("Jan Demobankowy");
  });

  test("unsuccessful login with too short username", async ({ page }) => {
    await page.goto(URL);
    await page.getByTestId("login-input").fill("test");
    await page.getByTestId("login-input").blur();

    await expect(page.getByTestId("error-login-id")).toHaveText(
      "identyfikator ma min. 8 znaków"
    );
  });

  test("unsuccessful login with too short password", async ({ page }) => {
    await page.goto(URL);
    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill("12345");
    await page.getByTestId("password-input").blur();

    await expect(page.getByTestId("error-login-password")).toHaveText(
      "hasło ma min. 8 znaków"
    );
  });
});
