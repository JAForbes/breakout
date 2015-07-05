var sprite = require("../engine/systems/sprite.js")

module.exports = {
	start: console.log.bind(console, "start", __filename ),

	systems: [].concat(
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/removal.js")
	),

	end: console.log.bind(console, "end", __filename )
}