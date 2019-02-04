'use strict';

const { port } = require('../func-constants');

const MIME_JS = 'application/javascript';
const MIME_HTML = 'text/html';

const toBase64 = string => Buffer.from(string).toString('base64');
const toDataURL = (mime, data) => `data:${mime};base64,${toBase64(data)}`;
const composeURL = (opts = {}) => {
    return toDataURL(
        MIME_HTML,
        `
            <!DOCTYPE html>
            <head>
                <meta charset="utf-8">
                <title>Shower plugins test</title>
                ${opts.head || ''}
            </head>
            <body class="${opts.containerClass || 'shower'} full">
                <section id="a" class="slide">
                    <h2>1</h2>
                </section>
                <section id="b" class="slide">
                    <h2>2</h2>
                </section>
                <section id="c" class="slide">
                    <h2>3</h2>
                </section>
                ${opts.body || ''}
            </body>
        `,
    );
};

const containerClass = 'custom';
const showerURL = `http://localhost:${port}/shower.js`;
const pluginURL = toDataURL(
    MIME_JS,
    `
        shower.addEventListener('start', () => {
            shower.last();
        });
    `,
);

module.exports = {
    '@tags': ['start'],

    'sync shower in <head>': browser => {
        browser.url(
            composeURL({
                head: `
                    <script src="${showerURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#a', 'active');
        browser.end();
    },

    'sync shower & data-* config in <head>': browser => {
        browser.url(
            composeURL({
                containerClass,
                head: `
                    <script src="${showerURL}" data-container-selector=".${containerClass}"></script>
                    <script src="${pluginURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'sync shower, config <script>, and plugin in <head>': browser => {
        browser.url(
            composeURL({
                containerClass,
                head: `
                    <script src="${showerURL}"></script>
                    <script>
                        shower.configure({
                            containerSelector: '.${containerClass}',
                        });
                    </script>
                    <script src="${pluginURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'sync shower in <body>': browser => {
        browser.url(
            composeURL({
                body: `
                    <script src="${showerURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#a', 'active');
        browser.end();
    },

    'sync shower & plugin in <body>': browser => {
        browser.url(
            composeURL({
                body: `
                    <script src="${showerURL}"></script>
                    <script src="${pluginURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'sync shower, config <script>, and plugin in <body>': browser => {
        browser.url(
            composeURL({
                containerClass,
                body: `
                    <script src="${showerURL}"></script>
                    <script>
                        shower.configure({
                            containerSelector: '.${containerClass}',
                        });
                    </script>
                    <script src="${pluginURL}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'deferred shower': browser => {
        browser.url(
            composeURL({
                head: `
                    <script src="${showerURL}" defer></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#a', 'active');
        browser.end();
    },

    'deferred shower & plugin': browser => {
        browser.url(
            composeURL({
                head: `
                    <script src="${showerURL}" defer></script>
                    <script src="${pluginURL}" defer></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'deferred shower, data-* config, and plugin': browser => {
        browser.url(
            composeURL({
                containerClass,
                head: `
                    <script src="${showerURL}" defer data-container-selector=".${containerClass}"></script>
                    <script src="${pluginURL}" defer></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#c', 'active');
        browser.end();
    },

    'async shower': browser => {
        browser.url(
            composeURL({
                head: `
                    <script src="${showerURL}" async></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#a', 'active');
        browser.end();
    },

    'async shower & data-* config': browser => {
        browser.url(
            composeURL({
                containerClass,
                head: `
                    <script src="${showerURL}" async data-container-selector=".${containerClass}"></script>
                `,
            }),
        );

        browser.assert.cssClassPresent('#a', 'active');
        browser.end();
    },
};
