package com.example.demo.service;

import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;

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
}
