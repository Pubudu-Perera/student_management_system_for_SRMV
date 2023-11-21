package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student,Integer> {

    @Query(value = "SELECT new Student(st.id, st.registration_no, st.full_name, st.name_with_initials) FROM Student st WHERE st.id" +
            " NOT IN (SELECT str.student_id.id FROM StudentRegistration str WHERE str.student_id IS NOT NULL )")
    List<Student> getStudentsWithoutClass();

    @Query(value = "SELECT max(st.registration_no)+1 FROM mydb.student AS st", nativeQuery = true)
    String nextRegNo();

//    Query for get the student list according to the classroom
    @Query(value = "SELECT new Student (s.id,s.registration_no,s.full_name,s.name_with_initials) FROM Student s WHERE s.id IN (SELECT str.student_id.id FROM StudentRegistration str WHERE str.classroom_id.id =?1 AND str.student_registration_status_id = '1')")
    List<Student> getStudentsByClassroom(Integer classroom_id);

}
