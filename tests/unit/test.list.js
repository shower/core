// Tests list.
modules.define('tests', [
    'test.Shower',
    'test.shower.Player',
    'test.shower.Container',
    'test.shower.Plugins',

    'test.event.Emitter',

    'test.Slide'
], function (provide) {
    provide();
});
