function execute(func){ func() }

function init(game){	

	var running = true;
	var empty = [function(){
		console.warn("game.active.state:'"+game.active.state+"' does not reference an array of system functions (probably a typo)")
	}]

	function loop(){
		if(running){
			var systems = game.states[game.active.state] || empty
			
			systems
				.forEach(execute)


			requestAnimationFrame(loop)
		}

	}

	loop()

	return {
		pause: function(){
			running = false;
		},

		unpause: function(){
			running = true;
			loop()
		}
	}
}

module.exports = init;