package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.common.State;
import com.example.demo.model.Demographic;
import com.example.demo.service.DemographicService;
import com.example.demo.util.StateIdConvertor;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class DemographicController {

    private final DemographicService demographicService;

    public DemographicController(DemographicService demographicService) {
        this.demographicService = demographicService;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/api/demographic", produces = "application/json")
    public ResponseEntity<List<Demographic>> getDemographicByStateId(@RequestParam("state") String state) {
        int id = StateIdConvertor.stringToId(State.valueOf(state.toUpperCase()));

        if (id == -1) {
            ResponseEntity.badRequest();
        }
        
        return ResponseEntity.ok(demographicService.getDemographicByStateId(id));
    }
}
