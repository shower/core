import EventEmitter from '../emitter';
import { defaultOptions } from '../shower';
import { Store } from '../utils';

/**
 * @class Slide layout. Work with DOM, DOM events, etc. View for Slide class.
 * @name Layout
 * @param {HTMLElement} el Slide node.
 * @param {object} opts Options for slide layout.
 */
class Layout {
    /**
     * @static
     * @function
     *
     * Layout factory for slides.
     *
     * @param {object} [opts]
     * @param {string} [opts.content=''] Slide content.
     * @param {string} [opts.contentType='slide'] Cover, slide, image.
     * @returns {Layout}
     */
    static create(opts = {}) {
        const {
            content = '',
            contentType = 'slide',
        } = opts;

        const el = document.createElement('section');
        el.innerHTML = content;
        el.classList.add(contentType);

        return new this(el);
    }

    constructor(el, opts) {
        this.events = new EventEmitter();
        this.options = new Store({
            title_element_selector: defaultOptions.slide_title_element_selector,
            active_classname: defaultOptions.slide_active_classname,
            visited_classname: defaultOptions.slide_visited_classname,
        }, opts);

        this._element = el;
        this._parent = null;
        this._parentElement = null;
        this._init();
    }

    _init() {
        const { parentNode } = this._element;
        if (parentNode) {
            this._parentElement = parentNode;
        } else {
            this.setParentElement(parentNode);
        }
    }

    setParent(parent) {
        if (this._parent === parent) return;

        this._clearListeners();
        this._parent = parent;

        if (this._parent) {
            this._setupListeners();
        }

        this.events.emit('parentchange', { parent });
    }

    getParent() {
        return this._parent;
    }

    /**
     * @param {HTMLElement} parentElement
     */
    setParentElement(parentElement) {
        if (this._parentElement === parentElement) return;

        this._parentElement = parentElement;
        parentElement.appendChild(this._element);

        this.events.emit('parentelementchange', { parentElement });
    }

    /**
     * Return slide parent HTML element.
     *
     * @returns {HTMLElement} Layout parent element.
     */
    getParentElement() {
        return this._parentElement;
    }

    /**
     * Return slide HTML element.
     *
     * @returns {HTMLElement} Layout element.
     */
    getElement() {
        return this._element;
    }

    /**
     * Set slide title or create new H2 element into slide element.
     *
     * @param {string} title Slide title.
     */
    setTitle(title) {
        const titleSelector = this.options.get('title_element_selector');
        let titleEl = this._element.querySelector(titleSelector);

        if (!titleEl) {
            titleEl = document.createElement(titleSelector);
            this._element.insertBefore(titleEl, this._element.firstChild);
        }

        titleEl.innerHTML = title;
    }

    /**
     * Return text content of H2 element.
     *
     * @returns {(string|null)} Title.
     */
    getTitle() {
        const titleSelector = this.options.get('title_element_selector');
        const titleEl = this._element.querySelector(titleSelector);

        return titleEl && titleEl.textContent;
    }

    /**
     * Get data, defined in property of slide element.
     *
     * @param {string} name Data attr name.
     * @returns {string} Value of data attr.
     */
    getData(name) {
        return this._element.dataset[name];
    }

    /**
     * Get inner content from slide element.
     *
     * @returns {string} Slide content.
     */
    getContent() {
        return this._element.innerHTML;
    }

    _setupListeners() {
        this._slideListeners = this._parent.events.group()
            .on('activate', this._onSlideActivate, this)
            .on('deactivate', this._onSlideDeactivate, this);

        this._onSlideClick = this._onSlideClick.bind(this);
        this._element.addEventListener('click', this._onSlideClick);
    }

    _clearListeners() {
        if (this._slideListeners) {
            this._slideListeners.offAll();
        }

        this._element.removeEventListener('click', this._onSlideClick);
    }

    _onSlideActivate() {
        this._element.classList.add(this.options.get('active_classname'));
    }

    _onSlideDeactivate() {
        const cl = this._element.classList;
        cl.remove(this.options.get('active_classname'));
        cl.add(this.options.get('visited_classname'));
    }

    _onSlideClick() {
        this.events.emit('click');
    }
}

export default Layout;
