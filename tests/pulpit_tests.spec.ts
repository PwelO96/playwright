import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PulpitPage } from "../pages/pulpit.pages";

test.describe("Pulpit tests", () => {
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;
  let pulpitPage: PulpitPage;

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);

    const loginPage = new LoginPage(page);
    pulpitPage = new PulpitPage(page);

    loginPage.login(username, userpassword);
  });

  test("quick payment with correct data", async () => {
    await pulpitPage.transferReceiverInput.selectOption("2");
    await pulpitPage.transferAmountInput.fill("120");
    await pulpitPage.transferTitleInput.fill("zwrot");

    await pulpitPage.transferButton.click();
    await pulpitPage.actionCloseButton.click();

    await expect(pulpitPage.messageText).toContainText("Przelew wykonany");
  });

  test("quick phone account update with correct data", async () => {
    // Arrange
    const receiverOption = "500 xxx xxx";
    const amount = "50";

    // Act
    await pulpitPage.phoneTopUp(receiverOption, amount);

    // Assert
    await expect(pulpitPage.messageText).toContainText("Doładowanie wykonane");
  });

  test("correct balance after successful mobile top-up", async () => {
    // Arrange
    const receiverOption = "500 xxx xxx";
    const amount = "50";
    const initialBalance = await pulpitPage.moneyValueText.innerText();
    const expectedBalance = Number(initialBalance) - Number(amount);

    // Act
    await pulpitPage.phoneTopUp(receiverOption, amount);

    // Assert
    await expect(pulpitPage.moneyValueText).toContainText(`${expectedBalance}`);
  });
});
