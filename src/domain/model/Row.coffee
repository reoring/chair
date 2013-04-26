class Row
    constructor: (@id, columns)->
        @columns = {}
        for own columnId, columnValue of columns
            @columns[columnId] = "#{columnValue}"

    updateColumn: (columnId, columnValue, gridId)->
        if @columns[columnId]
            @columns[columnId] = columnValue
            DomainEvent.publish('ColumnUpdated', new ColumnUpdated(gridId, @id, columnId, columnValue))
