class ViewController
	constructor: (@grid, @tableSelector, @header, @rowSelectedClass = 'row_selected', moveModeName) ->
		moveMode = MoveModeFactory.create moveModeName

		@table = new Table $(@tableSelector), moveMode
		@table.header header

		moveMode.init @table, new GridService, @rowSelectedClass

		DomainEvent.subscribe 'GridRowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId

		DomainEvent.subscribe 'GridRowSelected', (event, eventName)=>
			@table.addClassToRow event.rowId, @rowSelectedClass

		DomainEvent.subscribe 'GridRowUnselected', (event, eventName)=>
			@table.removeClassFromRow event.rowId, @rowSelectedClass

	add: (id, row)->
		@grid.append new Row(id, row)

	selectAll: (gridId) ->
		@applicationGridService.selectAll(gridId)

	unselectAll: (gridId) ->
		@applicationGridService.unselectAll(gridId)