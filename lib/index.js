import {Shower, defaultOptions} from './shower';
export let shower;

const dataAttrsOptions = [
    'debug-mode',
    'slides-selector',
    'hotkeys',
];

const hasOptions = typeof showerOptions !== 'undefined';
const opts = hasOptions ? showerOptions : {};
const containerSel = opts.shower_selector || defaultOptions.container_selector;
const container = document.querySelector(containerSel);
if (!container) {
    throw new Error(`Shower container with selector ${containerSel} not found.`);
}

const autoInit = 'auto_init' in opts ? opts.auto_init : true;
if ((hasOptions && autoInit) || container.dataset.autoInit !== 'false') {
    if (!hasOptions) {
        dataAttrsOptions.forEach(name => {
            const value = container.getAttribute(`data-${name}`);
            if (value !== null) {
                opts[name.replace(/-/g, '_')] = value;
            }
        });
    }

    shower = new Shower(container, opts);
}
