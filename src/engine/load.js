var Promise = require("bluebird")

//todo-james remove dependency later
var _ = {
	map: require("lodash/collection/map"),
	keys: require("lodash/object/keys"),
	object: require("lodash/array/object")
}

var load = {
	image: function (src) {
		var img = new Image()
		img.src = src
		return new Promise(function(resolve, reject){
			img.onload = resolve.bind(Promise, img)
			img.onerror = reject
		})
	},

	group: function(loader, group){
		return Promise.all(
		    _.map(group,loader)
		)
		.then(function(loaded){
		   return _.object(
		    _.keys(group),
		    loaded
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

}
module.exports = load