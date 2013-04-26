class GridService
    select: (gridId, rowId)->
        DomainRegistry.rowSelectionService().select(gridId, rowId)

    unselect: (gridId, rowId)->
        DomainRegistry.rowSelectionService().unselect(gridId, rowId)

    selectAll: (gridId)->
    	DomainRegistry.rowSelectionService().selectAll(gridId)

    unselectAll: (gridId)->
    	DomainRegistry.rowSelectionService().unselectAll(gridId)

    updateColumn: (gridId, rowId, columnId, columnValue)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return if grid is null
            grid.updateColumn(rowId, columnId, columnValue)

    removeRow: (gridId, rowId)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return if grid is null
            grid.removeRow(rowId)
