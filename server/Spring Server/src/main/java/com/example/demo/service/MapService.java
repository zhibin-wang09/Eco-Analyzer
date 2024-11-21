package com.example.demo.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.model.Boundary;
import com.example.demo.repository.BoundaryRepository;

@Service
public class MapService {

	private BoundaryRepository boundaryRepository;

	public MapService(BoundaryRepository boundaryRepository){
		this.boundaryRepository = boundaryRepository;
	}

    public List<Boundary> getBoundaryData(int stateId, GeoType geoType){
		return boundaryRepository.findByStateIdAndGeoType(stateId, geoType);  
    }
}
