'use strict';

const TIMING = 1100;

function keydown() {
    const event = new KeyboardEvent('keydown', {
        key: 'a',
        bubbles: true,
    });

    document.body.dispatchEvent(event);
}

module.exports = {
    '@tags': ['plugin', 'timer'],

    'does not activate on page load in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list-timer.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'does not activate when moving forwards in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list-timer.html#1`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'does not activate when moving backwards in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list-timer.html#3`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'activates on page load': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'activates when moving forwards': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#1`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_RIGHT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'activates when moving backwards': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#3`);
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'works only once': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.sendKeys('.send-keys', browser.Keys.ARROW_LEFT);
        browser.assert.cssClassPresent('[id="2"]', 'visited');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'gets cancelled by key press': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#2`);
        browser.execute(keydown);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    '[nested steps] activates on page load': browser => {
        browser.url(`${browser.launchUrl}/full-timer-next.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.a.next', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.b.next', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.c.next', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    '[nested steps] gets cancelled by key press': browser => {
        browser.url(`${browser.launchUrl}/full-timer-next.html#2`);
        browser.execute(keydown);
        browser.pause(TIMING);
        browser.assert.cssClassNotPresent('.a.next', 'active');
        browser.end();
    },
};
