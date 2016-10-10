import fs from 'fs';
import webdriver from 'selenium-webdriver';
import chai from 'chai';
import config from './config.json';

const platform = process.env.PLATFORM || 'CHROME';

let host = (config.serverHost || 'http://localhost');

if (process.env.WEBSITE_HOST) {
  host = 'http://' + process.env.WEBSITE_HOST;
}

const port = process.env.HTTP_PORT || config.serverPort || '8008';

export const HOST = `${host}:${port}`;

let browser = null;

const buildAndroidBrowser = ()=>new webdriver.Builder()
  .usingServer('http://localhost:4723/wd/hub')
  .withCapabilities({
    platformName: 'Android',
    platformVersion: '4.4',
    deviceName: 'Android Emulator',
    browserName: 'Chrome'
  })
  .build();

const buildChromeBrowser = () => new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

const buildFirefoxBrowser = () => new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.firefox())
  .build();

const buildPhantomJSBrowser = () => new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.phantomjs())
  .build();

const buildRemoteBrowser = () => new webdriver.Builder()
  .usingServer(`http://${process.env.SELENIUM_HOST}:4444/wd/hub`)
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

switch (platform) {
  case 'ANDROID':
    browser = buildAndroidBrowser();
    break;
  case 'FIREFOX':
    browser = buildFirefoxBrowser();
    break;
  case 'PHANTOM_JS':
    browser = buildPhantomJSBrowser();
    break;
  case 'HEADLESS':
    browser = buildRemoteBrowser();
    break;
  default:
    browser = buildChromeBrowser();
}

browser.manage().timeouts().setScriptTimeout(15000);
browser.manage().timeouts().pageLoadTimeout(5000);

browser.manage().window().setSize(1024, 768);

const getBrowser = () => browser;

const World = function World() {
  const defaultTimeout = 10000;
  const screenshotPath = 'screenshotsAndLogs';

  this.webdriver = webdriver;
  this.browser = browser;
  this.HOST = HOST;

  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath);
  }

  const chaiWebdriver = require('chai-webdriver-promised');

  chai.use(chaiWebdriver(this.browser, defaultTimeout, 100));

  this.waitFor = function (cssLocator, timeout) {
    const waitTimeout = timeout || defaultTimeout;
    return browser.wait(() => browser.isElementPresent({css: cssLocator}), waitTimeout);
  };

  this.sleep = (milliseconds) => {
    const start = new Date().getTime();
    while (true) {
      if ((new Date().getTime() - start) > milliseconds) break;
    }
  };

  this.setField = function (fieldSelector, newValue) {
    this.browser.findElement({ css: fieldSelector }).clear();
    this.sleep(500);
    return this.browser.findElement({ css: fieldSelector }).sendKeys(newValue ? newValue : '');
  };

  this.click = function (fieldSelector) {
    this.waitFor(fieldSelector);
    return this.browser.findElement({ css: fieldSelector }).click();
  };
};

module.exports.World = World;
module.exports.getBrowser = getBrowser;
