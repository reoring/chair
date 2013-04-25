class Column
    constructor: (columnId, name, formats = [])->
        @id = columnId
        @name = name
        @formats = formats

    format: (columnValue)->
        columnValue = @escapeHTML(columnValue)
        for format in @formats
            columnValue = format.format(columnValue)
        return columnValue

    escapeHTML: (string)->
        return string
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")