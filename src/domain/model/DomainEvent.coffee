DomainEvent = 
    channels: {
        '*': []
    }
    publish: (eventName, event) ->
        @channels[eventName] = [] unless eventName of @channels
        eventData = event.serialize()
        subscriber(eventData, eventName) for subscriber in @channels['*']
        subscriber(eventData, eventName) for subscriber in @channels[eventName]
        null

    subscribe: (eventName, listener) ->
        @channels[eventName] = [] unless eventName of @channels
        @channels[eventName].push listener
        null
