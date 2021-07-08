'use strict';

const urlHost = `localhost:${process.env.npm_package_config_test_port}`;
const testShower = ({
    headContent = '',
    containerClass = 'shower',
    mode = '',
    slide1,
    slide2,
    slide3,
    bodyContent = '',
    urlSearch = '',
    urlHash = '',
} = {}) => {
    slide1 = {
        id: 's1',
        class: 'slide',
        content: '',
        ...slide1,
    };

    slide2 = {
        id: 's2',
        class: 'slide',
        content: '',
        ...slide2,
    };

    slide3 = {
        id: 's3',
        class: 'slide',
        content: '',
        ...slide3,
    };

    const echo = encodeURIComponent(`
        <!DOCTYPE html>
        <head>
            <meta charset="utf-8">
            <title>Shower functional tests</title>
            <script src="../shower.js" defer></script>
            ${headContent}
        </head>
        <body class="${containerClass} ${mode}">
            <input class="send-keys" tabindex="-1">
            <section id="${slide1.id}" class="${slide1.class}">
                <h2>1</h2>
                ${slide1.content}
            </section>
            <section id="${slide2.id}" class="${slide2.class}">
                <h2>2</h2>
                ${slide2.content}
            </section>
            <section id="${slide3.id}" class="${slide3.class}">
                <h2>3</h2>
                ${slide3.content}
            </section>
            ${bodyContent}
        </body>
    `);

    return `http://${urlHost}?echo=${echo}&${urlSearch}#${urlHash}`;
};

module.exports = testShower;
