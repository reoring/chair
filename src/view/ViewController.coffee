class ViewController
	constructor: (@gridId, @columnConfigJSON, ajaxURL, ajaxCommandURL, @tableSelector, @rowSelectedClass = 'row_selected', @moveModeName) ->
		@rowModifiedClass = 'row_modified'
		@applicationGridService = new GridService
		@applicationGridService.startup(@gridId, columnConfigJSON, ajaxURL, ajaxCommandURL)
		@selectedRows = {}

	startup: (@page, @rowsPerGrid)->
		moveMode = MoveModeFactory.create @moveModeName

		@table = new Table @gridId, $(@tableSelector), moveMode, @applicationGridService, @columnConfigJSON
		@table.header JSON.parse(@columnConfigJSON)

		moveMode.init @table, @applicationGridService, @rowSelectedClass

		@applicationGridService.change(@gridId, page, rowsPerGrid)

		@table.setFilterRow() unless @table.filterRowExists()

		DomainEvent.subscribe 'GridChanged', (event, eventName)=>
			if event.gridId isnt @gridId
				return null

			@table.removeAllRowsWithout('filter')

			for row in event.rows
				@table.insert row.columns, row.id
				@table.selectRow row.id, @rowSelectedClass if row.selected is true

				for columnId in row.updatedColumns
					@table.addClassToColumn(@table.rowIdOfGlobal(row.id), columnId, 'column_modified')
				
				if event.rows.length > 0
					@cursor()
			null

		DomainEvent.subscribe 'ColumnUpdated', (event, eventName)=>
			@table.addClassToColumn(@table.rowIdOfGlobal(event.rowId), event.columnId, 'column_modified')

		DomainEvent.subscribe 'RowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId if event.gridId is @gridId

		DomainEvent.subscribe 'RowRemoved', (event, eventName)=>
			@table.removeRow(event.gridId + '.' + event.rowId)

		DomainEvent.subscribe 'RowSaved', (event, eventName)=>
			@table.removeClassFromRowColumns(event.gridId + '.' + event.rowId, 'column_modified')

		DomainEvent.subscribe 'RowSelected', (event, eventName)=>
			@table.selectRow event.rowId, @rowSelectedClass if event.gridId is @gridId
			@selectedRows[event.rowId] = true

		DomainEvent.subscribe 'RowUnselected', (event, eventName)=>
			@table.unselectRow event.rowId, @rowSelectedClass if event.gridId is @gridId
			delete @selectedRows[event.rowId]

		ViewEvent.subscribe 'ViewFilterChanged', (event, eventName)=>
			@applicationGridService.change @gridId, @page, @rowsPerGrid, JSON.stringify(event)


	add: (rowId, values)->
		@applicationGridService.append @gridId, rowId, values

	save: (rowId)->
		@applicationGridService.save @gridId, rowId

	remove: (rowId)->
		@applicationGridService.removeRow @gridId, rowId

	removeSelectedRows: ->
		for id, value of @selectedRows
			@remove(id)

	saveAll: ()->
		@applicationGridService.saveAll @gridId

	selectAll: () ->
		@applicationGridService.selectAll(@gridId)

	unselectAll: () ->
		@applicationGridService.unselectAll(@gridId)

	movePageTo: (@page) ->
		@applicationGridService.change @gridId, @page, @rowsPerGrid

	cursor: (rowId) ->
		@table.cursorRow rowId unless rowId is undefined
		@table.cursorTop()


ViewEvent = 
    channels: {
        '*': []
    }
    publish: (eventName, event) ->
        @channels[eventName] = [] unless eventName of @channels
        eventData = event.serialize()
        subscriber(eventData, eventName) for subscriber in @channels['*']
        subscriber(eventData, eventName) for subscriber in @channels[eventName]
        null

    subscribe: (eventName, listener) ->
        @channels[eventName] = [] unless eventName of @channels
        @channels[eventName].push listener
        null
