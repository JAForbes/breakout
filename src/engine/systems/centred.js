var E = require("../entity_manager")

function Centred(){

	E.each( "Centred" , function(alignment, entity){
		var location = E.component(entity, "Location")
		var	sprite = E.component(entity, "Sprite")

		var canvas = E.component(sprite.canvas, "Canvas")

		location.x = canvas.canvas.width / 2 - sprite.img.width / 2
		location.y = canvas.canvas.height / 2 - sprite.img.height / 2

	})

}
module.exports = Centred