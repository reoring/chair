class ColumnFormat
    constructor: (@formatter)->

    format: (columnValue)->
        return @formatter(columnValue)
