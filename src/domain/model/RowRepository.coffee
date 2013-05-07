class RowRepository
    add: (row)->

    rowOfId: (gridId, rowId, callback)->


class JQueryAjaxRowRepository extends RowRepository
    constructor: (ajaxURL)->
        @ajaxURL = ajaxURL
        @gridContainer = new InMemoryRowContainer()

    add: (row)->
        throw new Error("Row ID is not specified") unless row.id
        throw new Error("Grid ID is not specified") unless row.gridId
        @gridContainer.add(row)

    rowOfId: (gridId, rowId, callback)->
        callback("Missing argument: gridId", null) unless gridId
        callback("Missing argument: rowId", null) unless rowId

        row = @gridContainer.get(rowId, gridId)

        if row instanceof Row
            callback(null, row)
        else
            # here needs to ajax to fetch that Row?
            callback(null, null)

    rowsSpecifiedBy: (condition, callback)->
        $.ajax {
            url: @ajaxURL
            data: {id: condition.gridId, page: condition.page, rowsPerGrid: condition.rowsPerGrid}
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
                total = data.total

                rowsForResponse = []

                for rowData in data.rows
                    @gridContainer.addByData(gridId, rowData)
                    row = @gridContainer.get(gridId, rowData.id)
                    rowsForResponse.push(row)

                callback(null, rowsForResponse)
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
        @add(new Row(rowId, columns, gridId))
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
        

