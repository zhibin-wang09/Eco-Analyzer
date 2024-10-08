const mongoose = require('mongoose');

var mongo = 'mongodb://127.0.0.1/eco-analyzer-DB';
mongoose.connect(mongo);
var dbConnection = mongoose.connection;
dbConnection.on("connected", ()=>{ console.log('Connection to database was successful.') });

let Precinct = require('./Schemas/precinctSchema');

const fs = require('fs');

const tempPopulate = () => {
    fs.readFile('./Data/ARtemp.json', 'utf-8', async (err, data) => {
        const temp = JSON.parse(data);
        
        for(let i = 0; i < temp.features.length; i++){

            let tempArr = [];
            for(let j = 0; j < temp.features[i].geometry.coordinates[0].length; j++){
                
                tempArr.push(temp.features[i].geometry.coordinates[0][j]);
            }

            const newPrecinct = new Precinct({
                precinctID: i,
                state: 'AR',
                trumpVotes: temp.features[i].properties.G20PRERTRU,
                bidenVotes: temp.features[i].properties.G20PREDBID,
                coordinates: tempArr
            });

            await newPrecinct.save();
        }

        dbConnection.close();
    });
}

tempPopulate();