class Event
    @instance = null

    constructor: () ->
        @channels = []

    publish: (channel, message) =>
        @channels[channel] = [] if @channels[channel] is undefined

        for subscriber in @channels[channel]
            subscriber message

    subscribe: (channel, listener) =>
        @channels[channel] = [] if @channels[channel] is undefined
        @channels[channel].push listener
