package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;

public interface ClassroomRepository extends JpaRepository<Classroom,Integer> {

    @Query(value = "SELECT new Classroom (c.id,c.classroom_name,c.academic_year_id,c.classroom_status_id) FROM Classroom c WHERE c.classroom_status_id = '1'")
    List<Classroom> classroomList();

    @Query(value = "SELECT new Classroom (c.id,c.classroom_name,c.grade_id) FROM Classroom c WHERE c.grade_id.id = :grade_id")
    List<Classroom> classroomsByGrade(@Param("grade_id") Integer grade_id);

}
