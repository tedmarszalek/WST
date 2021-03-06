var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SculptureSchema = new Schema({
	//name: {type: String, unique: true, required: true},
	sculpture_name: {type: String},
	video: {type: String, default: ""},
	image: {type: String, default: ""},
	audio: {type: String, default: ""},
	active: {type: Boolean},
	coordinates_latitude: {type: Number},
	coordinates_longitude: {type: Number},
	artist: {type: String},
	artist_statement: {type: String},
	type: {type: String}, 
	number: {type: Number}, 
	location: {type: String}
}, {versionKey: false});

mongoose.model('Sculpture', SculptureSchema);