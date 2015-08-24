(function (global) {
    var DEFAULT_SHOWER_SELECTOR = '.shower';
    var dataAttrsOptions = [
        'debug-mode',
        'slides-selector',
        'hotkeys'
    ];

    document.addEventListener('DOMContentLoaded', function () {
        modules.require([
            'Options'
        ], function (Options) {
            var hasOptions = global.hasOwnProperty('showerOptions');
            var options = new Options(global.showerOptions || {});
            var containerSelector = options.get('shower_selector', DEFAULT_SHOWER_SELECTOR);
            var element = document.querySelector(containerSelector);
            var getDataAttr = getData.bind(this, element);

            if (!element) {
                throw new Error('Shower element with selector ' + containerSelector + ' not found.');
            }

            if (getDataAttr('auto-init') !== 'false' || (hasOptions && options.get('auto_init', true) !== false)) {
                if (!hasOptions) {
                    dataAttrsOptions.forEach(function (name) {
                        var value = getDataAttr(name);
                        // Null for getAttr, undefined for dataset.
                        if (value !== null && typeof value !== 'undefined') {
                            options.set(name.replace(/-/g, '_'), value);
                        }
                    });
                }

                modules.require(['shower'], function (shower) {
                    shower.init(element, options.getAll());
                });
            }
        });
    }, false);

    /**
     * Get data-attr value.
     * @param {HTMLElement} element
     * @param {String} name Data property
     * @returns {Object}
     */
    function getData(element, name) {
        return element.dataset ?
            element.dataset[name] :
            element.getAttribute('data-' + name);
    }
})(this);
