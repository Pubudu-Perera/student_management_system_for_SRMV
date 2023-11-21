package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.AcademicYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AcademicYearRepository extends JpaRepository<AcademicYear,Integer> {

    @Query(value = "SELECT new AcademicYear (ay.id,ay.name) FROM AcademicYear ay WHERE ay.aca_status_id = '5'")
    List<AcademicYear> activeAcademicYear();
}
