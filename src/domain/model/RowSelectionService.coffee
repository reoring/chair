class RowSelectionService
    gridSelectionStatuses: [] # this is prototype attribute

    selectAll: (gridId)->
        @gridSelectionStatuses[gridId] = new AllRowSelectedStatus()

        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return if grid is null
            for row in grid.rows()
                DomainEvent.publish "GridRowSelected", new GridRowSelected(gridId, row.id)


    unselectAll: (gridId)->
        throw new Error('Invalid status transition') unless @gridSelectionStatuses[gridId]
        @gridSelectionStatuses[gridId] = new AllRowUnselectedStatus()

        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)->
            throw new Error(error) if error
            return if grid is null
            for row in grid.rows()
                DomainEvent.publish "GridRowUnselected", new GridRowUnselected(gridId, row.id)

    select: (gridId, rowId)->
        unless @gridSelectionStatuses[gridId]
            @gridSelectionStatuses[gridId] = new AllRowUnselectedStatus()
        @gridSelectionStatuses[gridId].select(rowId)

        DomainEvent.publish "GridRowSelected", new GridRowSelected(gridId, rowId)

    unselect: (gridId, rowId)->
        throw new Error('Invalid status transition') unless @gridSelectionStatuses[gridId]
        @gridSelectionStatuses[gridId].unselect(rowId)

        DomainEvent.publish "GridRowUnselected", new GridRowUnselected(gridId, rowId)
