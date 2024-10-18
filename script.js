const fs = require("fs");
const path = require("path");
const csv = require('csv-parser')

// Script for reading csv files and organizing data into json format then storing it into district.json
async function readCSV() {
  const json = {};

  // Age
  const newyorkAgeData = {};
  fs.createReadStream('./NewyorkAge/ACSST5Y2020.S0101-Data.csv')
  .pipe(csv())
  .on("data", (row) => {
    // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
    newyorkAgeData[row["NAME"]] = []
    for(let key in row){
      if(/S0101_C02_00\dE/i.test(key)){
        newyorkAgeData[row["NAME"]][key] = row[key];
      }
    }
  })
  .on("end", () => {
    console.log(newyorkAgeData);
  })

  // Earning
  const newyorkEarningData = {}
  fs.createReadStream('./NewyorkEarning/ACSST5Y2020.S2001-Data.csv')
  .pipe(csv())
  .on("data", (row) => {
    // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
    newyorkEarningData[row["NAME"]] = []
    for(let key in row){
      if(/S2001_C02_00\dE/i.test(key)){
        newyorkEarningData[row["NAME"]][key] = row[key];
      }
    }
  })
  .on("end", () => {
    console.log(newyorkEarningData);
  })
  
  // Race
  const newyorkRaceData = {}
  fs.createReadStream('./NewyorkRace/DECENNIALCD1182020.P9-Data.csv')
  .pipe(csv())
  .on("data", (row) => {
    // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
    newyorkRaceData[row["NAME"]] = []
    for(let key in row){
      if(/P9_00\dN/i.test(key) || /P9_010N/i.test(key)){
        newyorkRaceData[row["NAME"]][key] = row[key];
      }
    }
  })
  .on("end", () => {
    console.log(newyorkRaceData);
  })

  // write those values into the json file
}

// Takes json object and insert it in to the geojson file
async function insertGeoJSON() {
  try {
    const coordinateFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/newCoordinate.json"
    );
    const districtDataFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/District.json"
    );

    const coordinateContent = await fs.readFile(coordinateFilePath, "utf8");
    const districtDataContent = await fs.readFile(districtDataFilePath, "utf8");

    const coordinateJson = JSON.parse(coordinateContent);
    const districtDataJson = JSON.parse(districtDataContent);

    const arkansasDistrictData = districtDataJson.arkansas.district;
    const arkansasDistrictCoordinate =
      coordinateJson.data[0].district.geometries;

    // const newyorkDistrictData = districtDataJson["New York"];
    // const newyorkDistrictCoordinate = coordinateJson.data[1].district.geometries;

    // go through each district in the District.json and insert into the properties key of coordinate data
    for (let i = 0; i < 4; i++) {
      Object.assign(
        coordinateJson.data[0].district.geometries[i].properties,
        arkansasDistrictData[i]
      );
    }

    const outputFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/newCoordinate.json"
    );

    await fs.writeFile(outputFilePath, JSON.stringify(coordinateJson, null, 2));

    console.log("Success");
  } catch (e) {
    console.log(e);
  }
}

// takes coordinate large json and remove the precinct key value pairs
async function removePrecintFromJSON() {
  try {
    // Use fs to read the local file instead of fetch
    const filePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/CoordinateLarge.json"
    );
    const fileContent = await fs.readFile(filePath, "utf8");

    // Parse the JSON data
    const json = JSON.parse(fileContent);

    // Modify the JSON data
    const arkansas = json.data[0];
    const newyork = json.data[1];

    // Remove the precinct properties
    delete arkansas.precinct;
    delete newyork.precinct;

    // Create the new JSON object
    const newJson = {
      data: [arkansas, newyork],
    };

    // Convert to JSON string
    const newJsonString = JSON.stringify(newJson, null, 2);

    // Write the modified JSON to a new file
    const outputFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/newCoordinate.json"
    );
    await fs.writeFile(outputFilePath, newJsonString);

    console.log("Success");
  } catch (err) {
    console.error("Error", err);
  }
}

// takes newCoordinate.json file and convert it into a feature collection geojson
async function convertGeometryCollectionToFeatureCollection() {
  const filePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/newCoordinate.json"
  );
  const fileContent = await fs.readFile(filePath, "utf8");

  // Parse the JSON data
  const geometryCollectionJson = JSON.parse(fileContent);

  geometryCollectionJson.data.map((d) => {
    d.district = {
      type: "FeatureCollection",
      features: d.district.geometries.map((geometry) => ({
        type: "Feature",
        geometry: geometry.geometry,
        properties: geometry.properties, // Add properties as needed
      })),
    };
  });

  const newJsonString = JSON.stringify(geometryCollectionJson, null, 2);

  // Write the modified JSON to a new file
  const outputFilePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/testFeatureCollection.json"
  );
  await fs.writeFile(outputFilePath, newJsonString);

  console.log("Success");
}

// removePrecintFromJSON();
readCSV();
