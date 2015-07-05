var E = require("../engine/entity_manager.js")
var _ = require("lodash")

var sprite = require("../engine/systems/sprite.js")

module.exports = {
	start: function(){

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

		var help_text = E.create({
			Element: {
				tagName: "h2",
				innerText: "Tap or Click to Start",
				parent: game_content,
				id: "help_text",
				className: "dynamic-position black"
			},
			Location: { x:0, y: 300 },
			Dimensions: board
		})

		var click_area = E.create({
			Location: board,
			Dimensions: board,
			Has: {
				Click: {
					Change: { property: "active.state", value: "breakout" },
					Create: {
						Remove: { entity: help_text }
					},
					Remove: {}
				}
			},
		})
	},

	systems: [].concat(
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/element.js"),
		require("../engine/systems/removal.js")
	),

	end: function(){


		_.keys(E.category("StateLifespan"))
			.forEach(E.removeEntity)

	}
}