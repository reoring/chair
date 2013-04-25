DomainEvent = 
    channels: []
    publish: (eventName, event) ->
        @channels[eventName] = [] if @channels[eventName] is undefined

        for subscriber in @channels[eventName]
            subscriber(event.serialize(), eventName)

    subscribe: (eventName, listener) ->
        @channels[eventName] = [] if @channels[eventName] is undefined
        @channels[eventName].push listener
