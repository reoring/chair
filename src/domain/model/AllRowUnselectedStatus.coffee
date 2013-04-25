class AllRowUnselectedStatus
    constructor: ()->
        @selectedRows = []

    select: (rowId)->
        if rowId not in @selectedRows
            @selectedRows.push(rowId)

    unselect: (rowId)->
        if rowId in @selectedRows
            index = @selectedRows.indexOf(rowId)
            @selectedRows.splice(index, 1)
