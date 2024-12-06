package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.model.DistrictDetail;

@Repository
public interface DistrictDetailRepository extends MongoRepository<DistrictDetail, String> {
    List<DistrictDetail> findDistrictDetailsByStateId(int stateId);
}
