class GridService
    select: (gridId, rowId)->
        DomainRegistry.rowSelectionService().select(gridId, rowId)

    unselect: (gridId, rowId)->
        DomainRegistry.rowSelectionService().unselect(gridId, rowId)
