var systems = {};
var E = require("../entity_manager")
var SAT = require("sat")
var _ = {
	each: require("lodash/collection/each"),
	clone: require("lodash/lang/clone")
}


systems.SAT = function(){


	/*
		Creates a list of entities that are relevant to collision detection.

		Based on the types specified in the CollidesWith component
	*/
	E.each("CollidesWith", function(collidesWith, entity){
		delete collidesWith.entities
		var relevant = {}

		_.each(collidesWith, function(componentsToAdd, against_component_name ){

			E.each( against_component_name , function(component, against_entity){
				relevant[against_entity] = true
			})
		})
		collidesWith.entities = relevant

	})

	E.each("SAT", function(sat, entity){
		sat.box = new SAT.Box()
		var dimensions = E.component(entity, "Dimensions")
		sat.box.pos = E.component(entity, "Location")
		sat.box.w = dimensions.width
		sat.box.h = dimensions.height
	})

	var processed = {}

	E.each("CollidesWith", function(collidesWith, a){
		_.each(collidesWith.entities, function(relevant, b){

			if( a != b && !processed[a+":"+b] ){
				processed[b+":"+a] = true
				var satA = E.component(a, "SAT")
				var satB = E.component(b, "SAT")
				var response = new SAT.Response()

				var collided = SAT.testPolygonPolygon(
					satA.box.toPolygon(),
					satB.box.toPolygon(),
					response
				) && response
			}

			if(collided){
				var aCollided = E.component(a, "Collided") || {}
				;(aCollided.collisions = aCollided.collisions || {})[b] = {response: response}

				E.addComponent("Collided", aCollided, a)

				var bCaresAbout = E.component(b, "CollidesWith") || { entities: {} }
				bCaresAboutA = bCaresAbout.entities[a]
				if(bCaresAboutA){
					var bCollided = E.component(b, "Collided") || {}
					;(bCollided.collisions = bCollided.collisions || {})[b] = {response: response}
					E.addComponent("Collided", bCollided, b)
				}
			}

		})
	})
	if( E._components.Collided ) {
		E.create({
			RemoveCategory: { name: 'Collided' }
		})
	}
}


//Adds components to an entity, if it has collided with a particular type.
//The types are specified in CollidesWith

systems.CollidesWith = function(){

	var triggerCollisionComponents = function(entity_id, against_id, componentsToAdd, against_type){
		if(against_type == 'entities') return;

		var collidedWithThreat = E._components[against_type] && E._components[against_type][against_id]
	 	if(collidedWithThreat){
	 		_.each(componentsToAdd, function(component, componentName){
	 			component = _.clone(component)
	 			component.other_id = against_id
	 			E.addComponent( componentName, component, entity_id)
			})
	 	}
	}

	E.each("Collided", function(collided, entity){
		_.each( collided.collisions , function(collision, against){
			_.each( E.component(entity, "CollidesWith"), function(componentsToAdd,against_type){
				triggerCollisionComponents(entity, against, componentsToAdd,against_type )
			})
		})
	})
}

systems.Bounce = function(){
	E.each("Bounce", function(bounce, entity){
		var location = E.component(entity, "Location")
		var acceleration = E.component(entity, "Acceleration") || { x:0 , y:0 }
		var velocity = E.component(entity, "Velocity") || { x:0, y: 0}
		var oldV = { x: velocity.x, y: velocity.y }
		var oldA = {x: acceleration.x, y: acceleration.y }

		var collision = E.component(entity, "Collided").collisions[bounce.other_id]

		var overlapN = collision.response.overlapN
		var overlapV = collision.response.overlapV

		if(overlapN.y){
			velocity.y = 0
			acceleration.y += overlapV.y * -1
		}
		if(overlapN.x){
			velocity.x = 0
			acceleration.x += overlapV.x
		}

		var overlapV = collision.response.overlapV

		//todo-james If two entities collide precisely on the corner the overlap won't resolve properely, hence the 1e-4
		location.x -= overlapV.x > 0 ? overlapV.x + 1e-4 : overlapV.x -1e-4
		location.y -= overlapV.y > 0 ? overlapV.y + 1e-4 : overlapV.y -1e-4

		E.addComponent("Velocity", velocity, entity)
		E.addComponent("Acceleration", acceleration, entity)

	})

	E._components.Bounce && E.create({
		RemoveCategory: {name: 'Bounce'}
	})
}

//todo-james Perhaps have an onground flag to save calculations.
systems.Uncollide = function(){

	E.each("Uncollide", function(uncollide, entity){
		var location = E.component(entity, "Location")
		var acceleration = E.component(entity, "Acceleration") || { x:0 , y:0 }
		var velocity = E.component(entity, "Velocity") || { x:0, y: 0}
		var oldV = { x: velocity.x, y: velocity.y }
		var oldA = {x: acceleration.x, y: acceleration.y }

		var collision = E.component(entity, "Collided").collisions[uncollide.other_id]

		var overlapN = collision.response.overlapN
		var overlapV = collision.response.overlapV

		if(overlapN.y){
			acceleration.y = velocity.y = 0
		}
		if(overlapN.x){
			acceleration.x = velocity.x = 0
		}

		var overlapV = collision.response.overlapV

		//todo-james If two entities collide precisely on the corner the overlap won't resolve properely, hence the 1e-4
		location.x -= overlapV.x > 0 ? overlapV.x + 1e-4 : overlapV.x -1e-4
		location.y -= overlapV.y > 0 ? overlapV.y + 1e-4 : overlapV.y -1e-4

		E.addComponent("Velocity", velocity, entity)
		E.addComponent("Acceleration", acceleration, entity)
	})

	E._components.Uncollide && E.create({
		RemoveCategory: {name: 'Uncollide'}
	})
}

module.exports = systems;