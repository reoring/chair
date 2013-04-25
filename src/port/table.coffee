define ->
    class Chair
        constructor: (@table) ->
            @rows = {}
            @rowsById = {}
            @numberOfRows = 0

        get: (index) ->
            @rows[index]

        getById: (id) ->
            @rowsById[id]

        removeById: (id) ->
            $(@table).find('tr[data-id=' + id + ']').remove

            data = @getById id
            delete @rowsById[id]

            return data

        updateById: (id, data) ->
            newTr = $('<tr></tr>').attr 'data-id', id
            oldTr = $(@table).find('tr[data-id=' + id + ']')

            @getById id = data

            for x in data
                newTr.append $('<td></td>').append x

            oldTr.html(newTr.html())

        insert: (data, id) ->
            tr = $('<tr></tr>').attr 'data-id', id

            @rows[@numberOfRows++] = data
            @rowsById[id] = data if id?

            for x in data
                tr.append $('<td></td>').append x

            @table.find('tbody').append tr