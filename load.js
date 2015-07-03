//todo-james remove dependency later
var _ = require("lodash")

var load = {
	image: function (src) {
		var img = new Image()
		img.src = src
		return new Promise(function(resolve, reject){
			img.onload = resolve.bind(Promise, img)
			img.onerror = reject
		})
	},

	imageGroup: function(imageGroup){
		return Promise.all(
		    _.map(imageGroup,load.image)
		)
		.then(function(images){
		   return _.object(
		    _.keys(imageGroup),
		    images
		  )
		})
	},

	sound: function (src) {
		var sound = new Audio()
		sound.src = src
		return new Promise(function(resolve, reject){
			sound.onloadeddata = resolve.bind(Promise, sound)
			sound.onerror = reject
		})
	},

	soundGroup: function(soundGroup){
		return Promise.all(
		    _.map(soundGroup,load.sound)
		)
		.then(function(sounds){
		   return _.object(
		    _.keys(soundGroup),
		    sounds
		  )
		})
	},
}
module.exports = load