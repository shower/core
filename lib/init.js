(function () {
    var showerSelector = '.shower',
        optionsName = [
            'plugins',
            'debug',
            'slides',
            'hotkeys'
        ],
        options = {},
        plugins;

    document.addEventListener('DOMContentLoaded', function () {
        var element = document.querySelector(showerSelector),
            getData = function (name) {
                return element.dataset ?
                    element.dataset[name] :
                    element.getAttribute('data-' + name);
            };

        if (!element) {
            throw new Error('Shower element not found.');
        }

        if (getData('auto') != 'false') {
            if (window.hasOwnProperty('showerOptions')) {
                options = window.showerOptions;
            } else {
                optionsName.forEach(function (name) {
                    var value = getData(name);
                    // Null for getAttr, undefined for dataset.
                    if (value !== null && typeof value != 'undefined') {
                        options[name] = value;
                    }
                });
            }
            initShower();
        }
    }, false);

    function initShower () {
        modules.require(['shower'], function (shower) {
            shower.init(showerSelector, options);
        });
    }
})();