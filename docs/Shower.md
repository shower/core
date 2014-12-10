
## Shower

Shower core.


### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|init(containerElement, options) |this          |Init function 
|destroy()                       |              |Destroy function
|ready(callback)                 |boolean       |The ready function will call callback when Shower init. If Shower already initialized, callback will call immediately.
|add(slide)                      |this          |Add slide or array of slides.
|remove(slide)                   |this          |Remove slide from shower.
|get(index)                      |Slide         |Get slide by index.
|getSlidesArray()                |Slide[]       |Get slides array.
|getSlidesCount()                |number        |Get length of slides array.
|next()                          |this          |Go to next slide
|prev()                          |this          |Go to prev slide
|first()                         |this          |Go to first slide
|last()                          |this          |Go to last slide
|go(index)                       |this          |Go to slide by index
|disableHotKeys()                |this          |Turn off hotkeys control.
|enableHotKeys()                 |this          |Turn on hotkeys control.
|isHotKeysEnabled()              |boolean       |State of hotkeys control.
|getLiveRegion()                 |HTMLElement   |Get live region element.
|updateLiveRegion(content)       |this          |Update live region content.

====
### Events
|Name           |Description
|---------------|--------------
|ready          |Fire when the Shower API is ready for use. 
|destroy        |The Shower was destroyed.
|slideremove    |The slide was removed. You can get index from event obj.
|slideadd       |The slide was added. You can get index from event obj.

====

#### init 
`{Shower} init([containerElement, [options]])`

Init function.

|Parameters         |Type                   |Default         |Description
|-------------------|-----------------------|----------------|---------------------------------
|containerElement   |HTMLElement or string  |.shower         |Container HTML element or CSS selector.
|options            |object                 |                |Shower options.
|options.debug      |boolean                |false           |Debug mode.
|options.hotkeys    |boolean                |true            |If true — hotkeys will work.
|options.slide      |string                 |.shower>SECTION |CSS selector for find slides.
|options.parser     |ISlidesPrarseFunction  |                |Parse function.
|options.plugins    |object                 |{}              |Shower plugins options.

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
#### destroy
`destroy()`

Destroy Shower.

====
#### ready
`{boolean} ready([callback])`

Ready function will call callback when Shower init.
If Shower already initialized, callback will call immediately.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|callback           |function               |Your function that run after Shower initialized.

**Returns**: `boolean`, Ready state.

====
#### add
`{Shower}  add(slide)` 

Add slide or array of slides.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|slide              |Slide|Slide[]          |Slide or array of slides.

**Returns**: `Shower`

====
#### remove
`{Shower} remove(slide)`

Remove slide from shower.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|slide              |Slide|number           |Slide or his index.

**Returns**: `Shower`

====
#### get
`{Slide} get(index)`

Return slide by index.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|index              |number                 |Slide index.

**Returns**: `Slide`, Slide by the index.

====
#### getSlidesArray
`{Slide[]} getSlidesArray()`

**Returns**: `Slide[]`, Array with slides {@link Slide}.

====
#### getSlidesCount 
`{number} getSlidesCount()`

**Returns**: `number`, Slides count.

====
#### next 
`{Shower} next()`

Go to next slide.

**Returns**: `Shower`

====
#### prev 
`{Shower} prev()`

Go to prev slide.

**Returns**: `Shower`

====
#### first 
`{Shower} first()`

Go to first slide.

**Returns**: `Shower`

====
#### last 
`{Shower} last()`

Go to last slide.

**Returns**: `Shower`

====
#### go
`{Shower} go(index)` 

Go to slide by the index.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|index              |number                 |Slide index.

**Returns**: `Shower`

====
#### disableHotkeys 
`{Shower} disableHotkeys()`

Turn off hotkeys control.

**Returns**: `Shower`

====
#### enableHotkeys
`{Shower} enableHotkeys()` 

Turn on hotkeys control.

**Returns**: `Shower`

====
#### isHotkeysEnabled
`{boolean} isHotkeysEnabled()`

**Returns**: `boolean`, Hotkeys is enabled.

====
#### getLiveRegion
`{HTMLElement} getLiveRegion()` 

**Returns**: `HTMLElement`, Live region element.

====
#### updateLiveRegion
`{Shower} updateLiveRegion(content)`

Update live region content.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|content            |string                 |New content for live region.

**Returns**: `Shower`
