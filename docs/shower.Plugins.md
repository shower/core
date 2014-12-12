## shower.Plugins

Plugins controller for Shower.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|shower             |Shower                 |Shower core instance.

====
### Fields
|Name                            |Type          | Description |
|--------------------------------|--------------|-------------|
|events                          |event.Emitter |Container event emitter.

### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|constructor(shower)             |              |Constructor method
|init()                          |              |Init plugins manager.
|destroy()                       |              |Destroy plugins manager.
|add(name[, pluginOptions])      |this          |Add plugin to the Shower plugins manager.
|remove(name)                    |this          |Remove plugin from manager.
|get(name)                       |plugin        |Get plugin by name.

### Events
|Name           |Description
|---------------|--------------
|pluginadd      |Plugin was added. You can get name from event object.
|pluginremove   |Plugin was deleted. You can get name from event object.

====
#### add
`{shower.Plugins} add(name[, pluginOptions])` 

Add plugin to the Shower plugins manager.
After add plugin, auto:
— instance plugin;
— call init method for setup the plugin.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|name               |string                 |Plugin module name.
|[pluginOptions]    |object                 |Custom options for plugin.

**Returns**: `shower.Plugins`

====
#### remove
`{shower.Plugins} remove(name)`

Remove plugin from manager.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|name               |string                 |Plugin module name.

**Returns**: `shower.Plugins`

====
#### get
`{shower.Plugins} get(name)`

Get plugin by name.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|name               |string                 |Plugin module name.

**Returns**: `object`, Plugin.