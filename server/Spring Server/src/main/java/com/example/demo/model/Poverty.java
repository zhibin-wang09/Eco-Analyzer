package com.example.demo.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "poverty")
public class Poverty implements Serializable{
    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    private PovertyInfo poverty;

    public static class PovertyInfo implements Serializable{

        private int totalHousehold;

        private int povertyHousehold;

        private double povertyPercentage;

        private String povertyShading;

        public int getTotalHousehold() {
            return this.totalHousehold;
        }

        public int getPovertyHousehold() {
            return this.povertyHousehold;
        }

        public double getPovertyPercentage() {
            return this.povertyPercentage;
        }

        public String getPovertyShading() {
            return this.povertyShading;
        }
    }

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

    public GeoType getGeoType() {
        return this.geoType;
    }

    public void setGeoType(GeoType geoType) {
        this.geoType = geoType;
    }

    public PovertyInfo getPoverty() {
        return this.poverty;
    }

    public void setPoverty(PovertyInfo poverty) {
        this.poverty = poverty;
    }

}
