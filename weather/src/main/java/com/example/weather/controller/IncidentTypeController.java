package com.example.weather.controller;

import com.example.weather.dto.IncidentTypeDTO;
import com.example.weather.repository.IncidentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/incident-types")
public class IncidentTypeController {
    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<IncidentTypeDTO>> getAllIncidentTypes() {
        List<com.example.weather.entity.IncidentType> allTypes = incidentTypeRepository.findAll();
        System.out.println("Total incident types found: " + allTypes.size());
        allTypes.forEach(type -> System.out.println("  - ID: " + type.getId() + ", Name: " + type.getName()));
        
        List<IncidentTypeDTO> dtos = allTypes.stream()
                .map(type -> {
                    IncidentTypeDTO dto = new IncidentTypeDTO();
                    dto.setId(type.getId());
                    dto.setName(type.getName());
                    dto.setDescription(type.getDescription());
                    dto.setIcon(type.getIcon());
                    dto.setColor(type.getColor());
                    dto.setCreatedAt(type.getCreatedAt());
                    dto.setUpdatedAt(type.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        
        System.out.println("Total DTOs created: " + dtos.size());
        return ResponseEntity.ok(dtos);
    }
}
