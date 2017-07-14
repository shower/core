export { default as Store } from './store';
export { default as SessionStore } from './session-store';

export const isInteractiveEl = el => el.tabIndex !== -1;
