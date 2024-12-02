package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document("StateRepresentative")
public class StateRepresentative {

    @Id
    private String id;

    private int stateId;

    private String geoId;
    
    private String stateRep;

    private GeoType geoType;


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

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

    public String getStateRep() {
        return this.stateRep;
    }

    public void setStateRep(String stateRep) {
        this.stateRep = stateRep;
    }

    public GeoType getGeoType() {
        return this.geoType;
    }

    public void setGeoType(GeoType geoType) {
        this.geoType = geoType;
    }

}
