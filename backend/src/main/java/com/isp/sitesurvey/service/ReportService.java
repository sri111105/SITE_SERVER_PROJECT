package com.isp.sitesurvey.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import com.isp.sitesurvey.model.Survey;
import com.isp.sitesurvey.model.SurveyResponse;
import com.isp.sitesurvey.repository.SurveyRepository;
import com.isp.sitesurvey.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ReportService {

    @Autowired
    private SurveyRepository surveyRepository;
    
    @Autowired
    private SurveyResponseRepository surveyResponseRepository;

    public byte[] generateSurveyReport(Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId)
                .orElseThrow(() -> new RuntimeException("Survey not found"));
        
        List<SurveyResponse> responses = surveyResponseRepository.findBySurveyId(surveyId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Survey Report").setTextAlignment(TextAlignment.CENTER).setFontSize(20).setBold());
            document.add(new Paragraph("Survey Name: " + survey.getName()));
            document.add(new Paragraph("Property: " + (survey.getProperty() != null ? survey.getProperty().getName() : "N/A")));
            document.add(new Paragraph("Status: " + survey.getStatus()));
            document.add(new Paragraph("Assigned To: " + (survey.getAssignedTo() != null ? survey.getAssignedTo().getUsername() : "N/A")));
            document.add(new Paragraph("\n"));

            document.add(new Paragraph("Responses:").setBold().setFontSize(14));
            
            if (responses.isEmpty()) {
                document.add(new Paragraph("No responses recorded."));
            } else {
                for (SurveyResponse response : responses) {
                    document.add(new Paragraph("Question: " + (response.getItem() != null ? response.getItem().getQuestion() : "Unknown")));
                    document.add(new Paragraph("Answer: " + response.getResponseValue()));
                    if (response.getAttachmentUrl() != null) {
                        document.add(new Paragraph("(Attachment available: " + response.getAttachmentUrl() + ")"));
                    }
                    document.add(new Paragraph("--------------------------------------------------"));
                }
            }

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return baos.toByteArray();
    }
}
