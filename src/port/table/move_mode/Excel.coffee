class ExcelMoveMode
	init: (@table, @applicationGridService, @rowSelectedClass) ->
		@table.listenCellEvent 'click', (rowId, element) =>
			columnName = element.attr('data-column')
			@table.toCellEdit rowId, columnName

	beforeHeader: (tr) ->
		input = $('<input></input>').attr 'type', 'checkbox'

		input.on 'click', =>
			checkbox = $(this)
			if checkbox.prop 'checked'
				@applicationGridService.unselectAll @table.selector()
				checkbox.prop 'checked', false
			else
				@applicationGridService.selectAll @table.selector()
				checkbox.prop 'checked', true

		tr.append $('<td></td>').append(input)

	beforeInsert: (id, tr) ->
		input = $('<input></input>').attr 'type', 'checkbox'
		input.attr 'data-row-id', id

		input.on 'click', =>
			if @table.hasClassOfRow @table.rowIdOfGlobal(id), @rowSelectedClass
				@applicationGridService.unselect @table.tableId, id
			else
				@applicationGridService.select @table.tableId, id

		tr.append $('<td></td>').append input

	beforeRowSelect: (id) ->
		$('input[data-row-id="' + id + '"]').prop 'checked', true

	beforeRowUnselect: (id) ->
		$('input[data-row-id="' + id + '"]').prop 'checked', false

	move: (input, column) ->
		input.on 'keydown', (event) =>
			if event.which is 9 # tab
				event.preventDefault()

				input.replaceWith $('<span></span>').text input.val()
				
				if event.shiftKey is true
					@table._editPreviousCell column
				else
					@table._editNextCell column

			if event.which is 13 # enter
				input.replaceWith $('<span></span>').text input.val()

				if event.shiftKey is true
					prevRow = $ column.parent().prev()
					prevColumn = prevRow.find('td[data-column="' + column.attr('data-column') + '"]')

					@table._editCell prevColumn
				else
					nextRow = $ column.parent().next()
					nextColumn = nextRow.find('td[data-column="' + column.attr('data-column') + '"]')

					@table._editCell nextColumn

		input.on 'blur', =>
			input.replaceWith $('<span></span>').text input.val()