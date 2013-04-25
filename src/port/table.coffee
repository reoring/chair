class Table
    constructor: (@table) ->
        @rows = {}
        @rowsById = {}
        @numberOfRows = 0

    header: (@columns) ->
        newTr = $('<tr></tr>')

        for column in @columns
            newTr.append $('<th></th>').append $('<span></span>').append column
            @table.find('thead').append newTr

    get: (index) ->
        @rows[index]

    getById: (id) ->
        @rowsById[id]

    removeById: (id) ->
        @findRow(id).remove

        data = @getById id
        delete @rowsById[id]

        return data

    updateById: (id, data) ->
        newTr = $('<tr></tr>').attr 'data-id', id
        oldTr = $(@table).find('tr[data-id=' + id + ']')

        @getById id = data

        columnIndex = 0

        for x in data
            newTr.append @createRowColumn @columns[columnIndex], x
            columnIndex++

        oldTr.html(newTr.html())

    insert: (data, id) ->
        id = @guid() if id is undefined

        tr = $('<tr></tr>').attr 'data-id', id

        @rows[@numberOfRows++] = data
        @rowsById[id] = data

        columnIndex = 0

        for x in data
            tr.append @createRowColumn @columns[columnIndex], x
            columnIndex++

        @table.find('tbody').append tr

    createRowColumn: (column, value) ->
        $('<td></td>').addClass(column).append $('<span></span>').append value

    addClassToRow: (id, className) ->
        row = @findRow(id)
        row.addClass(className) if not row.hasClass(className)

    removeAllClassesFromRow: (id) ->
        row = @findRow(id)
        row.removeClass()

    toggleClassToRow: (id, className) ->
        @findRow(id).toggleClass className

    findRow: (id) ->
        $(@table).find('tr[data-id=' + id + ']')

    listen: (id, eventName, callback) ->
        @findRow(id).on eventName, ->
            callback id, $(this)

    listenRowEvent: (eventName, callback) ->
        @table.on eventName, 'tr', ->
            id = $(this).attr('data-id')
            callback id, $(this)


    listenTextEvent: (eventName, callback) ->
        @table.find('span').on eventName, ->
            id = $(this).parents('tr').attr('data-id')
            callback id, $(this)
            return false

    s4: ->
        Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1)

    guid: ->
      return @s4() + @s4() + '-' + @s4() + '-' + @s4() + '-' + @s4() + '-' + @s4() + @s4() + @s4()