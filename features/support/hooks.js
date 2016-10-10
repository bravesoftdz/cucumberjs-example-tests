import fs from 'fs';
import path from 'path';
import sanitize from 'sanitize-filename';
import { World, getBrowser } from '../support/world';

export default function myHooks() {
  this.World = World;
  const browser = getBrowser();

  this.Before(function beforeAction(scenario, done) {
    this.browser.manage().deleteAllCookies();
    this.browser.manage().window().setSize(1024, 768);
    this.sleep(500);
    done();
  });

  this.After(function afterAction(scenario) {
    if (scenario.isFailed()) {
      this.browser.takeScreenshot().then((data) => {
        const base64Data = data.replace(/^data:image\/png;base64,/, '');
        fs.writeFile(path.join('screenshotsAndLogs', sanitize(`${scenario.getName()}.png`).replace(/ /g, '_')),
          base64Data, 'base64',
        );
      });

      this.browser.manage().logs().get('browser').then((log) => {
        fs.writeFile(path.join('screenshotsAndLogs', sanitize(`${scenario.getName()}.txt`).replace(/ /g, '_')),
          JSON.stringify(log, null, 2),
          (err) => {
            if (err) console.log(err);
          });
      });
    }
    return this.browser.manage().deleteAllCookies();
  });

  this.registerHandler('AfterFeatures', () => (browser.quit()));
}
