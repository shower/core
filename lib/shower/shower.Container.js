modules.define('shower.Container', [
    'event.Emitter',
    'util.extend'
], function (provide, EventEmitter, extend) {

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

        this._setupListeners();
    }

    extend(Container.prototype, /** @lends shower.Container.prototype */{
        /**
         * @returns {HTMLElement} Container element.
         */
        getElement: function () {
            return this._element;
        },

        /**
         * @param {HTMLElement} containerElement
         */
        setElement: function (containerElement) {
            this._element = containerElement;
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
            this.events.emmit('slidemodeenter');
        },

        /**
         * Exit slide mode.
         */
        exitSlideMode: function () {
            var elementClassList = document.body.classList;
            elementClassList.remove(cssClasses.full);
            elementClassList.add(cssClasses.list);

            this._applyTransform('none');

            this._isSlideMode = false;
            this.events.emmit('slidemodeexit');
        },

        /**
         * @returns {Boolean} Slide mode state.
         */
        isSlideMode: function () {
            return this._isSlideMode;
        },

        _setupListeners: function () {
            this._showerListeners = this._shower.events.group()
                .on('slideadd', this._onSlideAdd, this)
                .on('slideremove', this._onSlideRemove, this);

            window.addEventListener('resize', this._onResize.bind(this));
            document.addEventListener('keydown', this._onKeyDown.bind(this));
        },

        _clearListeners: function () {
            this._showerListeners.offAll();
            window.removeEventListener('resize', this._onResize.bind(this));
            document.removeEventListener('keydown', this._onKeyDown.bind(this));
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

        _onKeyDown: function (e) {
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
        }
    });

    provide(Container);
});
