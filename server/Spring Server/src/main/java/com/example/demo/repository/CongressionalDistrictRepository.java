package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.CongressionalDistrict;

@Repository
public interface CongressionalDistrictRepository extends MongoRepository<CongressionalDistrict, String> {
    List<CongressionalDistrict> findCongressionalDistrictsByStateId(int stateId);
}
