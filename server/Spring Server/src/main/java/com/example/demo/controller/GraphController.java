package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.CacheService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GraphController {

    private final CacheService cacheService;

    public GraphController(CacheService cacheService){
        this.cacheService = cacheService;
    }
    
	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/chartdata/{state}", produces = "application/json")
	public ResponseEntity<String> getChartData(@PathVariable("state") String state) {
		boolean isNy = state.equals("ny");
		boolean isAr = state.equals("ar");
		if (!isNy && !isAr) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not exist in server");
		}
		return ResponseEntity.ok(cacheService.getChartData(state));
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/chartdata", produces = "application/json")
	public ResponseEntity<String> getChartData() {
		return ResponseEntity.ok(cacheService.getChartData());
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/gingles-data", produces = "application/json")
	public ResponseEntity<String> getGinglesData(@RequestParam String state, @RequestParam String demographicGroup) {
		boolean isNy = state.equals("ny");
		boolean isAr = state.equals("ar");
		if (!isNy && !isAr) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("State not exist in server");
		}
		return ResponseEntity.ok(cacheService.getGinglesData(state, demographicGroup));
	}

}
