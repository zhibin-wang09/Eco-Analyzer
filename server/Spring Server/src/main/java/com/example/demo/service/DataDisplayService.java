package com.example.demo.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.common.RegionType;
import com.example.demo.common.Category;
import com.example.demo.model.DistrictDetail;
import com.example.demo.model.DistrictDetail.Data;
import com.example.demo.model.EcologicalInference;
import com.example.demo.model.BoxPlot;
import com.example.demo.model.Demographic;
import com.example.demo.model.Gingles;
import com.example.demo.model.Income;
import com.example.demo.model.Urbanicity;
import com.example.demo.model.Votes;
import com.example.demo.model.BoxPlot.BoxPlotData;
import com.example.demo.repository.BoxPlotRepository;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.ElectionResultRepository;
import com.example.demo.repository.IncomeRepository;
import com.example.demo.repository.UrbanicityRepository;
import com.example.demo.repository.DistrictDetailRepository;
import com.example.demo.repository.EcologicalInferenceRepository;

@Service
public class DataDisplayService {

	DemographicRepository demographicRepository;
	ElectionResultRepository electionResultRepository;
	IncomeRepository incomeRepository;
	DistrictDetailRepository districtDetailRepository;
	UrbanicityRepository urbanicityRepository;
	BoxPlotRepository boxPlotRepository;
	EcologicalInferenceRepository ecologicalInferenceRepository;

	public DataDisplayService(DemographicRepository demographicRepository,
			ElectionResultRepository electionResultRepository, IncomeRepository incomeRepository,
			DistrictDetailRepository districtDetailRepository,
			UrbanicityRepository urbanicityRepository,
			BoxPlotRepository boxPlotRepository,
			EcologicalInferenceRepository ecologicalInferenceRepository) {
		this.demographicRepository = demographicRepository;
		this.electionResultRepository = electionResultRepository;
		this.incomeRepository = incomeRepository;
		this.districtDetailRepository = districtDetailRepository;
		this.urbanicityRepository = urbanicityRepository;
		this.boxPlotRepository = boxPlotRepository;
		this.ecologicalInferenceRepository = ecologicalInferenceRepository;
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
		for (DistrictDetail d : result) {
			Data data = d.getData();
			data.setPovertyPercentage(data.getPovertyPercentage() * 100);
			data.setRuralPercentage(data.getRuralPercentage() * 100);
			data.setUrbanPercentage(data.getUrbanPercentage() * 100);
			data.setSubUrbanPercentage(data.getSubUrbanPercentage() * 100);
		}
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
		int otherVotes = 0;
		for (DistrictDetail c : districtData) {
			population += c.getData().getPopulation(); // state population
		}

		List<Votes> electionData = electionResultRepository.findVotesByStateIdAndGeoType(stateId, GeoType.PRECINCT);
		for (Votes v : electionData) {
			otherVotes += (Integer) v.getElectionData().get("other_votes");
			democratVotes += (Integer) v.getElectionData().get("biden_votes");
			republicanVotes += (Integer) v.getElectionData().get("trump_votes"); // state voter distribution
		}

		Map<String, Double> voteDistribution = new HashMap<>();
		voteDistribution.put("Democratic Votes", Double.valueOf(democratVotes));
		voteDistribution.put("Republican Votes", Double.valueOf(republicanVotes));
		voteDistribution.put("Other Votes", Double.valueOf(otherVotes));

		Map<String, Integer> racialPopulation = getRacialPopulationAsState(stateId); // race -> population
		Map<String, Double> percentagePopulationByRegionType = getPercentagePopulationByRegionType(stateId); // regionType
																												// ->
																												// population
																												// percentage

		List<Map<String, String>> stateRepresentative = new ArrayList<>();
		if (stateId == 36) {
			Map<String, String> rep = new HashMap<>();
			rep.put("Kirsten Gillibrand", "Democratic");
			stateRepresentative.add(rep);
			rep = new HashMap<>();
			rep.put("Chuck Schumer", "Democratic");
			stateRepresentative.add(rep);
		} else {
			Map<String, String> rep = new HashMap<>();
			rep.put("Tom Cotton", "Republican");
			stateRepresentative.add(rep);
			rep = new HashMap<>();
			rep.put("John Boozman", "Republican");
			stateRepresentative.add(rep);
		}
		Map<String, Double> populationByIncome = getPopulationByAverageHouseholdIncome(stateId);
		// summary of congressional representatives by party
		stateSummary.put("population", population);
		stateSummary.put("racial population", racialPopulation);
		stateSummary.put("vote distribution", voteDistribution);
		stateSummary.put("population percentage by region", percentagePopulationByRegionType);
		stateSummary.put("congressional representatives", stateRepresentative);
		stateSummary.put("population by income", populationByIncome);
		return stateSummary;
	}

	public Map<String, Double> getPopulationByAverageHouseholdIncome(int stateId) {
		List<Income> income = incomeRepository.findIncomeByStateIdAndGeoType(stateId, GeoType.PRECINCT);

		Map<String, Double> result = new HashMap<>();
		result.put("0-25k", 0.0);
		result.put("25k-50k", 0.0);
		result.put("50k-75k", 0.0);
		result.put("75k-100k", 0.0);
		result.put("100k+", 0.0);

		double total = 0;

		// Aggregate values
		for (Income i : income) {
			Map<String, Object> incomeData = i.getIncome();
			double one = getIncomeValue(incomeData.get("from_0_to_9999"));
			double two = getIncomeValue(incomeData.get("from_10000_to_14999"));
			double three = getIncomeValue(incomeData.get("from_15000_to_24999"));
			double four = getIncomeValue(incomeData.get("from_25000_to_34999"));
			double five = getIncomeValue(incomeData.get("from_35000_to_49909"));
			double six = getIncomeValue(incomeData.get("from_50000_to_74999"));
			double seven = getIncomeValue(incomeData.get("from_75000_to_99999"));
			double eight = getIncomeValue(incomeData.get("from_100000_and_more"));

			total += getIncomeValue(incomeData.get("total_household"));

			result.put("0-25k", result.get("0-25k") + one + two + three);
			result.put("25k-50k", result.get("25k-50k") + four + five);
			result.put("50k-75k", result.get("50k-75k") + six);
			result.put("75k-100k", result.get("75k-100k") + seven);
			result.put("100k+", result.get("100k+") + eight);
		}

		// Normalize to percentages
		if (total > 0) {
			double sum = 0; // Track sum for adjustment
			for (String key : result.keySet()) {
				double percentage = (result.get(key) / total * 100);
				percentage = Math.round(percentage * 100.0) / 100.0; // Round to 2 decimal places
				result.put(key, percentage);
				sum += percentage;
			}

			// Adjust for rounding errors
			double difference = 100.0 - sum;
			if (Math.abs(difference) > 0.01) { // Only adjust if meaningful
				String largestKey = result.entrySet().stream()
						.max(Map.Entry.comparingByValue())
						.get()
						.getKey();
				result.put(largestKey, result.get(largestKey) + difference);
			}
		} else {
			System.err.println("Total income is zero. Skipping percentage calculations.");
		}

		return result;
	}

	public double getIncomeValue(Object income) {
		if (income instanceof Number) {
			return ((Number) income).doubleValue(); // Retain precision
		} else {
			return 0.0;
		}
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
			double population = precinctPopulation.getOrDefault(geoId, 0);
			statePopulation += population;

			percentagePopulationByRegionType.put(regionType,
					percentagePopulationByRegionType.getOrDefault(regionType, 0.0) + population);
		}

		for (Map.Entry<String, Double> entry : percentagePopulationByRegionType.entrySet()) {
			percentagePopulationByRegionType.put(entry.getKey(), entry.getValue() / statePopulation * 100);
		}
		return percentagePopulationByRegionType;
	}

	@Cacheable(value = "precinctDetail")
	public Map<String, Object> getPrecinctDetail(int stateId, String geoId) {
		Map<String, Object> precinctDetail = new HashMap<>();
		Demographic demographic = demographicRepository.findDemographicByStateIdAndGeoId(stateId, geoId);
		Urbanicity urbanicity = urbanicityRepository.findUrbanicityByStateIdAndGeoId(stateId, geoId);
		Income income = incomeRepository.findIncomeByStateIdAndGeoId(stateId, geoId);
		Votes vote = electionResultRepository.findVotesByStateIdAndGeoId(stateId, geoId);

		precinctDetail.put("population", demographic.getRace().get("population"));

		Map<String, Object> racialPopulation = new HashMap<>();
		String[] races = new String[] { "white", "black", "asian", "hispanic", "other" };
		for (int i = 0; i < races.length; i++) {
			racialPopulation.put(races[i], demographic.getRace().get(races[i]));
		}
		precinctDetail.put("racial populatoin", racialPopulation);
		precinctDetail.put("region type", urbanicity.getUrbanicity().getType());

		precinctDetail.put("average household income", income.getIncome().get("average_income"));

		precinctDetail.put("republic votes", vote.getElectionData().get("trump_votes"));
		precinctDetail.put("republic votes", vote.getElectionData().get("biden_votes"));
		return precinctDetail;
	}

	public List<Map<String, Object>> getPrecincts(int stateId) {

		List<Demographic> demographic = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
				GeoType.PRECINCT);
		List<Urbanicity> urbanicity = urbanicityRepository.findUrbanicityByStateId(stateId);
		List<Income> income = incomeRepository.findIncomeByStateIdAndGeoType(stateId, GeoType.PRECINCT);
		List<Votes> vote = electionResultRepository.findVotesByStateIdAndGeoType(stateId, GeoType.PRECINCT);
		Map<String, Income> geoIdToIncome = new HashMap<>();
		Map<String, Votes> geoIdToVote = new HashMap<>();
		Map<String, Urbanicity> geoIdToUrbanicity = new HashMap<>();

		for (Income i : income) {
			geoIdToIncome.put(i.getGeoId(), i);
		}

		for (Urbanicity u : urbanicity) {
			geoIdToUrbanicity.put(u.getGeoId(), u);
		}

		for (Votes v : vote) {
			geoIdToVote.put(v.getGeoId(), v);
		}

		List<Map<String, Object>> precincts = new ArrayList<>();
		for (Demographic d : demographic) {
			Map<String, Object> precinctDetail = new HashMap<>();
			Map<String, Object> racialPopulation = new HashMap<>();
			Urbanicity u = geoIdToUrbanicity.get(d.getGeoId());
			Income ic = geoIdToIncome.get(d.getGeoId());
			Votes v = geoIdToVote.get(d.getGeoId());

			precinctDetail.put("precinct name", d.getGeoId());
			precinctDetail.put("population", d.getRace().get("population"));
			String[] races = new String[] { "white", "black", "asian", "hispanic", "other" };
			for (int i = 0; i < races.length; i++) {
				racialPopulation.put(races[i], d.getRace().get(races[i]));
			}
			precinctDetail.put("racial populatoin", racialPopulation);
			precinctDetail.put("region type", u == null ? null : u.getUrbanicity().getType());

			precinctDetail.put("average household income", ic == null ? null : ic.getIncome().get("average_income"));

			precinctDetail.put("republic votes", v == null ? null : v.getElectionData().get("trump_votes"));
			precinctDetail.put("republic votes", v == null ? null : v.getElectionData().get("biden_votes"));
			precincts.add(precinctDetail);
		}
		return precincts;
	}

	@Cacheable(value = "boxplot")
	public List<BoxPlot> getBoxPlot(int stateId, Category category, RegionType regionType) {
		List<BoxPlot> boxplots = boxPlotRepository.findBoxPlotByStateIdAndCategoryAndRegionType(stateId, category,
				regionType);
		double totalPopulation = getTotalPopulation(stateId, category);

		for (BoxPlot b : boxplots) {
			BoxPlotData boxplot = b.getBoxPlot();
			if (boxplot == null)
				return new ArrayList<>();
			boxplot.setMax(boxplot.getMax() / totalPopulation * 100);
			boxplot.setMin(boxplot.getMin() / totalPopulation * 100);
			boxplot.setMedian(boxplot.getMedian() / totalPopulation * 100);
			boxplot.setQ1(boxplot.getQ1() / totalPopulation * 100);
			boxplot.setQ3(boxplot.getQ3() / totalPopulation * 100);
		}

		return boxplots;
	}

	@Cacheable(value = "boxplotByRange")
	public List<BoxPlot> getBoxPlotByRange(int stateId, Category category, RegionType regionType, String range) {
		List<BoxPlot> boxplots = boxPlotRepository.findBoxPlotByStateIdAndCategoryAndRegionTypeAndRange(stateId,
				category, regionType, range);
		double totalPopulation = getTotalPopulation(stateId, category);
		for (BoxPlot b : boxplots) {
			BoxPlotData boxplot = b.getBoxPlot();
			if (boxplot == null)
				return new ArrayList<>();
			boxplot.setMax(boxplot.getMax() / totalPopulation * 100);
			boxplot.setMin(boxplot.getMin() / totalPopulation * 100);
			boxplot.setMedian(boxplot.getMedian() / totalPopulation * 100);
			boxplot.setQ1(boxplot.getQ1() / totalPopulation * 100);
			boxplot.setQ3(boxplot.getQ3() / totalPopulation * 100);
		}
		return boxplots;
	}

	public double getTotalPopulation(int stateId, Category category) {
		double totalPopulation = 0;
		if (category == Category.DEMOGRAPHIC) {
			totalPopulation = stateId == 36 ? 17161215 : 2096286;
		} else if (category == Category.ECONOMIC) {
			totalPopulation = stateId == 36 ? 6320329 : 869004;
		} else if (category == Category.URBANICITY) {
			totalPopulation = stateId == 36 ? 13283 : 2589;
		}

		return totalPopulation;
	}

	public List<Map<String, Object>> getBoxPlotDots(int stateId, Category category, RegionType regionType,
			String range) {
		List<Map<String, Object>> result = new ArrayList<>();
		List<Urbanicity> urbanicities = urbanicityRepository.findUrbanicityByStateId(stateId);
		Map<String, Urbanicity> geoIdToUrbanicity = new HashMap<>();
		for (Urbanicity u : urbanicities) {
			geoIdToUrbanicity.put(u.getGeoId(), u);
		}

		switch (category) {
			case Category.DEMOGRAPHIC:
				List<Demographic> demographics = demographicRepository.findDemographicByStateIdAndGeoType(stateId,
						GeoType.PRECINCT);
				urbanicities = filterUrbanicity(urbanicities, regionType);
				int population = 0;
				for (Demographic d : demographics) {
					Urbanicity u = geoIdToUrbanicity.get(d.getGeoId());
					if (u != null && u.getUrbanicity().getType().toLowerCase() == regionType
							.toString().toLowerCase()) { // we got the desired precinct data
						population += (Integer) d.getRace().get(range.toLowerCase());
					}
				}

				break;

			default:
				break;
		}
		return new ArrayList<>();
	}

	public List<Urbanicity> filterUrbanicity(List<Urbanicity> urbanicity, RegionType regionType) {
		List<Urbanicity> filtered = new ArrayList<>();
		for (Urbanicity u : urbanicity) {

			if (u.getUrbanicity().getType().toLowerCase() == regionType.toString().toLowerCase()
					|| regionType.toString().toLowerCase() == "all") {
				filtered.add(u);
			}
		}
		return filtered;
	}

	@Cacheable(value = "ecologicalInference")
	public List<EcologicalInference> getEcologicalInferenceData(int stateId, Category category, String candidate,
			String[] range) {
		for (int i = 0; i < range.length; i++) {
			range[i] = range[i].substring(0, 1).toUpperCase() + range[i].substring(1);
		}
		return ecologicalInferenceRepository.findByStateIdAndCategoryAndCandidateAndRangeIn(stateId, category,
				candidate.substring(0, 1).toUpperCase() + candidate.substring(1), range);
	}

	public String getEnsembleSummary(int stateId) {
		String stateAbbrev = stateId == 36 ? "ny" : "ar";
		StringBuilder jsonString = new StringBuilder();

		try (InputStream inputStream = getClass().getClassLoader()
				.getResourceAsStream(stateAbbrev + "_ensemble_summary" + ".json")) {
			BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
			String line;

			while ((line = reader.readLine()) != null) {
				jsonString.append(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		JSONObject obj = new JSONObject(jsonString.toString());
		return obj.toString();
	}
}
