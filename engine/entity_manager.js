var EntityManager = {

  _sequence_id: 0,

  _components: {},

  _removeMultiple: function(components, id, names){
    var empty = {}
    names.forEach(function(name){
      delete (components[name] || empty)[id]
    })
    return id
  },

  _replaceComponent: function(components, id, component, name){

      //create category
      var category = components[name] = components[name] || {}

      //store data on category
      category[id] = component

      return id
  },

  _create: function(components, id, new_components){

    Object.keys(new_components)
      .forEach(function(name){
        EntityManager._replaceComponent(components, id, new_components[name], name)
      })
    return id;
  },

  //Call a visitor function whenever an entity has an component
  _entity_each: function(components, visitor, entity){
    Object

      .keys(components)

      .reduce(function(results, name){
        var category = components[name]

        if(category){
          visitor( category, name, entity )
        }
      })
    return entity
  },

  //Build an object of every component associated with an entity id.
  _entity: function(components, target, entity){

    EntityManager._entity_each(components, function(component, name){
      target[name] = component
    }, entity)

    return target;
  },

  category: function(category){
    return EntityManager._components[category]
  },

  component: function(entity, category){
    return EntityManager._components[category] && EntityManager._components[category][entity]
  },

  add: function(id, new_components){
    return EntityManager._create(EntityManager._components, id, new_components)
  },

  addComponent: function(name, component, entity){
    return EntityManager._replaceComponent(EntityManager._components, entity, component, name);
  },

  create: function(new_components){
    return EntityManager._create(EntityManager._components, ++EntityManager._sequence_id, new_components)
  },

  remove: function(id, name){
    var array = []
    var names = arguments.length == 2 ?
      array.concat(name) : array.slice.call(arguments)
    return EntityManager._removeMultiple(EntityManager._components, id, names)
  },

  removeEntity: function(id){
    return EntityManager._entity_each(EntityManager._components, function(component, name){
      delete EntityManager._components[name]
    })
  },

  entity: function(entity){
    return EntityManager._entity(EntityManager._components, {}, entity)
  }
}

module.exports = EntityManager