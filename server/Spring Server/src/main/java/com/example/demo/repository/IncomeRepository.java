package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.common.GeoType;
import com.example.demo.model.Income;

@Repository
public interface IncomeRepository extends MongoRepository<Income, String> {

    public List<Income> findIncomeByStateIdAndGeoType(int stateId, GeoType geoType);

}
