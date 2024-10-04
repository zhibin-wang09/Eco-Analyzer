const mongoose = require('mongoose');

var mongo = 'mongodb://127.0.0.1/eco-analyzer-DB';
mongoose.connect(mongo);
var dbConnection = mongoose.connection;
dbConnection.on("connected", ()=>{ console.log('Connection to database was successful.') });

let Precinct = require('./Schemas/precinctSchema');

