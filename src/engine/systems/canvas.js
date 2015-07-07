var E = require("../entity_manager")

function Canvas(){
	var canvases = E.category("Canvas")

	Object.keys(canvases)
		.forEach(function(entity){
			var canvas = canvases[entity]
			canvas.ratio = canvas.ratio || { width: 1, height: 1}
			canvas.context = canvas.context || canvas._canvas.getContext("2d")
			canvas._canvas.width = canvas._parent.offsetWidth * canvas.ratio.width
			canvas._canvas.height = canvas._parent.offsetHeight * canvas.ratio.height
		})

}

module.exports = Canvas