class Row
    constructor: (@id, columns)->
        @columns = {}
        for columnId, columnValue of columns
            @columns[columnId] = "#{columnValue}"
