package com.example.demo.model;

import com.example.demo.common.GeoType;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.Map;

@Document(collection = "Demographic") // Replace with the actual collection name
public class Demographic implements Serializable{

    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    private Map<String, Integer> race;

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getStateId() {
        return stateId;
    }

    public void setStateId(int stateId) {
        this.stateId = stateId;
    }

    public String getGeoId() {
        return geoId;
    }

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

    public GeoType getGeoType() {
        return geoType;
    }

    public void setGeoType(GeoType geoType) {
        this.geoType = geoType;
    }

    public Map<String, Integer> getRace() {
        return race;
    }

    public void setRace(Map<String, Integer> race) {
        this.race = race;
    }

    @Override
    public String toString() {
        return "RaceData{" +
                "id='" + id + '\'' +
                ", stateId=" + stateId +
                ", geoId='" + geoId + '\'' +
                ", geoType=" + geoType +
                ", race=" + race +
                '}';
    }
}