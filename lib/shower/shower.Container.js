modules.define('shower.Container', [
    'event.Emitter',
    'util.bind',
    'util.extend'
], function (provide, EventEmitter, bind, extend) {

    var cssClasses = {
        full: 'shower--full',
        list: 'shower--list'
    };

    /**
     * @class
     * @name shower.Container
     * @param {Shower} shower
     * @param {HTMLElement} containerElement
     */
    function Container (shower, containerElement) {
        this.events = new EventEmitter();

        this._shower = shower;
        this._element = containerElement;
        this._isSlideMode = false;

        this.init();
    }

    extend(Container.prototype, /** @lends shower.Container.prototype */{
        init: function () {
            this._setupListeners();
        },

        destroy: function () {
            this._clearListeners();
            this._element = null;
            this._shower = null;
            this._isSlideMode = null;
        },

        /**
         * @returns {HTMLElement} Container element.
         */
        getElement: function () {
            return this._element;
        },

        /**
         * Enter slide mode.
         */
        enterSlideMode: function () {
            var bodyClassList = document.body.classList;
            bodyClassList.remove(cssClasses.list);
            bodyClassList.add(cssClasses.full);

            this._applyTransform(this._getTransformScale());

            this._isSlideMode = true;
            this.events.emit('slidemodeenter');
        },

        /**
         * Exit slide mode.
         */
        exitSlideMode: function () {
            var elementClassList = document.body.classList;
            elementClassList.remove(cssClasses.full);
            elementClassList.add(cssClasses.list);

            this._applyTransform('none');
            this.scrollToSlide(this._shower.player.getCurrentSlideIndex());

            this._isSlideMode = false;
            this.events.emit('slidemodeexit');
        },

        /**
         * @returns {Boolean} Slide mode state.
         */
        isSlideMode: function () {
            return this._isSlideMode;
        },

        /**
         * @param {Number} slideIndex
         * @returns {shower.Container}
         */
        scrollToSlide: function (slideIndex) {
            var slide = this._shower.get(slideIndex),
                slideElement;

            if (!slide) {
                throw new Error('There is no slide with index ' + slideIndex);
            }

            slideElement = slide.getLayout().getElement();
            window.scrollTo(0, slideElement.offsetTop);

            return this;
        },

        _setupListeners: function () {
            this._showerListeners = this._shower.events.group()
                .on('slideadd', this._onSlideAdd, this)
                .on('slideremove', this._onSlideRemove, this);

            window.addEventListener('resize', bind(this._onResize, this));
            document.addEventListener('keydown', bind(this._onKeyDown, this));
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            window.removeEventListener('resize', bind(this._onResize, this));
            document.removeEventListener('keydown', bind(this._onKeyDown, this));
        },

        _getTransformScale: function () {
            var denominator = Math.max(
                document.body.clientWidth / window.innerWidth,
                document.body.clientHeight / window.innerHeight
            );

            return 'scale(' + (1 / denominator) + ')';
        },

        _applyTransform: function (transformValue) {
            [
                'WebkitTransform',
                'MozTransform',
                'msTransform',
                'OTransform',
                'transform'
            ].forEach(function (property) {
                document.body.style[property] = transformValue;
            });
        },

        _onResize: function () {
            if (this.isSlideMode()) {
                this._applyTransform(this._getTransformScale());
            }
        },

        _onSlideAdd: function (e) {
            var slide = e.get('slide');
            slide.events
                .on('click', this.enterSlideMode, this);
        },

        _onSlideRemove: function (e) {
            var slide = e.get('slide');
            slide.events
                .off('click', this.enterSlideMode, this);
        },

        _onKeyDown: function (e) {
            if (!this._shower.isHotkeysEnabled()) {
                return;
            }

            switch (e.which) {
                case 13: // enter
                    e.preventDefault();
                    this.enterSlideMode();
                    break;

                case 27: // esc
                    e.preventDefault();
                    this.exitSlideMode();
                    break;

                case 116: // F5 (Shift)
                    e.preventDefault();
                    if (this.isSlideMode()) {
                        this.exitSlideMode();
                    } else {
                        var slideNumber = e.shiftKey ? this._shower.player.getCurrentSlideIndex() : 0;
                        this._shower.go(slideNumber);
                        this.enterSlideMode();
                    }
                    break;

                case 80: // P Alt Cmd
                    if (!this.isSlideMode() && e.altKey && e.metaKey) {
                        e.preventDefault();
                        this.enterSlideMode();
                    }
                    break;
            }
        }
    });

    provide(Container);
});
