class GridService

    startup: (gridId, columnsConfig, ajaxQueryURL, ajaxCommandURL)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Columns Config are required') unless columnsConfig
        throw new Error('Ajax Query URL is required') unless ajaxQueryURL

        ajaxCommandURL = ajaxQueryURL unless ajaxCommandURL

        columnsConfig = JSON.parse(columnsConfig)

        columns = []

        for config in columnsConfig
            formats = [] # todo: implement when we need that
            columns.push(new Column(config.id, config.title, formats))

        grid = new Grid(gridId, columns)

        DomainRegistry.gridRepository().add(grid)

        DomainRegistry.setRowRepository(new JQueryAjaxRowRepository(ajaxQueryURL, ajaxCommandURL))

        null

    select: (gridId, rowId)->
        DomainRegistry.rowRepository().rowOfId gridId, rowId, (error, row)->
            throw new Error(error) if error
            return null if row is null
            row.select()
        null

    save: (gridId, rowId)->
        rowRepository = DomainRegistry.rowRepository()
        rowRepository.save gridId, rowId, (error, row)=>
            throw new Error(error) if error
            return null if row is null
        null

    saveAll: (gridId)->
        rowRepository = DomainRegistry.rowRepository()
        rowRepository.saveAll gridId


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

    append: (gridId, rowId, columnValues)->
        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return null if grid is null
            grid.append new Row(rowId, columnValues)
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

    change: (gridId, page, rowsPerGrid, filter)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Page is required') unless page
        throw new Error('Rows Per Grid is required') unless rowsPerGrid
        DomainRegistry.gridChangeService().change(gridId, page, rowsPerGrid, filter)
        null
