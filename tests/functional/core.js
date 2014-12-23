casper.test.begin(
// ------------------------------------------------------------------
    'Automatically initialized slide IDs', 4,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html').then(function() {

        test.assertExists('[id="1"]', 'There’s #1');
        test.assertDoesntExist('[id="2"]', 'There’s no #2');
        test.assertExists('[id="MyID"]', 'There’s MyID');
        test.assertExists('[id="3"]', 'There’s #3');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Entering Full mode by URL query', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html?full').then(function() {

        test.assertExists('.shower.shower--full', 'Shower in Full mode');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Keeping Full mode after reload', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html?full').then(function() {

        this.reload();

    }).then(function() {

        test.assertExists('.shower.shower--full', 'Shower in Full mode');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Slide activated by URL hash', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#1').then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Activating first slide from List mode by Right', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html').then(function() {

        this.sendKeys('body', casper.page.event.key.Right);

    }).then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Entering Full mode by click on slide', 2,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html').then(function() {

        this.click('[id="1"]');

    }).then(function() {

        test.assertExists('.shower.shower--full', 'Shower in Full mode');
        test.assertUrlMatch(/html\?full#1/, 'Slide #1 in Full mode URL');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Entering Full mode from active slide by Enter', 2,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#1').then(function() {

        this.sendKeys('body', casper.page.event.key.Enter);

    }).then(function() {

        test.assertExists('.shower.shower--full', 'Shower in Full mode');
        test.assertUrlMatch(/html\?full#1/, 'Slide #1 in Full mode URL');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Moving forward in List mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#1').then(function() {

        this.sendKeys('body', casper.page.event.key.Right); // 2
        this.sendKeys('body', casper.page.event.key.Right); // 3

    }).then(function() {

        test.assertExists('[id="3"].active', 'Slide #3 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Moving backward in List mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#3').then(function() {

        this.sendKeys('body', casper.page.event.key.Left); // 2
        this.sendKeys('body', casper.page.event.key.Left); // 1

    }).then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Moving forward in Full mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html?full#1').then(function() {

        this.sendKeys('body', casper.page.event.key.Right); // 2
        this.sendKeys('body', casper.page.event.key.Right); // 3

    }).then(function() {

        test.assertExists('[id="3"].active', 'Slide #3 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Moving backward in Full mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html?full#3').then(function() {

        this.sendKeys('body', casper.page.event.key.Left); // 2
        this.sendKeys('body', casper.page.event.key.Left); // 1

    }).then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Non-existing ID in List mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#404').then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});

casper.test.begin(
// ------------------------------------------------------------------
    'Non-existing ID in Full mode', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html?full#404').then(function() {

        test.assertExists('[id="1"].active', 'Slide #1 is active');

    }).run(function() { test.done() }).clear();
});
