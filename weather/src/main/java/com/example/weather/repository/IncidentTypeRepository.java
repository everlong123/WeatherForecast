package com.example.weather.repository;

import com.example.weather.entity.IncidentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IncidentTypeRepository extends JpaRepository<IncidentType, Long> {
    Optional<IncidentType> findByName(String name);
    Boolean existsByName(String name);
}










