package com.example.demo.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "Income")
public class Income {
    @Id
    private String id;

    private int stateId;

    private String geoID;

    private GeoType geoType;

    private Map<String, Double> income;

    public String getId() {
        return this.id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getStateId() {
        return this.stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }

    public String getGeoID() {
        return this.geoID;
    }

    public void setGeoID(String geoID) {
        this.geoID = geoID;
    }

    public GeoType getGeotype() {
        return this.geoType;
    }

    public void setGeotype(GeoType geotype) {
        this.geoType = geotype;
    }

    public Map<String,Double> getIncome() {
        return this.income;
    }

    public void setIncome(Map<String,Double> income) {
        this.income = income;
    }


    @Override
    public String toString() {
        return "{" +
            " id='" + getId() + "'" +
            ", stateId='" + getStateId() + "'" +
            ", geoID='" + getGeoID() + "'" +
            ", geotype='" + getGeotype() + "'" +
            ", income='" + getIncome() + "'" +
            "}";
    }
    
}
