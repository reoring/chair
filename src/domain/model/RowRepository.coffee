class RowRepository
    add: (row)->

    rowOfId: (gridId, rowId, callback)->


class JQueryAjaxRowRepository extends RowRepository
    constructor: (ajaxQueryURL, ajaxCommandURL)->
        @ajaxQueryURL = ajaxQueryURL
        @ajaxCommandURL = ajaxCommandURL
        @gridContainer = new InMemoryRowContainer()

    add: (row)->
        throw new Error("Row ID is not specified") unless row.id
        throw new Error("Grid ID is not specified") unless row.gridId
        @gridContainer.add(row)

    rowOfId: (gridId, rowId, callback)->
        callback("Missing argument: gridId", null) unless gridId
        callback("Missing argument: rowId", null) unless rowId

        row = @gridContainer.get(gridId, rowId)

        if row instanceof Row
            callback(null, row)
        else
            # here needs to ajax to fetch that Row?
            callback(null, null)

    save: (gridId, rowId, callback)->
        callback("Missing argument: gridId", null) unless gridId
        callback("Missing argument: rowId", null) unless rowId

        row = @gridContainer.get(gridId, rowId)

        return unless row.isModified()

        data = {}
        data.bulk    = false
        data.gridId  = gridId
        data.rowId   = rowId
        data.columns = JSON.stringify(row.columns)
        data.deleted = row.deleted

        $.ajax {
            url: @ajaxCommandURL
            data: data
            dataType: 'json'
            success: (data)=>
                row.save()
        }

    saveAll: (gridId, callback)->
        callback("Missing argument: gridId", null) unless gridId

        modifiedRows = @gridContainer.getModifiedRows(gridId)
        deletedRows  = @gridContainer.getDeletedRows(gridId)

        modified = Object.keys(modifiedRows).length is 0
        deleted  = Object.keys(deletedRows).length is 0

        return if (modified == true && deleted == true)

        data = {}
        data.bulk = true
        data.gridId = gridId
        data.rows = JSON.stringify(modifiedRows)
        data.deletedRows = JSON.stringify(deletedRows)

        $.ajax {
            url: @ajaxCommandURL
            data: data
            dataType: 'json'
            success: (data)=>
                #
                # TODO save ignore if failed to save on the server side at the some of a rows
                #
                for rowId, row of modifiedRows
                    row.save()
        }

    rowsSpecifiedBy: (condition, callback)->
        $.ajax {
            url: @ajaxQueryURL
            data: {
                    id:               condition.gridId
                    page:             condition.page
                    rowsPerGrid:      condition.rowsPerGrid
                    filter:           condition.filter
                    additionalFilter: condition.additionalFilter
                  }

            dataType: 'json'
            success: (data)=>
                return callback("Response is not object", null) if typeof data isnt 'object'
                return callback("Invalid scheme: gridId is missing", null) if 'id' not of data
                return callback("Invalid scheme: rows is missing", null) if 'rows' not of data
                return callback("Invalid scheme: total is missing", null) if 'total' not of data

                for row in data.rows
                    return callback("Row id is missing: #{JSON.stringify(row)}", null) unless row.id

                gridId = data.id
                rows = data.rows

                rowsForResponse = []

                for rowData in data.rows
                    @gridContainer.addByData(gridId, rowData)
                    row = @gridContainer.get(gridId, rowData.id)
                    rowsForResponse.push(row)

                response = {
                    gridId: gridId
                    rows:   rowsForResponse
                    total:  data.total
                }

                callback(null, response)
                null

            error: (xhr, status, error)=>
                return callback(error, null)
        }

class InMemoryRowContainer
    constructor: ()->
        @grids = {}
        
    addByData: (gridId, rowData)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Row data must be instance of Object') if rowData not instanceof Object
        throw new Error('Row data must NOT be instance of Row') if rowData instanceof Row
        throw new Error('Row must contain "id" key') unless rowData.id
        
        rowId = rowData.id
        
        if @_rowExists(gridId, rowId)
            return 

        columns = @_removeIdFromColumns(rowData, 'id')

        DomainRegistry.gridRepository().gridOfId gridId, (error, grid)=>
            throw new Error('Failed to find Grid') if error
            throw new Error('Grid not found') if grid not instanceof Grid

            row = new Row(rowId, columns, gridId)
            if grid.allRowSelected()
                row.selected = true
            else
                row.selected = false
            @add(row)

        null
    
    add: (row)->
        throw new Error('Row must be instanceof Row') if row not instanceof Row
        throw new Error('Row ID is required') unless row.id
        throw new Error('Row grid ID is required') unless row.gridId
        gridId = row.gridId
        rowId = row.id
        if @grids[gridId] is undefined
            @grids[gridId] = {}
        @grids[gridId][rowId] = row
        null
        
    get: (gridId, rowId)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Row ID is required') unless rowId

        if @_rowExists(gridId, rowId)
            return @grids[gridId][rowId]
        else
            return null

    getModifiedRows: (gridId)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Grid not found: ' + gridId) unless @_gridExists(gridId)

        modifiedRows = {}

        for rowId, row of @grids[gridId]
            modifiedRows[rowId] = row if row.isModified()

        return modifiedRows

    getDeletedRows: (gridId)->
        throw new Error('Grid ID is required') unless gridId
        throw new Error('Grid not found: ' + gridId) unless @_gridExists(gridId)

        deletedRows = {}

        for rowId, row of @grids[gridId]
            deletedRows[rowId] = row if row.isDeleted()

        return deletedRows

    _gridExists: (gridId)->
        return @grids[gridId]?
   
    _rowExists: (gridId, rowId)->
        return @grids[gridId]?[rowId]?
        
    _removeIdFromColumns: (rowData, idKey)->
        columns = {}
        for own name, value of rowData
            if name is idKey
                # no-op
            else
                columns[name] = value
        return columns
