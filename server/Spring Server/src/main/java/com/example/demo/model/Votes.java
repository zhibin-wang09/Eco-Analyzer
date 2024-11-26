package com.example.demo.model;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.example.demo.common.GeoType;

@Document(collection = "ElectionResult")
public class Votes {
    @Id
    private String Id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    @Field("election data")
    private Map<String, Object> electionData;

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

    public String getGeoId() {
        return this.geoId;
    }

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

    public GeoType getGeoType() {
        return this.geoType;
    }

    public void setGeoType(GeoType geoType) {
        this.geoType = geoType;
    }

    public Map<String, Object> getElectionData() {
        return this.electionData;
    }

    public void setElectionData(Map<String, Object> electionData) {
        this.electionData = electionData;
    }

    @Override
    public String toString() {
        return "{" +
                " Id='" + getId() + "'" +
                ", stateId='" + getStateId() + "'" +
                ", geoID='" + getGeoId() + "'" +
                ", geoType='" + getGeoType() + "'" +
                ", ElectionData='" + getElectionData() + "'" +
                "}";
    }

}
