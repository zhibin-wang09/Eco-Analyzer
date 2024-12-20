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
import com.example.demo.model.EcologicalInference;
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
    @GetMapping(value = "/api/precinct", produces = "application/json")
    public ResponseEntity<Map<String, Object>> getPrecinctDetail(
            @RequestParam String state, @RequestParam String geoId) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        Map<String, Object> precinctDetail = dataDisplayService.getPrecinctDetail(id, geoId);
        return ResponseEntity.ok(precinctDetail);
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/precinct/table", produces = "application/json")
    public ResponseEntity<List<Map<String, Object>>> getPrecincs(
            @RequestParam String state) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            return ResponseEntity.badRequest().body(null);
        }

        List<Map<String, Object>> precincts = dataDisplayService.getPrecincts(id);
        return ResponseEntity.ok(precincts);
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
            @RequestParam String regionType, @RequestParam(required = false) String range) {
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

        if (range == null) {
            return ResponseEntity.ok(dataDisplayService.getBoxPlot(id, c, r));
        } else {
            // user specify the range of the category(i.e. white/black/asian of race
            // category, or urban/suburban of urbanicity category)
            return ResponseEntity.ok(dataDisplayService.getBoxPlotByRange(id, c, r, range));
        }
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/graph/ecologicalinference")
    public ResponseEntity<List<EcologicalInference>> getEcologicalInferenceData(@RequestParam String state,
            @RequestParam String category, @RequestParam String candidate, @RequestParam String[] range) {
        int id = -1;
        Category c = null;
        try {
            id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));
            c = Category.valueOf(category.toUpperCase());
            if (id == -1) {
                throw new IllegalArgumentException();
            }

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(dataDisplayService.getEcologicalInferenceData(id, c, candidate, range));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/ensembleSummary")
    public ResponseEntity<String> getEcologicalInferenceData(@RequestParam String state) {
        int id = -1;

        try {
            id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));
            if (id == -1) {
                throw new IllegalArgumentException();
            }

        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(dataDisplayService.getEnsembleSummary(id));
    }
}
