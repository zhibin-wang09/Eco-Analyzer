package com.example.demo.model;

public class Gingles {

    private String precinctId;

    private Demographic demographic;

    private Votes votes;

    public String getPrecinctId() {
        return this.precinctId;
    }

    public void setPrecinctId(String precinctId) {
        this.precinctId = precinctId;
    }

    public Demographic getDemographic() {
        return this.demographic;
    }

    public void setDemographic(Demographic demographic) {
        this.demographic = demographic;
    }

    public Votes getVotes() {
        return this.votes;
    }

    public void setVotes(Votes votes) {
        this.votes = votes;
    }

}
