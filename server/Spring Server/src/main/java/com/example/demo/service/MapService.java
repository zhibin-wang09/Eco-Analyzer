package com.example.demo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.common.Category;
import com.example.demo.common.GeoType;
import com.example.demo.model.Boundary;
import com.example.demo.model.Demographic;
import com.example.demo.model.Income;
import com.example.demo.model.Poverty;
import com.example.demo.model.Votes;
import com.example.demo.repository.BoundaryRepository;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.ElectionResultRepository;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.PovertyRepository;

@Service
public class MapService {

	private BoundaryRepository boundaryRepository;
	private DemographicRepository demographicRepository;
	private IncomeRepository incomeRepository;
	private PovertyRepository povertyRepository;
	private ElectionResultRepository electionResultRepository;

	public MapService(BoundaryRepository boundaryRepository, DemographicRepository demographicRepository,
			IncomeRepository incomeRepository, PovertyRepository povertyRepository, ElectionResultRepository electionResultRepository) {
		this.boundaryRepository = boundaryRepository;
		this.demographicRepository = demographicRepository;
		this.incomeRepository = incomeRepository;
		this.povertyRepository = povertyRepository;
		this.electionResultRepository = electionResultRepository;
	}

	public List<Boundary> getBoundaryData(int stateId, GeoType geoType) {
		return boundaryRepository.findByStateIdAndGeoType(stateId, geoType);
	}

	public List<Boundary> getHeapMap(int stateId, GeoType geoType, Category category) {
		List<Boundary> boundary = boundaryRepository.findByStateIdAndGeoType(stateId, geoType);
		switch (category) {
			case Category.DEMOGRAPHIC:
				List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
						geoType);
				Map<String, Demographic> geoIdToDemographic = new HashMap<>();
				// store demographicData into a mapping of geoId -> demographic
				for (Demographic d : demographicData) {
					geoIdToDemographic.put(d.getGeoId(), d);
				}

				// Merge demographic data with boundary data
				for (Boundary b : boundary) {
					Map<String, Object> race = new HashMap<>();
					race.put("race", geoIdToDemographic.get(b.getProperties().getGeoId()));
					b.getProperties().setData(race);
				}
				return boundary;
			case Category.ECONOMIC:
				List<Income> incomeData = incomeRepository.findIncomeByStateIdAndGeoType(stateId, geoType);
				Map<String, Income> geoIdToIncome = new HashMap<>();
				// store incomeData into a mapping of geoId -> income
				for (Income i : incomeData) {
					geoIdToIncome.put(i.getGeoId(), i);
				}

				// Merge income data with boundary data
				for (Boundary b : boundary) {
					Map<String, Object> income = new HashMap<>();
					income.put("income", geoIdToIncome.get(b.getProperties().getGeoId()));
					b.getProperties().setData(income);
				}
				return boundary;
			case Category.POLITICAL:
				List<Votes> politicalData = electionResultRepository.findVotesByStateIdAndGeoType(stateId, geoType);
				Map<String, Votes> geoIdToVotes = new HashMap<>();
				// store politicalData into a mapping of geoId -> votes
				for (Votes i : politicalData) {
					geoIdToVotes.put(i.getGeoId(), i);
				}

				// Merge votes data with boundary data
				for (Boundary b : boundary) {
					Map<String, Object> Votes = new HashMap<>();
					Votes.put("votes", geoIdToVotes.get(b.getProperties().getGeoId()));
					b.getProperties().setData(Votes);
				}
				return boundary;
			case Category.POVERTY:
				List<Poverty> povertyData = povertyRepository.findPovertyByStateIdAndGeoType(stateId, geoType);
				Map<String, Poverty> geoIdToPoverty = new HashMap<>();
				// store povertyData into a mapping of geoId -> poverty
				for (Poverty i : povertyData) {
					geoIdToPoverty.put(i.getGeoId(), i);
				}

				// Merge poverty data with boundary data
				for (Boundary b : boundary) {
					Map<String, Object> poverty = new HashMap<>();
					poverty.put("poverty", geoIdToPoverty.get(b.getProperties().getGeoId()));
					b.getProperties().setData(poverty);
				}
				return boundary;
			default:
				break;
		}

		return null;
	}
}
