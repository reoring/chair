class GridRowUnselected
	constructor: (@gridId, @rowId)->
		throw new Error("no grid id specified") unless @gridId
		throw new Error("no row id specified") unless @rowId


	serialize: ()->
		return {
            gridId: @gridId
            rowId: @rowId
        }