class GridChangeService
    change: (gridId, page, rowsPerGrid)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Page is required') unless page
        throw new Error('Rows Per Grid is required') unless rowsPerGrid

        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return if grid is null

            condition = {
                gridId: grid.id
                page: page
                rowsPerGrid: rowsPerGrid
            }

            DomainRegistry.rowRepository().rowsSpecifiedBy condition, (error, rows)->
                throw new Error(error) if error
                grid.change(rows)

        null
