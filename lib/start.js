import { loaded } from 'document-promises';
import Shower from './shower';

const options = document.currentScript.dataset;
const shower = new Shower(options);

Object.defineProperty(window, 'shower', {
    value: shower,
    configurable: true,
});

loaded.then(() => {
    shower.start();
});
