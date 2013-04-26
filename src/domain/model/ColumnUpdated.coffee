class GridColumnUpdated
    constructor: (@gridId, @rowId, @columnId, @columnValue)->

    serialize: ()->
        return {
            gridId: @gridId
            rowId: @rowId
            columnId: @columnId
            columnValue: @columnValue
        }
