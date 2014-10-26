

====
#### .inherit (ChildClass, ParentClass, override) 

Inherit function.

Parameters:<br>
— ***ChildClass***: `function`, Inherit function.<br>
— ***ParentClass***: `function`, Inherit function.<br>
— ***override***: `object`, Inherit function.<br>

**Returns**: `object`, Child class prototype.

**Example**:
```javascript
function CrazySlide(content, options) {
     CrazySlide.super.constructor.call(this, content, options);
     …
}
inherit(CrazySlide, Slide, {
    _haveFun: function () {
        alert('fun');
    }
});
```




* * *




