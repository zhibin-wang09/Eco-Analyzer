package com.example.demo.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.Category;
import com.example.demo.common.RegionType;
import com.example.demo.common.State;
import com.example.demo.model.BoxPlot;
import com.example.demo.model.DistrictDetail;
import com.example.demo.model.Gingles;
import com.example.demo.model.PrecinctDetail;
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
    @GetMapping(value = "/api/table", produces = "application/json")
    public ResponseEntity<List<DistrictDetail>> getDistrictDetails(
            @RequestParam String state) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        List<DistrictDetail> tableData = dataDisplayService.getDistrictDetails(id);
        return ResponseEntity.ok(tableData);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/precicnt/table", produces = "application/json")
    public ResponseEntity<PrecinctDetail> getPrecinctDetail(
            @RequestParam String state, @RequestParam String geoId) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        PrecinctDetail precinctDetail = dataDisplayService.getPrecinctDetail(id, geoId);
        return ResponseEntity.ok(precinctDetail);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/summary")
    public ResponseEntity<Map<String, Object>> getStateSummary(@RequestParam String state) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }
        return ResponseEntity.ok(dataDisplayService.getStateSummary(id));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/graph/boxplot")
    public ResponseEntity<List<BoxPlot>> getBoxplot(@RequestParam String state, @RequestParam String category,
            @RequestParam String regionType) {
        int id = -1;
        Category c = null;
        RegionType r = null;
        try {
            id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));
            c = Category.valueOf(category.toUpperCase());
            r = RegionType.valueOf(regionType.toUpperCase());
            if (id == -1) {
                throw new IllegalArgumentException();
            }

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(dataDisplayService.getBoxPlot(id, c, r));
    }
}
