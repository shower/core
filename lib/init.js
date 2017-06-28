import {defaultOptions} from '../shower';

var dataAttrsOptions = [
    'debug-mode',
    'slides-selector',
    'hotkeys'
];

// global.shower = {
//     modules: modules.create(),
//     options: global.showerOptions || {}
// };

// if (/interactive|complete|loaded/.test(document.readyState)) {
//     initialize();
// } else {
//     document.addEventListener('DOMContentLoaded', initialize);
// }

var hasOptions = global.hasOwnProperty('showerOptions');
var options = global.shower.options;
var containerSelector = options.shower_selector || defaultOptions.container_selector;
var element = document.querySelector(containerSelector);
var autoInit = typeof options.auto_init !== 'undefined' ?
    options.auto_init : true;

if (!element) {
    throw new Error('Shower element with selector ' + containerSelector + ' not found.');
}

if (element.dataset.autoInit !== 'false' || (hasOptions && autoInit)) {
    if (!hasOptions) {
        dataAttrsOptions.forEach(function (name) {
            var value = element.dataset[name];
            // Null for getAttr, undefined for dataset.
            if (value !== undefined) {
                options[name.replace(/-/g, '_')] = value;
            }
        });
    }

    global.shower.modules.require(['shower'], function (sh) {
        sh.init({
            container: element,
            options: options
        });
    });
}
