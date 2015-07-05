var E = require("../entity_manager")
var _ = require("lodash")

var z_index_fallback = { value: Infinity }

function z_index(entity){
	return ( E.component(entity, "Z-Index") || z_index_fallback ).value
}

function default_dimensions(sprite){
	return { width: sprite.img.width, height: sprite.img.height }
}

function default_frame(sprite){
	return {
		//Our current position in the strip
		index: 0,
		//how much does the current frame advance by every tick
		//usually would be a small number like 1e-2
		play_speed: 0,

		width: sprite.img.width,
		height: sprite.img.height,
		//where does the first frame start
		start: { x:0, y:0 },
		//where does the rectangle containing all the frames end
		end: { x: sprite.img.width, y: sprite.img.height },

		total_frames: 1
	}
}

function setup(){

	_.each(E.category("Sprite"), function(sprite, entity){
		sprite.canvas = sprite.canvas || Object.keys( E.category("Canvas") )[0]

		var dimensions = E.component(entity, "Dimensions")
		if( !dimensions){
			dimensions = default_dimensions(sprite)
			E.addComponent("Dimensions", dimensions, entity)
		}

		var frame = E.component(entity, "Frame")

		if(!frame){
			frame = default_frame(sprite)
			E.addComponent("Frame", frame, entity)
		}
	})

}

function draw_entity(entity) {

	var sprite = E.component(entity, "Sprite")
	var dimensions = E.component(entity, "Dimensions")
	var frame = E.component(entity, "Frame")
	var canvas = E.component(sprite.canvas, "Canvas")
	var location = E.component(entity, "Location")


	var index = frame.total_frames == 1 ? 1 : Math.floor(frame.index += frame.play_speed)
	var start = frame.start;
	var end = frame.end;
	var cols = (end.x - start.x) / frame.width;
	var rows = (end.y - start.y) / frame.height;
	var source_x = start.x + (index  % cols) * frame.width;
	var source_y = start.y + (index  % rows) * frame.height;

	canvas.context.drawImage( sprite.img, source_x, source_y, frame.width, frame.height, location.x, location.y, dimensions.width, dimensions.height )
}


//Dependencies: Z-Index, Sprite, Location, Dimensions
function draw(){


	var sprites = E.category("Sprite")

	var entities = Object.keys(sprites)

	var sorted = _.sortBy( entities, z_index )



	sorted
		.forEach(
			draw_entity
		)

}

module.exports = {
	draw: draw,
	setup: setup
}