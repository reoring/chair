class ViewController
	constructor: (@gridId, @columnConfigJSON, ajaxURL, @tableSelector, @rowSelectedClass = 'row_selected', @moveModeName) ->
		@rowModifiedClass = 'row_modified'
		@applicationGridService = new GridService
		@applicationGridService.startup(@gridId, columnConfigJSON, ajaxURL)

	startup: (page, @rowsPerGrid)->
		moveMode = MoveModeFactory.create @moveModeName

		@table = new Table @gridId, $(@tableSelector), moveMode, @applicationGridService
		@table.header JSON.parse(@columnConfigJSON)

		moveMode.init @table, @applicationGridService, @rowSelectedClass

		@applicationGridService.change(@gridId, page, rowsPerGrid)

		# DomainEvent.subscribe '*', (event, eventName)->
		#     console.log "I got #{eventName}: #{JSON.stringify(event)}"

		DomainEvent.subscribe 'GridChanged', (event, eventName)=>
			@table.removeAllRows()
			
			if event.gridId is @gridId
				for row in event.rows
					@table.insert row.columns, row.id
					@table.selectRow row.id, @rowSelectedClass if row.selected is true

					for columnId in row.updatedColumns
						@table.addClassToColumn(@table.rowIdOfGlobal(row.id), columnId, 'column_modified')

			@cursor()

		DomainEvent.subscribe 'ColumnUpdated', (event, eventName)=>
			@table.addClassToColumn(@table.rowIdOfGlobal(event.rowId), event.columnId, 'column_modified')

		DomainEvent.subscribe 'RowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId if event.gridId is @gridId

		DomainEvent.subscribe 'RowSelected', (event, eventName)=>
			@table.selectRow event.rowId, @rowSelectedClass if event.gridId is @gridId

		DomainEvent.subscribe 'RowUnselected', (event, eventName)=>
			@table.unselectRow event.rowId, @rowSelectedClass if event.gridId is @gridId


	add: (rowId, values)->
		@applicationGridService.append @gridId, rowId, values

	selectAll: () ->
		@applicationGridService.selectAll(@gridId)

	unselectAll: () ->
		@applicationGridService.unselectAll(@gridId)

	movePageTo: (page) ->
		@applicationGridService.change @gridId, page, @rowsPerGrid

	cursor: (rowId) ->
		@table.cursorRow rowId unless rowId is undefined
		@table.cursorTop()
