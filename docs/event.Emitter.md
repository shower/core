**Overview:** Event emitter.
* * *



## event.Emitter

Event emitter. Handle events, emit custom events and other.




====
#### .on (types, callback, context) 

Add event (events) listener.

Parameters:<br>
— ***types***: `string | Array.&lt;string&gt;`, Event name or array of event names.<br>
— ***callback***: `function`, Add event (events) listener.<br>
— ***context***: `object`, Callback context.<br>

**Returns**: `event.Emitter`

====
#### .off (types, callback, context) 

Remove event (events) listener.

Parameters:<br>
— ***types***: `string | Array.&lt;string&gt;`, Event name or array of event names.<br>
— ***callback***: `function`, Remove event (events) listener.<br>
— ***context***: `object`, Callback context.<br>

**Returns**: `event.Emitter`

====
#### .once (eventType, callback, context) 

Add event listener. Callback will run once and after remove auto.

Parameters:<br>
— ***eventType***: `string | Array.&lt;string&gt;`, Event name or array of event names.<br>
— ***callback***: `function`, Add event listener. Callback will run once and after remove auto.<br>
— ***context***: `object`, Callback context.<br>

**Returns**: `event.Emitter`

====
#### .emit (eventType, eventObject) 

Fire all handlers who listen that event type.

Parameters:<br>
— ***eventType***: `string`, Fire all handlers who listen that event type.<br>
— ***eventObject***: `event.Event | object`, Fire all handlers who listen that event type.<br>


====
#### .createEventObject (type, eventData, target) 

Parameters:<br>
— ***type***: `string`<br>
— ***eventData***: `object`<br>
— ***target***: `object`<br>


====
#### .setParent (parent) 

Parameters:<br>
— ***parent***: `event.Emitter`<br>


====
#### .getParent () 


**Returns**: `event.Emitter | null`



* * *




