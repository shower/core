import {defaultOptions} from './shower';
import sh from './global';

const dataAttrsOptions = [
    'debug-mode',
    'slides-selector',
    'hotkeys',
];

const hasOptions = typeof showerOptions !== 'undefined';
const options = hasOptions ? showerOptions : {};
const containerSel = options.shower_selector || defaultOptions.container_selector;
const container = document.querySelector(containerSel);
if (!container) {
    throw new Error(`Shower container with selector ${containerSel} not found.`);
}

const autoInit = 'auto_init' in options ? options.auto_init : true;
if ((hasOptions && autoInit) || container.dataset.autoInit !== 'false') {
    if (!hasOptions) {
        dataAttrsOptions.forEach(name => {
            const value = container.getAttribute(`data-${name}`);
            if (value !== null) {
                options[name.replace(/-/g, '_')] = value;
            }
        });
    }

    sh.init({container, options});
}
