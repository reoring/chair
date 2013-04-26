class GridService
    select: (gridId, rowId)->
        DomainRegistry.rowSelectionService().select(gridId, rowId)

    unselect: (gridId, rowId)->
        DomainRegistry.rowSelectionService().unselect(gridId, rowId)

    selectAll: (gridId)->
    	DomainRegistry.rowSelectionService().selectAll(gridId)

    unselectAll: (gridId)->
    	DomainRegistry.rowSelectionService().unselectAll(gridId)