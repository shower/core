## shower.Location
`new ShowerLocation(shower)`

History controller for Shower.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|shower             |Shower                 |Shower core instance.

====
### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|constructor(shower)             |              |Constructor method
|init()                          |              |Init history controller.
|destroy()                       |              |Destroy history controller.
|push(content)                   |              |Push to history custom content.
|save()                          |              |Save current Shower state.

====
#### .push (content) 
`push(content)`

Push to history custom content.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|content            |string                 |Push to history custom content.

====
#### save 
`save()`

Save current Shower state, e.g.:
- slide (index or id);
- slide mode.