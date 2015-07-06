var E = require("../entity_manager")

//todo-james Movement functions should migrate to systems/
function Accelerate(){
	E.each('Accelerate', function(a, id){
		var A = E.component(id, 'Acceleration') || {x:0, y:0}

		if(a.x || a.y){
			a.x && (A.x += a.x)
			a.y && (A.y += a.y)
		} else {

			var angle = a.angle || E.component(id, 'Angle').value || 0
			var accelerationRate = E.component(id, 'AccelerationRate').value || 1
			A.x += Math.cos(angle) * accelerationRate
			A.y += Math.sin(angle) * accelerationRate
		}
		E.addComponent('Acceleration',A,id)


	})
	E._components.Accelerate && E.create({
		RemoveCategory: {name: 'Accelerate'}
	})
}

function Friction(){
	E.each("Friction", function(friction, id){
		var velocity = E.component(id, "Velocity")
		velocity.x *= friction.value
		velocity.y *= friction.value
	})
}


function Velocity(){

	E.each("Velocity", function(velocity, id){
		var location = E.component(id, "Location")
		var acceleration = E.component(id, "Acceleration") || { x:0 , y: 0}

		velocity.x += acceleration.x
		velocity.y += acceleration.y


		acceleration.x = 0
		acceleration.y = 0

		var new_x = location.x + velocity.x
		var new_y = location.y + velocity.y
		var delta = {
			x: new_x - location.x,
			y: new_y - location.y
		}
		var easing = 2
		location.x += delta.x / easing
		location.y += delta.y / easing
	})
}

function Gravity(){
	E.each("Gravity", function(gravity,id){
		var acceleration = E.component(id, 'Acceleration')
		acceleration.y += gravity.value
	})
}

module.exports = [
	Accelerate,
	Friction,
	Velocity,
	Gravity
]