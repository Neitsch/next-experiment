const { Builder, By, Key, until } = require("selenium-webdriver");

describe("Smoke", () => {
  let webdriver = null;
  beforeAll(async () => {
    webdriver = await new Builder().forBrowser("firefox").build();
  });
  beforeEach(async () => {
    await webdriver.get("http://localhost:3000");
  });

  it("Title", async () => {
    await webdriver.wait(until.titleIs("Condor Club"), 1000);
  });

  afterAll(async () => {
    webdriver.quit();
  });
});
