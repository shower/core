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

    'initially sets live region in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list.html#3`);
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'initially sets live region in `full` mode': browser => {
        browser.url(`${browser.launchUrl}/full.html#2`);
        browser.assert.containsText('.region h2', '2');
        browser.end();
    },

    'updates live region when moving forwards in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list.html#1`);
        browser.assert.containsText('.region h2', '1');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'updates live region when moving backwards in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list.html#3`);
        browser.assert.containsText('.region h2', '3');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '1');
        browser.end();
    },

    'updates live region when moving forwards in `full` mode': browser => {
        browser.url(`${browser.launchUrl}/full.html#1`);
        browser.assert.containsText('.region h2', '1');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'updates live region when moving backwards in `full` mode': browser => {
        browser.url(`${browser.launchUrl}/full.html#3`);
        browser.assert.containsText('.region h2', '3');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '1');
        browser.end();
    },
};
