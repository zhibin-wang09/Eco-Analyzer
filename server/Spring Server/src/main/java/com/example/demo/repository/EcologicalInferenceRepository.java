package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.common.Category;
import com.example.demo.model.EcologicalInference;

public interface EcologicalInferenceRepository extends MongoRepository<EcologicalInference, String> {

    List<EcologicalInference> findByStateIdAndCategoryAndCandidateAndRangeIn(int stateId, Category category,
            String candidate, String[] range);
}
