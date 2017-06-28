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
export default (ctx, fn) => {
    const key = `__bound_${fn}`;
    return ctx[key] || (ctx[key] = ctx[fn].bind(ctx));
};
