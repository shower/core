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
    'Slide activated by URL hash', 1,
// ------------------------------------------------------------------
    function suite(test) {
    casper.start('http://0.0.0.0:7497/core.html#1').then(function() {

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

//  4. Activating first slide from List mode by Right
//  5. Entering Full mode from active slide by Enter
//  6. Moving forward in List mode
//  7. Moving backward in List mode
//  8. Moving forward in Full mode
//  9. Moving backward in Full mode
// 10. Non-existing ID in List mode
// 11. Non-existing ID in Full mode
