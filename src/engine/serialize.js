//todo-james convert to system later

var _ = require("lodash")
var traverse = require("traverse")
var path = require("path")

function relative_chrome_path(val){
	return path.relative(".",val.replace("file:///",""))
}

function serialize(components){
  var cloned = _.cloneDeep(components)
  var scrubbed = traverse(cloned).forEach(function(x){
    if (x instanceof Image || x instanceof Audio) {
      this.parent.node[this.key + "_src"] = relative_chrome_path(x.src)
    }
    if( x instanceof Function || x instanceof Element || x instanceof CanvasRenderingContext2D){
    	this.delete(true)
    }
  })
  return scrubbed;
}

function deserialize(serialized, existing_components){
	existing_components = existing_components || {}
	traverse(serialized).forEach(function(x){

		if(this.key && this.key.indexOf("_src") > -1){

			var real_key = this.key.replace("_src","")
			var real_path = this.parent.path.concat(real_key)

			var existing_resource = _.get(existing_components,real_path.join("."))


			var isImage = path.extname(x) in Serializer.image_extensions
			var isAudio = path.extname(x) in Serializer.audio_extensions
			if(isImage || isAudio){
			  if(!existing_resource || relative_chrome_path(existing_resource.src) != x){

			  	var Constructor = isImage ? Image : Audio
			    var resource = new Constructor()
			    resource.src = x
			    this.parent.node[real_key] = resource
			  }
			}
		}

	})
	return serialized;
}

var Serializer = {
	image_extensions: { ".png":1, ".jpg":1, ".jpeg":1 },
	audio_extensions: { ".wav":1, ".mp3":1, ".ogg":1 },
	serialize: serialize,
	deserialize: deserialize
}

module.exports = Serializer