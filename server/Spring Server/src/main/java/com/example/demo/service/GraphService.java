package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.model.Demographic;
import com.example.demo.model.Gingles;
import com.example.demo.model.Votes;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.ElectionResultRepository;

@Service
public class GraphService {

	DemographicRepository demographicRepository;
	ElectionResultRepository electionResultRepository;

	public GraphService(DemographicRepository demographicRepository, ElectionResultRepository electionResultRepository){
		this.demographicRepository = demographicRepository;
		this.electionResultRepository = electionResultRepository;
	}
    
	public List<Gingles> getGinglesData(int stateId, String race, GeoType geoType){
		List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndRaceAndGeoType(stateId, race, geoType);
		List<Votes> electionData = electionResultRepository.findElectionResultByStateIdAndGeoType(stateId, geoType);

		return null;
	}
}
