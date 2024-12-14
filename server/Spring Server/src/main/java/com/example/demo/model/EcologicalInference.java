package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.demo.common.Category;

@Document(collection = "EcologicalInference")
public class EcologicalInference {
    @Id
    String id;

    private int stateId;

    private Category category;

    private String range;

    private double posteriorMean;

    private String candidate;

    private double[] interval;


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

    public double getPosteriorMean() {
        return this.posteriorMean;
    }

    public void setPosteriorMean(double posteriorMean) {
        this.posteriorMean = posteriorMean;
    }

    public double[] getInterval() {
        return this.interval;
    }

    public void setInterval(double[] interval) {
        this.interval = interval;
    }

    public String getCandidate() {
        return this.candidate;
    }

    public void setCandidate(String group) {
        this.candidate = group;
    }

}

