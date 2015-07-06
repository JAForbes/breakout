function execute(func){ func() }

function transitions(last_state, active_state){
	if(last_state != active_state){
		last_state && last_state.end()
		active_state && active_state.start()
	}
	return active_state;
}

var placeholder = {
	start: function(){},

	systems: [function(){
		console.warn("game.active.state:'"+game.active.state+"' does not reference an array of system functions (probably a typo)")
	}],

	end: function(){}
}

function init(game){

	var running = true;
	var last_state = null;

	function loop(){
		var active_state = game.states[game.active.state]

		last_state = transitions( last_state, active_state )

		if(running){

			(active_state || placeholder)
				.systems
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