package com.example.demo.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.common.Category;
import com.example.demo.common.DemographicGroup;
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
			IncomeRepository incomeRepository, PovertyRepository povertyRepository,
			ElectionResultRepository electionResultRepository) {
		this.boundaryRepository = boundaryRepository;
		this.demographicRepository = demographicRepository;
		this.incomeRepository = incomeRepository;
		this.povertyRepository = povertyRepository;
		this.electionResultRepository = electionResultRepository;
	}

	@Cacheable(value = "map")
	public List<Boundary> getBoundaryData(int stateId, GeoType geoType) {
		return boundaryRepository.findByStateIdAndGeoType(stateId, geoType);
	}

	public String getDistrictPlan(int stateId, int districtPlan){
		String stateAbbrev = stateId == 36 ? "ny" : "ar";
		StringBuilder jsonString = new StringBuilder();

		try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(stateAbbrev + "_district_plan_" + districtPlan + ".json")){
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
				String line;

				while ((line = reader.readLine()) != null) {
					jsonString.append(line);
				}
		}
		catch(IOException e){
			e.printStackTrace();
		}

		JSONArray obj = new JSONArray(jsonString.toString());
		return obj.toString();
	}

	@Cacheable(value = "heatmap")
	public List<Boundary> getHeapMap(int stateId, Category category, DemographicGroup demographicGroup) {
		List<Boundary> boundary = boundaryRepository.findByStateIdAndGeoType(stateId, GeoType.PRECINCT);

		switch (category) {
			case Category.DEMOGRAPHIC:
				List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
						GeoType.PRECINCT);
				Map<String, Demographic> geoIdToDemographic = new HashMap<>();
				// store demographicData into a mapping of geoId -> demographic
				for (Demographic d : demographicData) {
					geoIdToDemographic.put(d.getGeoId(), d);
				}
				for (Boundary b : boundary) {
					Demographic d =  geoIdToDemographic.get(b.getProperties().getGeoId());
					b.getProperties().setData(new HashMap<>());
					b.getProperties().getData().put("demographic shading", d.getRace().get(demographicGroup.toString().toLowerCase() + "_shading"));
				}
				return boundary;
			case Category.ECONOMIC:
				List<Income> incomeData = incomeRepository.findIncomeByStateIdAndGeoType(stateId, GeoType.PRECINCT);
				Map<String, Income> geoIdToIncome = new HashMap<>();
				// store incomeData into a mapping of geoId -> income
				for (Income i : incomeData) {
					geoIdToIncome.put(i.getGeoId(), i);
				}

				// Merge income data with boundary data
				for (Boundary b : boundary) {
					Income i = geoIdToIncome.get(b.getProperties().getGeoId());
					b.getProperties().setData(new HashMap<>());
					b.getProperties().getData().put("income shading", i.getIncome().get("average_income_shading"));
				}
				return boundary;
			case Category.POLITICALINCOME:
				List<Votes> election = electionResultRepository.findVotesByStateIdAndGeoType(stateId, GeoType.PRECINCT);
				Map<String, Votes> geoIdToVotes = new HashMap<>();
				for (Votes e : election) {
					geoIdToVotes.put(e.getGeoId(), e);
				}

				// Merge political/income data with boundary data
				for (Boundary b : boundary) {
					Votes i = geoIdToVotes.get(b.getProperties().getGeoId());
					b.getProperties().setData(new HashMap<>());
					b.getProperties().getData().put("income_shading_by_party", i.getElectionData().get("income_shading_by_party"));
				}
				return boundary;
			case Category.POVERTY:
				List<Poverty> povertyData = povertyRepository.findPovertyByStateIdAndGeoType(stateId, GeoType.PRECINCT);
				Map<String, Poverty> geoIdToPoverty = new HashMap<>();
				// store povertyData into a mapping of geoId -> poverty
				for (Poverty i : povertyData) {
					geoIdToPoverty.put(i.getGeoId(), i);
				}

				// Merge poverty data with boundary data
				for (Boundary b : boundary) {
					Poverty p = geoIdToPoverty.get(b.getProperties().getGeoId());
					b.getProperties().setData(new HashMap<>());
					b.getProperties().getData().put("poverty shading", p.getPoverty().getPovertyShading());
				}
				return boundary;
			default:
				break;
		}

		return null;
	}
}
