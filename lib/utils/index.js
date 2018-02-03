export { default as EventTarget } from './event-target';
export const isInteractiveElement = element => element.tabIndex !== -1;
export const isModifierUsed = event => event.ctrlKey || event.altKey || event.metaKey;

export const readOnly = (target, props) => {
    for (const [key, value] of Object.entries(props)) {
        Object.defineProperty(target, key, {
            value,
            enumerable: true,
            configurable: true,
        });
    }
};
