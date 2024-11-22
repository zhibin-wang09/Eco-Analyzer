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
import com.example.demo.repository.BoundaryRepository;
import com.example.demo.repository.DemographicRepository;
import com.example.demo.repository.IncomeRepository;

@Service
public class MapService {

	private BoundaryRepository boundaryRepository;
	private DemographicRepository demographicRepository;
	private IncomeRepository incomeRepository;

	public MapService(BoundaryRepository boundaryRepository, DemographicRepository demographicRepository,
			IncomeRepository incomeRepository) {
		this.boundaryRepository = boundaryRepository;
		this.demographicRepository = demographicRepository;
		this.incomeRepository = incomeRepository;
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
					Map<String, Object> raceData = new HashMap<>();
					raceData.put("race", geoIdToDemographic.get(b.getProperties().getGeoId()));
					b.getProperties().setData(raceData);
				}
				return boundary;
			case Category.ECONOMIC:
				List<Income> incomeData = incomeRepository.findIncomeByStateIdAndGeoType(stateId, geoType);
				Map<String, Income> geoIdToIncome = new HashMap<>();
				// store demographicData into a mapping of geoId -> demographic
				for (Income i : incomeData) {
					geoIdToIncome.put(i.getGeoId(), i);
				}

				// Merge demographic data with boundary data
				for (Boundary b : boundary) {
					Map<String, Object> raceData = new HashMap<>();
					raceData.put("race", geoIdToIncome.get(b.getProperties().getGeoId()));
					b.getProperties().setData(raceData);
				}
				return boundary;
			case Category.POLITICALINCOME:

				break;
			case Category.POVERTY:

				break;
			default:
				break;
		}

		return null;
	}
}
