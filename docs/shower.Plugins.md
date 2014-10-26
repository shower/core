**Overview:** Plugins controller for Shower.
* * *



## shower.Plugins

Plugins controller for Shower.




====
#### .add (name, pluginOptions) 

Add plugin to the Shower plugins system.
After add plugin, auto:
— instance plugin;
— call init method for setup plugin.

Parameters:<br>
— ***name***: `string`, Plugin module name.<br>
— ***pluginOptions***: `object`, Custom options for plugin.<br>

**Returns**: `shower.Plugins`

====
#### .remove (name) 

Remove plugin from system.

Parameters:<br>
— ***name***: `String`, Remove plugin from system.<br>

**Returns**: `shower.Plugins`

====
#### .get (name) 

Get plugin by name.

Parameters:<br>
— ***name***: `string`, Plugin name.<br>

**Returns**: `object`, Plugin.



* * *




