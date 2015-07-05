var sprite = require("../engine/systems/sprite.js")

module.exports = {
	start: function () {
		var assets = E.component(1, "Game").assets

		var board = E.create({
			Sprite: { img: assets.images.bg },
			Location: { x: 0, y: 0},
			StateLifespan: {}
		})

	},

	systems: [].concat(
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/removal.js")
	),

	end: console.log.bind(console, "end", __filename )
}