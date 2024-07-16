const PolestarPage = require('../pageobjects/polestar.page');
const assert = require('assert'); // Add this line to import the assert module

function generateRandomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateRandomEmail() {
    const randomString = generateRandomString(10);
    return `${randomString}@example.com`;
}

function generateRandomPhoneNumber() {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) { // 10-digit phone number
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
}

function generateRandomZipCode() {
    const digits = '0123456789';
    let result = '';
    for (let i = 0; i < 5; i++) { // 5-digit zip code
        result += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    return result;
}

async function waitForElement(selector, timeout = 20000) {
    const start = new Date().getTime();
    let element;

    while ((new Date().getTime() - start) < timeout) {
        element = await $$(selector);
        if (element.length > 0) {
            return element;
        }
        await browser.pause(500); // Wait for 500ms before retrying
    }
    throw new Error(`Element with selector ${selector} not found within ${timeout}ms`);
}

describe('Navigate through Polestar website', () => {
    it('Click on Discover on Polestar homepage', async () => {
        await PolestarPage.open();
        await browser.pause(3000);
        await browser.maximizeWindow();

        // Accept cookies if displayed
        const acceptCookieButton = await $('#onetrust-accept-btn-handler');
        if (await acceptCookieButton.isDisplayed()) {
            console.log('Cookies page is displayed');
            await acceptCookieButton.click();
        } else {
            console.log('Cookies page is not displayed');
        }

        // Click on Discover
        const discoverSelector = await $('//span[@id="CI2U8EIPRDmNVTVRAr4P5Q"]//descendant::span[text()="Upptäck"]');
        await discoverSelector.waitForClickable({ timeout: 20000 });
        await discoverSelector.click();

        // Click on Trial Run using JavaScript
        const trialRunSelector = await $('//a[@class="css-1348ase"]//child::span[@class="css-ave74c"]//child::span[@class="css-1lfoa71" and text()="Provkörning"]');
        await trialRunSelector.scrollIntoView();
        await browser.pause(1000); // Pause to ensure the element is in view
        await browser.execute((element) => {
            element.click();
        }, trialRunSelector);

        // Model selection
        const modelSelection = await $('img.css-1wocpk[alt="Polestar 4"]'); 
        if (await modelSelection.isDisplayed()) {
            await modelSelection.waitForDisplayed({ timeout: 5000 });
            await modelSelection.click();
        } else {
            const scrollElement = await $('//img[@data-testid="selectable-card-ps4-image"]'); 
            await scrollElement.scrollIntoView();
            await scrollElement.waitForDisplayed({ timeout: 5000 });
            await scrollElement.click();
        }
       
        // Choose location
        const chooseLocationButton = await $('button.css-1o2h877[data-dd-action-name="at-polestar"]');
        await chooseLocationButton.waitForClickable({ timeout: 20000 });
        await chooseLocationButton.click();

        const locationButton = await $('//button[@class="css-1o2h877" and @data-testid="at-polestar-list-malmo"]');
        await locationButton.waitForClickable({ timeout: 20000 });
        await locationButton.click();

        // Choose time slot
        const dateSelectors = await waitForElement('//button[@data-testid="selectable-date"]');
        const firstDateSelector = dateSelectors[0];
        await browser.execute((element) => {
            element.scrollIntoView();
        }, firstDateSelector);
        await firstDateSelector.waitForClickable({ timeout: 20000 });
        await firstDateSelector.click();

        // Fill in form with random values
        const fillInput = async (selector, value) => {
            const input = await $(selector);
            await input.setValue(value);
            const inputValue = await input.getValue();
            console.log(`User input text (${selector}):`, inputValue);
        };

        await fillInput('//input[@id="firstname" and @data-testid="firstname"]', generateRandomString(10));
        await fillInput('//input[@id="lastname" and @data-testid="lastname"]', generateRandomString(10));
        await fillInput('//input[@id="email" and @data-testid="email"]', generateRandomEmail());
        await fillInput('//input[@id="phone" and @data-testid="phone"]', generateRandomPhoneNumber());
        await fillInput('//input[@id="postal-code" and @data-testid="postal-code"]', generateRandomZipCode());
        await browser.execute(() => {
            window.scrollBy(0, 200); 
        });

        // Select dropdown option
        const dropdownSelectors = await waitForElement('//div[@class="css-1b3loew"]//descendant::label[@class="css-9pq9cn" and @tabindex="-1"]');
        const dropdown = dropdownSelectors[1];
        await dropdown.waitForClickable({ timeout: 20000 });
        await dropdown.click();

        const option = await $('//button[@data-index="0" and @class="css-jxfe2"]');
        await option.waitForExist({ timeout: 20000 });
        await option.waitForDisplayed({ timeout: 20000 });
        await option.click();

        // Accept legal documents and book test drive
        const checkbox = await $('//input[@id="checkbox-legalDocumentsAccepted"]');
        await checkbox.scrollIntoView();
        await checkbox.click();

        await browser.pause(3000); // Add a brief pause to ensure the checkbox is clicked

        const bookTestDriveButton = await $('//span[text()="Bekräfta din bokning"]');
        await bookTestDriveButton.scrollIntoView();
        await bookTestDriveButton.waitForClickable({ timeout: 20000 });
        await bookTestDriveButton.click();
    });

    it('validate if booking is confirmed', async () => {
        // Add wait and screenshot for debugging
        await browser.pause(5000); // Wait for 5 seconds to ensure the page is fully loaded
        await browser.saveScreenshot('./screenshots/confirmation_page.png'); // Save screenshot for debugging

        const confirmationSelector = await $('div.css-meld6a+h2.css-1euduvz');
        await confirmationSelector.waitForDisplayed({ timeout: 20000 });
        const confirmationText = await confirmationSelector.getText();
        assert.strictEqual(confirmationText, "Din Polestar-provkörning är nu bekräftad", "The expected text is not displayed");
    });
});
