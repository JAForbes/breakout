var sprite = require("../engine/systems/sprite.js")

var E = require("../engine/entity_manager")

function TapTeleport(){
	E.each("Tap", function(tap, entity){
		if ( E.component(entity, "TapTeleport") ){
			var location = E.component(entity, "Location")
			location.x = tap.x
			location.y = tap.y
		}
	})
}

function Sync(){
	E.each( "Sync", function(sync, entity){
		_.each(sync, function(sources, component_to_sync){
			var component = E.component(entity, component_to_sync)
			_.each( sources, function(properties_to_sync, source_category ){
				var source_entity = _.keys(E.category(source_category))[0]
				var source_component = E.component(source_entity, component_to_sync);

				source_component && properties_to_sync.forEach(function(property){
					component[property] = source_component[property]
				})
			})
		})
	})
}

function Constrain(){
	E.each("Constrain", function(constrain, entity){
		_.each(constrain, function( properties, component_to_constrain ){
			var component = E.component(entity, component_to_constrain )
			_.each(properties, function(constraints, property){
				component[property] = Math.min( Math.max(component[property], constraints.min), constraints.max)
			})
		})
	})
}

var hammer;

module.exports = {
	start: function () {

		hammer = require("../engine/systems/touch.js")(game_content)
		mouse = require("../engine/systems/mouse.js")(game_content)

		game_canvas.style.cursor = "none";
		var assets = E.component(1, "Game").assets

		var mouse = E.create({
			Mouse: {},
			Location: {x:assets.images.bg.width/2, y:0},
			TapTeleport: {}
		})

		var board = E.create({
			Sprite: { img: assets.images.bg },
			Location: { x: 0, y: 0},
			StateLifespan: {}
		})

		var paddle = E.create({
			Frame: {
				index: 0, play_speed: 0,
				width: 48, height: 16,
				start: { x:48*0, y: 16*4 },
				end: { x: 48*1, y: 16*5},
				total_frames: 1
			},
			Sprite: { img: assets.images.tiles },
			Location: {

				//centred
				x: assets.images.bg.width /2 - 24 ,

				//3 rows from the bottom
				y: assets.images.bg.height - 16 * 3
			},
			Sync: {
				//Get Location.x from entity that has type Mouse
				Location: {
					Mouse: ["x"]
				}
			},
			Constrain: {
				Location: {
					x: { max: assets.images.bg.width - 48, min: 0 },
				}
			},
			Dimensions: { width: 48, height: 16 }
		})
	},

	systems: [].concat(
		TapTeleport,
		Sync,
		Constrain,
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/removal.js")
	),

	end: function(){
		game_canvas.style.cursor = "default";

		hammer.destroy()
		hammer = null;
		mouse.destroy()
		mouse = null;
	}
}