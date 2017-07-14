'use strict';

const TIMING = 1100;

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
        browser.sendKeys('body', browser.Keys.ARROW_RIGHT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'does not activate when moving backwards in `list` mode': browser => {
        browser.url(`${browser.launchUrl}/list-timer.html#3`);
        browser.sendKeys('body', browser.Keys.ARROW_LEFT);
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
        browser.sendKeys('body', browser.Keys.ARROW_RIGHT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'activates when moving backwards': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#3`);
        browser.sendKeys('body', browser.Keys.ARROW_LEFT);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    'works only once': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.sendKeys('body', browser.Keys.ARROW_LEFT);
        browser.assert.cssClassPresent('[id="2"]', 'visited');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    'gets canceled by key press': browser => {
        browser.url(`${browser.launchUrl}/full-timer.html#2`);
        browser.sendKeys('body', 'Q');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },

    '[nested steps] activates on page load': browser => {
        browser.url(`${browser.launchUrl}/full-timer-next.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.next.a', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.next.b', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.next.c', 'active');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('[id="3"]', 'active');
        browser.end();
    },

    '[nested steps] gets canceled by key press': browser => {
        browser.url(`${browser.launchUrl}/full-timer-next.html#2`);
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.next.a', 'active');
        browser.sendKeys('body', 'Q');
        browser.pause(TIMING);
        browser.assert.cssClassPresent('.next.a', 'active');
        browser.assert.cssClassPresent('[id="2"]', 'active');
        browser.end();
    },
};
