class Row
    constructor: (@id, columns)->
        @columns = {}
        for own columnId, columnValue of columns
            @columns[columnId] = "#{columnValue}"
        @deleted = false
        @gridId = null

    updateColumn: (columnId, columnValue)->
        if @columns[columnId]
            @columns[columnId] = columnValue
            DomainEvent.publish('GridColumnUpdated', new GridColumnUpdated(@gridId, @id, columnId, columnValue))

    remove: ()->
        @deleted = true
        DomainEvent.publish('GridRowRemoved', new GridRowRemoved(@gridId, @id))
