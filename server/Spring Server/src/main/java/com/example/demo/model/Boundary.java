package com.example.demo.model;

import java.io.Serializable;
import java.util.Map;

import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.GeoType;

@Document(collection = "Boundary")
public class Boundary implements Serializable{

    private String type;

    private Geometry geometry;

    private Properties properties;

    public static class Properties implements Serializable{
        private String geoId;

        private int stateId;

        private GeoType geoType;

        private Map<String, Object> data;

        public String getGeoId() {
            return this.geoId;
        }

        public int getstateId() {
            return this.stateId;
        }

        public GeoType getGeoType() {
            return this.geoType;
        }

        public Map<String, Object> getData() {
            return data;
        }

        public void setGeoId(String geoId) {
            this.geoId = geoId;
        }

        public void setstateId(int stateId) {
            this.stateId = stateId;
        }

        public void setGeoType(GeoType geoType) {
            this.geoType = geoType;
        }

        public void setData(Map<String, Object> data) {
            this.data = data;
        }
    }

    public static class Geometry implements Serializable{
        private String type;

        private Object coordinates;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public Object getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(Object coordinates) {
            this.coordinates = coordinates;
        }
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Geometry getGeometry() {
        return this.geometry;
    }

    public void setGeometry(Geometry geometry) {
        this.geometry = geometry;
    }

    public Properties getProperties() {
        return this.properties;
    }

    public void setProperties(Properties properties) {
        this.properties = properties;
    }

}
