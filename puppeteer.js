const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');

(async () => {
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
    console.log("Launched.")
    const page = await browser.newPage();
    console.log("Opened new page");
    page.setDefaultNavigationTimeout(0);
    await useProxy(page, 'http://admin:QRCqiLsDeY@165.227.80.239:8167');
    console.log("Connected to proxy.");
    await page.goto('https://testmy.net');
    console.log("Opened testmy.net");
    await page.$eval('#testBtnMn', el => el.click());
    await page.click('a[title="Upload & Download Speed Test"]');
    console.log("Speedtest started");
    await page.waitForNavigation({timeout: 0, waitUntil: "networkidle0"});
    console.log("Collecting data");
    await page.screenshot({ path: 'example.png' });
    const dwSiblings = await page.$$('.im-dnarw');
    const dwSibling = dwSiblings[0];
    const dwParent = (await dwSibling.$x('..'))[0]; // Element Parent
    const dwParentElement = await dwParent.getProperty("innerHTML")
    const dwParentHtml = dwParentElement.toString();
    const dwSpeedFull = dwParentHtml.replace(`JSHandle:<span class="icoImg im-dnarw" aria-hidden="true"></span> `, "");
    const dwSpeedArray = dwSpeedFull.split(" ");
    const dwSpeed = dwSpeedArray[0];
    const upSiblings = await page.$$('.im-uparw');
    const upSibling = upSiblings[0];
    const upParent = (await upSibling.$x('..'))[0]; // Element Parent
    const upParentElement = await upParent.getProperty("innerHTML")
    const upParentHtml = upParentElement.toString();
    const upSpeedFull = upParentHtml.replace(`JSHandle:<span class="icoImg im-uparw" aria-hidden="true"></span> `, "");
    const upSpeedArray = upSpeedFull.split(" ");
    const upSpeed = upSpeedArray[0];
    console.log(`Download speed: ${dwSpeed}`);
    console.log(`Upload speed: ${upSpeed}`);
})();