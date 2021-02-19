const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');

async function testSpeed(username, password, ip, port, mirror) {
    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${ip}:${port}`] });
    let dwSpeed = 0;
    let upSpeed = 0;
    console.log("Launched.")
    try {
        const page = await browser.newPage();
        await page.authenticate({
            username,
            password,
        });
        console.log("Authenticated");
        await page.goto(`https://${mirror}.testmy.net`);
        await page.$eval('#testBtnMn', el => el.click());
        await page.click('a[title="Upload & Download Speed Test"]');
        console.log("Testing started")
        await page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" });
        console.log("Collecting data");
        await page.screenshot({ path: 'example.png' });
        const dwSiblings = await page.$$('.im-dnarw');
        const dwSibling = dwSiblings[0];
        const dwParent = (await dwSibling.$x('..'))[0]; // Element Parent
        const dwParentElement = await dwParent.getProperty("innerHTML")
        const dwParentHtml = dwParentElement.toString();
        const dwSpeedFull = dwParentHtml.replace(`JSHandle:<span class="icoImg im-dnarw" aria-hidden="true"></span> `, "");
        const dwSpeedArray = dwSpeedFull.split(" ");
        dwSpeed = dwSpeedArray[0];
        const upSiblings = await page.$$('.im-uparw');
        const upSibling = upSiblings[0];
        const upParent = (await upSibling.$x('..'))[0]; // Element Parent
        const upParentElement = await upParent.getProperty("innerHTML")
        const upParentHtml = upParentElement.toString();
        const upSpeedFull = upParentHtml.replace(`JSHandle:<span class="icoImg im-uparw" aria-hidden="true"></span> `, "");
        const upSpeedArray = upSpeedFull.split(" ");
        upSpeed = upSpeedArray[0];
        console.log(`Download speed: ${dwSpeed}`);
        console.log(`Upload speed: ${upSpeed}`);
        browser.close();
    } catch (e) {
        browser.close();
        console.log(e);
        throw new Error(`Check logs for errors, Download: ${dwSpeed}Mbps Upload: ${upSpeed}Mbps`);
    }
    return { dwSpeed, upSpeed };
}

module.exports = testSpeed;