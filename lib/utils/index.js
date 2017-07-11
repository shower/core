export const isInteractiveEl = el => {
    return el.tabIndex !== -1;
};

/**
 * @name bound
 * @static
 * @function
 *
 * bind with memoization
 *
 * @param {object} ctx Context.
 * @param {String} fn Function name.
 */
export const bound = (ctx, fn) => {
    const key = `__bound_${fn}`;
    return ctx[key] || (ctx[key] = ctx[fn].bind(ctx));
};

export { default as Store } from './store';
export { default as SessionStore } from './session-store';
