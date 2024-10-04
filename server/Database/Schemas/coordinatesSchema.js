var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoordinatesSchema = new Schema({
        x: {type: Number},
        y: {type: Number}
});

module.exports = mongoose.model("Coordinates", CoordinatesSchema);