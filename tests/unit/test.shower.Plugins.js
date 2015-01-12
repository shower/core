modules.define('test.shower.Plugins', [
    'shower',
    'shower.Plugins'
], function (provide, shower, Plugins) {

    var should = chai.should();

    describe('shower.Plugins', function () {
        var plugins,
            pluginName = 'shower-test-plugin';

        beforeEach(function () {
            plugins = new Plugins(shower);
        });

        afterEach(function () {
            plugins.destroy();
        });

        it('Should add and init new plugin', function (done) {
            var eventCounter = 0;

            plugins.events.once('pluginadd', function () {
                eventCounter++;
            });

            shower.events.once('testplugininit', function () {
                eventCounter++;
                eventCounter.should.eq(2);
                done();
            });

            plugins.add(pluginName);
        });

        it('Should remove the plugin', function (done) {
            plugins.events.once('pluginadd', function (e) {
                setTimeout(function () {
                    plugins.remove(pluginName);
                }, 15);
            });

            plugins.events.once('pluginremove', function () {
                console.log(plugins.get(pluginName));
                done();
            });

            plugins.add(pluginName);
        });

        it('Should get the plugin', function (done) {
            plugins.events.once('pluginadd', function (e) {
                var name = e.get('name');
                name.should.eq(pluginName);

                var plugin = plugins.get(pluginName);
                plugin.test().should.eq('test');

                done();
            });

            plugins.add(pluginName);
        });

        it('Should instance the plugin with options from the Shower', function (done) {
            var testPluginOptions = 'test-test';
            shower.options.plugins[pluginName] = testPluginOptions;

            plugins.events.once('pluginadd', function (e) {
                var plugin = plugins.get(pluginName);
                plugin.testOptions().should.eq(testPluginOptions);

                done();
            });

            plugins.add(pluginName);
        });

        it('Should instance the plugin with options from method', function (done) {
            var testPluginOptions = 'test-test';

            plugins.events.once('pluginadd', function (e) {
                var plugin = plugins.get(pluginName);
                plugin.testOptions().should.eq(testPluginOptions);
                done();
            });

            plugins.add(pluginName, testPluginOptions);
        });
    });

    provide();
});

// Тестовый плагин.
modules.define('shower-test-plugin', [
    'Emitter'
], function (provide, EventEmitter) {

    function TestPlugin (shower, options) {
        this._shower = shower;
        this._options = options;
        this.events = new EventEmitter();
    }

    TestPlugin.prototype = {
        init: function () {
            this._shower.events.emit('testplugininit');
            this.events.emit('init');
        },

        destroy: function () {
            this.events.emit('destroy');
        },

        test: function () {
            this.events.emit('test');
            return 'test';
        },

        testOptions: function () {
            return this._options;
        }
    };

    provide(TestPlugin);
});
