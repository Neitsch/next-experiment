import { Builder, By, until, WebDriver, promise } from "selenium-webdriver";
import * as firefox from "selenium-webdriver/firefox";
// import axe, { AxeBuilder } from "axe-webdriverjs";

jest.setTimeout(10000);
promise.USE_PROMISE_MANAGER = false;

const email = String(process.env["SAMPLE_EMAIL"]);
const password = String(process.env["SAMPLE_PASSWORD"]);

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
    await webdriver!.get("http://localhost:3000/auth/sign-in");
    await webdriver!.wait(function() {
      return webdriver!
        .executeScript("return document.readyState")
        .then(function(readyState) {
          return readyState === "complete";
        });
    });
  }, 20000);

  it(
    "Login and Logout",
    async () => {
      // Login part
      await webdriver!.wait(until.elementLocated(By.name("email")));
      await webdriver!.wait(until.elementLocated(By.name("password")));
      await webdriver!.wait(until.elementLocated(By.name("submit")));
      let emailComponent = await webdriver!.findElement(By.name("email"));
      let passwordComponent = await webdriver!.findElement(By.name("password"));
      let submitComponent = await webdriver!.findElement(By.name("submit"));
      await webdriver!.wait(until.elementIsVisible(emailComponent));
      await webdriver!.wait(until.elementIsVisible(passwordComponent));
      await webdriver!.wait(until.elementIsVisible(submitComponent));
      await emailComponent.sendKeys(email);
      await passwordComponent.sendKeys(password);
      await submitComponent.click();
      await webdriver!.wait(until.urlIs("http://localhost:3000/"), 30000);

      // Logout part
      await webdriver!.wait(until.elementLocated(By.id("accountButton")));
      await webdriver!.findElement(By.id("accountButton")).click();
      await webdriver!.wait(until.elementLocated(By.id("logout")));
      const logout = await webdriver!.findElement(By.id("logout"));
      await webdriver!.wait(until.elementIsVisible(logout));
      await logout.click();
      await webdriver!.wait(until.elementLocated(By.id("login")));
    },
    40000,
  );
  afterAll(async () => {
    webdriver!.quit();
  });
});
