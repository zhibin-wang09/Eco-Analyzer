package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.common.GeoType;
import com.example.demo.model.Income;
import com.example.demo.repository.IncomeRepository;

@Service
public class IncomeService {

    private IncomeRepository incomeRepository;

    public IncomeService(IncomeRepository incomeRepository) {
        this.incomeRepository = incomeRepository;
    }

    public List<Income> getIncomeByStateAndGeoType(int stateId, GeoType geoType) {
        return incomeRepository.findIncomeByStateIdAndGeoType(stateId, geoType);
    }
}
