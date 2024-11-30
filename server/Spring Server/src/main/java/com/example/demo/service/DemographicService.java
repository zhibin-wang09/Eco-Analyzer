package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.repository.DemographicRepository;
import com.example.demo.model.Demographic;
import java.util.List;

@Service
public class DemographicService {

    private final DemographicRepository demographicRepository;

    public DemographicService(DemographicRepository demographicRepository) {
        this.demographicRepository = demographicRepository;
    }

    public List<Demographic> getDemographicByStateId(int stateId) {
        return demographicRepository.findDemographicByStateId(stateId);
    }
}
