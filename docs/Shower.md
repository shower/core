**Overview:** Core module of the Shower.
* * *



## Shower

Shower core.




====
#### .init (containerElement, options, options.debug, options.hotkeys, options.slide, options.parser, options.plugins) 

Init function.

Parameters:<br>
— ***containerElement***: `HTMLElement | string`, Container element or selector.<br>
— ***options***: `object`, Shower options.<br>
— ***options.debug***: `boolean`, Debug mode.<br>
— ***options.hotkeys***: `boolean`, If true — hotkeys is work.<br>
— ***options.slide***: `string`, Slide selector.<br>
— ***options.parser***: `ISlidesParseFunction`, Parse function.<br>
— ***options.plugins***: `object`, Plugins options.<br>

**Returns**: `Shower`

**Example**:
```javascript
modules.require(['shower'], function (shower) {
     shower.init(".mySlidesContainer", {
         slide: '.mySlidesContainer > SECTION',
         hotkeys: false
     });
});
```

====
#### .destroy () 

Destroy Shower.



====
#### .ready (callback) 

Ready function will call callback when Shower init.
If Shower already initialized, callback will call immediately.

Parameters:<br>
— ***callback***: `function`, Your function that run after Shower initialized.<br>

**Returns**: `boolean`, Ready state.

====
#### .add (slide) 

Add slide or array of slides.

Parameters:<br>
— ***slide***: `Slide | Array.&lt;Slide&gt;`, Slide or array or slides.<br>

**Returns**: `Shower`

====
#### .remove (slide) 

Remove slide from shower.

Parameters:<br>
— ***slide***: `Slide | number`, Slide {@link Slide} or slide index.<br>

**Returns**: `Shower`, Self link.

====
#### .get (index) 

Return slide by index.

Parameters:<br>
— ***index***: `number`, Slide index.<br>

**Returns**: `Slide`, Slide by index.

====
#### .getSlidesArray () 


**Returns**: `Array.&lt;Slide&gt;`, Array with slides {@link Slide}.

====
#### .getSlidesCount () 


**Returns**: `number`, Slides count.

====
#### .next () 


**Returns**: `Shower`

====
#### .prev () 


**Returns**: `Shower`

====
#### .first () 


**Returns**: `Shower`

====
#### .last () 


**Returns**: `Shower`

====
#### .go () 


**Returns**: `Shower`

====
#### .disableHotkeys () 

Turn off hotkeys control.


**Returns**: `Shower`

====
#### .enableHotkeys () 

Turn on hotkeys control.


**Returns**: `Shower`

====
#### .isHotkeysEnabled () 


**Returns**: `boolean`, Hotkeys is enabled.

====
#### .getLiveRegion () 


**Returns**: `HTMLElement`, Live region element.

====
#### .updateLiveRegion (content) 

Update live region content.

Parameters:<br>
— ***content***: `string`, New content for live region.<br>

**Returns**: `Shower`



* * *




