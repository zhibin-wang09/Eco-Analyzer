package com.example.demo.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.example.demo.common.GeoType;

@Document(collection = "CongressionalDistrict")
public class DistrictDetail implements Serializable {

    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    @Field("data")
    private Data data;

    public static class Data implements Serializable {
        private String rep;

        private String party;

        private String race;

        private int averageIncome;

        private int population;

        private int povertyPopulation;

        private double povertyPercentage;

        private double ruralPercentage;

        private double subUrbanPercentage;

        private double urbanPercentage;

        private int trumpVotes;

        private int bidenVotes;

        public String getRep() {
            return this.rep;
        }

        public void setRep(String rep) {
            this.rep = rep;
        }

        public String getParty() {
            return this.party;
        }

        public void setParty(String party) {
            this.party = party;
        }

        public String getRace() {
            return this.race;
        }

        public void setRace(String race) {
            this.race = race;
        }

        public int getAverageIncome() {
            return this.averageIncome;
        }

        public void setAverageIncome(int averageIncome) {
            this.averageIncome = averageIncome;
        }

        public int getPopulation() {
            return this.population;
        }

        public void setPopulation(int population) {
            this.population = population;
        }

        public int getPovertyPopulation() {
            return this.povertyPopulation;
        }

        public void setPovertyPopulation(int povertyPopulation) {
            this.povertyPopulation = povertyPopulation;
        }

        public double getPovertyPercentage() {
            return this.povertyPercentage;
        }

        public void setPovertyPercentage(double povertyPercentage) {
            this.povertyPercentage = povertyPercentage;
        }

        public double getRuralPercentage() {
            return this.ruralPercentage;
        }

        public void setRuralPercentage(double ruralPercentage) {
            this.ruralPercentage = ruralPercentage;
        }

        public double getSubUrbanPercentage() {
            return this.subUrbanPercentage;
        }

        public void setSubUrbanPercentage(double subUrbanPercentage) {
            this.subUrbanPercentage = subUrbanPercentage;
        }

        public double getUrbanPercentage() {
            return this.urbanPercentage;
        }

        public void setUrbanPercentage(double urbanPercentage) {
            this.urbanPercentage = urbanPercentage;
        }

        public int getTrumpVotes() {
            return this.trumpVotes;
        }

        public void setTrumpVotes(int trumpVotes) {
            this.trumpVotes = trumpVotes;
        }

        public int getBidenVotes() {
            return this.bidenVotes;
        }

        public void setBidenVotes(int bidenVotes) {
            this.bidenVotes = bidenVotes;
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

    public Data getData() {
        return this.data;
    }

    public void setData(Data data) {
        this.data = data;
    }

}