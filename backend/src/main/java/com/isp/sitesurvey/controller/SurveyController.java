package com.isp.sitesurvey.controller;

import com.isp.sitesurvey.dto.BuildingDto;
import com.isp.sitesurvey.dto.FloorDto;
import com.isp.sitesurvey.dto.PropertyDto;
import com.isp.sitesurvey.model.Building;
import com.isp.sitesurvey.model.Floor;
import com.isp.sitesurvey.model.Property;
import com.isp.sitesurvey.repository.BuildingRepository;
import com.isp.sitesurvey.repository.FloorRepository;
import com.isp.sitesurvey.model.*;
import com.isp.sitesurvey.repository.*;
import com.isp.sitesurvey.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/survey")
public class SurveyController {

    @Autowired
    private PropertyRepository propertyRepository;
    @Autowired
    private BuildingRepository buildingRepository;
    @Autowired
    private FloorRepository floorRepository;
    @Autowired
    private SurveyRepository surveyRepository;
    @Autowired
    private SurveyResponseRepository surveyResponseRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChecklistTemplateRepository checklistTemplateRepository;

    // Property Endpoints
    @GetMapping("/properties")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @PostMapping("/properties")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public Property createProperty(@RequestBody PropertyDto propertyDto) {
        Property property = new Property();
        property.setName(propertyDto.getName());
        property.setAddress(propertyDto.getAddress());
        property.setClientName(propertyDto.getClientName());
        return propertyRepository.save(property);
    }

    // Building Endpoints
    @GetMapping("/properties/{propertyId}/buildings")
    public List<Building> getBuildingsByProperty(@PathVariable Long propertyId) {
        return buildingRepository.findByPropertyId(propertyId);
    }

    @PostMapping("/buildings")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public Building createBuilding(@RequestBody BuildingDto buildingDto) {
        Property property = propertyRepository.findById(buildingDto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));
        Building building = new Building();
        building.setName(buildingDto.getName());
        building.setProperty(property);
        return buildingRepository.save(building);
    }

    // Floor Endpoints
    @GetMapping("/buildings/{buildingId}/floors")
    public List<Floor> getFloorsByBuilding(@PathVariable Long buildingId) {
        return floorRepository.findByBuildingId(buildingId);
    }
    
    @PostMapping("/floors")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public Floor createFloor(@RequestBody FloorDto floorDto) {
        Building building = buildingRepository.findById(floorDto.getBuildingId())
                .orElseThrow(() -> new RuntimeException("Building not found"));
        Floor floor = new Floor();
        floor.setName(floorDto.getName());
        floor.setLevel(floorDto.getLevel());
        floor.setBuilding(building);
        return floorRepository.save(floor);
    }

    // Survey Execution Endpoints

    @PostMapping("/create")
    public Survey createSurvey(@RequestParam Long propertyId, @RequestParam String name) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        Property property = propertyRepository.findById(propertyId).orElseThrow();

        Survey survey = new Survey();
        survey.setName(name);
        survey.setProperty(property);
        survey.setAssignedTo(user);
        survey.setStatus("IN_PROGRESS");
        survey.setCreatedAt(LocalDateTime.now());
        
        return surveyRepository.save(survey);
    }

    @GetMapping("/my-surveys")
    public List<Survey> getMySurveys() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return surveyRepository.findByAssignedToId(userDetails.getId());
    }
    
    @PostMapping("/{surveyId}/responses")
    public SurveyResponse submitResponse(@PathVariable Long surveyId, @RequestBody SurveyResponse response) {
        Survey survey = surveyRepository.findById(surveyId).orElseThrow();
        response.setSurvey(survey);
        return surveyResponseRepository.save(response);
    }
}
