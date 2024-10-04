var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PrecinctSchema = new Schema({
    precinctID: {type: Number},
    coordinates: [{type: Schema.Types.ObjectId, ref: "Coordinates"}],
    trumpVotes: {type: Number},
    bidenVotes: {type: Number}
});

PrecinctSchema
.virtual("voteRatio")
.get(function(){
    return this.trumpVotes/(this.trumpVotes + this.bidenVotes);
})

module.exports = mongoose.model("Precinct", PrecinctSchema);