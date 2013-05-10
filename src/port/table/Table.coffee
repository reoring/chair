class Table
    constructor: (@tableId, @table, @moveMode, @gridService, columnConfigJSON) ->
        @rows = {}
        @rowsById = {}
        @numberOfRows = 0

        @columnConfig = JSON.parse(columnConfigJSON)

        @currentCursor = undefined

        $(document).on 'keydown', (event) =>
            currentRow = @findRow @currentCursor

            if currentRow.length is 0
                return

            if event.which is 32 # space
                event.preventDefault()
                rowId = currentRow.attr('data-id').split('.')[2]

                if currentRow.hasClass 'row_selected'
                    @gridService.unselect @tableId, rowId
                else
                    @gridService.select @tableId, rowId

            if event.which is 40 # down cursor
                event.preventDefault()
                nextRow = currentRow.next()
                @cursorRow nextRow.attr 'data-id' unless nextRow.length is 0
            else if event.which is 38 # up cursor
                event.preventDefault()
                nextRow = currentRow.prev()
                @cursorRow nextRow.attr 'data-id' unless nextRow.length is 0

    reset: ->
        @rows = {}
        @rowsById = {}
        @numberOfRows = 0
        @currentCursor = undefined

    selector: ->
        @table.selector

    header: (@columns) ->
        newTr = $('<tr></tr>')

        @moveMode.beforeHeader? newTr

        for column in @columns
            newTr.append $('<th></th>').attr('data-column-id', column.id)
                                       .append $('<span></span>')
                                       .append column.title

            @table.find('thead').append newTr

        @moveMode.afterHeader? newTr

    get: (index) ->
        @rows[index]

    getById: (id) ->
        @rowsById[id]

    removeById: (id) ->
        @findRow(id).remove

        data = @getById id
        delete @rowsById[id]

        return data

    updateById: (rowId, data) ->
        id = @rowIdOfGlobal rowId

        newTr = $('<tr></tr>').attr 'data-id', id
        oldTr = $(@table).find('tr[data-id="' + id + '"]')

        @getById id = data

        columnIndex = 0

        for x in data
            newTr.append @createRowColumn @columns[columnIndex], x
            columnIndex++

        oldTr.html(newTr.html())

    cursorTop: () ->
        row = @get 0
        @cursorRow @rowIdOfGlobal row.id

    cursorRow: (rowId) ->
        if @currentCursor is undefined
            @addClassToRow rowId, 'current'
        else
            @removeClassFromRow @currentCursor, 'current'
            @addClassToRow rowId, 'current'

        @currentCursor = rowId

    rowIdOfGlobal: (rowId) ->
        @tableId + '.' + rowId

    insert: (data, id) ->
        id = @guid() if id is undefined

        rowId = @rowIdOfGlobal id

        tr = $('<tr></tr>').attr 'data-id', rowId

        @moveMode.beforeInsert? id, tr

        @rows[@numberOfRows++] = {id: id, data: data}
        @rowsById[id] = data

        for columnConfig in @columnConfig
            tr.append @createRowColumn columnConfig, data[columnConfig.id]

        @table.find('tbody').append tr

        @moveMode.afterInsert? id, tr

    createRowColumn: (column, value) ->
        td = $('<td></td>')
        td.addClass(column).attr('data-column', column.id)
        td.attr('data-column-editable', column.editable)
        td.addClass('disabled') if column.editable is false
        td.append $('<span></span>').append value

    selectRow: (rowId, cssClass) ->
        @moveMode.beforeRowSelect? rowId
        @addClassToRow @rowIdOfGlobal(rowId), cssClass
        @moveMode.afterRowSelect? rowId

    unselectRow: (rowId, cssClass) ->
        @moveMode.beforeRowUnselect? rowId
        @removeClassFromRow @rowIdOfGlobal(rowId), cssClass
        @moveMode.afterRowUnselect? rowId

    addClassToRow: (id, className) ->
        row = $ @findRow(id)
        row.addClass(className) unless row.hasClass(className)

    addClassToColumn: (rowId, columnName, className) ->
        row = @findRow rowId
        column = row.find 'td[data-column="'+columnName+'"]'
        column.addClass className

    removeClassFromRow: (id, className) ->
        @findRow(id).removeClass(className)

    removeAllRows: () ->
        @reset()
        @table.find('tbody').html ''

    removeAllClassesFromRow: (id) ->
        row = @findRow(id)
        row.removeClass()

    toggleClassToRow: (id, className) ->
        @findRow(id).toggleClass className

    hasClassOfRow: (id, className) ->
        @findRow(id).hasClass className

    findRow: (rowId) ->
        $(@table).find('tr[data-id="' + rowId + '"]')

    listen: (id, eventName, callback) ->
        @findRow(id).on eventName, ->
            callback id, $(this)

    listenRowEvent: (eventName, callback) ->
        @table.on eventName, 'tr', ->
            id = $(this).attr('data-id')
            callback id, $(this)

    toRowEdit: (rowId) ->
        row = @findRow rowId

    toCellEdit: (rowId, columnId) ->
        row = @findRow rowId
        column = row.find('td[data-column="' + columnId + '"]')

        @_editCell column if @isCellEditable column

    isCellEditable: (column) ->
        column.attr('data-column-editable') is 'true'

    _editPreviousCell: (column) ->
        column = @searchEditableColumnToBackward column
        return false if column is false
        @_editCell column if @isCellEditable column

    searchEditableColumnToBackward: (column, depth = 1) ->
        return false if depth > 20 # Give up searching editable column

        prevColumn = column.prev()

        return prevColumn if @isCellEditable prevColumn

        if prevColumn.length is 0
            parent = column.parent().prev()
            numberOfChildren = parent.children().length
            prevColumn = $ parent.children()[numberOfChildren - 1]
            return prevColumn if @isCellEditable prevColumn

        @searchEditableColumnToBackward prevColumn, depth + 1

    searchEditableColumnToForward: (column, depth = 1) ->
        return false if depth > 20 # Give up searching editable column

        nextColumn = column.next()

        return nextColumn if @isCellEditable nextColumn

        if nextColumn.length is 0
            nextRow = column.parent().next()
            nextColumn = $ nextRow.children()[0]
            return nextColumn if @isCellEditable nextColumn
        
        @searchEditableColumnToForward nextColumn, depth + 1

    _editNextCell: (column) ->
        column = @searchEditableColumnToForward column
        return false if column is false
        @_editCell column if @isCellEditable column

    _editCell: (column) ->
        return false if column is false

        input = $('<input type="text"></input>').val(column.text())

        TableUIHelper.fitInputToCell input, column
        column.find("span").replaceWith(input)
        input.select()

        @moveMode.move? input, column

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