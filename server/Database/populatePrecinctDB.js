const mongoose = require('mongoose');

var mongo = 'mongodb://127.0.0.1/eco-analyzer-DB';
// mongoose.connect(mongo);
// var dbConnection = mongoose.connection;
// dbConnection.on("connected", ()=>{ console.log('Connection to database was successful.') });

let Coordinates = require('./Schemas/coordinatesSchema');
let Precinct = require('./Schemas/precinctSchema');

const fs = require('fs');

fs.readFile('./Data/ARtemp.json', 'utf-8', (err, data) => {
    const temp = JSON.parse(data);

    console.log(temp.features.length);
    console.log(temp.features[0].geometry.coordinates[0].length);

    console.log(temp.features[0].geometry);

    
});