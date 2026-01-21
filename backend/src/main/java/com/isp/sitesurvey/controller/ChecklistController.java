package com.isp.sitesurvey.controller;

import com.isp.sitesurvey.model.ChecklistItem;
import com.isp.sitesurvey.model.ChecklistTemplate;
import com.isp.sitesurvey.repository.ChecklistTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/checklists")
public class ChecklistController {

    @Autowired
    private ChecklistTemplateRepository checklistTemplateRepository;

    @GetMapping
    public List<ChecklistTemplate> getAllTemplates() {
        return checklistTemplateRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ChecklistTemplate createTemplate(@RequestBody ChecklistTemplate template) {
        return checklistTemplateRepository.save(template);
    }

    @GetMapping("/{id}")
    public ChecklistTemplate getTemplateById(@PathVariable Long id) {
        return checklistTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }
}
