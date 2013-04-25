class RowSelectionService
    gridSelectionStatuses: [] # this is prototype attribute

    selectAll: (gridId)->
        @gridSelectionStatuses[gridId] = new AllRowSelectedStatus()

    unselectedAll: (gridId)->
        throw new Error('Invalid status trasition') unless @gridSelectionStatuses[gridId]
        @gridSelectionStatuses[gridId] = new AllRowUnselectedStatus()

    select: (gridId, rowId)->
        unless @gridSelectionStatuses[gridId]
            @gridSelectionStatuses[gridId] = new AllRowUnselectedStatus()
        @gridSelectionStatuses[gridId].select(rowId)

    unselect: (gridId, rowId)->
        throw new Error('Invalid status trasition') unless @gridSelectionStatuses[gridId]
        @gridSelectionStatuses[gridId].unselect(rowId)
