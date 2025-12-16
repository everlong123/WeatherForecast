package com.example.weather.controller;

import com.example.weather.entity.IncidentType;
import com.example.weather.repository.IncidentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/incident-types")
public class IncidentTypeController {
    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    @GetMapping
    public ResponseEntity<List<IncidentType>> getAllIncidentTypes() {
        return ResponseEntity.ok(incidentTypeRepository.findAll());
    }
}
