var _ = {
	sample: require("lodash/collection/sample"),
	map: require("lodash/collection/map")
}
var E = require("./engine/entity_manager")
var load = require("./engine/load")
var loop = require("./engine/loop")
var Promise = require("bluebird")

var game = {
	active: {
		state: "loading"
	},
	assets: {
		images: {
			logo: "resources/logo.png",
			tiles: "resources/tiles.png",
			bg: "resources/bg_prerendered.png"
		},
		sounds: {
			brickDeath: "resources/sfx/brickDeath.mp3",
			countdownBlip: "resources/sfx/countdownBlip.mp3",
			powerdown: "resources/sfx/powerdown.mp3",
			powerup: "resources/sfx/powerup.mp3",
			recover: "resources/sfx/recover.mp3"
		}
	},
	states: {
		loading: require("./states/loading"),
		intro: require("./states/intro"),
		breakout: require("./states/breakout"),
		gameover: require("./states/gameover"),
		gamecomplete: require("./states/gamecomplete")
	}
}


var controller = loop(game)

global.controller = controller
global.game = game
global.load = load
global._ = _
global.E = E
// loading assets
var images = _.map(game.assets.images, load.image)

Promise || console.log("Promise is not defined")

Promise.all([
	load.group(load.image, game.assets.images),
	load.group(load.sound, game.assets.sounds)
]).then(function(loaded) {
	game.assets._images = loaded[0]
	game.assets._sounds = loaded[1]
	_.sample(game.assets._sounds).play()
}).then(function(){
	if(game.active.state == "loading"){
		game.active.state = "intro"
	}
})

