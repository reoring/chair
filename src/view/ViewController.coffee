class ViewController
	constructor: (@gridId, @columnConfigJSON, ajaxURL, @tableSelector, @rowSelectedClass = 'row_selected', @moveModeName) ->
		@applicationGridService = new GridService
		@applicationGridService.startup(@gridId, columnConfigJSON, ajaxURL)

	startup: ()->
		moveMode = MoveModeFactory.create @moveModeName

		@table = new Table @gridId, $(@tableSelector), moveMode, @applicationGridService
		@table.header JSON.parse(@columnConfigJSON)

		moveMode.init @table, @applicationGridService, @rowSelectedClass

		@applicationGridService.change(@gridId, 1, 20)

		DomainEvent.subscribe 'GridChanged', (event, eventName)=>
			if event.gridId is @gridId
				for row in event.rows
					@table.insert row.columns, row.id

			@cursor()

		DomainEvent.subscribe 'RowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId if event.gridId is @gridId

		DomainEvent.subscribe 'RowSelected', (event, eventName)=>
			@table.selectRow event.rowId, @rowSelectedClass if event.gridId is @gridId

		DomainEvent.subscribe 'RowUnselected', (event, eventName)=>
			@table.unselectRow event.rowId, @rowSelectedClass if event.gridId is @gridId


	add: (id, row)->
		@grid.append new Row(id, row)

	selectAll: (gridId) ->
		@applicationGridService.selectAll(gridId)

	unselectAll: (gridId) ->
		@applicationGridService.unselectAll(gridId)

	cursor: (rowId) ->
		@table.cursorRow rowId unless rowId is undefined
		@table.cursorTop()
