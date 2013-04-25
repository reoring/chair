class AllRowSelectedStatus
    constructor: ()->
        @unselectedRows = []

    select: (rowId)->
        if rowId in @unselectedRows
            index = @unselectedRows.indexOf(rowId)
            @unselectedRows.splice(index, 1)

    unselect: (rowId)->
        if rowId not in @unselectedRows
            @unselectedRows.push(rowId)
