package com.example.demo.model;

import java.io.Serializable;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.Category;
import com.example.demo.common.RegionType;

@Document(collection = "BoxPlot")
public class BoxPlot implements Serializable{

    @Id
    private String id;

    private String geoId;

    private int stateId;

    private RegionType regionType;

    private Category category;

    private String range;

    private BoxPlotData boxPlot;

    public static class BoxPlotData implements Serializable{
        private Double min;
        private Double q1;
        private Double median;
        private Double q3;
        private Double max;

        public Double getMin() {
            return this.min;
        }

        public void setMin(Double min) {
            this.min = min;
        }

        public Double getQ1() {
            return this.q1;
        }

        public void setQ1(Double q1) {
            this.q1 = q1;
        }

        public Double getMedian() {
            return this.median;
        }

        public void setMedian(Double median) {
            this.median = median;
        }

        public Double getQ3() {
            return this.q3;
        }

        public void setQ3(Double q3) {
            this.q3 = q3;
        }

        public Double getMax() {
            return this.max;
        }

        public void setMax(Double max) {
            this.max = max;
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

    public RegionType getRegionType() {
        return this.regionType;
    }

    public void setRegionType(RegionType regionType) {
        this.regionType = regionType;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getRange() {
        return this.range;
    }

    public void setRange(String range) {
        this.range = range;
    }

    public BoxPlotData getBoxPlot() {
        return this.boxPlot;
    }

    public void setBoxPlot(BoxPlotData boxPlot) {
        this.boxPlot = boxPlot;
    }

    public String getGeoId() {
        return this.geoId;
    }

    public void setGeoId(String geoId) {
        this.geoId = geoId;
    }

}
