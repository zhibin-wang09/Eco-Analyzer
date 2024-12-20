package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.Category;
import com.example.demo.common.DemographicGroup;
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
	@GetMapping(value = "/api/map/districtplan", produces = "application/json")
	public ResponseEntity<String> getDistrictPlan(@RequestParam("state") String state,
			@RequestParam Integer districtPlan) {
		int id = 0;
		State s = null;
		int districtPlanNum = -1;
		try {
			s = State.valueOf(state.toUpperCase());

			id = StateIdConvertor.stringToId(s);
			if (id == -1) {
				throw new IllegalArgumentException("id does not match ");
			}

			if(districtPlan == null || (districtPlan < 0 || districtPlan > 5)){
				throw new IllegalArgumentException("district plan does not exist");
			}else{
				districtPlanNum = districtPlan;
			}
		} catch (Exception e) {
			ResponseEntity.status(404).body(e.toString());
		}
		
		return ResponseEntity.ok(mapService.getDistrictPlan(id, districtPlanNum));
	}

	@CrossOrigin(origins = "http://localhost:3000")
	@GetMapping(value = "/api/heatmap/{category}")
	public ResponseEntity<List<Boundary>> getHeapMaps(@PathVariable("category") String category,
			@RequestParam String state, @RequestParam(required = false) String demographicGroup) {
		int id = 0;
		Category cat = null;
		State s = null;
		DemographicGroup d = null;
		try {
			cat = Category.valueOf(category.toUpperCase());
			if (demographicGroup != null)
				d = DemographicGroup.valueOf(demographicGroup.toUpperCase());
			s = State.valueOf(state.toUpperCase());

			id = StateIdConvertor.stringToId(s);
			if (id == -1) {
				throw new IllegalArgumentException("id does not match ");
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(null);
		}

		return ResponseEntity.ok(mapService.getHeapMap(id, cat, d));
	}

}
