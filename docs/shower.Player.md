## shower.Player

Slides player.

====
### Fields
|Name                            |Type          | Description |
|--------------------------------|--------------|-------------|
|events                          |event.Emitter |Player event emitter.

### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|constructor(shower)             |              |Constructor method
|init()                          |              |Init player.
|destroy()                       |              |Destroy player.
|next()                          |this          |Go to next slide
|prev()                          |this          |Go to prev slide
|first()                         |this          |Go to first slide
|last()                          |this          |Go to last slide
|go(index)                       |this          |Go to slide by index
|getCurrentSlide()               |Slide         |Get active slide
|getCurrentSlideIndex()          |number        |Get index of active slide                    

### Events
|Name           |Description
|---------------|--------------
|next           |Player turned to next slide.
|prev           |Player turned to prev slide.
|activate       |Player activate one of slide. You can get slide index from event obj.

====
#### next
`{shower.Player} next()` 

Go to next slide.

**Returns**: `shower.Player`

====
#### prev
`{shower.Player} prev()` 

Go to previous slide.

**Returns**: `shower.Player`

====
#### first
`{shower.Player} first()` 

Go to first slide.

**Returns**: `shower.Player`

====
#### last
`{shower.Player} last()` 

Go to last slide.

**Returns**: `shower.Player`

====
#### go
`{shower.Player} go(index)` 

Go to custom slide by index.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|index              |number                 |Slide index.

**Returns**: `shower.Player`

====
#### getCurrentSlide
`{Slide} getCurrentSlide()`

Get active slide.

**Returns**: `Slide`, Current active slide.

====
#### getCurrentSlideIndex
`{number} getCurrentSlideIndex()` 


**Returns**: `number`, Current active slide index.