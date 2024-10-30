package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.CoordinateDataService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CoordinateDataController {

	private final CoordinateDataService dataService;

	public CoordinateDataController(CoordinateDataService dataService) {
		this.dataService = dataService;
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/oldcoordinates", produces = "application/json")
	public ResponseEntity<String> getCoordinateData() {
		return ResponseEntity.ok(dataService.getCoordinateData());
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/coordinates/{state}", produces = "application/json")
	public ResponseEntity<String> getCoordinateData(@PathVariable("state") String state) {
		boolean isNy = state.equals("ny");
		boolean isAk = state.equals("ak");
		if (!isNy && !isAk) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not exist in server");
		}
		return ResponseEntity.ok(dataService.getCoordinateData(state));
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/chartdata/{state}", produces = "application/json")
	public ResponseEntity<String> getChartData(@PathVariable("state") String state) {
		boolean isNy = state.equals("ny");
		boolean isAk = state.equals("ak");
		if (!isNy && !isAk) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not exist in server");
		}
		return ResponseEntity.ok(dataService.getChartData(state));
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/chartdata", produces = "application/json")
	public ResponseEntity<String> getChartData() {
		return ResponseEntity.ok(dataService.getChartData());
	}
}
