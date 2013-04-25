class InMemoryGridRepository extends GridRepository
    constructor: ()->
        @grids = {}
    gridOfId: (id, callback)->
        if id not in @grids 
            callback(null, "grid not found of id(#{id})")
        else
            callback(@grids[id], null)