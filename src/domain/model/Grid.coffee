class Grid
    constructor: (@id, columns)->
        @_rows = {}
        @columns = []

        for column in columns
            @columns.push(column)

    append: (row)->
        throw new Error("Row(id:#{row.id}) already exists in the Grid(id:#{@id})") if @_hasRow(row.id)
        @_addRow(row)

    updateColumn: (rowId, columnId, columnValue)->
        if @_hasRow(rowId)
            @_getRow(rowId).updateColumn(columnId, columnValue, @id)

    rows: ()->
        return (row for own key, row of @_rows)

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
        DomainEvent.publish("GridRowAppended", new GridRowAppended(@id, row.id, row.columns))
