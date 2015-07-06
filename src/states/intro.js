var E = require("../engine/entity_manager.js")

var sprite = require("../engine/systems/sprite.js")
var hammer;

module.exports = {
	start: function(){

		hammer = require("../engine/systems/touch.js")(game_content)

		var assets = E.component(1, "Game").assets

		var board = E.create({
			Sprite: { img: assets.images.bg },
			Location: { x: 0, y: 0},
			StateLifespan: {}
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
			Dimensions: { width: assets.images.bg.width, height: 200 },
			StateLifespan: {}
		})

		var click_area = E.create({
			Location: board,
			Dimensions: board,
			Tappable: {},
			Has: {
				Tap: {
					SwitchState: {
						value: "breakout",
						game: 1
					}
				}
			},
			StateLifespan: {}
		})


		console.log("click_area",click_area)
	},

	systems: [].concat(
		require("../engine/systems/has.js"),
		require("../engine/systems/canvas.js"),
		sprite.setup,
		require("../engine/systems/centred.js"),
		sprite.draw,
		require("../engine/systems/switch_state.js"),
		require("../engine/systems/element.js"),
		require("../engine/systems/removal.js")
	),

	end: function(){
		hammer.destroy()
		hammer = null;
	}
}