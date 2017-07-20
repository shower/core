'use strict';

module.exports = {
    '@tags': ['core'],

    'uses `list` mode in lack of any': browser => {
        browser.url(`${browser.launchUrl}/none.html`);
        browser.assert.elementPresent('.shower.list');
        browser.end();
    },

    'stays in `list` mode if `list` is present': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.assert.elementPresent('.shower.list');
        browser.end();
    },

    'stays in `full` mode if `full` is present': browser => {
        browser.url(`${browser.launchUrl}/full.html`);
        browser.assert.elementPresent('.shower.full');
        browser.end();
    },

    'keeps `full` mode after reload': browser => {
        browser.url(`${browser.launchUrl}/full.html`);
        browser.refresh();
        browser.assert.elementPresent('.shower.full');
        browser.end();
    },

    'adds IDs to all slides unless alredy set': browser => {
        browser.url(`${browser.launchUrl}/id.html`);
        browser.assert.elementPresent('[id="1"]');
        browser.assert.elementNotPresent('[id="2"]');
        browser.assert.elementPresent('#id');
        browser.assert.elementPresent('[id="3"]');
        browser.end();
    },

    'doesn’t set any slide states on init': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.assert.elementNotPresent('.active');
        browser.assert.elementNotPresent('.visited');
        browser.end();
    },

    'sets `active` state to a current slide only (not `visited`)': browser => {
        browser.url(`${browser.launchUrl}/id.html#id`);
        browser.assert.cssClassNotPresent('[id="1"]', 'active');
        browser.assert.cssClassNotPresent('[id="1"]', 'visited');
        browser.assert.cssClassPresent('#id', 'active');
        browser.assert.cssClassNotPresent('#id', 'visited');
        browser.assert.cssClassNotPresent('[id="3"]', 'active');
        browser.assert.cssClassNotPresent('[id="3"]', 'visited');
        browser.end();
    },

    // Action

    'goes to `full` mode when a slide is clicked': browser => {
        browser.url(`${browser.launchUrl}/list.html`);
        browser.click('[id="3"]');
        browser.assert.elementPresent('.shower.full');
        browser.end();
    },

    // Traverse

    'changes slides states when moving forward': browser => {
        browser.url(`${browser.launchUrl}/id.html#1`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);

        browser.assert.cssClassNotPresent('[id="1"]', 'active');
        browser.assert.cssClassPresent('[id="1"]', 'visited');
        browser.assert.cssClassNotPresent('#id', 'active');
        browser.assert.cssClassPresent('#id', 'visited');
        browser.assert.cssClassNotPresent('[id="3"]', 'visited');
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'changes slides states when moving backward': browser => {
        browser.url(`${browser.launchUrl}/id.html#3`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);

        browser.assert.cssClassNotPresent('[id="1"]', 'visited');
        browser.assert.cssClassPresent('[id="1"]', 'active');
        browser.assert.cssClassNotPresent('#id', 'active');
        browser.assert.cssClassPresent('#id', 'visited');
        browser.assert.cssClassNotPresent('[id="3"]', 'active');
        browser.assert.cssClassPresent('[id="3"]', 'visited');
        browser.end();
    },

    'changes slides states when moving forward and backward': browser => {
        browser.url(`${browser.launchUrl}/id.html#1`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);

        browser.assert.cssClassPresent('[id="1"]', 'active');
        browser.assert.cssClassPresent('[id="1"]', 'visited');
        browser.assert.cssClassNotPresent('#id', 'active');
        browser.assert.cssClassPresent('#id', 'visited');
        browser.assert.cssClassNotPresent('[id="3"]', 'active');
        browser.assert.cssClassPresent('[id="3"]', 'visited');
        browser.end();
    },

};
