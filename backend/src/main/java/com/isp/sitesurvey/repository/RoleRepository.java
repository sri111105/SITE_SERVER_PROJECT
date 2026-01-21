package com.isp.sitesurvey.repository;

import com.isp.sitesurvey.model.ERole;
import com.isp.sitesurvey.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
