'use strict';

module.exports = {
    '@tags': ['a11y'],

    'doesn’t add `application` role in list mode': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.assert.elementNotPresent('.shower[role=application]');
        browser.end();
    },

    'adds `application` role in full screen mode': browser => {
        browser.url(`${browser.launchUrl}/full.html`);
        browser.assert.elementPresent('.shower[role=application]');
        browser.end();
    },
};
