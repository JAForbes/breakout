var _ = {
	each: require("lodash/collection/each"),
	omit: require("lodash/object/omit"),
}

var E = require("../entity_manager.js")

function RemoveEntity(){
	_.each( E.category('Remove'), function(remove,id){
		var removed = {}
		removed.Has = E.component(id, 'Has')
		removed.After = E.component(id, 'After')
		removed.Delete = {}
		id = remove.entity || id
		if( remove.omit ){
			_.each( _.omit( E.entity(id), remove.omit ) , function(component, key){
				delete E._components[key][id]
			})
		} else {
			E.removeEntity( id)
		}
		//Move this Has thing into omit?
		E._components['Has'] = E._components['Has'] || {}
		E._components['Has'][id] = removed.Has

		E._components['Delete'] = E._components['Delete'] || {}
		E._components['Delete'][id] = { omit: remove.omit || [] }
	})
}

function RemoveComponents(){
	_.each( E.category('RemoveComponents'), function(removeComponents,id){
		removeComponents.names.map(
			E.remove.bind(null, removeComponents.entity || id )
		)
	})
	delete E._components.RemoveComponents
}

function RemoveCategory(){
	_.each( E.category('RemoveCategory'), function(RemoveCategory){
		delete E._components[RemoveCategory.name]
	})
	delete E._components.RemoveCategory
}

function DeleteEntity(){
	_.each( E.category('Delete'), function( remove, id){

		_.each( _.omit( E.entity(id) , remove.omit ) , function(component, key){
			delete E._components[key][id]
		})

	})
}

module.exports = [
	DeleteEntity,
	RemoveComponents,
	RemoveCategory,
	RemoveEntity
]