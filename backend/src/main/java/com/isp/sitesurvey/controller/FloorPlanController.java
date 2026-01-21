package com.isp.sitesurvey.controller;

import com.isp.sitesurvey.model.Floor;
import com.isp.sitesurvey.model.FloorPlan;
import com.isp.sitesurvey.repository.FloorPlanRepository;
import com.isp.sitesurvey.repository.FloorRepository;
import com.isp.sitesurvey.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/floor-plans")
public class FloorPlanController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private FloorPlanRepository floorPlanRepository;

    @Autowired
    private FloorRepository floorRepository;

    @PostMapping("/upload/{floorId}")
    public ResponseEntity<?> uploadFloorPlan(@PathVariable Long floorId, @RequestParam("file") MultipartFile file) {
        try {
            String fileName = fileStorageService.storeFile(file);
            
            Floor floor = floorRepository.findById(floorId)
                    .orElseThrow(() -> new RuntimeException("Floor not found"));

            FloorPlan floorPlan = floorPlanRepository.findByFloorId(floorId).orElse(new FloorPlan());
            floorPlan.setFileName(fileName);
            floorPlan.setFileType(file.getContentType());
            floorPlan.setSize(file.getSize());
            floorPlan.setFloor(floor);
            
            floorPlanRepository.save(floorPlan);

            return ResponseEntity.ok("Floor plan uploaded successfully: " + fileName);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        Path filePath = fileStorageService.loadFile(fileName);
        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read the file!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/view/{floorId}")
    public ResponseEntity<Resource> viewFloorPlan(@PathVariable Long floorId) {
         FloorPlan floorPlan = floorPlanRepository.findByFloorId(floorId)
                 .orElseThrow(() -> new RuntimeException("Floor plan not found"));
         
         return downloadFile(floorPlan.getFileName());
    }
}
