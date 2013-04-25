class Grid
    constructor: (@id, columns)->
        @rows = []
        @rowIds = []
        @columns = []

        for column in columns
            @columns.push(column)

    append: (row)->
        if row.id in @rowIds
            throw new Error("Row(id:#{row.id}) already exists in the Grid(id:#{@id})")
        @rowIds.push(row.id)
        @rows.push(row)
        DomainEvent.publish("GridRowAppended", new GridRowAppended(@id, row.id, row.columns))
