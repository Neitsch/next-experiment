import { Builder, until, WebDriver } from "selenium-webdriver";
import axe, { AxeBuilder } from "axe-webdriverjs";

describe("Smoke", () => {
  let webdriver: WebDriver;
  beforeAll(async () => {
    webdriver = await new Builder().forBrowser("firefox").build();
  });
  beforeEach(async () => {
    await webdriver!.get("http://localhost:3000");
  });

  it("Title", async () => {
    await webdriver!.wait(until.titleIs("Condor Club"), 1000);
  });

  it("Axe", () => {
    return new Promise(resolve => {
      // @ts-ignore
      const AxeB = axe as AxeBuilder;
      // @ts-ignore
      new AxeB(webdriver!).analyze(result => {
        expect(result.violations).toHaveLength(0);
        resolve();
      });
    });
  });

  afterAll(async () => {
    webdriver!.quit();
  });
});
