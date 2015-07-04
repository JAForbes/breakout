var E = require("../engine/entity_manager.js")

module.exports = {
	start: function(){
		console.log.bind(console, "start", __filename )()

		var assets = E.component(1, "Game").assets
		var board = E.create({
			Sprite: { img: assets.bg }
		})
	},

	systems: [],// [	console.log.bind(console, __filename) ],

	end: console.log.bind(console, "end", __filename )
}