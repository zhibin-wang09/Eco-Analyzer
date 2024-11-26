const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const csv = require("csv-parser");

// Script for reading csv files and organizing data into json format then storing it into district.json
async function readAndWriteCSV() {
  const json = {};

  // Age
  const parseNewyorkAgeCSV = () => {
    return new Promise((resolve, reject) => {
      const newyorkAgeData = {};
      fs.createReadStream("./NewyorkAge/ACSST5Y2020.S0101-Data.csv")
        .pipe(csv())
        .on("data", (row) => {
          // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
          newyorkAgeData[row["NAME"]] = [];
          for (let key in row) {
            if (/S0101_C02_0(1|0)\dE/i.test(key)) {
              newyorkAgeData[row["NAME"]][key] = row[key];
            }
          }
        })
        .on("end", () => {
          resolve(newyorkAgeData);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };

  // Earning
  const parseNewyorkEarningCSV = () => {
    return new Promise((resolve, reject) => {
      const newyorkEarningData = {};
      fs.createReadStream("./NewyorkEarning/ACSST5Y2020.S2001-Data.csv")
        .pipe(csv())
        .on("data", (row) => {
          // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
          newyorkEarningData[row["NAME"]] = [];
          for (let key in row) {
            if (/S2001_C02_0(1|0)\dE/i.test(key)) {
              newyorkEarningData[row["NAME"]][key] = row[key];
            }
          }
        })
        .on("end", () => {
          resolve(newyorkEarningData);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };

  // Race
  const parseNewyorkRaceCSV = () => {
    return new Promise((resolve, reject) => {
      const newyorkRaceData = {};
      fs.createReadStream("./NewyorkRace/DECENNIALCD1182020.P9-Data.csv")
        .pipe(csv())
        .on("data", (row) => {
          // .on iterates every row in the csv and we will go through the row for each column that has the percent of populate by age we insert the value into our object
          newyorkRaceData[row["NAME"]] = [];
          for (let key in row) {
            if (/P9_00\dN/i.test(key) || /P9_010N/i.test(key)) {
              newyorkRaceData[row["NAME"]][key] = row[key];
            }
          }
        })
        .on("end", () => {
          resolve(newyorkRaceData);
        })
        .on("error", (err) => {
          reject(err);
        });
    });
  };

  // insert the 26 ny districts into json
  const earningEntries = Object.entries(await parseNewyorkEarningCSV());
  const raceEntries = Object.entries(await parseNewyorkRaceCSV());
  const ageEntries = Object.entries(await parseNewyorkAgeCSV());
  const newyorkDistricts = [];
  for (let i = 1; i <= 26; i++) {
    const earning = {
      "1-9999": earningEntries[i][1]["S2001_C02_004E"],
      "10000-14999": earningEntries[i][1]["S2001_C02_005E"],
      "15000-24999": earningEntries[i][1]["S2001_C02_006E"],
      "25000-34999": earningEntries[i][1]["S2001_C02_007E"],
      "35000-49999": earningEntries[i][1]["S2001_C02_008E"],
      "50000-64999": earningEntries[i][1]["S2001_C02_009E"],
      "65000-74999": earningEntries[i][1]["S2001_C02_010E"],
      "75000-99999": earningEntries[i][1]["S2001_C02_011E"],
      "10000+": earningEntries[i][1]["S2001_C02_012E"],
    };
    const race = {
      "Hispanic or Latino": raceEntries[i][1]["P9_002N"],
      white: raceEntries[i][1]["P9_005N"],
      black: raceEntries[i][1]["P9_006N"],
      "american indian": raceEntries[i][1]["P9_007N"],
      asian: raceEntries[i][1]["P9_008N"],
      "native hawaiian": raceEntries[i][1]["P9_009N"],
      other: raceEntries[i][1]["P9_010N"],
    };
    const age = {
      "20 to 24 years": ageEntries[i][1]["S0101_C02_006E"],
      "25 to 29 years": ageEntries[i][1]["S0101_C02_007E"],
      "30 to 34 years": ageEntries[i][1]["S0101_C02_008E"],
      "35 to 39 years": ageEntries[i][1]["S0101_C02_009E"],
      "40 to 44 years": ageEntries[i][1]["S0101_C02_010E"],
      "45 to 49 years": ageEntries[i][1]["S0101_C02_011E"],
      "50 to 54 years": ageEntries[i][1]["S0101_C02_012E"],
      "55 to 59 years": ageEntries[i][1]["S0101_C02_013E"],
      "60 to 64 years": ageEntries[i][1]["S0101_C02_014E"],
      "65 to 69 years": ageEntries[i][1]["S0101_C02_015E"],
      "70 to 74 years": ageEntries[i][1]["S0101_C02_016E"],
      "75 to 79 years": ageEntries[i][1]["S0101_C02_017E"],
      "80 to 84 years": ageEntries[i][1]["S0101_C02_018E"],
      "85 years and over": ageEntries[i][1]["S0101_C02_019E"],
    };

    const district = {
      number: i,
      earning: earning,
      race: race,
      age: age,
    };
    newyorkDistricts.push(district);
  }
  console.log(newyorkDistricts);

  // write those values into the json file
  const districtDataFilePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/District.json"
  );
  const districtDataContent = await fsp.readFile(districtDataFilePath, "utf8");
  const districtDataJson = JSON.parse(districtDataContent);
  Object.assign(districtDataJson["New York"].district, newyorkDistricts);
  const newDistrictJson = JSON.stringify(districtDataJson, null, 2);
  const newDistrictDataFilePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/newDistrict.json"
  );
  await fsp.writeFile(newDistrictDataFilePath, newDistrictJson);
  console.log("Success");
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
      "./server/Spring Server/src/main/resources/newDistrict.json"
    );

    const coordinateContent = await fsp.readFile(coordinateFilePath, "utf8");
    const districtDataContent = await fsp.readFile(
      districtDataFilePath,
      "utf8"
    );

    const coordinateJson = JSON.parse(coordinateContent);
    const districtDataJson = JSON.parse(districtDataContent);

    const arkansasDistrictData = districtDataJson.arkansas.district;
    const arkansasDistrictCoordinate =
      coordinateJson.data[0].district.geometries;

    const newyorkDistrictData = districtDataJson["New York"].district;
    const newyorkDistrictCoordinate =
      coordinateJson.data[1].district.geometries;

    // go through each district in the District.json and insert into the properties key of coordinate data
    for (let i = 0; i < 4; i++) {
      Object.assign(
        coordinateJson.data[0].district.geometries[i].properties,
        arkansasDistrictData[i]
      );
    }
    Object.assign(
      coordinateJson.data[1].district.geometries[0].properties,
      newyorkDistrictData[20]
    );
    for (let i = 0; i < 25; i++) {
      if (i == 20) continue;
      const newI = i + 1;
      Object.assign(
        coordinateJson.data[1].district.geometries[newI].properties,
        newyorkDistrictData[i]
      );
    }

    const outputFilePath = path.join(
      __dirname,
      "./server/Spring Server/src/main/resources/newCoordinate.json"
    );

    await fsp.writeFile(
      outputFilePath,
      JSON.stringify(coordinateJson, null, 2)
    );

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
  const fileContent = await fsp.readFile(filePath, "utf8");

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
    "./server/Spring Server/src/main/resources/FeatureCollectionCoordinate.json"
  );
  await fsp.writeFile(outputFilePath, newJsonString);

  console.log("Success");
}

async function loadElectionDataInFeatureCollection(electiondataFile) {
  const filePath = path.join(__dirname, electiondataFile);
  const destinationFilePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/newCoordinate.json"
  );
  const fileContent = await fsp.readFile(filePath, "utf8");
  const coordinateContent = await fsp.readFile(destinationFilePath, "utf8");
  const coordinateJSON = JSON.parse(coordinateContent);
  const electionData = [];

  const data = JSON.parse(fileContent);
  data.geometries.map((district) => {
    electionData.push({
      trumpVotes: district.trumpVotes,
      bidenVotes: district.bidenVotes,
    });
  });
  let stateIndex = electiondataFile.includes("newyork") ? 1 : 0;
  if (stateIndex == 0) {
    for (let i = 0; i < data.geometries.length; i++) {
      coordinateJSON.data[stateIndex].district.geometries[i].properties[
        "election data"
      ] = electionData[i];
    }
  }else{
    coordinateJSON.data[stateIndex].district.geometries[0].properties[
      "election data"
    ] = electionData[20];
    for (let i = 0; i < 25; i++) {
      if (i == 20) continue;
      const newI = i + 1;
      coordinateJSON.data[stateIndex].district.geometries[newI].properties[
        "election data"
      ] = electionData[i];
    }
  }
  //console.log(coordinateJSON.data[0].district.geometries[0].properties)
  const jsonString = JSON.stringify(coordinateJSON, null, 2);

  // Write the modified JSON to a new file
  const outputFilePath = path.join(
    __dirname,
    "./server/Spring Server/src/main/resources/newCoordinate.json"
  );
  await fsp.writeFile(outputFilePath, jsonString);

  console.log("Success");
}

async function splitFile(filename){
  const filepath = path.join(__dirname, filename);
  const fileContent = await fsp.readFile(filepath);
  const districtJson = JSON.parse(fileContent);

  const newyorkFileName = path.join(__dirname, `./server/Spring Server/src/main/resources/ny_district_data.json`)
  const arkansasFileNAme = path.join(__dirname, `./server/Spring Server/src/main/resources/arkansas_district_data.json`)

  const arkansasData = districtJson.data[0].district;
  const newyorkData = districtJson.data[1].district;

  const arkansasDataJsonString = JSON.stringify(arkansasData,null,2);
  const newyorkDataJsonString = JSON.stringify(newyorkData,null,2 );

  await fsp.writeFile(newyorkFileName, newyorkDataJsonString);
  await fsp.writeFile(arkansasFileNAme, arkansasDataJsonString);

  console.log("success");
}

async function insertDataToPrecinctFiles(file1, file2, file3,file4){
  let file1Path = path.join(__dirname, file1);
  let file2Path = path.join(__dirname, file2);
  let file3Path = path.join(__dirname, file3);
  let file4Path = path.join(__dirname, file4);


  const precinctContent = await fsp.readFile("./precinct/precincts_arkansas/arkansas_precincts.json")
  const file1Content = await fsp.readFile(file1Path);
  const file2Content = await fsp.readFile(file2Path);
  const file3Content = await fsp.readFile(file3Path);
  const file4Content = await fsp.readFile(file4Path);

  const file1Json = JSON.parse(file1Content);
  const file2Json = JSON.parse(file2Content);
  const file3Json = JSON.parse(file3Content);
  const file4Json = JSON.parse(file4Content);
  const precinctJson = JSON.parse(precinctContent);

  const features = precinctJson.features;
  let map = new Map();
  for(const f of features){
    map.set(f.properties["NAMELSAD20"], f);
  }

  file1Json.forEach((item) => {
    const id = item.precinct_id;
    if(map.has(id)){
      const newF = map.get(id);
      newF.properties["earning"] = item;
      map.set(id,newF);
    }
  })

  file2Json.forEach((item) => {
    const id = item.precinct_id;
    if(map.has(id)){
      const newF = map.get(id);
      newF.properties["age"] = item;
      map.set(id,newF);
    }
  })
  
  file3Json.forEach((item) => {
    const id = item.precinct_id;
    if(map.has(id)){
      const newF = map.get(id);
      newF.properties["race"] = item;
      map.set(id,newF);
    }
  })

  file4Json.forEach((item) => {
    const id = item.precinct_id;
    if(map.has(id)){
      const newF = map.get(id);
      newF.properties["vote"] = item;
      map.set(id,newF);
    }
  })
  
  precinctJson.features = Array.from(map.values())

  const precinctJsonString = JSON.stringify(precinctJson,null,2);

  await fsp.writeFile("./precinct/precincts_arkansas/final_arkansas_precincts.json", precinctJsonString);
  console.log("success")
}

async function indentFile(file) {
  try {
    const filePath = path.join(__dirname, file);
    const filep = await fsp.readFile(filePath, 'utf8'); // Read as a UTF-8 string

    const json = JSON.parse(filep);

    const indentedJson = JSON.stringify(json, null, 2);

    await fsp.writeFile(filePath, indentedJson); // Write to filePath, not filep
    console.log("Success");
  } catch (error) {
    console.error("Error:", error);
  }
}

async function formatFileForMongoImport(file, dest, category) {
  try {
    const filePath = path.join(__dirname, file);
    const destPath = path.join(__dirname, dest);
    const fileContent = await fsp.readFile(filePath, 'utf8');

    // Parse the file content as JSON
    const jsonArray = JSON.parse(fileContent).features;

    // Ensure it's an array and format each item as a separate line
    if (Array.isArray(jsonArray)) {
      const newlineDelimitedJson = jsonArray.map(item => {
        let newItem = {};
        newItem["stateId"] = Number(item.properties["STATEFP20"]);
        newItem["geoId"] = item.properties["CD118FP"];
        newItem["geoType"] = item.properties["CD118FP"] ? "DISTRICT" : "PRECICNT";
        newItem[category == "earning" ? "income" : category] = item.properties[category];
        return JSON.stringify(newItem);
      }).join(',\n');

      // Write the formatted JSON to the file, ready for mongoimport
      await fsp.writeFile(destPath, "[" + newlineDelimitedJson + "]", 'utf8');
      console.log("File formatted successfully for mongoimport.");
    } else {
      console.error("Error: JSON is not an array of objects.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function toNewLineDelimitedJSON(file, dest){
  try{
    const orgFile = path.join(__dirname, file);
    const destFile = path.join(__dirname, dest);
    const fileContent = await fsp.readFile(orgFile, 'utf8');

    const json = JSON.parse(fileContent);
    const newlineDelimitedJson = json.map(item => {
      return JSON.stringify(item);
    }).join(',\n');
    await fsp.writeFile(destFile, "[" + newlineDelimitedJson + "]", 'utf8');
      console.log("File formatted successfully for mongoimport.");
  }catch(e){
    console.log(e);
  }
}

async function splitFeatureCollectionFile(file,dest){
  try{
    const filePath = path.join(__dirname, file);
    const fileContent = await fsp.readFile(filePath, 'utf8');

    const data = JSON.parse(fileContent);
    const geojson = data.data[1].district.features;
    for(let i =0; i < geojson.length; i++){
      geojson[i].properties = {
        "geoId": geojson[i].properties["CD118FP"],
        "stateId": Number(geojson[i].properties["STATEFP20"]),
        "number": Number(geojson[i].properties["CD118FP"]),
        "geoType": "DISTRICT",
      };
    }


    const destFile = path.join(__dirname, dest);
    const newJson = {
      "type": "FeatureCollection",
      "features": geojson
    }
    await fsp.writeFile(destFile, JSON.stringify(newJson, null ,2));
    console.log("successfully splitted");
  }catch(e){
    console.log(e);
  }
}


async function precicntDataIntoProperFormat(file,type){
  try{
    const filePath = path.join(__dirname, file);
    const fileContent = await fsp.readFile(filePath, 'utf8');

    const data = JSON.parse(fileContent);
    const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
    const newData= data.map(m => {
      const newJson = {
        stateId: stateId,
        geoId: m.precinct_id,
        geoType: "PRECINCT",
        // urbanicity: {
        //   density: m["density"],
        //   type: m["type"],
        //   shading: m["shading"]
        // }
      };
      newJson[type] = m[type];
      return newJson;
    });
    await fsp.writeFile(filePath, JSON.stringify(newData,null,2));
    console.log("success")    
  }catch(e){
    console.log(e);
  }
}

async function precinctBoundaryIntoProperFormat(file, dest){
  const filePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, dest);
  const fileContent = await fsp.readFile(filePath, 'utf8');

  let data = JSON.parse(fileContent);
  let features = data.features;
  const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
  for(let i =0; i< features.length;i++){
    features[i].properties = {
      "stateId": stateId,
      "geoId": features[i].properties.geoId,
      "geoType": features[i].properties.geoType
    }
  }
  data.features = features;
  await fsp.writeFile(destPath, JSON.stringify(data,null,2));
  console.log("success")    

}

async function findDistrictRep(file, dest){
  const filePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, dest);
  const fileContent = await fsp.readFile(filePath, 'utf8');

  let data = JSON.parse(fileContent);
  const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
  const district = new Map();
  data.forEach(d => {
    if(!district.has(d.parentDistrict)){
      district.set(d.parentDistrict, {
        stateId: stateId,
        geoId: d.parentDistrict.toString().padStart(2, "0"),
        stateRep: d.stateRep,
        geoType: "DISTRICT"
      })
    }
  })

  const result = [];
  for(const v of district.values()){
    result.push(v);
  }

  await fsp.writeFile(destPath, JSON.stringify(result,null,2));
  console.log("success")
}
// removePrecintFromJSON();
// loadElectionDataInFeatureCollection(
//   "./client/public/newyork_congressional_district.json"
// );
// convertGeometryCollectionToFeatureCollection();
//splitFile("./server/Spring Server/src/main/resources/FeatureCollectionCoordinate.json")
//indentFile("./precinct/precincts_newyork/newyork_precincts.json")
// formatFileForMongoImport("/server/Spring Server/src/main/resources/ny_data.json", "./DistrictData/ny_race.json", "race")
// insertDataToPrecinctFiles("./PrecinctData/official_ar_precinct_data/OFFICIAL AR Precinct Age Data.json",
//   "./PrecinctData/official_ar_precinct_data/OFFICIAL AR Precinct Election Data.json",
//   "./PrecinctData/official_ar_precinct_data/OFFICIAL AR Precinct Income Data.json",
//   "./PrecinctData/official_ar_precinct_data/OFFICIAL AR Precinct Race Data.json"
// )
//toNewLineDelimitedJSON("./official_ar_precinct_data/OFFICIAL AR Precinct Election Data.json", "./PrecinctData/ar_votes.json")
//indentFile("./server/Spring Server/src/main/resources/precinct/ny_data.json")

const array = ["age", "earning", "race", "election data"]

// formatFileForMongoImport("./server/Spring Server/src/main/resources/ny_data.json",`./server/Spring Server/src/main/resources/district/ny_demographic.json`, "race");
//toNewLineDelimitedJSON("./server/Spring Server/src/main/resources/precinct/ar_age.json", "ar_age.json")
//precinctBoundaryIntoProperFormat("./NY Precinct Boundaries.json", "./ny_precicnt.json")
// precicntDataIntoProperFormat("./AR Precinct Data/AR Race.json", "race")//
// toNewLineDelimitedJSON("./AR Precinct Data/AR Race.json", "./AR Precinct Data/AR Race.json")
// precicntDataIntoProperFormat("./NY\ Urbanicity-2.json", "urbanicity")
//precinctBoundaryIntoProperFormat("./ny_precicnt.json", "./ny_precicnt.json");
findDistrictRep("./AR State Reps.json", "./AR State Reps.json");

// Boundary done
// Demographic done
// Age done 
// Election Result done
// Income done
// Poverty done
// Urbanicity 