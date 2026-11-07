
const { chromium } = require('playwright');

async function main() {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    await page.goto('https://chatgpt.com/');

    const title = await page.title();

    console.log('Page title:', title);

    if (title === 'ChatGPT: Chat, Work, Create & Code with AI') {
        console.log('TEST PASSED');
    } else {
        console.log('TEST FAILED');
    }

    await browser.close();
}

main().catch(console.error);
