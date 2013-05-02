DomainRegistry = 
    _gridRepository: null
    _rowRepository: null

    gridRepository: ()->
        if @_gridRepository is null
            @_gridRepository = new GridRepository()
        return @_gridRepository

    rowRepository: ()->
        return @_rowRepository

    setRowRepository: (@_rowRepository)->

    gridChangeService: ()->
        return new GridChangeService()
