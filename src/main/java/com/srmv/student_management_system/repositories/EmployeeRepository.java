package com.srmv.student_management_system.repositories;

import com.srmv.student_management_system.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    //    new Employee(...) is an instance calling. it Must be declared  in Entity Employee class as a constructor method.
    @Query(value = "SELECT new Employee(em.id, em.employee_no, em.name_with_initials, em.calling_name, em.designation_id, em.nic, em.mobile, em.email) FROM Employee AS em ORDER BY em.id DESC")
    List<Employee> employeeList();


//    this is a query to fetch employees without a user account
//    customized constructor student(Integer id, String calling_name) declared in Employee entity has been used here
    @Query(value = "SELECT new Employee(em.id, em.calling_name) FROM Employee em WHERE em.id NOT IN (SELECT us.employee_id.id FROM User us WHERE us.employee_id IS NOT NULL)")
    List<Employee> employeesWithoutAccount();



//    fetch the employees, which the designation is teacher. & teachers who is not already in teacher table
    @Query(value = "SELECT new Employee(em.id, em.name_with_initials, em.calling_name, em.nic, em.mobile, em.designation_id) FROM Employee AS em WHERE em.designation_id = '3' AND " +
            "em.id NOT IN (SELECT t.employee_id FROM Teacher t WHERE t.employee_id IS NOT NULL)")
    List<Employee> teacherEmployees();


    //    fetch the employees, which the designation is teacher. & teachers who is not already assign to an classroom
    @Query(value = "SELECT new Employee(em.id, em.name_with_initials, em.calling_name, em.nic, em.mobile, em.designation_id) FROM Employee AS em WHERE em.designation_id = '3' AND " +
            "em.id NOT IN (SELECT c.teacher_id FROM Classroom c WHERE c.teacher_id IS NOT NULL)")
    List<Employee> classroomTeachers();



//    next employee number
    @Query(value = "SELECT max(e.employee_no)+1 FROM Employee e", nativeQuery = true)
    String nextEmpNo();


//    get the employee record according to given nic
    Employee findEmployeeByNic(String nic);
}
