package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Civil_status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CivilStatusRepository extends JpaRepository<Civil_status,Integer> {
}
