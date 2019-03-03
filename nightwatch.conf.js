'use strict';

const yn = require('yn');
const { port } = require('./test/func-constants');

const { env } = process;
const chromeLocalArgs = [];
const isHeadless = yn(env.CHROME_HEADLESS, { default: true });
if (isHeadless) {
    chromeLocalArgs.push('headless');
}

const makeSauceEnv = caps => ({
    selenium: {
        host: 'ondemand.saucelabs.com',
        port: 80,
    },
    username: env.SAUCE_USERNAME,
    access_key: env.SAUCE_ACCESS_KEY,
    desiredCapabilities: {
        'tunnel-identifier': env.TRAVIS_JOB_NUMBER,
        ...caps,
    },
});

module.exports = {
    globals_path: 'test/func-harness.js',
    src_folders: 'test/func',
    output_folder: 'test/output',

    launch_url: `http://localhost:${port}/tests`,
    live_output: true,
    skip_testcases_on_fail: false,

    test_settings: {
        'chrome-local': {
            webdriver: {
                start_process: true,
                server_path: 'node_modules/.bin/chromedriver',
                port: 9515,
            },
            desiredCapabilities: {
                browserName: 'Chrome',
                chromeOptions: {
                    args: chromeLocalArgs,
                },
            },
        },

        chrome: makeSauceEnv({
            browserName: 'Chrome',
            platform: 'macOS 10.13',
        }),

        firefox: makeSauceEnv({
            browserName: 'Firefox',
            platform: 'Windows 10',
        }),

        safari: makeSauceEnv({
            browserName: 'Safari',
            platform: 'macOS 10.13',
        }),

        edge: makeSauceEnv({
            browserName: 'MicrosoftEdge',
            platform: 'Windows 10',
        }),
    },
};
