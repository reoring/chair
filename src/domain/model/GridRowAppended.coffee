class GridRowAppended
    constructor: (@gridId, @rowId, columns)->
        @columns = []
        for key, value of columns
            @columns.push(value)


    serialize: ()->
        return {
            gridId: @gridId
            rowId: @rowId
            columns: @columns
        }
