(function (global) {
    var dataAttrsOptions = [
        'debug-mode',
        'slides-selector',
        'hotkeys'
    ];

    global.shower = {
        modules: modules.create(),
        options: global.showerOptions || {}
    };

    document.addEventListener('DOMContentLoaded', function () {
        global.shower.modules.require(['Options'], function (Options) {
            var hasOptions = global.hasOwnProperty('showerOptions');
            var options = new Options(global.shower.options);
            var containerSelector = options.get('shower_selector', '.shower');
            var element = document.querySelector(containerSelector);
            var getDataAttr = getData.bind(this, element);

            if (!element) {
                throw new Error('Shower element with selector ' + containerSelector + ' not found.');
            }

            if (getDataAttr('auto-init') !== 'false' ||
                (hasOptions && options.get('auto_init', true) !== false)) {
                if (!hasOptions) {
                    dataAttrsOptions.forEach(function (name) {
                        var value = getDataAttr(name);
                        // Null for getAttr, undefined for dataset.
                        if (value !== null && typeof value !== 'undefined') {
                            options.set(name.replace(/-/g, '_'), value);
                        }
                    });
                }

                global.shower.modules.require(['shower'], function (sh) {
                    sh.init({
                        container: element,
                        options: options.getAll()
                    });
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
})(window);
