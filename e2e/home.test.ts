const { Builder, By, Key, until } = require("selenium-webdriver");

describe("Smoke", () => {
  it("Title", async () => {
    let driver = await new Builder().forBrowser("firefox").build();
    try {
      await driver.get("http://localhost:3000");
      await driver.wait(until.titleIs("My page"), 1000);
    } finally {
      await driver.quit();
    }
  });
});
