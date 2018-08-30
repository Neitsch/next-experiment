import { Builder, until, WebDriver, promise } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox";
import axe, { AxeBuilder } from "axe-webdriverjs";

promise.USE_PROMISE_MANAGER = false;

describe("Smoke", () => {
  let webdriver: WebDriver;
  beforeAll(async () => {
    const opts = new firefox.Options();
    opts.headless();
    console.log("Pre setup");
    let inst = new Builder();
    console.log("Started Builder");
    inst = inst.forBrowser("firefox");
    console.log("Configured browser");
    inst = inst.setFirefoxOptions(opts);
    console.log("Set opts");
    webdriver = await inst.build();
    console.log("Awaited webdriver");
  });
  beforeEach(async () => {
    await webdriver!.get("http://localhost:3000");
  }, 20000);

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
