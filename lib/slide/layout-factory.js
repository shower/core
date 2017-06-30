import SlideLayout from './Layout';

/**
 * @static
 * @function
 *
 * Layout factory for slides.
 *
 * @param {object} [params]
 * @param {string} [params.content=''] Slide content.
 * @param {string} [params.contentType='slide'] Cover, slide, image.
 * @returns {Layout}
 */
export const createLayout = (opts = {}) => {
    const {
        content = '',
        contentType = 'slide',
    } = opts;

    const el = document.createElement('section');
    el.innerHTML = content;
    el.classList.add(contentType);

    return new SlideLayout(el);
};
