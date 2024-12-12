package com.example.demo.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.common.Category;
import com.example.demo.common.RegionType;
import com.example.demo.model.BoxPlot;

public interface BoxPlotRepository extends MongoRepository<BoxPlot, String>{
    public List<BoxPlot> findBoxPlotByStateIdAndCategoryAndRegionType(int stateId, Category category, RegionType regionType);
}
