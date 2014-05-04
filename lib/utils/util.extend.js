modules.define('util.extend', [], function (provide) { 

    function extend () {
        var extendedObject = arguments[0];
        for (var i = 1, l = arguments.length; i < l; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    extendedObject[key] = obj[key];
                }
            }
        }

        return extendedObject;   
    }

    provide(extendedObject);
}); 