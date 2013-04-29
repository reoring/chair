class MoveModeFactory
	@classes = {excel: ExcelMoveMode, sequence: SequenceMoveMode}

	@create: (name) ->
		return new @classes[name]
