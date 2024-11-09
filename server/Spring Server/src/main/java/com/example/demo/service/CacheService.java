package com.example.demo.service;

import java.util.HashMap;

import org.json.JSONArray;
import org.springframework.stereotype.Service;

@Service
public class CacheService {

    private final DataProcessService dataProcessService;
    private final HashMap<String, JSONArray> cache;
    
    public CacheService(DataProcessService dataProcessService){
        this.dataProcessService = dataProcessService;
        this.cache = new HashMap<>();
    }
    
    public String getCoordinateData(){
        return dataProcessService.getCoordinateData();
    }

    public String getCoordinateData(String state){
        return dataProcessService.getCoordinateData();
    }

    public String getChartData(String state){
        return dataProcessService.getChartData(state);
    }

	public String getChartData(){
		return dataProcessService.getChartData();
	}

	public String getGinglesData(String state, String demographicGroup){
		return dataProcessService.getGinglesData(state, demographicGroup);
	}
}
