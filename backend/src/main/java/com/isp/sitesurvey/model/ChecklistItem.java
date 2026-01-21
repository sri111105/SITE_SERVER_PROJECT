package com.isp.sitesurvey.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "checklist_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChecklistItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String question;
    private String type; // TEXT, YES_NO, PHOTO, NUMBER, MULTIPLE_CHOICE
    private String options; // Comma separated for multiple choice
}
