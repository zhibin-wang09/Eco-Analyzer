package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.State;
import com.example.demo.model.CongressionalDistrict;
import com.example.demo.model.Gingles;
import com.example.demo.service.DataDisplayService;
import com.example.demo.util.StateIdConvertor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DataDisplayController {

    DataDisplayService dataDisplayService;

    public DataDisplayController(DataDisplayService dataDisplayService) {
        this.dataDisplayService = dataDisplayService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/graph/gingles", produces = "application/json")
    public ResponseEntity<List<Gingles>> getGinglesDataByRace(@RequestParam String state,
            @RequestParam(required = false) String demographicGroup,
            @RequestParam(defaultValue = "false") boolean includeIncome) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Gingles> ginglesData = new ArrayList<>();
        if (demographicGroup != null) {
            ginglesData = dataDisplayService.getGinglesDataByRace(ginglesData, id, demographicGroup);
        }

        if (includeIncome) {
            ginglesData = dataDisplayService.getGinglesDataByIncome(ginglesData, id);
        }

        return ResponseEntity.ok(ginglesData);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/district/table", produces = "application/json")
    public ResponseEntity<List<CongressionalDistrict>> getStateCongressionalRepresentationTable(
            @RequestParam String state) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        List<CongressionalDistrict> tableData = dataDisplayService.getStateCongressionalRepresentationTable(id);
        return ResponseEntity.ok(tableData);
    }
}
