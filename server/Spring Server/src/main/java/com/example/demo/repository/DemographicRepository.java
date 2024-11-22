package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

import com.example.demo.common.GeoType;
import com.example.demo.model.Demographic;

public interface DemographicRepository extends MongoRepository<Demographic, String>{
    public List<Demographic> findDemographicByStateId(int stateId);

    public List<Demographic> findDemographicByStateIdAndGeoType(int stateId, GeoType geoType);

    @Query(value = "{ 'stateId': ?0, 'geoId': ?2}", fields = "{ 'race.?2': 1, 'race.?2_percentage': 1, 'race.?2_shading': 1, '_id': 0 }")
    public List<Demographic> findDemographicByStateIdAndRaceAndGeoType(int stateId, String Race, GeoType geoType);
}
