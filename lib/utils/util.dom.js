modules.define('util.dom', [

], function (provide) {

    var utilDom = {
        find: function (query, parentElement) {
            var element;
            if (parentElement) {
                element = parentElement.querySelector(query);
            } else {
                element = document.querySelector(query);
            }

            return element;
        },

        findById: function (query, parentElement) {
            var element;
            if (parentElement) {
                element = parentElement.getElementById(elementId);
            } else {
                element = document.getElementById(elementId);
            }

            return element;
        }
    }

    provide(utilDom);
});
