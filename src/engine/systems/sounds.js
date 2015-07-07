var _ = {
	each: require("lodash/collection/each"),
	sample: require("lodash/collection/sample")
}
var E = require("../entity_manager")

function Sounds(){
	E.each('Sounds',function(sounds,id){
		_.each(sounds, function(sound, componentName){

			var category = E._components[componentName]
			var component = category && category[id]
			if( component ) {
				var sounds = sound.sounds.filter(function(snd){
					return snd.paused
				})
				if(!sounds.length){
					sounds = sound.sounds
				}

				var snd = _.sample(sounds)
				snd.currentTime = 0
				snd.play()
			}
		})
	})
}

module.exports = Sounds;