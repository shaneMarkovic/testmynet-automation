const puppeteer = require('puppeteer');
const useProxy = require('puppeteer-page-proxy');
const axios = require('axios');

class Test {
    constructor(id, username, password, ip, port, mirror) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.ip = ip;
        this.port = port;
        this.mirror = mirror;
        this.dwSpeed = 0;
        this.upSpeed = 0;
        this.numberOfTests = 0;
    }

    testSpeed = async () => {
        const browser = await puppeteer.launch({
            ignoreHTTPSErrors: true,
            headless: true, args: [`--proxy-server=http://${this.ip}:${this.port}`,
                '--no-sandbox', // meh but better resource comsuption
                '--disable-setuid-sandbox',
                '--enable-logging=stderr',
                '--v=1',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ]
        });
        console.log("Launched.")
        try {
            this.numberOfTests++;
            const page = await browser.newPage();
            await page.authenticate({
                username: this.username,
                password: this.password,
            });
            console.log("Authenticated");
            await page.setDefaultNavigationTimeout(60000);
            await page.goto(`https://${this.mirror}.testmy.net`);
            await page.$eval('#testBtnMn', el => el.click());
            await page.click('a[title="Upload & Download Speed Test"]');
            console.log("Testing started")
            await page.waitForSelector('.im-dnarw', { timeout: 180000 });
            // await page.waitForNavigation({ timeout: 0, waitUntil: "networkidle0" });
            console.log("Collecting data");
            const dwSiblings = await page.$$('.im-dnarw');
            const dwSibling = dwSiblings[0];
            const dwParent = (await dwSibling.$x('..'))[0]; // Element Parent
            const dwParentElement = await dwParent.getProperty("innerHTML")
            const dwParentHtml = dwParentElement.toString();
            const dwSpeedFull = dwParentHtml.replace(`JSHandle:<span class="icoImg im-dnarw" aria-hidden="true"></span> `, "");
            const dwSpeedArray = dwSpeedFull.split(" ");
            this.dwSpeed = dwSpeedArray[0];
            const upSiblings = await page.$$('.im-uparw');
            const upSibling = upSiblings[0];
            const upParent = (await upSibling.$x('..'))[0]; // Element Parent
            const upParentElement = await upParent.getProperty("innerHTML")
            const upParentHtml = upParentElement.toString();
            const upSpeedFull = upParentHtml.replace(`JSHandle:<span class="icoImg im-uparw" aria-hidden="true"></span> `, "");
            const upSpeedArray = upSpeedFull.split(" ");
            this.upSpeed = upSpeedArray[0];
            console.log(`Download speed: ${this.dwSpeed}`);
            console.log(`Upload speed: ${this.upSpeed}`);
            browser.close();
            await sendTestResults(this.id, this.dwSpeed, this.upSpeed);
        } catch (e) {
            if (this.numberOfTests < 3) {
                browser.close();
                console.log(`Repeating Test for ${this.id}`);
                await this.testSpeed();
            } else {
                browser.close();
                await sendTestResults(this.id, this.dwSpeed, this.upSpeed);
                console.log(e);
                console.log(`Check logs for errors, Download: ${this.dwSpeed}Mbps Upload: ${this.upSpeed}Mbps`);
            }
        }
    }
}

class Queue {
    constructor() { };

    tests = [];

    runTests = async () => {
        const nextTest = this.tests[0];
        const test = new Test(nextTest.id, nextTest.username, nextTest.password, nextTest.ip, nextTest.port, nextTest.mirror);
        await test.testSpeed();
        this.tests.pop();
        if(this.tests.length) {
            this.runTests();
        }
    }

    addTest = (id, username, password, ip, port, mirror) => {
        this.tests.push({ id, username, password, ip, port, mirror });
        console.log(this.tests)
        if(this.tests.length == 1) {
            this.runTests();
        }
    }
}



async function testSpeed(id, username, password, ip, port, mirror) {

}

async function sendTestResults(id, dwSpeed, upSpeed) {
    const postResults = await axios.default.post(`https://api.mountproxies.com/api/speed_test_log/${id}/update`, { dwSpeed, upSpeed })
    console.log(postResults.data);
}

module.exports = Queue;