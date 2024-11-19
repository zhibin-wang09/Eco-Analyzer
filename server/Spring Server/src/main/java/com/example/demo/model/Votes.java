package com.example.demo.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "ElectionResult")
public class Votes {
    @Id
    private String Id;

    private int stateId;

    private String geoID;

    private GeoType geoType;

    private Map<String, Integer> ElectionData;


    public String getId() {
        return this.Id;
    }

    public void setId(String Id) {
        this.Id = Id;
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

    public GeoType getGeoType() {
        return this.geoType;
    }

    public void setGeoType(GeoType geoType) {
        this.geoType = geoType;
    }

    public Map<String,Integer> getElectionData() {
        return this.ElectionData;
    }

    public void setElectionData(Map<String,Integer> ElectionData) {
        this.ElectionData = ElectionData;
    }

    @Override
    public String toString() {
        return "{" +
            " Id='" + getId() + "'" +
            ", stateId='" + getStateId() + "'" +
            ", geoID='" + getGeoID() + "'" +
            ", geoType='" + getGeoType() + "'" +
            ", ElectionData='" + getElectionData() + "'" +
            "}";
    }
    
}
