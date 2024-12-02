package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

import com.example.demo.common.GeoType;
import com.example.demo.model.Demographic;

public interface DemographicRepository extends MongoRepository<Demographic, String>{

    public List<Demographic> findDemographicByStateId(int stateId);

    public List<Demographic> findDemographicByStateIdAndGeoType(int stateId, GeoType geoType);
    
}
