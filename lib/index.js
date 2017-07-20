import 'shim-keyboard-event-key';
import { Shower, defaultOptions } from './shower';
import Title from './plugins/title';
import Location from './plugins/location';
import Next from './plugins/next';
import Progress from './plugins/progress';
import Timer from './plugins/timer';
import Touch from './plugins/touch';

export let shower; // eslint-disable-line

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
    shower.plugins
        .add('title', Title)
        .add('location', Location)
        .add('next', Next)
        .add('progress', Progress)
        .add('timer', Timer)
        .add('touch', Touch);
}
