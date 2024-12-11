package com.example.demo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.demo.model.BoxPlot;

public interface BoxPlotRepository extends MongoRepository<String, BoxPlot>{
    public BoxPlot getBoxPlotByStateIdAndGeoIdAndRegionTypeAndMetric();
}
