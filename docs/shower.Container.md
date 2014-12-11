## shower.Container
`new Container(shower, containerElement)`

Container class for shower slides. Contains DOM,
enter & exit slide mode.

### Fields
|Name                            |Type          | Description |
|--------------------------------|--------------|-------------|
|events                          |event.Emitter |Container event emitter.

### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|constructor(shower, containerElement)|this     |Constructor method
|init()                          |              |Init container.
|destroy()                       |              |Destroy container.
|getElement()                    |HTMLElement   |Returns container element.
|enterSlideMode()                |this          |Enter to slide mode. In this mode a slide fills the maximum area.
|exitSlideMode()                 |this          |Return to list mode view
|isSlideMode()                   |boolean       |Return state of slide mode.
|scrollToSlide(slideIndex)       |this          |Scroll container to slide by index.

### Events
|Name           |Description
|---------------|--------------
|slidemodeenter |Enter slide mode.
|slidemodeexit  |Exit from slide mode.

====
#### getElement
`{HTMLElement} getElement()` 

**Returns**: `HTMLElement`, Container element.

====
#### enterSlideMode 
`{shower.Container} enterSlideMode()`

Enter slide mode.
Slide fills the maximum area.

**Returns**: `shower.Container`

====
#### exitSlideMode
`{shower.Container} exitSlideMode()`

Exit slide mode.
Shower returns into list mode.

**Returns**: `shower.Container`

====
#### isSlideMode
`{boolean} isSlideMode()`

Return state of slide mode.

**Returns**: `boolean`, Slide mode state.

====
#### scrollToSlide
`{shower.Container} scrollToSlide(slideIndex)`

Scroll to slide by index.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|slideIndex         |number                 |Scroll to slide by index.

**Returns**: `shower.Container`
