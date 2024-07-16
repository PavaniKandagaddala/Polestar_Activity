const PolestarPage = require('../pageobjects/polestar.page');

describe('Polestar website', () => {
    it('should open the Polestar homepage', async () => {
        await PolestarPage.open();
        await browser.pause(3000); // pause to ensure the page loads properly
        const title = await browser.getTitle();
        console.log('Page title is: ' + title);
        expect(title).toContain('Polestar');
        const accept_cookie_button = await $('#onetrust-accept-btn-handler');
        if (await accept_cookie_button.isDisplayed()) {
            console.log('Cookies page is displayed');
            // Perform some actions
            await accept_cookie_button.click();
        } else {
            console.log('Cookies page is not displayed');
            // Perform alternative actions
        }
    });
    it('scroll to the covered car image', async () => {
        const Scroll_element = await $('//span[text()="Bli den första som får veta"]'); 
        await Scroll_element.scrollIntoView();
        await browser.pause(3000); 
        console.log('Page scrolled to the required image');
    });
});
