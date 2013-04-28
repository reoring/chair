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
        td = $('<td></td>')
        td.addClass(column).attr('data-column', column)
        td.append $('<span></span>').append value

    addClassToRow: (id, className) ->
        row = @findRow(id)
        row.addClass(className) if not row.hasClass(className)

    removeClassFromRow: (id, className) ->
        @findRow(id).removeClass(className)

    removeAllClassesFromRow: (id) ->
        row = @findRow(id)
        row.removeClass()

    toggleClassToRow: (id, className) ->
        @findRow(id).toggleClass className

    hasClassOfRow: (id, className) ->
        @findRow(id).hasClass className

    findRow: (id) ->
        $(@table).find('tr[data-id=' + id + ']')

    listen: (id, eventName, callback) ->
        @findRow(id).on eventName, ->
            callback id, $(this)

    listenRowEvent: (eventName, callback) ->
        @table.on eventName, 'tr', ->
            id = $(this).attr('data-id')
            callback id, $(this)

    toRowEdit: (rowId) ->
        row = @findRow rowId

    _editCell: (column) ->
        input = $('<input type="text"></input>').val(column.text())

        paddingLeft   = parseInt(column.css('paddingLeft'), 10)
        paddingRight  = parseInt(column.css('paddingRight'), 10)
        paddingTop    = parseInt(column.css('paddingTop'), 10)
        paddingBottom = parseInt(column.css('paddingBottom'), 10)

        borderLeft   = parseInt(column.css('borderLeft'), 10)
        borderRight  = parseInt(column.css('borderRight'), 10)
        borderTop    = parseInt(column.css('borderTop'), 10)
        borderBottom = parseInt(column.css('borderBottom'), 10)

        ULTRA_COSMIC_CONST_NUMBER = 2

        input.css('marginLeft',   paddingLeft * -1)
        input.css('marginRight',  paddingRight * -1)
        input.css('marginTop',    (paddingTop + borderTop + ULTRA_COSMIC_CONST_NUMBER) * -1)
        input.css('marginBottom', paddingBottom * -1)

        input.width(column.width() + paddingLeft + paddingRight)
        input.height(column.height() + paddingTop + paddingBottom + borderTop)

        column.find("span").replaceWith(input)

        input.select()

        input.on 'keypress', (event) =>
            if event.which == 13
                input.replaceWith $('<span></span>').text input.val()

                if column.next().length == 0
                    @_editCell $(column.parent().next().find('td')[0])
                else
                    @_editCell column.next()

        input.on 'blur', =>
            input.replaceWith $('<span></span>').text input.val()


    toCellEdit: (rowId, columnName) ->
        row = @findRow rowId
        column = row.find("td[class=" + columnName + "]")

        @_editCell column


    listenCellEvent: (eventName, callback) ->
        @table.on eventName, 'td', ->
            id = $(this).parents('tr').attr('data-id')
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