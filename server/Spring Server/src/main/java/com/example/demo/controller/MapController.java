package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.CacheService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MapController {

	private final CacheService cacheService;

	public MapController(CacheService cacheService) {
		this.cacheService = cacheService;
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/oldcoordinates", produces = "application/json")
	public ResponseEntity<String> getCoordinateData() {
		return ResponseEntity.ok(cacheService.getCoordinateData());
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/coordinates/{state}/{geography}", produces = "application/json")
	public ResponseEntity<String> getCoordinateData(@PathVariable("state") String state, @PathVariable String geography) {
		boolean isNy = state.equals("ny");
		boolean isAk = state.equals("ar");
		if (!isNy && !isAk) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not exist in server");
		}
		return ResponseEntity.ok(cacheService.getCoordinateData(state,geography));
	}
	
}
