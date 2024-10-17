const fs = require("fs/promises");
const path = require("path");

// Script for reading csv files and organizing data into json format
function readCSV() {}

// Takes json object and insert it in to the geojson file
async function insertGeoJSON() {
  try{
    const coordinateFilePath = path.join(__dirname, "./server/Spring Server/src/main/resources/newCoordinate.json");
    const districtDataFilePath = path.join(__dirname, "./server/Spring Server/src/main/resources/District.json");

    const coordinateContent = await fs.readFile(coordinateFilePath, "utf8");
    const districtDataContent = await fs.readFile(districtDataFilePath, "utf8");

    const coordinateJson = JSON.parse(coordinateContent);
    const districtDataJson = JSON.parse(districtDataContent);

    const arkansasDistrictData = districtDataJson.arkansas.district;
    const arkansasDistrictCoordinate = coordinateJson.data[0].district.geometries;

    // const newyorkDistrictData = districtDataJson["New York"];
    // const newyorkDistrictCoordinate = coordinateJson.data[1].district.geometries;

    // go through each district in the District.json and insert into the properties key of coordinate data
    for(let i = 0; i < 4; i++){
      Object.assign(coordinateJson.data[0].district.geometries[i].properties, arkansasDistrictData[i]);
    }

    const outputFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/newCoordinate.json"
    );

    await fs.writeFile(outputFilePath, JSON.stringify(coordinateJson, null, 2));

    console.log("Success");
  }catch(e){
    console.log(e);
  }
}

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

// removePrecintFromJSON();
insertGeoJSON();