class ViewController
	constructor: (@tableSelector, @header, @rowSelectedClass = 'row_selected') ->
		@table = new Table $(@tableSelector)

		@applicationGridService = new GridService()
		
		@table.header header

		@table.listenRowEvent 'click', (id, element) =>
			if @table.hasClassOfRow id, @rowSelectedClass
				@applicationGridService.unselect @tableSelector, id
			else
				@applicationGridService.select @tableSelector, id
			
		DomainEvent.subscribe 'GridRowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId

		DomainEvent.subscribe 'GridRowSelected', (event, eventName)=>
			@table.addClassToRow event.rowId, @rowSelectedClass

		DomainEvent.subscribe 'GridRowUnselected', (event, eventName)=>
			@table.removeClassFromRow event.rowId, @rowSelectedClass

	selectAll: () ->
		@applicationGridService.selectAll()

	unselectAll: () ->
		@applicationGridService.UnselectAll()