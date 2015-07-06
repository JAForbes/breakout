var E = require("../entity_manager")

function onmousemove (event){
	//unless your target is changing size all the time, you really only have to do this once. config?
	var bounding_rect = event.target.getBoundingClientRect()

	var x = event.pageX - bounding_rect.left
	var y = event.pageY - bounding_rect.top

	E.each( "Mouse", function(mouse, entity){
		var location = E.component(entity, "Location" )
		location.x = x
		location.y = y
	})

}

function Mouse(element){

	element.addEventListener("mousemove", onmousemove)

	return {

		destroy: function(){
			element.removeEventListener("mousemove", onmousemove)
		}
	}
}

module.exports = Mouse