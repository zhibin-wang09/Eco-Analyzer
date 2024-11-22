package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.GeoType;
import com.example.demo.common.State;
import com.example.demo.model.Gingles;
import com.example.demo.service.GraphService;
import com.example.demo.util.StateIdConvertor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class GraphController {

    GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/graph/gingles", produces = "application/json")
    public ResponseEntity<List<Gingles>> getGinglesData(@RequestParam String state,
            @RequestParam String demographicGroup, @RequestParam String geoType) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));
        GeoType type = GeoType.valueOf(geoType.toUpperCase());
        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(graphService.getGinglesData(id, demographicGroup, type));
    }
}
