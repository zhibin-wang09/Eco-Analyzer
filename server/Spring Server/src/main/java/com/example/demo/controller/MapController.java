package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.GeoType;
import com.example.demo.model.Boundary;
import com.example.demo.service.MapService;
import com.example.demo.util.StateIdConvertor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class MapController {

	private final MapService mapService;

	public MapController(MapService mapService) {
		this.mapService = mapService;
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/map/{state}/{geoType}", produces = "application/json")
	public ResponseEntity<List<Boundary>> getBoundaryData(@PathVariable("state") String state, @PathVariable String geoType) {
		int id = 0;
		GeoType type = null;
		try {
			id = StateIdConvertor.stringToId(state);
			if(id == -1){
				throw new IllegalArgumentException("id does not match ");
			}
			type = GeoType.valueOf(geoType.toUpperCase());
		} catch (Exception e) {
			ResponseEntity.status(404).body(e.toString());
		}
		return ResponseEntity.ok(mapService.getBoundaryData(id, type));
	}
	
}
