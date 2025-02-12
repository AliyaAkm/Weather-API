const puppeteer = require('puppeteer');
const { startServer, closeServer } = require('../server');

let browser, page;

describe('E2E Login Test', () => {
    beforeAll(async () => {
        startServer();
        browser = await puppeteer.launch({
            headless: false ,
            defaultViewport: null, 
            args: ['--start-maximized']
        });
        page = await browser.newPage();
        await page.goto('http://localhost:3001/login');

        await page.type('#email', 'aakm25305@gmail.com');
        await page.type('#password', '1234');
        await page.click('button[type="submit"]');

        await page.waitForSelector('#otp-section', { visible: true });
        await page.type('#otp', '0000');
        await page.click('#verify-btn');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });
    }, 20000);

    test('Successful Login and OTP Verification', async () => {
        const currentUrl = page.url();
        expect(currentUrl).toContain('/index.html');

        const welcomeMessage = await page.$eval('#welcomeMessage', el => el.textContent);
        expect(welcomeMessage).toMatch(/Добро пожаловать!/);
    }, 15000);

    afterAll(async () => {
        // ✅ Задержка перед закрытием браузера (5 секунд)
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (page) await page.close();
        if (browser) await browser.close();
        await closeServer();
    });
});
