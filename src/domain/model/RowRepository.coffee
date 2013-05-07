class RowRepository
    add: (row)->

    rowOfId: (gridId, rowId, callback)->


class JQueryAjaxRowRepository extends RowRepository
    constructor: (ajaxURL)->
        @ajaxURL = ajaxURL
        @_grids = {}

    add: (row)->
        throw new Error("Row ID is not specified") unless row.id
        throw new Error("Grid ID is not specified") unless row.gridId
        gridId = row.gridId
        rowId  = row.id
        @_grids[gridId] = {} unless gridId of @_grids 
        @_grids[gridId][rowId] = row

    rowOfId: (gridId, rowId, callback)->
        callback("Missing argument: gridId", null) unless gridId
        callback("Missing argument: rowId", null) unless rowId

        if @_grids[gridId]?[rowId]?
            callback(null, @_grids[gridId][rowId])
        else
            # here needs to ajax?
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

                for row in data.rows
                    if @_grids[gridId]?[row.id]?
                        rowsForResponse.push(@_grids[gridId][row.id])
                    else
                        columns = {}
                        for own name, value of row
                            columns[name] = value if name isnt 'id'

                        @_grids[gridId] = {} if @_grids[gridId] is undefined

                        row = new Row(row.id, columns, gridId)

                        @_grids[gridId][row.id] = row
                        rowsForResponse.push(row)

                callback(null, rowsForResponse)
                null

            error: (xhr, status, error)=>
                return callback(error, null)
        }


