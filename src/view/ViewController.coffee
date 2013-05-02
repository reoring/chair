class ViewController
	constructor: (@grid, @tableSelector, @header, @rowSelectedClass = 'row_selected', moveModeName) ->
		moveMode = MoveModeFactory.create moveModeName

		@applicationGridService = new GridService

		@table = new Table $(@tableSelector), moveMode, @applicationGridService
		@table.header header

		moveMode.init @table, @applicationGridService, @rowSelectedClass

		DomainEvent.subscribe 'GridChanged', (event, eventName)=>
			if event.gridId is @tableSelector
				for row in event.rows
					@table.insert row.columns, row.rowId

		DomainEvent.subscribe 'RowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId if event.gridId is @tableSelector

		DomainEvent.subscribe 'RowSelected', (event, eventName)=>
			@table.selectRow event.rowId, @rowSelectedClass if event.gridId is @tableSelector

		DomainEvent.subscribe 'RowUnselected', (event, eventName)=>
			@table.unselectRow event.rowId, @rowSelectedClass if event.gridId is @tableSelector

	add: (id, row)->
		@grid.append new Row(id, row)

	selectAll: (gridId) ->
		@applicationGridService.selectAll(gridId)

	unselectAll: (gridId) ->
		@applicationGridService.unselectAll(gridId)

	cursor: (rowId) ->
		@table.cursorRow rowId
