/**
 * @file Slide layout.
 */

import {bound} from '../utils';
import {EventEmitter} from '../emitter';
import {defaultOptions} from '../shower';
import OptionsManager from '../options';

/**
 * @class Slide layout. Work with DOM, DOM events, etc. View for Slide class.
 * @name slide.Layout
 * @param {HTMLElement} element Slide node.
 * @param {object} Options for slide layout.
 */
class Layout {
    constructor(element, options) {
        this.options = new OptionsManager({
            title_element_selector: defaultOptions.slide_title_element_selector,
            active_classname: defaultOptions.slide_active_classname,
            visited_classname: defaultOptions.slide_visited_classname,
        }, options);

        this.events = new EventEmitter();
        this._element = element;

        this._parent = null;
        this._parentElement = null;

        this.init();
    }

    /**
     * @ignore
     * Init layout.
     */
    init() {
        const {parentNode} = this._element;
        if (!parentNode) {
            this.setParentElement(parentNode);
        } else {
            this._parentElement = parentNode;
        }
    }

    destroy() {
        this.setParent(null);
    }

    setParent(parent) {
        if (this._parent === parent) return;

        this._clearListeners();
        this._parent = parent;

        if (this._parent) {
            this._setupListeners();
        }

        this.events.emit('parentchange', {parent});
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

        this.events.emit('parentelementchange', {parentElement});
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

        this._element.addEventListener('click', bound(this, '_onSlideClick'));
    }

    _clearListeners() {
        if (this._slideListeners) {
            this._slideListeners.offAll();
        }

        this._element.removeEventListener('click', bound(this, '_onSlideClick'));
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
