package com.example.demo.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document("Urbanicity")
public class Urbanicity implements Serializable{
    @Id
    private String id;

    private int stateId;

    private String geoId;

    private GeoType geoType;

    private UrbanicityInfo urbanicity;

    public static class UrbanicityInfo implements Serializable{
        private Object density;
    
        private String type;
    
        private String shading;
    
        public Object getDensity() {
            return this.density;
        }
    
        public void setDensity(Object density) {
            this.density = density;
        }
    
        public String getType() {
            return this.type;
        }
    
        public void setType(String type) {
            this.type = type;
        }
    
        public String getShading() {
            return this.shading;
        }
    
        public void setShading(String shading) {
            this.shading = shading;
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

    public UrbanicityInfo getUrbanicity() {
        return this.urbanicity;
    }

    public void setUrbanicity(UrbanicityInfo urbanicity) {
        this.urbanicity = urbanicity;
    }

}

