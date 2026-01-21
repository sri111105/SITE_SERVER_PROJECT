package com.isp.sitesurvey.repository;

import com.isp.sitesurvey.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SurveyRepository extends JpaRepository<Survey, Long> {
    List<Survey> findByAssignedToId(Long userId);
    List<Survey> findByPropertyId(Long propertyId);
}
