var E = require("../entity_manager.js")

function initialize(element, id){
	if( !element._element ){
		element._element = document.createElement(element.tagName)
		element._element.className = element.className
		element._element.innerText = element.innerText
		element._element.id = element.id
		element.parent.appendChild(
			element._element
		)
	}
}

function update(element, id){
	var location = E.component(id, "Location")
	var dimensions = E.component(id, "Dimensions")

	element._element.style.transform = "translate("+location.x+"px,"+location.y+"px)"
	element._element.style.width = dimensions.width + "px"
	element._element.style.height = dimensions.height + "px"
}

function remove(element, id){
	var remove = E.component(id, "Remove")
	if( remove ){
		remove.entity = remove.entity || id
		if(remove.entity == id){
			element.parent.removeChild(
				element._element
			)
		}
	}
}

function Element(){


	E.each("Element", function(element, id){
		initialize(element, id)
		update(element,id)
		remove(element, id)
	})
}

module.exports = Element