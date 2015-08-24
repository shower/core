/**
 * @fileOverview Default Shower options.
 */
modules.define('shower.defaultOptions', [
    'shower.slidesParser'
], function (provide, slidesParser) {
    provide({
        debug_mode: false,
        debug_mode_classname: 'debug',

        hotkeys: true,
        enable_location: true,

        slides_parser: slidesParser,
        slides_selector: '.shower > SECTION',

        mode_full_url_param: 'full',
        mode_full_classname: 'full',
        mode_list_classname: 'list',

        slide_active_classname: 'active',
        slide_visited_classname: 'visited'
    });
});
