import { Builder, By, until, WebDriver } from "selenium-webdriver";
// import axe, { AxeBuilder } from "axe-webdriverjs";

const email = String(process.env["SAMPLE_EMAIL"]);
const password = String(process.env["SAMPLE_PASSWORD"]);

describe("Smoke", () => {
  let webdriver: WebDriver;
  beforeAll(async () => {
    webdriver = await new Builder().forBrowser("firefox").build();
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
      try {
        // tslint:disable-next-line
        console.log(await webdriver!.getCurrentUrl());
        await webdriver!.wait(until.urlIs("http://localhost:3000/"), 80000);
      } catch (e) {
        // tslint:disable-next-line
        console.log(e);
        // tslint:disable-next-line
        console.log(await webdriver!.getCurrentUrl());
      }

      // Logout part
      await webdriver!.wait(until.elementLocated(By.id("accountButton")));
      await webdriver!.findElement(By.id("accountButton")).click();
      await webdriver!.findElement(By.id("logout")).click();
      await webdriver!.wait(until.elementLocated(By.id("login")));
    },
    100000,
  );
  afterAll(async () => {
    webdriver!.quit();
  });
});
