package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Subjects;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface SubjectsRepository extends JpaRepository<Subjects,Integer> {

//    Query to fetch the subjects list
//    Usage -: teacher module -> teaching subjects list in teacher form
    @Query(value = "SELECT new Subjects (s.id, s.name, s.subject_code) FROM Subjects s")
    List<Subjects> distinctSubjects();

    @Query(value = "SELECT s FROM Subjects s WHERE s.id IN (SELECt ths.subjects_id.id FROM TeacherHasSubjects ths WHERE ths.teacher_id.id = :teacher_id)")
    List<Subjects> getSubjectsByTeacherID(@Param("teacher_id") Integer teacher_id);

    @Query(value = "SELECT * FROM mydb.subjects s WHERE s.id IN (SELECT ghs.subjects_id FROM mydb.grades_has_subjects ghs WHERE ghs.grades_id = :grade_id)",nativeQuery = true)
    List<Subjects> getSubjectsByGradeID(@Param("grade_id") Integer grade_id);

    @Query(value = "SELECT s FROM Subjects s WHERE s.id IN (SELECt strhs.subjects_id.id FROM StudentRegistrationHasSubjects strhs WHERE strhs.student_registration_id.id = :student_registration_id)")
    List<Subjects> getSubjectsByStudent(@Param("student_registration_id") Integer student_registration_id);

}
