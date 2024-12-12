package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.common.RegionType;
import com.example.demo.common.Category;
import com.example.demo.model.DistrictDetail;
import com.example.demo.model.BoxPlot;
import com.example.demo.model.Demographic;
import com.example.demo.model.Gingles;
import com.example.demo.model.Income;
import com.example.demo.model.Urbanicity;
import com.example.demo.model.Votes;
import com.example.demo.repository.BoxPlotRepository;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.ElectionResultRepository;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.UrbanicityRepository;
import com.example.demo.repository.DistrictDetailRepository;

@Service
public class DataDisplayService {

	DemographicRepository demographicRepository;
	ElectionResultRepository electionResultRepository;
	IncomeRepository incomeRepository;
	DistrictDetailRepository districtDetailRepository;
	UrbanicityRepository urbanicityRepository;
	BoxPlotRepository boxPlotRepository;

	public DataDisplayService(DemographicRepository demographicRepository,
			ElectionResultRepository electionResultRepository, IncomeRepository incomeRepository,
			DistrictDetailRepository districtDetailRepository,
			UrbanicityRepository urbanicityRepository,
			BoxPlotRepository boxPlotRepository) {
		this.demographicRepository = demographicRepository;
		this.electionResultRepository = electionResultRepository;
		this.incomeRepository = incomeRepository;
		this.districtDetailRepository = districtDetailRepository;
		this.urbanicityRepository = urbanicityRepository;
		this.boxPlotRepository = boxPlotRepository;
	}

	@Cacheable(value = "gingles")
	private List<Gingles> initializeGinglesData(int stateId) {
		List<Gingles> result = new ArrayList<>();
		List<Votes> electionData = electionResultRepository.findVotesByStateIdAndGeoType(stateId, GeoType.PRECINCT);
		List<Urbanicity> urbanicityData = urbanicityRepository.findUrbanicityByStateId(stateId);
		Map<String, Urbanicity> map = new HashMap<>();

		for (Urbanicity u : urbanicityData) {
			map.put(u.getGeoId(), u);
		}

		for (Votes v : electionData) {
			Gingles g = new Gingles();
			g.setGeoId(v.getGeoId());
			g.setElectionData(v.getElectionData());
			Urbanicity u = map.get(v.getGeoId());
			g.setUrbanicity(u.getUrbanicity().getType());
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
			if (g.getDemographicGroupPercentage() != 0) {
				// compute for normalized value
				int maximumIncomeAcrossPrecicnt = 100000;
				int minimumIncomeAcrossPrecinct = 0;
				double normalizedValue = (maximumIncomeAcrossPrecicnt - g.getAverageHouseholdIncome())
						/ (maximumIncomeAcrossPrecicnt - minimumIncomeAcrossPrecinct);
				double normalizedDemographicPercentage = (1 - g.getDemographicGroupPercentage()) * 100;
				g.setNormalizedValue((normalizedValue + normalizedDemographicPercentage) / 2);
			}
		}

		return ginglesData;
	}

	@Cacheable(value = "table")
	public List<DistrictDetail> getDistrictDetails(int stateId) {
		List<DistrictDetail> result = districtDetailRepository
				.findDistrictDetailsByStateId(stateId);
		return result;
	}

	@Cacheable(value = "summary")
	public Map<String, Object> getStateSummary(int stateId) {
		Map<String, Object> stateSummary = new HashMap<>();
		List<DistrictDetail> districtData = districtDetailRepository
				.findDistrictDetailsByStateId(stateId);
		int population = 0;
		int democratVotes = 0;
		int republicanVotes = 0;
		for (DistrictDetail c : districtData) {
			population += c.getData().getPopulation(); // state population
			democratVotes += c.getData().getBidenVotes();
			republicanVotes += c.getData().getTrumpVotes(); // state voter distribution
		}

		Map<String, Integer> racialPopulation = getRacialPopulationAsState(stateId); // race -> population
		Map<String, Double> percentagePopulationByRegionType = getPercentagePopulationByRegionType(stateId); // regionType
																												// ->
																												// population percentage

		List<Map<String, String>> congressionalRepresentativeData = new ArrayList<>();
		List<DistrictDetail> districtDetails = districtDetailRepository.findDistrictDetailsByStateId(stateId);

		for(DistrictDetail d : districtDetails){
			Map<String, String> m = new HashMap<>();
			m.put("representative", d.getData().getRep());
			m.put("representative party", d.getData().getParty());
			m.put("district", d.getGeoId());
			congressionalRepresentativeData.add(m);
		}

		double totalVotes = democratVotes + republicanVotes;
		// summary of congressional representatives by party
		stateSummary.put("population", population);
		stateSummary.put("racial population", racialPopulation);
		stateSummary.put("vote margin", (democratVotes / totalVotes) - (republicanVotes / totalVotes));
		stateSummary.put("percentage by region type", percentagePopulationByRegionType);
		stateSummary.put("congressional representatives", congressionalRepresentativeData);
		return stateSummary;
	}

	public Map<String, Integer> getRacialPopulationAsState(int stateId) {
		Map<String, Integer> racialPopulation = new HashMap<>();

		List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
				GeoType.DISTRICT);
		for (Demographic d : demographicData) { // population of each racial group in the state
			for (Map.Entry<String, Object> entry : d.getRace().entrySet()) {
				String race = entry.getKey();
				Integer population = (Integer) entry.getValue();
				Integer existingPopulation = racialPopulation.getOrDefault(entry.getKey(), 0);

				racialPopulation.put(race, existingPopulation + population);
			}
		}

		return racialPopulation;
	}

	public Map<String, Double> getPercentagePopulationByRegionType(int stateId) {
		Map<String, Double> percentagePopulationByRegionType = new HashMap<>();
		List<Demographic> demographicData = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
				GeoType.PRECINCT); // has population data
		Map<String, Integer> precinctPopulation = new HashMap<>();

		for (Demographic d : demographicData) {
			int population = (Integer) d.getRace().get("population");
			precinctPopulation.put(d.getGeoId(), population);
		}

		List<Urbanicity> urbanicityData = urbanicityRepository.findUrbanicityByStateId(stateId); // has region type
																									// information
		
		int statePopulation = 0;

		for (Urbanicity u : urbanicityData) {
			String regionType = u.getUrbanicity().getType();
			String geoId = u.getGeoId();
			double population = precinctPopulation.getOrDefault(geoId,0);
			statePopulation += population;

			percentagePopulationByRegionType.put(regionType,
					percentagePopulationByRegionType.getOrDefault(regionType, 0.0) + population);
		}

		for(Map.Entry<String, Double> entry : percentagePopulationByRegionType.entrySet()){
			percentagePopulationByRegionType.put(entry.getKey(), entry.getValue() / statePopulation);
		}
		return percentagePopulationByRegionType;
	}

	public Map<String, Object> getPrecinctDetail(int stateId, String geoId){
		Map<String, Object> precinctDetail = new HashMap<>();
		Demographic demographic = demographicRepository.findDemographicByStateIdAndGeoId(stateId, geoId);
		Urbanicity urbanicity = urbanicityRepository.findUrbanicityByStateIdAndGeoId(stateId, geoId);
		Income income = incomeRepository.findIncomeByStateIdAndGeoId(stateId, geoId);
		Votes vote = electionResultRepository.findVotesByStateIdAndGeoId(stateId, geoId);

		precinctDetail.put("population", demographic.getRace().get("population"));

		Map<String,Object> racialPopulation = new HashMap<>();
		String[] races = new String[]{"white", "black", "asian", "hispanic", "other"};
		for(int i =0; i< races.length ;i++){
			racialPopulation.put(races[i], demographic.getRace().get(races[i]));
		}
		precinctDetail.put("racial populatoin", racialPopulation);
		precinctDetail.put("region type", urbanicity.getUrbanicity().getType());

		precinctDetail.put("average household income", income.getIncome().get("average_income"));

		precinctDetail.put("republic votes", vote.getElectionData().get("trump_votes"));
		precinctDetail.put("republic votes", vote.getElectionData().get("biden_votes"));
		return precinctDetail;
	}

	public List<BoxPlot> getBoxPlot(int stateId, Category category, RegionType regionType){
		System.out.println(stateId);
		return boxPlotRepository.findBoxPlotByStateIdAndCategoryAndRegionType(stateId, category, regionType);
	}
}
