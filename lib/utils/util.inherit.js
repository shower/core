modules.define("util.inherit", [
    "util.extend"
], function (provide, extend) {

    /**
     * Базовая функция, реализующая наследование в JavaScript.
     * Реализует наследование прототипа без исполнения конструктора родителя.
     * К дочернему классу приписывается поле superclass, указывающее на
     * прототип родительского класса.
     * @name util.inherit
     * @function
     * @static
     * @param {Function} ChildClass Дочерний класс.
     * @param {Function} ParentClass Родительский класс.
     * @param {Object} override Набор дополнительных полей и функций,
     * которые будут приписаны к прототипу дочернего класса.
     * @returns {Object} Прототип дочернего класса.
     */

    var inherit = function (ChildClass, ParentClass, override) {
        ChildClass.prototype = (Object.create || function (obj) {
            function F () {}
            F.prototype = obj;
            return new F();
        })(ParentClass.prototype);

        ChildClass.prototype.constructor = ChildClass;
        ChildClass.super = ParentClass.prototype;
        ChildClass.super.constructor = ParentClass;

        if (override) {
            extend(ChildClass.prototype, override);
        }
        return ChildClass.prototype;
    };

    provide(inherit);
});
