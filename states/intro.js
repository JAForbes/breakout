var E = require("../engine/entity_manager.js")
var _ = require("lodash")

var sprite = require("../engine/systems/sprite.js")

module.exports = {
	start: function(){
		console.log.bind(console, "start", __filename )()

		var assets = E.component(1, "Game").assets

		var board = E.create({
			Sprite: { img: assets.images.bg },
			Location: { x: 0, y: 0}
		})

		var logo = E.create({
			Sprite: { img: assets.images.logo },
			Location: { x: 0, y: 0},
			Centred: {},
			StateLifespan: {}
		})
	},

	systems: [].concat(
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw
	),

	end: function(){
		Object.keys(E.category("StateLifespan"))
			.forEach(E.removeEntity)
	}
}