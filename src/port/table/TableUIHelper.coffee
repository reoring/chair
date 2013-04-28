class TableUIHelper
	@fitInputToCell: (input, column) ->
        paddingLeft   = parseInt(column.css('paddingLeft'), 10)
        paddingRight  = parseInt(column.css('paddingRight'), 10)
        paddingTop    = parseInt(column.css('paddingTop'), 10)
        paddingBottom = parseInt(column.css('paddingBottom'), 10)

        borderLeft   = parseInt(column.css('borderLeft'), 10)
        borderRight  = parseInt(column.css('borderRight'), 10)
        borderTop    = parseInt(column.css('borderTop'), 10)
        borderBottom = parseInt(column.css('borderBottom'), 10)

        ULTRA_COSMIC_CONST_NUMBER = 2

        input.css('marginLeft',   paddingLeft * -1)
        input.css('marginRight',  paddingRight * -1)
        input.css('marginTop',    (paddingTop + borderTop + ULTRA_COSMIC_CONST_NUMBER) * -1)
        input.css('marginBottom', paddingBottom * -1)

        input.width(column.width() + paddingLeft + paddingRight)
        input.height(column.height() + paddingTop + paddingBottom + borderTop)