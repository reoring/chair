DomainRegistry = 
    _gridRepository: null

    rowSelectionService: ()->
        return new RowSelectionService()

    gridRepository: ()->
        if @_gridRepository is null
            @_gridRepository = new GridRepository()
        return @_gridRepository
