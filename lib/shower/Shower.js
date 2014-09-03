/**
 * @fileOverview
 */
modules.define('shower', [
    'event.Emitter',
    'shower.Container',
    'shower.parser',
    'shower.Player',
    'shower.Location',
    'util.extend'
], function (provide, EventEmitter, Container, parser, Player, Location, extend) {

    /**
     * @name Shower
     * @constructor
     */
    function Shower () {
        this.events = new EventEmitter();

        this.options = {};
        this.container = null;
        this.player = null;
        this.location = null;

        this._slides = [];
        this._isReady = false;
        this._isHotkeysOn = true;
    }

    extend(Shower.prototype, /** @lends Shower.prototype */{
        /**
         * Init shower.
         * @param {HTMLElement | String} containerElement Container element or selector.
         * @param {Object} [options] Shower options.
         * @param {Boolean} [options.debugMode = false]
         * @param {Boolean} [options.hotkeys = true]
         * @param {String} [options.slideSelector = '.shower--list > section'] Slide selector.
         * @param {Function} [options.parser] Function that gets as param {HTMLElement} containerElement,
         * {String} slideSelector and returns {Slide[]} slides.
         * @param {Object[]|String[]} [options.plugins = ['progress', 'timing', 'innerNavigation']] Plugins name or
         * array of {String} name and {Object} plugin options.
         * For example [['progress', {selector: '.prog'}], 'timing'].
         */
        init: function (containerElement, options) {
            this.options = extend({
                // Default options.
                debugMode: false,
                hotkeys: true,
                slideSelector: '.shower > section',
                parser: parser,
                plugins: [
                    'progress',
                    'timing',
                    'innerNavigation'
                ]
            }, options);

            if (typeof containerElement == 'string') {
                containerElement = document.querySelector(containerElement);
            }

            this.container = new Container(this, containerElement);
            this.player = new Player(this);
            this.location = new Location(this);

            this._parseSlides();
            this._initPlugins();

            if (this.options.debugMode) {
                document.body.classList.add('debug');
                console.log('Debug mode on');
            }

            if (!this.options.hotkeys) {
                this.disableHotkeys();
            }

            this._isReady = true;
            this.events.emmit('ready');

            return this;
        },

        destroy: function () {
            this.events.emmit('destroy');

            this.container.destroy();
            this.player.destroy();

            this._slides.length = 0;
        },

        /**
         * @param {Function} callback
         */
        ready: function (callback) {
            if (this._isReady) {
                callback();
            } else {
                this.events.once('ready', callback);
            }

            return this;
        },

        /**
         * @param {Slide | Slide[]} slide
         * @returns {Shower}
         */
        add: function (slide) {
            if (Array.isArray(slide)) {
                for (var i = 0, k = slide.length; i < k; i++) {
                    this._addSlide(slide[i]);
                }
            } else {
                this._addSlide(slide);
            }

            return this;
        },

        /**
         * @param {Slide | Number} slide
         * @returns {Shower}
         */
        remove: function (slide) {
            var slidePosition;

            if (typeof slide == 'number') {
                slidePosition = slide;
            } else if (this._slides.indexOf(slide) != -1) {
                slidePosition = this._slides.indexOf(slide);
            } else {
                throw new Error('Slide not found');
            }

            slide = this._slides.splice(slidePosition, 1);

            this.events.emmit('slideremove', {
                slide: slide
            });

            slide.destroy();
            return this;
        },

        /**
         * @param {Number} index Slide index.
         * @returns {Slide} Slide by index.
         */
        get: function (index) {
            return this._slides[index];
        },

        /**
         * @returns {Slide[]}
         */
        getSlidesArray: function () {
            return this._slides.slice();
        },

        /**
         * @returns {Number} Slides count.
         */
        getSlidesCount: function () {
            return this._slides.length;
        },

        /**
         * @borrows shower.Player.next
         * @returns {Shower}
         */
        next: function () {
            this.player.next();
            return this;
        },

        /**
         * @borrows shower.Player.prev
         * @returns {Shower}
         */
        prev: function () {
            this.player.prev();
            return this;
        },

        /**
         * @borrows shower.Player.first
         * @returns {Shower}
         */
        first: function () {
            this.player.first();
            return this;
        },

        /**
         * @borrows shower.Player.last
         * @returns {Shower}
         */
        last: function () {
            this.player.last();
            return this;
        },

        /**
         * @borrows shower.Player.go
         * @returns {Shower}
         */
        go: function (index) {
            this.player.go(index);
            return this;
        },

        disableHotkeys: function () {
            this._isHotkeysOn = false;
            return this;
        },

        enableHotkeys: function () {
            this._isHotkeysOn = true;
            return this;
        },

        isHotkeysEnabled: function () {
            return this._isHotkeysOn;
        },

        _parseSlides: function () {
            var slides = this.options.parser(this.container.getElement(), this.options.slideSelector);
            this.add(slides);
        },

        _addSlide: function (slide) {
            this._slides.push(slide);

            // TODO: ?
            // slide.setParent(this);

            this.events.emmit('slideadd', {
                slide: slide
            });
        },

        _initPlugins: function () {
            var shower = this;
            this.options.plugins.forEach(function (pluginInfo) {
                if (typeof pluginInfo == 'string') {
                    pluginInfo = [pluginInfo, {}];
                }

                var name = pluginInfo[0],
                    pluginName = 'plugin.' + name.charAt(0).toUpperCase() + name.substr(1),
                    pluginOptions = pluginInfo[1];

                modules.require([pluginName], function (Plugin) {
                    new Plugin(shower, pluginOptions);
                });
            }, this);
        }
    });

    provide(new Shower());
});
