/**
 * @file Layout factory for slides.
 */

import SlideLayout from './Layout';

/**
 * @ignore
 * @param opts
 * @returns {HTMLElement}
 */
const createElement = opts => {
    const el = document.createElement('section');
    el.innerHTML = opts.content;
    el.classList.add(opts.contentType);

    return el;
};

/**
 * @static
 * @function
 *
 * @param {object} [params]
 * @param {string} [params.content=''] Slide content.
 * @param {string} [params.contentType='slide'] Cover, slide, image.
 * @returns {Layout}
 */
export const createLayout = params => {
    const el = createElement(Object.assign({
        content: '',
        contentType: 'slide',
    }, params));

    return new SlideLayout(el);
};
