package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.common.GeoType;
import com.example.demo.model.Votes;

@Repository
public interface ElectionResultRepository extends MongoRepository<Votes, String> {

    public List<Votes> findVotesByStateIdAndGeoType(int stateId, GeoType geoType);

}
