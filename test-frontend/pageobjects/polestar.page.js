class PolestarPage {
    open () {
        return browser.url('https://www.polestar.com/se/');
    }
}

module.exports = new PolestarPage;
