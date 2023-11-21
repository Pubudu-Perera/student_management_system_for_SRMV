package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.AcademicYearFee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AcademicYearFeeRepository extends JpaRepository<AcademicYearFee,Integer> {

    @Query(value = "SELECT new AcademicYearFee (SUM(ayf.fee)) FROM AcademicYearFee ayf WHERE ayf.academic_year_id.id = ?1")
    AcademicYearFee academicYearFeeBySubsection(Integer aca_year_id);


}
