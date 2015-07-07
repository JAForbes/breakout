var E = require("../entity_manager")
function SwitchState(game){

	var state_changed = false;

	E.each("SwitchState", function(switch_state, entity){
		if(game){
			game.active.state = switch_state.value
			state_changed = true;
		}

	})

	E._components.SwitchState && E.create({
		RemoveCategory: { name: "SwitchState" }
	})

	state_changed && E.each("StateLifespan", function(lifespan, entity){
		E.addComponent("Remove", {}, entity)
		console.log("Removing",entity, E.component(entity, "Remove"))
	})
}

module.exports = SwitchState