package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.repository.DemographicRepository;
import com.example.demo.model.Demographic;
import java.util.List;
import java.util.Map;

@Service
public class DemographicService {

    private final DemographicRepository demographicRepository;
    private final Map<String, String> cache;

    public DemographicService(DemographicRepository demographicRepository, Map<String, String> cache){
        this.demographicRepository = demographicRepository;
        this.cache = cache;
    }

    public List<Demographic> getDemographicByStateId(int stateId){
        return demographicRepository.findDemographicByStateId(stateId);
    }
}
