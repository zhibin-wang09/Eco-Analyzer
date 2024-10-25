package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import org.springframework.http.ResponseEntity;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class DataRetriever {

	public static void main(String[] args) {
		SpringApplication.run(DataRetriever.class, args);
	}

	private Map<String, Object> process(String filename){
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

		JSONObject obj = new JSONObject(jsonString.toString());
		Map<String, Object> result = obj.toMap();
		return result;
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(value = "/oldgetcoordinates", produces = "application/json")
	public ResponseEntity<Map<String,Object>> getCoordinateData(){
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process("FeatureCollectionCoordinate.json"));
	}


	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(value = "/getcoordinates/{state}/{boundary}", produces = "application/json")
	public ResponseEntity<Map<String,Object>> getCoordinates(@PathVariable("state") String state, @PathVariable("boundary") String boundary){

		String fileName = state + "_" + boundary + "_data.json";
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process(fileName));
	}


	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(value = "/getchartdata", produces = "application/json")
	public ResponseEntity<Map<String,Object>> getChartData(){
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process("ChartData.json"));
	}
}
