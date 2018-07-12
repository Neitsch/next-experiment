const { Builder, until } = require("selenium-webdriver");
const axeBuilder = require("axe-webdriverjs");

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

  it("Axe", () => {
    return new Promise(resolve => {
      axeBuilder(webdriver).analyze(result => {
        expect(result.violations).toHaveLength(0);
        resolve();
      });
    });
  });

  afterAll(async () => {
    webdriver.quit();
  });
});
