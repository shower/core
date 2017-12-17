'use strict';

module.exports = {
    '@tags': ['plugin', 'a11y'],

    'initially doesn’t add `application` role in list mode': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.assert.elementNotPresent('.shower[role=application]');
        browser.end();
    },

    'removes `application` role when switched to `list` mode': browser => {
        browser.url(`${browser.launchUrl}/full.html`);
        browser.sendKeys('.send-keys', browser.Keys.ESCAPE);
        browser.assert.elementNotPresent('.shower[role=application]');
        browser.end();
    },

    'initially adds `application` role in full screen mode': browser => {
        browser.url(`${browser.launchUrl}/full.html`);
        browser.assert.elementPresent('.shower[role=application]');
        browser.end();
    },

    'adds `application` role when switched to `full` mode': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.click('[id="1"]');
        browser.assert.elementPresent('.shower[role=application]');
        browser.end();
    },
};
