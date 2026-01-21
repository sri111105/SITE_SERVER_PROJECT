package com.isp.sitesurvey.config;

import com.isp.sitesurvey.model.ChecklistItem;
import com.isp.sitesurvey.model.ChecklistTemplate;
import com.isp.sitesurvey.repository.ChecklistTemplateRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class TemplateInitializer {

    @Bean
    public CommandLineRunner initTemplates(ChecklistTemplateRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                ChecklistTemplate template = new ChecklistTemplate();
                template.setName("Standard ISP Site Survey");
                template.setDescription("Basic checklist for residential/small business installation");

                ChecklistItem item1 = new ChecklistItem(null, "Is there visible conduit access?", "YES_NO", null);
                ChecklistItem item2 = new ChecklistItem(null, "Distance to nearest distribution point (meters)", "NUMBER", null);
                ChecklistItem item3 = new ChecklistItem(null, "Take photo of the comms room", "PHOTO", null);
                ChecklistItem item4 = new ChecklistItem(null, "Signal strength (dBm)", "NUMBER", null);

                template.setItems(Arrays.asList(item1, item2, item3, item4));
                repository.save(template);
            }
        };
    }
}
