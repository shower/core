(function () {
    document.addEventListener('DOMContentLoaded', function () {
        var showerSelector = '.shower',
            showerElement = document.querySelector(showerSelector),
            plugins;

        if (showerElement && !showerElement.hasAttribute('data-no-auto-init')) {
            if (showerElement.hasAttribute('data-plugins')) {
                plugins = showerElement.getAttribute('data-plugins');
                plugins = plugins.split(',').map(function (plugin) {
                    return plugin.trim();
                });
            }

            modules.require(['shower'], function (shower) {
                shower.init(showerSelector, {
                    plugins: plugins || [
                        'progress',
                        'timer',
                        'navigation',
                        'notes',
                        'touch'
                    ]
                });
            });
        }
    }, false);
})();