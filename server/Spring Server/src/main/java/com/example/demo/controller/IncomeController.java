package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.IncomeService;
import com.example.demo.util.StateIdConvertor;
import com.example.demo.common.GeoType;
import com.example.demo.common.State;
import com.example.demo.model.Income;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
public class IncomeController {

    private IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(path = "/api/income", produces = "application/json")
    public ResponseEntity<List<Income>> getIncomeByStateAndGeoType(@RequestParam("state") String state,
            @RequestParam("geoType") String geoType) {
        int stateId = -1;
        GeoType g = null;

        try {
            State s = State.valueOf(state.toUpperCase());
            g = GeoType.valueOf(geoType.toUpperCase());
            stateId = StateIdConvertor.stringToId(s);

            if (stateId == -1) {
                throw new IllegalArgumentException();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok(incomeService.getIncomeByStateAndGeoType(stateId, g));
    }

}
