class Row
    constructor: (@id, columns)->
        @columns = {}
        for own columnId, columnValue of columns
            @columns[columnId] = "#{columnValue}"
        @deleted = false
        @gridId = null
        @selected = false
        DomainEvent.subscribe 'AllRowsSelected', (event)=>
            @select() if event.gridId == @gridId
        DomainEvent.subscribe 'AllRowsUnselected', (event)=>
            @unselect() if event.gridId == @gridId

    updateColumn: (columnId, columnValue)->
        if @columns[columnId]
            @columns[columnId] = columnValue
            DomainEvent.publish('ColumnUpdated', new ColumnUpdated(@gridId, @id, columnId, columnValue))
        null

    remove: ()->
        @deleted = true
        DomainEvent.publish('RowRemoved', new RowRemoved(@gridId, @id))
        null

    select: ()->
        if @selected is false
            @selected = true
            DomainEvent.publish('RowSelected', new RowSelected(@gridId, @id))
        null

    unselect: ()->
        if @selected is true
            @selected = false
            DomainEvent.publish('RowUnselected', new RowUnselected(@gridId, @id))
        null

class ColumnUpdated
    constructor: (@gridId, @rowId, @columnId, @columnValue)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Row ID is reuqired') unless @rowId
        throw new Error('Column ID is required') unless @columnId
        throw new Error('Column Value is required') unless @columnValue
    serialize: ()->
        return {
            gridId: @gridId
            rowId: @rowId
            columnId: @columnId
            columnValue: @columnValue
        }

class RowRemoved
    constructor: (@gridId, @rowId)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Row ID is required') unless @rowId
    serialize: ()->
        return {gridId: @gridId, rowId: @rowId}

class RowSelected
    constructor: (@gridId, @rowId)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Row ID is required') unless @rowId
    serialize: ()->
        return {gridId: @gridId, rowId: @rowId}
        
class RowUnselected
    constructor: (@gridId, @rowId)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Row ID is required') unless @rowId
    serialize: ()->
        return {gridId: @gridId, rowId: @rowId}
