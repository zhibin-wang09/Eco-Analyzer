package com.example.demo.model;

import java.io.Serializable;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "Age")
public class Age implements Serializable{
    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    private Map<String, Double> age;

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

    public Map<String, Double> getAge() {
        return this.age;
    }

    public void setAge(Map<String, Double> age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                ", stateId='" + getStateId() + "'" +
                ", geoId='" + getGeoId() + "'" +
                ", geoType='" + getGeoType() + "'" +
                ", age='" + getAge() + "'" +
                "}";
    }

}
