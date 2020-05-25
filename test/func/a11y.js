'use strict';

const testShower = require('../func-test-shower');

module.exports = {
    '@tags': ['a11y'],

    'initially doesn’t add "application" role in "list" mode': (browser) => {
        browser.url(testShower());
        browser.assert.attributeEquals('.shower', 'role', null);
        browser.end();
    },

    'removes "application" role when switched to "list" mode': (browser) => {
        browser.url(testShower({ mode: 'full' }));
        browser.sendKeys('.send-keys', browser.Keys.ESCAPE);
        browser.assert.attributeEquals('.shower', 'role', null);
        browser.end();
    },

    'initially adds "application" role in "full" mode': (browser) => {
        browser.url(testShower({ mode: 'full' }));
        browser.assert.attributeEquals('.shower', 'role', 'application');
        browser.end();
    },

    'adds "application" role when switched to "full" mode': (browser) => {
        browser.url(testShower());
        browser.click('#s1');
        browser.assert.attributeEquals('.shower', 'role', 'application');
        browser.end();
    },

    'initially sets live region in "list" mode': (browser) => {
        browser.url(testShower({ urlHash: 's3' }));
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'initially sets live region in "full" mode': (browser) => {
        browser.url(testShower({ mode: 'full', urlHash: 's2' }));
        browser.assert.containsText('.region h2', '2');
        browser.end();
    },

    'updates live region when moving forwards in "list" mode': (browser) => {
        browser.url(testShower({ urlHash: 's1' }));
        browser.assert.containsText('.region h2', '1');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'updates live region when moving backwards in "list" mode': (browser) => {
        browser.url(testShower({ urlHash: 's3' }));
        browser.assert.containsText('.region h2', '3');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '1');
        browser.end();
    },

    'updates live region when moving forwards in "full" mode': (browser) => {
        browser.url(testShower({ mode: 'full', urlHash: 's1' }));
        browser.assert.containsText('.region h2', '1');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.assert.containsText('.region h2', '3');
        browser.end();
    },

    'updates live region when moving backwards in "full" mode': (browser) => {
        browser.url(testShower({ mode: 'full', urlHash: 's3' }));
        browser.assert.containsText('.region h2', '3');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '2');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.containsText('.region h2', '1');
        browser.end();
    },
};
