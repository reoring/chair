class Grid
    ALL_ROWS_UNSELECTED = 0
    ALL_ROWS_SELECTED = 1

    constructor: (@id, columns)->
        throw new Error('Grid ID is required') unless @id
        @_rows = {}
        @columns = []

        for column in columns
            @columns.push(column)

        @selectionStatus = ALL_ROWS_UNSELECTED

    selectAllRows: ()->
        @selectionStatus = ALL_ROWS_SELECTED
        DomainEvent.publish('AllRowsSelected', new AllRowsSelected(@id))
        null

    unselectAllRows: ()->
        @selectionStatus = ALL_ROWS_UNSELECTED
        DomainEvent.publish('AllRowsUnselected', new AllRowsUnselected(@id))
        null

    append: (row)->
        throw new Error("Row(id:#{row.id}) already exists in the Grid(id:#{@id})") if @_hasRow(row.id)
        @_addRow(row)
        DomainEvent.publish("RowAppended", new RowAppended(@id, row.id, row.columns))

    updateColumn: (rowId, columnId, columnValue)->
        if @_hasRow(rowId)
            @_getRow(rowId).updateColumn(columnId, columnValue, @id)

    rows: ()->
        return (row for own key, row of @_rows)

    change: (rows, page, total, rowsPerGrid, filter)->
        @_rows = {}

        for row in rows
            @_addRow(row)

        DomainEvent.publish("GridChanged", new GridChanged(@id, rows, page, total, rowsPerGrid, filter))

    removeRow: (rowId)->
        if @_hasRow(rowId)
            @_getRow(rowId).remove()
            delete @_rows[rowId]

    _hasRow: (rowId)->
        if @_rows[rowId]
            return true
        else
            return false

    _getRow: (rowId)->
        return @_rows[rowId]

    _addRow: (row)->
        @_rows[row.id] = row
        row.gridId = @id

class RowAppended
    constructor: (@gridId, @rowId, columns)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Row ID is required') unless @rowId
        throw new Error('Column Values are required') unless columns
        @columns = []
        for key, value of columns
            @columns.push(value)
    serialize: ()->
        return {gridId: @gridId, rowId: @rowId, columns: @columns}

class AllRowsSelected
    constructor: (@gridId)->
        throw new Error('Grid ID is required') unless @gridId
    serialize: ()-> 
        return {gridId: @gridId}
    
class AllRowsUnselected
    constructor: (@gridId)->
        throw new Error('Grid ID is required') unless @gridId
    serialize: ()->
        return {gridId: @gridId}

class GridChanged
    constructor: (@gridId, rows, @page, @total, @rowsPerGrid, @filter)->
        throw new Error('Grid ID is required') unless @gridId
        throw new Error('Rows are required') unless rows
        @rows = []

        for row in rows
            @rows.push {
                id: row.id
                columns: row.columns
                selected: row.selected
                updatedColumns: row.updatedColumns
            }

    page: ->
        return @page

    total: ->
        return @total

    filter: ->
        return @filter

    serialize: ()->
        return {gridId: @gridId, rows: @rows, page: @page, total: @total, rowsPerGrid: @rowsPerGrid, filter: @filter}
