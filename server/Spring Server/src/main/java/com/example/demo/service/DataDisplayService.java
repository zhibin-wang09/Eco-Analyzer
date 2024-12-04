package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.model.CongressionalDistrict;
import com.example.demo.model.Demographic;
import com.example.demo.model.Gingles;
import com.example.demo.model.Income;
import com.example.demo.model.Votes;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.ElectionResultRepository;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.CongressionalDistrictRepository;

@Service
public class DataDisplayService {

	DemographicRepository demographicRepository;
	ElectionResultRepository electionResultRepository;
	IncomeRepository incomeRepository;
	CongressionalDistrictRepository congressionalDistrictRepository;

	public DataDisplayService(DemographicRepository demographicRepository,
			ElectionResultRepository electionResultRepository, IncomeRepository incomeRepository,
			CongressionalDistrictRepository congressionalDistrictRepository) {
		this.demographicRepository = demographicRepository;
		this.electionResultRepository = electionResultRepository;
		this.incomeRepository = incomeRepository;
		this.congressionalDistrictRepository = congressionalDistrictRepository;
	}

	@Cacheable(value = "gingles")
	private List<Gingles> initializeGinglesData(int stateId) {
		List<Gingles> result = new ArrayList<>();
		List<Votes> electionData = electionResultRepository.findVotesByStateIdAndGeoType(stateId, GeoType.PRECINCT);

		for (Votes v : electionData) {
			Gingles g = new Gingles();
			g.setGeoId(v.getGeoId());
			g.setElectionData(v.getElectionData());
			result.add(g);
		}

		return result;
	}

	@Cacheable(value = "gingles")
	public List<Gingles> getGinglesDataByRace(List<Gingles> ginglesData, int stateId, String race) {
		if (ginglesData.size() == 0) {
			ginglesData = initializeGinglesData(stateId);
		}

		List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
				GeoType.PRECINCT);

		Map<String, Demographic> geoIdToDemographic = new HashMap<>();

		// store demographic data in a map then later be used to match against votes
		for (Demographic d : demographicData) {
			geoIdToDemographic.put(d.getGeoId(), d);
		}

		// for every precinct, we gather demographic percetange and electionData,
		// combine them into one object
		for (Gingles g : ginglesData) {
			Demographic d = geoIdToDemographic.get(g.getGeoId());

			Object racePercentage = d.getRace().get(race + "_percentage");
			if (racePercentage instanceof Integer) {
				g.setDemographicGroupPercentage(((Integer) racePercentage).doubleValue());
			} else if (racePercentage == null) {
				g.setDemographicGroupPercentage(0);
			} else {
				g.setDemographicGroupPercentage((Double) racePercentage);
			}

			g.setTotalPopulation(stateId);
			g.setTotalPopulation((int) d.getRace().get("population"));
		}

		return ginglesData;
	}

	@Cacheable(value = "gingles")
	public List<Gingles> getGinglesDataByIncome(List<Gingles> ginglesData, int stateId) {

		if (ginglesData.size() == 0) {
			ginglesData = initializeGinglesData(stateId);
		}

		List<Income> incomeData = incomeRepository.findIncomeByStateIdAndGeoType(stateId, GeoType.PRECINCT);
		Map<String, Income> geoIdToIncome = new HashMap<>();

		for (Income i : incomeData) {
			geoIdToIncome.put(i.getGeoId(), i);
		}

		for (Gingles g : ginglesData) {
			Income i = geoIdToIncome.get(g.getGeoId());
			g.setAverageHouseholdIncome((int) i.getIncome().get("average_income"));
			if(g.getDemographicGroupPercentage() != 0){
				// compute for normalized value
				int maximumIncomeAcrossPrecicnt = 100000;
				int minimumIncomeAcrossPrecinct = 0;
				double normalizedIncome = (maximumIncomeAcrossPrecicnt - g.getAverageHouseholdIncome())/(maximumIncomeAcrossPrecicnt - minimumIncomeAcrossPrecinct);
				double normalizedDemographicPercentage = (1 - g.getDemographicGroupPercentage()) * 100;
				g.setNormalizedValue((normalizedIncome + normalizedDemographicPercentage) / 2);
			}
		}

		return ginglesData;
	}

	@Cacheable(value = "table", key = "#stateId")
	public List<CongressionalDistrict> getStateCongressionalRepresentationTable(int stateId) {
		List<CongressionalDistrict> result = congressionalDistrictRepository
				.findCongressionalDistrictsByStateId(stateId);
		return result;
	}
}
