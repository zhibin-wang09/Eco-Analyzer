package com.example.demo.service;

import java.util.HashMap;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    private final DataProcessService dataProcessService;
    private final HashMap<String, String> cache;
    
    public CacheService(DataProcessService dataProcessService){
        this.dataProcessService = dataProcessService;
        this.cache = new HashMap<>();
    }
    
    public String getCoordinateData(){
        return dataProcessService.getCoordinateData();
    }

    public String getCoordinateData(String state, String geography){
        String identifier = "coordinates_" +  state + "_" + geography;
        if(cache.containsKey(identifier)){
            return cache.get(identifier);
        }
        String coordinates = dataProcessService.getCoordinateData(state, geography);
        cache.put(identifier,coordinates);
        return coordinates;
    }

    public String getChartData(String state){
        String identifier = "chart_" + state;
        if(cache.containsKey(identifier)){
            return cache.get(identifier);
        }
        String chartData = dataProcessService.getChartData(state);
        cache.put(identifier, chartData);
        return chartData;
    }

	public String getChartData(){
		return dataProcessService.getChartData();
	}

	public String getGinglesData(String state, String demographicGroup){
        String identifier = "gingles_" + state +  "_" + demographicGroup;
        if(cache.containsKey(identifier)){
            return cache.get(identifier);
        }
        String ginglesData =  dataProcessService.getGinglesData(state, demographicGroup);
        cache.put(identifier, ginglesData);
		return ginglesData;
	}
}
