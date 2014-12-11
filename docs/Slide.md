## Slide
`new Slide(content, options, state)`

Slide class.

### Fields
|Name                            |Type          | Description |
|--------------------------------|--------------|-------------|
|events                          |              |Slide event emitter
|options                         |object        |Options
|state                           |object        |State

### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|constructor(content, options, state)|          |Constructor method
|init()                          |              |Init slide.
|destroy()                       |              |Destroy function
|activate()                      |this          |Make the slide active
|deactivate()                    |this          |Make the slide inactive
|isActive()                      |boolean       |State of active.
|isVisited()                     |boolean       |State of visited.
|getLayout()                     |slide.Layout  |Get layout of slide.
|getTitle()                      |string        |Return slide title (h2 … /h2).
|setTitle(title)                 |this          |Set new title for slide.
|getId()                         |string        |Get id of slide element.
|getContent()                    |string        |Get slide content.

### Events
|Name           |Description
|---------------|--------------
|activate       |Slide activated
|deactivate     |Slide deactivated
|click          |Click on slide

====
#### activate
`{Slide} activate()`

Activate slide.

**Returns**: `Slide`

====
#### deactivate
`{Slide} deactivate()`

Deavtivate slide.

**Returns**: `Slide`

====
#### isActive 
`{boolean} isActive()`

Get active state.

**Returns**: `boolean`

====
#### isVisited
`{boolean} isVisited()`

Get visited state.

**Returns**: `boolean`

====
#### getLayout
`{slide.Layout} getLayout()`

Get slide layout.

**Returns**: `slide.Layout`

====
#### getTitle
`{string} getTitle()`

Get slide title.

**Returns**: `string`

====
#### setTitle
`{Slide} setTitle(title)`

Set slide title.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|title              |string                 |New slide title.


**Returns**: `Slide`

====
#### getId
`{string} getId()`

Get id of slide element.

**Returns**: `string`

====
#### getContent 
`{string} getContent()`

Get slide content.

**Returns**: `string`