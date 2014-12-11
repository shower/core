## event.Emitter
`new EventEmitter()`

Event emitter. Handle events, emit custom events and other.

=====
### Methods
|Name                            |Returns       | Description |
|--------------------------------|--------------|-------------|
|on(types, callback[, context])  |this          |Add event(s) handler(s).
|off(types, callback[, context]) |this          |Remove event(s) handler(s)
|once(types, callback[, context])|this          |Add event listener. Callback will run once and after remove auto.
|emit(eventType[, eventObject])  |              |Fire all handlers who listen event type.
|group()                         |event.EventGroup|Return helper.

### Events
|Name           |Description
|---------------|--------------
|slidemodeenter |Enter slide mode.
|slidemodeexit  |Exit from slide mode.


====
#### on
`{event.Emitter} on(types, callback[, context])` 

Add event (events) listener.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|types              |string or string[]     |Event name or array of event names.
|callback           |function               |Event listener
|[context]          |object                 |Callback context

**Returns**: `event.Emitter`

====
#### off
`{event.Emitter} off(types, callback[, context])`

Remove event (events) listener.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|types              |string or string[]     |Event name or array of event names.
|callback           |function               |Remove event listener
|[context]          |object                 |Callback context

**Returns**: `event.Emitter`

====
#### once
`{event.Emitter} once(eventType, callback[, context])`

Add event listener. Callback will run once and after remove auto.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|types              |string or string[]     |Event name or array of event names.
|callback           |function               |Remove event listener
|[context]          |object                 |Callback context

**Returns**: `event.Emitter`

====
#### emit
`emit(eventType[, eventObject])`

Fire all handlers who listen that event type.

|Parameters         |Type                   |Description
|-------------------|-----------------------|------------------------------------
|eventTyper         |string                 |Event type.
|eventObject        |object or event.Event  |Event object with custom content

====