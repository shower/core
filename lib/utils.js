const META_EL_TAGS = ['link', 'meta', 'base', 'script', 'style', 'title'];
const FOCUSABLE_EL_SELECTOR = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';

export const isInteractiveElement = element => element.tabIndex !== -1;
export const isModifierUsed = event => event.ctrlKey || event.altKey || event.metaKey;
export const isMac = () => /Mac/.test(window.navigator.platform);
export const isMetaEl = el => META_EL_TAGS.find(tag => tag === el.tagName.toLowerCase());
export const getFocusableElements = el => el.querySelectorAll(FOCUSABLE_EL_SELECTOR);
