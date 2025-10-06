import { test, expect } from "@playwright/test";
import { loginData } from "../test-data/login.data";
import { LoginPage } from "../pages/login.page";
import { PaymentPage } from "../pages/payment.pages";
import { PulpitPage } from "../pages/pulpit.pages";

test.describe("Payment tests", () => {
  const URL = "https://demo-bank.vercel.app";
  const username = loginData.username;
  const userpassword = loginData.password;

  test.beforeEach(async ({ page }) => {
    await page.goto(URL);

    const loginPage = new LoginPage(page);

    loginPage.login(username, userpassword);

    const pulpitPage = new PulpitPage(page);
    await pulpitPage.sideMenuComponent.paymentButton.click();
  });

  test("simple payment", async ({ page }) => {
    // Arrange
    const transferReceiver = "Jan Nowak";
    const transferAccount = "12 3456 7890 1234 5678 9012 35679";
    const transferAmount = "222";
    const expectedMessage = `Przelew wykonany! ${transferAmount},00PLN`;

    // Act
    const paymentPage = new PaymentPage(page);
    paymentPage.makeTransfer(transferReceiver, transferAccount, transferAmount);

    //Assert
    await expect(paymentPage.transferMessage).toContainText(expectedMessage);
  });
});
