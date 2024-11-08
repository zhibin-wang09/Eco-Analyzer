package com.example.demo.service;

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.io.IOException;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class CoordinateDataService {

    private String process(String filename){
		StringBuilder jsonString = new StringBuilder();

		try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(filename)){
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
				String line;

				while ((line = reader.readLine()) != null) {
					jsonString.append(line);
				}
		}
		catch(IOException e){
			e.printStackTrace();
		}

		return jsonString.toString();
	}

    public String getCoordinateData(){
        return process("FeatureCollectionCoordinate.json");
    }

    public String getCoordinateData(String state){
        return process(state + "_" + "data.json");
    }

    public String getChartData(String state){
        return process(state + "_" + "chartdata.json");
    }

	public String getChartData(){
		return process("ChartData.json");
	}

	public String getGinglesData(String state, String demographicGroup){
		String electionData = process("precinctData/" + state + "_" + "votes.json");
		String demographicData = process("precinctData/" + state + "_" + "race.json");
		JSONArray ginglesData = new JSONArray(electionData);
		JSONArray demographicArray = new JSONArray(demographicData);
		HashMap<String, JSONObject> precincts = new HashMap<>();
		for(int i =0; i < ginglesData.length();i++){
			precincts.put(ginglesData.getJSONObject(i).get("precinct_id").toString(), ginglesData.getJSONObject(i));
		}

		for(int i = 0; i< demographicArray.length();i++){
			JSONObject precinctDemographic = demographicArray.getJSONObject(i);
			String precinctName = precinctDemographic.get("precinct_id").toString();
			if(precincts.containsKey(precinctName)){
				JSONObject combinedPrecinctData =  precincts.get(precinctName);
				combinedPrecinctData.put("population", precinctDemographic.get("population"));
				combinedPrecinctData.put("demographic_precentage", Double.valueOf(precinctDemographic.get(demographicGroup).toString()) / Double.valueOf(precinctDemographic.get("population").toString()));
				precincts.put(precinctName, combinedPrecinctData);
			}
		}

		return new JSONArray( "[" +precincts.values().toString()+ "]").toString();
	}
}
