class Grid
    constructor: (@id)->
        @rows = []
        @rowIds = []

    append: (row)->
        if row.id in @rowIds
            throw new Error("Row(id:#{row.id}) already exists in the Grid(id:#{@id})")
        @rowIds.push(row.id)
        @rows.push(row)
