class Column
    constructor: (columnId, name, formats = [])->
        @id = columnId
        @name = name
        @formats = formats

    format: (columnValue)->
        for format in @formats
            columnValue = format.format(columnValue)
        return columnValue
