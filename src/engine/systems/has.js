//the old has, had a property every which let you control how often something happens
//but I think now, Every should be a component like so:

/*
	Every: {
		//every loop
		1 : {
			//components
		},

		//every second loop
		2: {
			//components
		}

		//first loop only
		Infinity: {
			//components
		}
	}
*/

//You could then compose every and has like so

/*
	Has: {
		Tap: {
			Every: {
				5: {
					ChangeColor: {}
				}
			}
		}
	}


	The above would trigger an infinite loop, that would change the entities colour every 5 cycles.
	This loop would only be activated when a tap exists
	And the loop would be deactived Every was removed explicitly
*/

//There  also used to be a notion that has selected globally by default
// And you needed a @ infront to signify a local search
//Local searches turned out to be more common, and by handling both cases the code becomes a lot more complicated
//So I think `Is` should be its own system/component that handles globabl existence checks



/*
	Has: {
		Tap: {
			SwitchState: {
				value: "breakout",
				game: 1
			}
		}
	},
*/

var _ = {
	cloneDeep: require("lodash/lang/cloneDeep"),
	each: require("lodash/collection/each")
}

var E = require("../entity_manager")

function Has(){
	E.each("Has", function(has, entity){
		_.each( has, function(components_to_add, component_to_search_for){
			var found = E.component(entity, component_to_search_for)
			if( found ){
				E.add(
					entity,
					_.cloneDeep(
						components_to_add
					)
				)
			}
		})
	})
}

module.exports = Has
