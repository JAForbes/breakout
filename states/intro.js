var E = require("../engine/entity_manager.js")

module.exports = {
	start: function(){
		console.log.bind(console, "start", __filename )()

		var assets = E.component(1, "Game").assets

		var board = E.create({
			Sprite: { img: assets.images.bg },
			Location: { x: 0, y: 0}
		})
	},

	systems: [].concat(
		require("../engine/systems/sprite.js")
	),

	end: console.log.bind(console, "end", __filename )
}