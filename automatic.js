const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');
const axios = require('axios');

async function testSpeed(id, username, password, ip, port, mirror) {
    const browser = await puppeteer.launch({ headless: true, args: [`--proxy-server=http://${ip}:${port}`,
    '--disable-canvas-aa', // Disable antialiasing on 2d canvas
    '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
    // '--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
    '--disable-dev-shm-usage', // ???
    '--no-zygote', // wtf does that mean ?
    '--use-gl=swiftshader', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
    '--enable-webgl',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--disable-infobars',
    '--disable-breakpad',
    //'--ignore-gpu-blacklist',
    '--window-size=1280,1024', // see defaultViewport
    '--no-sandbox', // meh but better resource comsuption
    '--disable-setuid-sandbox'] });
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
        await page.setDefaultNavigationTimeout(0);
        await page.goto(`https://${mirror}.testmy.net`);
        await page.$eval('#testBtnMn', el => el.click());
        await page.click('a[title="Upload & Download Speed Test"]');
        console.log("Testing started")
        await page.waitForSelector('.im-dnarw', {timeout: 0});
        // await page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" });
        console.log("Collecting data");
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
        await sendTestResults(id, dwSpeed, upSpeed);
    } catch (e) {
        await sendTestResults(id, dwSpeed, upSpeed);
        // browser.close();
        console.log(e);
        console.log(`Check logs for errors, Download: ${dwSpeed}Mbps Upload: ${upSpeed}Mbps`);
    }
}

async function sendTestResults(id, dwSpeed, upSpeed) {
    const postResults = await axios.default.post(`https://api.mountproxies.com/api/speed_test_log/${id}/update`, { dwSpeed, upSpeed })
    console.log(postResults.data);
}

module.exports = testSpeed;