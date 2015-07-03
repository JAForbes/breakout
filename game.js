var _ = require("lodash")
var E = require("./entity_manager")
var load = require("./load")

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
		loading: [],
		intro: [],
		breakout: [],
		gameover: [],
		gamecomplete: []
	}
}

global.game = game
global.load = load
global._ = _
//loading assets
var images = _.map(game.assets.images, load.image)

Promise.all([
	load.imageGroup(game.assets.images),
	load.soundGroup(game.assets.sounds)
]).then(function(loaded) {
	game.assets.images = loaded[0]
	game.assets.sounds = loaded[1]
	_.sample(game.assets.sounds).play()
}).then(function(){
	game.active.state = "intro"
})