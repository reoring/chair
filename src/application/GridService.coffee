class GridService
    select: (gridId, rowId)->
        DomainRegistry.rowRepository().rowOfId gridId, rowId, (error, row)->
            throw new Error(error) if error
            return null if row is null
            row.select()
        null

    unselect: (gridId, rowId)->
        DomainRegistry.rowRepository().rowOfId gridId, rowId, (error, row)->
            throw new Error(error) if error
            return null if row is null
            row.unselect()
        null

    selectAll: (gridId)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return null if grid is null
            grid.selectAllRows()
        null

    unselectAll: (gridId)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return null if grid is null
            grid.unselectAllRows()
        null

    updateColumn: (gridId, rowId, columnId, columnValue)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return null if grid is null
            grid.updateColumn(rowId, columnId, columnValue)
        null

    removeRow: (gridId, rowId)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return null if grid is null
            grid.removeRow(rowId)
        null

    change: (gridId, page, rowsPerGrid)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Page is required') unless page
        throw new Error('Rows Per Grid is required') unless rowsPerGrid
        DomainRegistry.gridChangeService().change(gridId, page, rowsPerGrid)
        null
