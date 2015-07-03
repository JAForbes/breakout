function execute(func){ func() }

function init(game){	

	var running = true;

	function loop(){
		if(running){
			var systems = game.states[game.active.state]
			
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