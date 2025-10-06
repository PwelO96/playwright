import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PulpitPage } from "../pages/pulpit.pages";

test.describe("User login to Demobank", () => {
  // Arrange
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;
  const expectedUserName = "Jan Demobankowy";
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
  });

  test("successful login with correct credentials", async ({ page }) => {
    // Act
    await page.goto(URL);
    await loginPage.login(username, userpassword);

    // Assert
    const pulpitPage = new PulpitPage(page);
    await expect(pulpitPage.userNameText).toHaveText(expectedUserName);
  });

  test("unsuccessful login with too short username", async ({ page }) => {
    // Arrange
    const incorrectUsername = "test";

    // Act
    await page.goto(URL);

    await loginPage.loginInput.fill(incorrectUsername);
    await loginPage.loginInput.blur();

    // Assert
    await expect(loginPage.loginError).toHaveText(
      "identyfikator ma min. 8 znaków"
    );
  });

  test("unsuccessful login with too short password", async ({ page }) => {
    // Arrange
    const incorrectPassword = "12345";

    // Act
    await page.goto(URL);

    await loginPage.loginInput.fill(username);
    await loginPage.passwordInput.fill(incorrectPassword);
    await loginPage.passwordInput.blur();

    // Assert
    await expect(loginPage.passwordError).toHaveText("hasło ma min. 8 znaków");
  });
});
