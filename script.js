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
  } else {
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

async function splitFile(filename) {
  const filepath = path.join(__dirname, filename);
  const fileContent = await fsp.readFile(filepath);
  const districtJson = JSON.parse(fileContent);

  const newyorkFileName = path.join(
    __dirname,
    `./server/Spring Server/src/main/resources/ny_district_data.json`
  );
  const arkansasFileNAme = path.join(
    __dirname,
    `./server/Spring Server/src/main/resources/arkansas_district_data.json`
  );

  const arkansasData = districtJson.data[0].district;
  const newyorkData = districtJson.data[1].district;

  const arkansasDataJsonString = JSON.stringify(arkansasData, null, 2);
  const newyorkDataJsonString = JSON.stringify(newyorkData, null, 2);

  await fsp.writeFile(newyorkFileName, newyorkDataJsonString);
  await fsp.writeFile(arkansasFileNAme, arkansasDataJsonString);

  console.log("success");
}

async function insertDataToPrecinctFiles(file1, file2, file3, file4) {
  let file1Path = path.join(__dirname, file1);
  let file2Path = path.join(__dirname, file2);
  let file3Path = path.join(__dirname, file3);
  let file4Path = path.join(__dirname, file4);

  const precinctContent = await fsp.readFile(
    "./precinct/precincts_arkansas/arkansas_precincts.json"
  );
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
  for (const f of features) {
    map.set(f.properties["NAMELSAD20"], f);
  }

  file1Json.forEach((item) => {
    const id = item.precinct_id;
    if (map.has(id)) {
      const newF = map.get(id);
      newF.properties["earning"] = item;
      map.set(id, newF);
    }
  });

  file2Json.forEach((item) => {
    const id = item.precinct_id;
    if (map.has(id)) {
      const newF = map.get(id);
      newF.properties["age"] = item;
      map.set(id, newF);
    }
  });

  file3Json.forEach((item) => {
    const id = item.precinct_id;
    if (map.has(id)) {
      const newF = map.get(id);
      newF.properties["race"] = item;
      map.set(id, newF);
    }
  });

  file4Json.forEach((item) => {
    const id = item.precinct_id;
    if (map.has(id)) {
      const newF = map.get(id);
      newF.properties["vote"] = item;
      map.set(id, newF);
    }
  });

  precinctJson.features = Array.from(map.values());

  const precinctJsonString = JSON.stringify(precinctJson, null, 2);

  await fsp.writeFile(
    "./precinct/precincts_arkansas/final_arkansas_precincts.json",
    precinctJsonString
  );
  console.log("success");
}

async function indentFile(file) {
  try {
    const filePath = path.join(__dirname, file);
    const filep = await fsp.readFile(filePath, "utf8"); // Read as a UTF-8 string

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
    const fileContent = await fsp.readFile(filePath, "utf8");

    // Parse the file content as JSON
    const jsonArray = JSON.parse(fileContent).features;

    // Ensure it's an array and format each item as a separate line
    if (Array.isArray(jsonArray)) {
      const newlineDelimitedJson = jsonArray
        .map((item) => {
          let newItem = {};
          newItem["stateId"] = Number(item.properties["STATEFP20"]);
          newItem["geoId"] = item.properties["CD118FP"];
          newItem["geoType"] = item.properties["CD118FP"]
            ? "DISTRICT"
            : "PRECICNT";
          newItem[category == "earning" ? "income" : category] =
            item.properties[category];
          return JSON.stringify(newItem);
        })
        .join(",\n");

      // Write the formatted JSON to the file, ready for mongoimport
      await fsp.writeFile(destPath, "[" + newlineDelimitedJson + "]", "utf8");
      console.log("File formatted successfully for mongoimport.");
    } else {
      console.error("Error: JSON is not an array of objects.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

async function toNewLineDelimitedJSON(file, dest) {
  try {
    const orgFile = path.join(__dirname, file);
    const destFile = path.join(__dirname, dest);
    const fileContent = await fsp.readFile(orgFile, "utf8");

    const json = JSON.parse(fileContent);
    const newlineDelimitedJson = json
      .map((item) => {
        return JSON.stringify(item);
      })
      .join(",\n");
    await fsp.writeFile(destFile, "[" + newlineDelimitedJson + "]", "utf8");
    console.log("File formatted successfully for mongoimport.");
  } catch (e) {
    console.log(e);
  }
}

async function splitFeatureCollectionFile(file, dest) {
  try {
    const filePath = path.join(__dirname, file);
    const fileContent = await fsp.readFile(filePath, "utf8");

    const data = JSON.parse(fileContent);
    const geojson = data.data[1].district.features;
    for (let i = 0; i < geojson.length; i++) {
      geojson[i].properties = {
        geoId: geojson[i].properties["CD118FP"],
        stateId: Number(geojson[i].properties["STATEFP20"]),
        number: Number(geojson[i].properties["CD118FP"]),
        geoType: "DISTRICT",
      };
    }

    const destFile = path.join(__dirname, dest);
    const newJson = {
      type: "FeatureCollection",
      features: geojson,
    };
    await fsp.writeFile(destFile, JSON.stringify(newJson, null, 2));
    console.log("successfully splitted");
  } catch (e) {
    console.log(e);
  }
}

async function precicntDataIntoProperFormat(file, type) {
  try {
    const filePath = path.join(__dirname, file);
    const fileContent = await fsp.readFile(filePath, "utf8");

    const data = JSON.parse(fileContent);
    const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
    const newData = data.map((m) => {
      const newJson = {
        stateId: stateId,
        geoId: m.congressional_district.toString().padStart(2, "0"),
        geoType: "DISTRICT",
        // urbanicity: {
        //   density: m["density"],
        //   type: m["type"],
        //   shading: m["shading"]
        // }
      };
      newJson[type] = m[type];
      // newJson[type] = {
      //   "rep": m.rep,
      //   "party": m.party,
      //   "race": m.race,
      //   "average_income": m.average_income,
      //   "population": m.population,
      //   "poverty_population": m.poverty_population,
      //   "poverty_percentage": m.poverty_percentage,
      //   "rural_percentage": m.rural_percentage,
      //   "suburban_percentage": m.suburban_percentage,
      //   "urban_percentage": m.urban_percentage,
      //   "trumpVotes": m.trumpVotes,
      //   "bidenVotes": m.bidenVotes,
      //   "vote_margin": m.vote_margin
      // }
      return newJson;
    });
    await fsp.writeFile(filePath, JSON.stringify(newData, null, 2));
    console.log("success");
  } catch (e) {
    console.log(e);
  }
}

async function precinctBoundaryIntoProperFormat(file, dest) {
  const filePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, dest);
  const fileContent = await fsp.readFile(filePath, "utf8");

  let data = JSON.parse(fileContent);
  let features = data.features;
  const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
  for (let i = 0; i < features.length; i++) {
    features[i].properties = {
      stateId: stateId,
      geoId: features[i].properties.geoId,
      geoType: features[i].properties.geoType,
    };
  }
  data.features = features;
  await fsp.writeFile(destPath, JSON.stringify(data, null, 2));
  console.log("success");
}

async function findDistrictRep(file, dest) {
  const filePath = path.join(__dirname, file);
  const destPath = path.join(__dirname, dest);
  const fileContent = await fsp.readFile(filePath, "utf8");

  let data = JSON.parse(fileContent);
  const stateId = file.toLowerCase().includes("ar") ? 5 : 36;
  const district = new Map();
  data.forEach((d) => {
    if (!district.has(d.parentDistrict)) {
      district.set(d.parentDistrict, {
        stateId: stateId,
        geoId: d.parentDistrict.toString().padStart(2, "0"),
        stateRep: d.stateRep,
        geoType: "DISTRICT",
      });
    }
  });

  const result = [];
  for (const v of district.values()) {
    result.push(v);
  }

  await fsp.writeFile(destPath, JSON.stringify(result, null, 2));
  console.log("success");
}

function getColor(percentage, party) {
  // Define bins for every 5% with colors interpolated between #FFCBCB and #FF2222

  // for demographic
  // const bins = [
  //   { upperLimit: 5, color: "#fff2f2" },
  //   { upperLimit: 10, color: "#ffd9d9" },
  //   { upperLimit: 15, color: "#ffbfbf" },
  //   { upperLimit: 20, color: "#ffa6a6" },
  //   { upperLimit: 25, color: "#ff8c8c" },
  //   { upperLimit: 30, color: "#ff7373" },
  //   { upperLimit: 35, color: "#ff5959" },
  //   { upperLimit: 40, color: "#ff4040" },
  //   { upperLimit: 45, color: "#ff2626" },
  //   { upperLimit: 50, color: "#ff0d0d" },
  //   { upperLimit: 55, color: "#f20000" },
  //   { upperLimit: 60, color: "#d90000" },
  //   { upperLimit: 65, color: "#bf0000" },
  //   { upperLimit: 70, color: "#a60000" },
  //   { upperLimit: 75, color: "#8c0000" },
  //   { upperLimit: 80, color: "#730000" },
  //   { upperLimit: 85, color: "#590000" },
  //   { upperLimit: 90, color: "#400000" },
  //   { upperLimit: 95, color: "#2e0000" },
  //   { upperLimit: 100, color: "#1f0000" },
  // ]

  //   // for poverty
  // const bins = [
  //   { upperLimit: 5, color: "#f2f9ff" }, // Very light blue
  //   { upperLimit: 10, color: "#d9ebff" },
  //   { upperLimit: 15, color: "#bfdeff" },
  //   { upperLimit: 20, color: "#a6d1ff" },
  //   { upperLimit: 25, color: "#8cc4ff" },
  //   { upperLimit: 30, color: "#73b7ff" },
  //   { upperLimit: 35, color: "#59aaff" },
  //   { upperLimit: 40, color: "#409dff" },
  //   { upperLimit: 45, color: "#2690ff" },
  //   { upperLimit: 50, color: "#0d83ff" }, // Medium blue
  //   { upperLimit: 55, color: "#0077f2" },
  //   { upperLimit: 60, color: "#006ad9" },
  //   { upperLimit: 65, color: "#005ebf" },
  //   { upperLimit: 70, color: "#0051a6" },
  //   { upperLimit: 75, color: "#00458c" },
  //   { upperLimit: 80, color: "#003873" },
  //   { upperLimit: 85, color: "#002c59" },
  //   { upperLimit: 90, color: "#001f40" },
  //   { upperLimit: 95, color: "#00162e" },
  //   { upperLimit: 100, color: "#001124" }, // Deep blue
  // ];

  //for income
  // const bins = [
  //   { upperLimit: 10000, color: "#f7fcf5" }, // Very light green
  //   { upperLimit: 20000, color: "#e8f6e2" },
  //   { upperLimit: 30000, color: "#d8f0ce" },
  //   { upperLimit: 40000, color: "#c8eabb" },
  //   { upperLimit: 50000, color: "#b9e4a7" },
  //   { upperLimit: 60000, color: "#a9de94" },
  //   { upperLimit: 70000, color: "#9ad880" },
  //   { upperLimit: 80000, color: "#8ad26d" },
  //   { upperLimit: 90000, color: "#7bcc59" },
  //   { upperLimit: 100000, color: "#6bc646" }, // Medium green
  //   { upperLimit: 110000, color: "#5eb939" },
  //   { upperLimit: 120000, color: "#54a633" },
  //   { upperLimit: 130000, color: "#4a922d" },
  //   { upperLimit: 140000, color: "#417f27" },
  //   { upperLimit: 150000, color: "#376b21" },
  //   { upperLimit: 160000, color: "#2d581b" },
  //   { upperLimit: 170000, color: "#234415" },
  //   { upperLimit: 180000, color: "#19310f" },
  //   { upperLimit: 190000, color: "#0f1f09" },
  //   { upperLimit: 200000, color: "#060d04" }, // Dark green
  // ];

  const republican = [
    { upperLimit: 10000, color: "#fff2f2" },
    { upperLimit: 20000, color: "#ffd9d9" },
    { upperLimit: 30000, color: "#ffbfbf" },
    { upperLimit: 40000, color: "#ffa6a6" },
    { upperLimit: 50000, color: "#ff8c8c" },
    { upperLimit: 60000, color: "#ff7373" },
    { upperLimit: 70000, color: "#ff5959" },
    { upperLimit: 80000, color: "#ff4040" },
    { upperLimit: 90000, color: "#ff2626" },
    { upperLimit: 100000, color: "#ff0d0d" },
    { upperLimit: 110000, color: "#f20000" },
    { upperLimit: 120000, color: "#d90000" },
    { upperLimit: 130000, color: "#bf0000" },
    { upperLimit: 140000, color: "#a60000" },
    { upperLimit: 150000, color: "#8c0000" },
    { upperLimit: 160000, color: "#730000" },
    { upperLimit: 170000, color: "#590000" },
    { upperLimit: 180000, color: "#400000" },
    { upperLimit: 190000, color: "#2e0000" },
    { upperLimit: 200000, color: "#1f0000" },
  ];

  const democrat = [
    { upperLimit: 10000, color: "#f2f9ff" }, // Very light blue
    { upperLimit: 20000, color: "#d9ebff" },
    { upperLimit: 30000, color: "#bfdeff" },
    { upperLimit: 40000, color: "#a6d1ff" },
    { upperLimit: 50000, color: "#8cc4ff" },
    { upperLimit: 60000, color: "#73b7ff" },
    { upperLimit: 70000, color: "#59aaff" },
    { upperLimit: 80000, color: "#409dff" },
    { upperLimit: 90000, color: "#2690ff" },
    { upperLimit: 100000, color: "#0d83ff" }, // Medium blue
    { upperLimit: 110000, color: "#0077f2" },
    { upperLimit: 120000, color: "#006ad9" },
    { upperLimit: 130000, color: "#005ebf" },
    { upperLimit: 140000, color: "#0051a6" },
    { upperLimit: 150000, color: "#00458c" },
    { upperLimit: 160000, color: "#003873" },
    { upperLimit: 170000, color: "#002c59" },
    { upperLimit: 180000, color: "#001f40" },
    { upperLimit: 190000, color: "#00162e" },
    { upperLimit: 200000, color: "#001124" }, // Deep blue
  ];

  // Determine the appropriate bin
  if (party == "Republican") {
    for (let bin of republican) {
      if (percentage <= bin.upperLimit) {
        return bin.color;
      }
    }
  } else if (party == "Democrat") {
    for (let bin of democrat) {
      if (percentage <= bin.upperLimit) {
        return bin.color;
      }
    }
  }

  // Default case (should not be reached due to validation)
  return "#FFFFFF"; // White
}

async function updateShading(file1, file2, type) {
  try {
    const filePath = path.join(__dirname, file1);
    const fileContent = await fsp.readFile(filePath, "utf8");

    const filePath2 = path.join(__dirname, file2);
    const fileContent2 = await fsp.readFile(filePath2, "utf8");

    const data = JSON.parse(fileContent);
    const data2 = JSON.parse(fileContent2);
    const map = new Map();
    data.forEach((m) => {
      map.set(m.geoId, m["income"]["average_income"]);
    });

    const newData = data2.map((m) => {
      const newJson = { ...m };
      // const races = ["white", "black", "asian", "hispanic", "other"]
      // for(const r of races){
      //   newJson[type][r + "_shading"] = getColor(newJson[type][r + "_percentage"] * 100);
      // }
      // newJson[type]["party_shading"] = stat == "Republican" ? "#ff0d0d" : stat == "Democrat" ? "0d83ff" : "ffffff";
      newJson[type]["income_shading_by_party"] = getColor(
        map.get(m.geoId),
        m["election data"]["party"]
      );
      return newJson;
    });
    await fsp.writeFile(filePath2, JSON.stringify(newData, null, 2));
    console.log("success");
  } catch (e) {
    console.log(e);
  }
}

async function combineJson(file1, file2) {
  try {
    const filePath = path.join(__dirname, file1);
    const fileContent = await fsp.readFile(filePath, "utf8");
    
    const filePath2 = path.join(__dirname, file2);
    const fileContent2 = await fsp.readFile(filePath2, "utf8");
    
    const file2Data = JSON.parse(fileContent2);
    const file1Data = JSON.parse(fileContent);
    const map = new Map();
    

    const incomeRanges = [
      "from_0_to_9999",
      "from_10000_to_14999",
      "from_15000_to_24999",
      "from_25000_to_34999",
      "from_35000_to_49999",
      "from_50000_to_74999",
      "from_75000_to_99999",
      "from_100000_and_more",
    ];

    const races = [
      "white",
      "black",
      "asian",
      "hispanic",
      "other"
    ]
    
    file2Data.forEach((m) => {
      map.set(m.precinct_id, m);
    });
    
    const result = [];

    function normalizePercentages(percentages) {
      const total = percentages.reduce((sum, value) => sum + (isNaN(value) ? 0 : value), 0);
      if (total === 0) {
        return percentages.map(() => 0); // Return all zeros if total is 0
      }
      return percentages.map(value => (isNaN(value) ? 0 : value) / total);
    }

    // Election data processing
    for (let data of file1Data) {
      const total = data["election data"].total_votes;
      const candidates = ["trump", "biden", "other"];
      let percentages = candidates.map(c => data["election data"][c + "_votes"] / total);
      percentages = normalizePercentages(percentages);
      
      const json = {
        precinct: data.geoId,
        total: total,
        pct_for_trump: percentages[0],
        pct_for_biden: percentages[1],
        pct_for_other: percentages[2],
      };
      map.set(data.geoId, json);
    }

    if (file2.toLowerCase().includes("race")) {
      for (let data of file2Data) {
        const json = map.get(data.geoId);
        let percentages = [];
        for (let r of races) {
          json["pct_" + r + "_pop"] = data["race"][r] / data["race"].population;
          percentages.push(json["pct_" + r + "_pop"]);
        }
        percentages = normalizePercentages(percentages);
        for (let i = 0; i < percentages.length; i++) {
          json["pct_" + races[i] + "_pop"] = percentages[i];
        }

        result.push(json);
      }
    }else if (file2.toLowerCase().includes("income")) {
      for (let data of file2Data) {
        const json = map.get(data.geoId);
        if (!json) {
          console.log(`Warning: No matching election data for precinct ${data.precinct_id}`);
          continue;
        }

        // Calculate raw percentages
        let percentages = incomeRanges.map(range => {
          const count = data.income[range] || 0; 
          const total = data.income.total_household;
          return total === 0 ? 0 : count / total;
        });

        // Normalize to ensure sum is 1
        const sum = percentages.reduce((a, b) => a + b, 0);
        if (sum === 0) {
          percentages = percentages.map(() => 1 / incomeRanges.length);
          console.log(`Warning: No income data for precinct ${data.geoId}, using equal distribution`);
        } else if (sum > 0) {
          percentages = percentages.map(p => p / sum);
        }

        incomeRanges.forEach((range, i) => {
          json["pct_" + range + "_pop"] = Number(percentages[i].toFixed(6));
        });

        result.push(json);
      }
    }
    

    const destination = path.join(__dirname, "el.json");
    await fsp.writeFile(destination, JSON.stringify(result, null, 2));

  } catch (e) {
    console.error("Error:", e);
  }
}


combineJson("./AR Election.json", "./AR Income.json");

// async function fixFieldName(file1){
//   const filePath = path.join(__dirname, file1);
//   const fileContent = await fsp.readFile(filePath, "utf8");

//   const data = JSON.parse(fileContent);
//   const result = [];
//   for(let d of data){
//     d["income"]["from_35000_to_49999"] =  d.income.from_35000_to_49909
//     delete d.income.from_35000_to_49909;
//     result.push(d);
//   }

//   await fsp.writeFile(filePath, JSON.stringify(result, null, 2));
//   console.log("success")
// }

// fixFieldName("./AR Income.json")
