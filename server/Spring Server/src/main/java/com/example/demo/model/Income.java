package com.example.demo.model;

import java.io.Serializable;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "Income")
public class Income implements Serializable{
    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    private Map<String, Object> income;

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

    public String getGeoId() {
        return this.geoId;
    }

    public void setGeoID(String geoId) {
        this.geoId = geoId;
    }

    public GeoType getGeotype() {
        return this.geoType;
    }

    public void setGeotype(GeoType geotype) {
        this.geoType = geotype;
    }

    public Map<String, Object> getIncome() {
        return this.income;
    }

    public void setIncome(Map<String, Object> income) {
        this.income = income;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", stateId='" + getStateId() + "'" +
                ", geoID='" + getGeoId() + "'" +
                ", geotype='" + getGeotype() + "'" +
                ", income='" + getIncome() + "'" +
                "}";
    }

}
