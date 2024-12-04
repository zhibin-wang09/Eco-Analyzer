package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.Urbanicity;

public interface UrbanicityRepository extends MongoRepository<Urbanicity,String>{
    List<Urbanicity> findUrbanicityByStateId(int stateId);
}
