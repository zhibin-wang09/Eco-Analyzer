package com.example.demo.model;

import java.io.Serializable;
import java.util.Map;

public class Gingles implements Serializable{

    private String geoId;

    private double demographicGroupPercentage; // used when displaying gingles result for race

    private int totalPopulation;

    private double averageHouseholdIncome; // used when displaying gingles result for income

    private double normalizedValue; // used when displaying gingles result for income/race

    private String urbanicity;

    private Map<String, Object> electionData;

    public String getUrbanicity() {
        return this.urbanicity;
    }

    public void setUrbanicity(String urbanicity) {
        this.urbanicity = urbanicity;
    }

    public double getNormalizedValue() {
        return this.normalizedValue;
    }

    public void setNormalizedValue(double normalizedValue) {
        this.normalizedValue = normalizedValue;
    }

    public String getGeoId() {
        return this.geoId;
    }

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

    public double getDemographicGroupPercentage() {
        return this.demographicGroupPercentage;
    }

    public void setDemographicGroupPercentage(double demographicGroupPercentage) {
        this.demographicGroupPercentage = demographicGroupPercentage;
    }

    public int getTotalPopulation() {
        return this.totalPopulation;
    }

    public void setTotalPopulation(int totalPopulation) {
        this.totalPopulation = totalPopulation;
    }

    public double getAverageHouseholdIncome() {
        return this.averageHouseholdIncome;
    }

    public void setAverageHouseholdIncome(double averageHouseholdIncome) {
        this.averageHouseholdIncome = averageHouseholdIncome;
    }

    public Map<String,Object> getElectionData() {
        return this.electionData;
    }

    public void setElectionData(Map<String,Object> electionData) {
        this.electionData = electionData;
    }

}