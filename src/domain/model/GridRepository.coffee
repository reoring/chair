class GridRepository
    constructor: (grids = [])->
        @grids = {}
        for grid in grids
            @add(grid)

    gridOfId: (id, callback)->
        unless @grids[id]
            callback(null, null)
            return
        callback(null, @grids[id])

    add: (grid)->
        @grids[grid.id] = grid
