package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class DataRetriever {

	public static void main(String[] args) {
		SpringApplication.run(DataRetriever.class, args);
	}

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

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/oldgetcoordinates", produces = "application/json")
	public ResponseEntity<String> getCoordinateData(){
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process("FeatureCollectionCoordinate.json"));
	}


	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/getcoordinates/{state}/{boundary}", produces = "application/json")
	public ResponseEntity<String> getCoordinates(@PathVariable("state") String state, @PathVariable("boundary") String boundary){

		String fileName = state + "_" + boundary + "_data.json";
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process(fileName));
	}


	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/getchartdata", produces = "application/json")
	public ResponseEntity<String> getChartData(){
		DataRetriever processor = new DataRetriever();
		return ResponseEntity.ok(processor.process("ChartData.json"));
	}
}
