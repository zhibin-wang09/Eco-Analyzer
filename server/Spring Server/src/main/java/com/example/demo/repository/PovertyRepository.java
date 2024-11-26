package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.common.GeoType;
import com.example.demo.model.Poverty;

public interface PovertyRepository extends MongoRepository<Poverty, String> {
    public List<Poverty> findPovertyByStateIdAndGeoType(int stateId, GeoType geoType);
}
