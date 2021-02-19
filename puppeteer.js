const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');

async function testSpeed(username, password, ip, port) {
    const browser = await puppeteer.launch({ headless: true, args: [ '--proxy-server=http://157.230.184.117:8225' ] });
    let dwSpeed = 0;
    let upSpeed = 0;
    console.log("Launched.")
    try {
        const page = await browser.newPage();
        await page.authenticate({
            username: "admin",
            password: "mhZdFu7H2R",
        });
        console.log("Opened new page");
        page.setDefaultNavigationTimeout(0);
        // await useProxy(page, `socks5://${ip}:${port}`);
        console.log("Connected to proxy.");
        await page.goto('https://testmy.net/mirror?testServer=fl');
        
        console.log("Selected mirror florida");
        await page.goto('https://testmy.net/download');
        console.log("Opened downlaod test");
        await page.select('select[name="s"]', '25MB');
        console.log("Download started")
        await page.waitForNavigation({ timeout: 0, waitUntil: "networkidle2" });
        const dwSiblings = await page.$$('.im-dnarw');
        const dwSibling = dwSiblings[0];
        const dwParent = (await dwSibling.$x('..'))[0]; // Element Parent
        const dwParentElement = await dwParent.getProperty("innerHTML")
        const dwParentHtml = dwParentElement.toString();
        const dwSpeedFull = dwParentHtml.replace(`JSHandle:<span class="icoImg im-dnarw" aria-hidden="true"></span> <span class="color22">`, "").replace("</span>").split(" ");
        dwSpeed = dwSpeedFull[0];
        console.log(dwSpeed);
        await page.goto('https://testmy.net/upload');
        console.log("Opened upload test");
        await page.select('select[name="s"]', '25MB');
        console.log("Upload started")
        await page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" });
        const upSiblings = await page.$$('.im-uparw');
        const upSibling = upSiblings[0];
        const upParent = (await upSibling.$x('..'))[0]; // Element Parent
        const upParentElement = await upParent.getProperty("innerHTML")
        const upParentHtml = upParentElement.toString();
        const upSpeedFull = upParentHtml.replace(`JSHandle:<span class="icoImg im-uparw" aria-hidden="true"></span> <span class="color23">`, "").replace("</span>").split(" ");
        upSpeed = upSpeedFull[0];
        console.log(upSpeed);
        // browser.close();
    } catch(e) {
        // browser.close();
        console.log(e);
        throw new Error(`Check logs for errors, Download: ${dwSpeed}Mbps Upload: ${upSpeed}Mbps`);
    }
    return { dwSpeed, upSpeed };
}

module.exports = testSpeed;