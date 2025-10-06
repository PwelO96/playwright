import { Locator, Page } from "@playwright/test";

export class PaymentPage {
  transferReceiver: Locator;
  transferAccount: Locator;
  transferAmount: Locator;
  transferButton: Locator;
  transferCloseButton: Locator;
  transferMessage: Locator;
  paymentButton: Locator;

  constructor(private page: Page) {
    this.paymentButton = this.page.getByRole("link", { name: "płatności" });

    this.transferReceiver = this.page.getByTestId("transfer_receiver");
    this.transferAccount = this.page.getByTestId("form_account_to");
    this.transferAmount = this.page.getByTestId("form_amount");
    this.transferButton = this.page.getByRole("button", {
      name: "wykonaj przelew",
    });
    this.transferCloseButton = this.page.getByTestId("close-button");
    this.transferMessage = this.page.locator("#show_messages");
  }
}
