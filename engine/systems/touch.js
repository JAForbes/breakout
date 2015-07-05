var Hammer = require("hammerjs")
var E = require("../entity_manager")

function ontap(event){

	//unless your target is changing size all the time, you really only have to do this one
	var bounding_rect = event.target.getBoundingClientRect()

	var x = event.center.x - bounding_rect.left
	var y = event.center.y - bounding_rect.top


	//Naive: if you have lots of Tappable's maybe use a qtree? https://github.com/JAForbes/qtree
	E.each("Tappable", function(tappable, entity){
		var location = E.component(entity, "Location")
		var dimensions = E.component(entity, "Dimensions")

		var top = location.x
		var left = location.y
		var bottom = top + dimensions.height
		var right = left + dimensions.width

		var outside = (
			x < left ||
			y < top ||
			x > right ||
			y >bottom
		)

		if( !outside ){

			E.add(entity, {
				Tap: { x: x, y: y }
			})
		}
	})

	E._components.Tap && E.create({
		RemoveCategory: { name: "Tap"}
	})
}

function Touch(element){
	var hammer = new Hammer(element)

	hammer.on("tap", ontap)

	return hammer
}

module.exports = Touch