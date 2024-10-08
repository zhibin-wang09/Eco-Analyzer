package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import org.json.JSONObject;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;
import org.springframework.http.ResponseEntity;


@SpringBootApplication
@RestController
public class DataRetriever {

	public static void main(String[] args) {
		SpringApplication.run(DataRetriever.class, args);
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@RequestMapping(value = "/getcoordinates", produces = "application/json")
	public ResponseEntity<Map<String,Object>> temp(){

		StringBuilder jsonString = new StringBuilder();

		try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream("Coordinate.json")){
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
		return ResponseEntity.ok(result);
	}
}
