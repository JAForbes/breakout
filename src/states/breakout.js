var sprite = require("../engine/systems/sprite.js")
var collision = require("../engine/systems/collision.js")

var E = require("../engine/entity_manager")
var _ = {
	each: require("lodash/collection/each"),
	keys: require("lodash/object/keys"),
	cloneDeep: require("lodash/lang/cloneDeep")
}

_ = require("lodash")
s = require("../engine/serialize")


//Mixes in keys to a component, can be used with replacement components to mixin
function Update(){
	E.each("Update", function(update, entity){
		_.each( update, function(component, component_name){
			var existing = E.component(entity, component_name)

			E.addComponent(
				component_name,
				_.merge(
					existing || {},
					_.cloneDeep(component)
				),
				entity
			)
		})
	})
	E.category("Update") && E.create({
		RemoveCategory: { name: "Update" }
	})
}

//Grabs the contents of a named component and replaces it in with E.add(entity, contents)
/*
	After the Activate system ran.  This entity would have a x position of 0:

		Mode1: {
			Position: { x:0, y:0 }
		},
		Position: { x:10, y: 0},
		Activate: { modes: ["Mode1"] }
*/
function Activate(){
	E.each("Activate", function(activate, entity){
		activate.modes.forEach(function(mode_name){
			var mode = E.component(entity, mode_name)


			E.add(entity,
				_.cloneDeep(mode)
			)
		})
	})
	E.category("Activate") && E.create({
		RemoveCategory: { name: "Activate" }
	})
}

//waits n millis then replaces components from the contents into the entity
/*
	Time: {
		1000: {
			Activate: { modes: ["Two"] }
		}
	}
*/
function Time(){
	var now = new Date().getTime();
	var digit = /\d/
	E.each("Time", function(time, entity){
		if(!time._created){ time._created = now }

		_.each(time, function(components, millis_string){
			if(millis_string.match(digit)){
				var millis = parseInt(millis_string,10)
				var delta = now - time._created
				if( delta > millis  ){
					E.add(
						entity,
						_.cloneDeep(components)
					)
					E.addComponent("RemoveComponents", {
						names: ["Time"]
					}, entity)
				}
			}

		})
	})
}

function Once(){
	E.each("Once",function(components, entity){
		E.add(
			entity,
			_.cloneDeep(components)
		)
		E.addComponent("RemoveComponents", {
			names: Object.keys(components).concat("Once")
		}, entity)
	})
}



function OffsetRatio(){
	E.each("OffsetRatio", function(offsetRatio, entity){
		var location = E.component(entity, "Location")
		var dimensions = E.component(entity, "Dimensions")

		if( offsetRatio.x) {
			location.x = location.x + offsetRatio.x * dimensions.width
		}
		if( offsetRatio.y) {
			location.y = location.y + offsetRatio.y * dimensions.height
		}
	})
}

function Shrink(){
	E.each("Shrink", function(shrink, entity){
		var dimensions = E.component(entity, "Dimensions")
		var location = E.component(entity, "Location")

		if(dimensions.width < 1e-1){

			E.add(entity, shrink.components)

		} else {
			var w = dimensions.width * shrink.ratio
			var h = dimensions.height * shrink.ratio

			var dw = dimensions.width - w
			var dh = dimensions.height - h

			location.x += dw /2
			location.y += dh /2

			dimensions.width = w
			dimensions.height = h
		}
	})
}

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

function WinCondition(){
	E.each("WinCondition", function(winCondition, entity){

		var no_balls = Object.keys( E.category("Ball") ).length == 0

		var no_blocks = Object.keys( E.category("Block") ).length == 0

		if( no_blocks ){
			console.log("Winner")
		} else if ( no_balls ) {
			console.log("Loser")
		}

	})
}

var hammer;
var mouse;

module.exports = {
	start: function (game) {
		var cloneCreate = _.compose(
			E.create,
			_.cloneDeep
		)

		//todo-james replace with Has Key S/R later
			var savegame = {}
			window.onkeydown = function(e){

				if(e.keyCode == 83){
					savegame = s.serialize(E._components)
				} else if (e.keyCode == 82){
					var load_state = _.cloneDeep(savegame)
					s.deserialize(load_state, E._components)
					_.merge(E._components, load_state)
				}

			}

		hammer = require("../engine/systems/touch.js")(game_content)
		mouse = require("../engine/systems/mouse.js")(game_content)


		var assets = game.assets

		game_canvas.style.cursor = "none";
		var canvas = E.create({
			Canvas: {
				_canvas: game_canvas,
				_parent: game_content
			},
			StateLifespan: {}
		})

		var mouse = E.create({
			Mouse: {},
			Location: {x:assets._images.bg.width/2, y:0},
			TapTeleport: {}
		})

		var board = E.create({
			Sprite: { _img: assets._images.bg },
			Location: { x: 0, y: 0},
			StateLifespan: {}
		})


		var Countdown = {
			Location: {
				x: (assets._images.bg.width/2) - 16,
				y: 200
			},
			Dimensions: { width: 32, height: 16*3 },
			Frame: {
				index: 0, play_speed: 0,
				width: 16*2, height: 16*3,
				start: { x:16*0, y: 16*6 },
				end: { x: 16*6, y: 16*9},
				total_frames: 3
			},
			Sprite: { _img: assets._images.tiles },
			Activate: { modes: ["Three"] },

			Three: {
				Update: { Frame: { index: 0 } },
				Time: {
					1000: {
						Activate: { modes: ["Two"] }
					}
				},
				Once: {
					ThreeStart: {}
				}
			},

			Two: {
				Update: { Frame: { index: 1 } },
				Time: {
					1000: {
						Activate: {
							modes: ["One"]
						}
					}
				},
				Once: {
					TwoStart: {}
				}
			},

			One: {
				Update: { Frame: { index: 2 } },
				Time: {
					1000: {
						Activate: {
							modes: ["End"]
						}
					}
				},
				Once: {
					OneStart: {}
				}
			},
			Sounds: {
				ThreeStart: { sounds: [game.assets._sounds.countdownBlip] },
				TwoStart: { sounds: [game.assets._sounds.countdownBlip] },
				OneStart: { sounds: [game.assets._sounds.countdownBlip] },
			},
			End: {
				Remove: {}
			},
		}



		var countdown = cloneCreate( Countdown )

		var walls = [
			//left
			[0,0,16, assets._images.bg.height],
			//right
			[assets._images.bg.width-16,0,16, assets._images.bg.height],
			//top
			[0,0, assets._images.bg.width, 16],
		].map(function( options ){
			var x = options[0]
			var y = options[1]
			var w = options[2]
			var h = options[3]

			return E.create({
				Location: { x: x, y: y},
				Dimensions: { width: w, height: h },
				SAT: {},
				Solid: {}
			})
		})

		var Ball = {
			Time: {
				3000: {
					Velocity: { x:4+Math.random(), y: 4+Math.random() },
				}
			},
			Velocity: { x:0, y:0},
			Acceleration: { x:0, y: 0},
			Frame: {
				index: 0, play_speed: 0.2,
				width: 16, height: 16,
				start: { x:16*3, y: 16*4 },
				end: { x: 16*7, y: 16*5},
				total_frames: 5
			},
			Sprite: { _img: assets._images.tiles },
			Location: { x: 100, y: 300},
			Dimensions: { width: 16, height: 16 },
			CollidesWith: {
				Solid: {
					Bounce: {},
				},
				Block: {
					Bounce: {},
					Once: {
						BlockBounce: {},
						WinCondition: {}
					}
				},
				EdgeTrigger: {
					Remove: {}
				}
			},
			Sounds: {
				BlockBounce: { sounds: [game.assets._sounds.brickDeath] }
			},
			Ball: {},
			SAT: {},
			Shrinker: {}
		}

		cloneCreate(Ball)

		var bottomEdge = E.create({
			EdgeTrigger: {},
			Location: { x:0 , y: game.assets._images.bg.height },
			Dimensions: { width: game.assets._images.bg.width, height: 16 },
			Frame: {
				index: 0, play_speed: 0.2,
				width: 16, height: 16,
				start: { x:16*3, y: 16*4 },
				end: { x: 16*7, y: 16*5},
				total_frames: 5
			},
			CollidesWith: {
				Ball: {
					Once: {
						WinCondition: {}
					}
				}
			},
			Sprite: { _img: assets._images.tiles },
			SAT: {}
		});



		var paddle = E.create({
			Solid: {},
			Frame: {
				index: 0, play_speed: 0,
				width: 48, height: 16,
				start: { x:48*0, y: 16*4 },
				end: { x: 48*1, y: 16*5},
				total_frames: 1,
			},
			Sprite: { _img: assets._images.tiles },
			Location: {

				//centred
				x: 20,

				//3 rows from the bottom
				y: assets._images.bg.height - 16 * 3
			},
			Dimensions: { width: 48, height: 16 },
			//Sync paddle position with mouse, but offset by half of width
				Sync: {
					//Get Location.x from entity that has type Mouse
					Location: {
						Mouse: ["x"]
					}
				},
				OffsetRatio: { x: -0.5 },

			Constrain: {
				Location: {
					x: { max: assets._images.bg.width - 48, min: 0 },
				}
			},

			SAT: {}
		})

		var n_blocks = 1
		var block_width = 32
		var block_height = 16
		var rows = 1;

		var blocks = _.times(rows,function(j){
			return _.times(n_blocks, function(i){

				return  E.create({
					Solid: {},
					Block: {},
					Frame: {
						index: 0, play_speed: 0,
						width: block_width, height: block_height,
						start: { x:block_width*0, y: block_height*(0+j) },
						end: { x: block_width*1, y: block_height*(1 +j)},
						total_frames: 1
					},
					Sprite: { _img: assets._images.tiles },
					Location: {

						//centred
						x: (block_width * i) + (assets._images.bg.width / 2) - (block_width * n_blocks * 0.5),

						//3 rows from the bottom
						y: block_height * (3 + j)
					},
					CollidesWith: {
						Shrinker: {
							Shrink: {
								ratio: 0.9,
								components: { Remove: {} }
							},
							RemoveComponents: {
								names: ["Block"]
							}
						}
					},
					Dimensions: { width: block_width, height: block_height },
					SAT: {}
				})
			})
		})
	},

	systems: [].concat(

		require("../engine/systems/movement.js"),
		Once,
		WinCondition,
		Activate,
		Time,
		Update,
		collision.SAT,
		collision.CollidesWith,
		collision.Uncollide,
		collision.Bounce,
		Shrink,
		TapTeleport,
		Sync,
		OffsetRatio,
		Constrain,
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/sounds.js"),
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