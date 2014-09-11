// -------------------------------
// Entering Full and pressing Back
// -------------------------------
casper.test.begin('Entering Full and pressing Back', 3, function suite(test) {
    casper.start('http://0.0.0.0:7497/').then(function() {

        this.click('[id="1"]');
        this.back();

    }).then(function() {

        test.assertExists('.shower--list', 'Body in List mode');
        test.assertExists('[id="1"].active', 'Slide #1 is active');
        test.assertUrlMatch(/\/#1/, 'Slide #1 in List mode URL');

    }).run(function() { test.done() }).clear();
});
