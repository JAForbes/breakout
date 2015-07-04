var E = require("../entity_manager")

function Canvas(){
	var canvases = E.category("Canvas")

	Object.keys(canvases)
		.forEach(function(entity){
			var canvas = canvases[entity]
			canvas.ratio = canvas.ratio || { width: 1, height: 1}
			canvas.context = canvas.context || canvas.canvas.getContext("2d")
			canvas.canvas.width = canvas.parent.offsetWidth * canvas.ratio.width
			canvas.canvas.height = canvas.parent.offsetHeight * canvas.ratio.height
		})

}

module.exports = Canvas