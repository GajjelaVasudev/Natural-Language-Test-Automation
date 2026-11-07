require('dotenv').config();
const { chromium } = require('playwright');
const { findElement } = require('./locatorResolver');

async function executeTest(testPlan) {
    const browser = await chromium.launch({
        headless: false
    });

    const page = await browser.newPage();

    try {
        for (const step of testPlan.steps) {
            console.log(
                `Executing: ${step.action} - ${step.target}`
            );

            switch (step.action) {

                case 'navigate': {
                    const url = new URL(step.value);

                    if (!['http:', 'https:'].includes(url.protocol)) {
                        throw new Error('Only HTTP and HTTPS URLs are allowed.');
                    }

                    await page.goto(step.value, {
                        waitUntil: 'domcontentloaded'
                    });

                    break;
                }

                case 'assertPageLoaded': {
                    await page.waitForLoadState('domcontentloaded');

                    await page.locator('body').waitFor({
                        state: 'visible',
                        timeout: 10000
                    });

                    const pageTitle = await page.title();

                    console.log('Page loaded:', page.url());
                    console.log('Page title:', pageTitle);

                    break;
                }

                case 'fill': {
                    let inputValue = step.value;

                    // Replace environment variable placeholders
                    const envMatch = inputValue.match(/^\{\{(.+)\}\}$/);

                    if (envMatch) {
                        const envName = envMatch[1];
                        inputValue = process.env[envName];

                        if (!inputValue) {
                            throw new Error(`Environment variable ${envName} is missing.`);
                        }
                    }

                    const element = await findElement(page, step.target, 'input');

                    await element.fill(inputValue);

                    console.log('Text entered:', step.target);

                    break;
                }

                case 'click': {
                    const element = await findElement(page, step.target, 'any');

                    await element.click();

                    console.log('Clicked:', step.target);

                    break;
                }

                case 'assertVisible': {
                    if (!step.target.trim()) {
                        throw new Error(
                            'A target is required for assertVisible.'
                        );
                    }

                    await page.getByText(step.target).first().waitFor({
                        state: 'visible',
                        timeout: 10000
                    });

                    console.log('Visible:', step.target);

                    break;
                }

                case 'assertText': {
                    if (!step.expected.trim()) {
                        throw new Error(
                            'Expected text is required for assertText.'
                        );
                    }

                    await page.getByText(step.expected).first().waitFor({
                        state: 'visible',
                        timeout: 10000
                    });

                    console.log('Expected text found:', step.expected);

                    break;
                }

                default:
                    throw new Error(
                        `Unsupported action: ${step.action}`
                    );
            }
        }

        console.log('\nTEST PASSED');

    } catch (error) {
        console.error('\nTEST FAILED:', error.message);
        throw error;

    } finally {
        await browser.close();
    }
}

module.exports = { executeTest };
