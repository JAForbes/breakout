module.exports = {
	start: console.log.bind(console, "start", __filename ),

	systems: [	console.log.bind(console, __filename) ],

	end: console.log.bind(console, "end", __filename )
}