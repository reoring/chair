class ViewController
	constructor: (@grid, @tableSelector, @header, @rowSelectedClass = 'row_selected', moveModeName) ->
		moveMode = MoveModeFactory.create moveModeName

		@applicationGridService = new GridService

		@table = new Table $(@tableSelector), moveMode
		@table.header header

		moveMode.init @table, @applicationGridService, @rowSelectedClass

		DomainEvent.subscribe 'GridRowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId

		DomainEvent.subscribe 'GridRowSelected', (event, eventName)=>
			@table.selectRow event.rowId, @rowSelectedClass

		DomainEvent.subscribe 'GridRowUnselected', (event, eventName)=>
			@table.unselectRow event.rowId, @rowSelectedClass

	add: (id, row)->
		@grid.append new Row(id, row)

	selectAll: (gridId) ->
		@applicationGridService.selectAll(gridId)

	unselectAll: (gridId) ->
		@applicationGridService.unselectAll(gridId)