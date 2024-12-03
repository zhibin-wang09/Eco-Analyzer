package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.Category;
import com.example.demo.common.GeoType;
import com.example.demo.common.State;
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
	@GetMapping(value = "/api/map", produces = "application/json")
	public ResponseEntity<List<Boundary>> getBoundaryData(@RequestParam("state") String state,
			@RequestParam String geoType) {
		int id = 0;
		GeoType type = null;
		State s = null;
		try {
			type = GeoType.valueOf(geoType.toUpperCase());
			s = State.valueOf(state.toUpperCase());

			id = StateIdConvertor.stringToId(s);
			if (id == -1) {
				throw new IllegalArgumentException("id does not match ");
			}
		} catch (Exception e) {
			ResponseEntity.status(404).body(e.toString());
		}
		return ResponseEntity.ok(mapService.getBoundaryData(id, type));
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/heatmap")
	public ResponseEntity<List<Boundary>> getHeapMaps(@RequestParam String state, @RequestParam String geoType,
			@RequestParam String category) {
		int id = 0;
		GeoType type = null;
		Category cat = null;
		State s = null;

		try {
			type = GeoType.valueOf(geoType.toUpperCase());
			cat = Category.valueOf(category.toUpperCase());
			s = State.valueOf(state.toUpperCase());

			id = StateIdConvertor.stringToId(s);
			if (id == -1) {
				throw new IllegalArgumentException("id does not match ");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}
		
		return ResponseEntity.ok(mapService.getHeapMap(id, type, cat));
	}

}
