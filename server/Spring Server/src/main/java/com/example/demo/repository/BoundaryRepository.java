package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.demo.common.GeoType;
import com.example.demo.model.Boundary;

@Repository
public interface BoundaryRepository extends MongoRepository<Boundary, String> {

    @Query(value = "{ 'properties.stateId': ?0, 'properties.GeoType': ?1 }")
    List<Boundary> findByStateIdAndGeoType(int stateId, GeoType geoType);
}
