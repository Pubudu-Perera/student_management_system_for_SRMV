package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Employee;
import com.srmv.student_management_system.entities.Guardian;
import com.srmv.student_management_system.entities.Student;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.EmployeeRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/employee")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;

    @GetMapping
    public ModelAndView employeeUI(){
        ModelAndView employeeUI = new ModelAndView();
        employeeUI.setViewName("Employee.html");
        return employeeUI;
    }



//    for selecting the employee for creating a user account. (User Module)
    @GetMapping(value = "/employeesWithoutAccount", produces = "application/json")
    public List<Employee> getEmployeesWithoutAccount(){
        return employeeDao.employeesWithoutAccount();
    }



//    fetch teachers list
    @GetMapping(value = "/teachersList")
    public List<Employee> getteacherList(){
        return employeeDao.teacherEmployees();
    }



//   fill the employee table
    @GetMapping(value = "/findall")
    public List<Employee> employeeFindAll(){
        return employeeDao.findAll();
    }


    @GetMapping(value = "/getByID")
    public Employee employeeGetByID(@RequestParam("id") Integer id){
        return employeeDao.getReferenceById(id);
    }



    @GetMapping(value = "/getByNIC/{nic}")
    public Employee employeeByNIC(@PathVariable("nic") String nic){
        return employeeDao.findEmployeeByNic(nic);
    }



//    service for delete employee record
    @DeleteMapping
    public String deleteEmployee(@RequestBody Employee employeeD) {

//      Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Employee");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("delete")) {
            //find the respective employee by its id
            Employee deletedEmployee = employeeDao.getReferenceById(employeeD.getId());

            if (deletedEmployee != null) {

                try {
                    deletedEmployee.setEmployee_status(false);
                    deletedEmployee.setDeleted_date(LocalDateTime.now());
                    employeeDao.save(deletedEmployee);
                    return "0";
                } catch (Exception e) {
                    return "Employee record can not be deleted! " + e.getMessage();
                }
            } else {
                return "This Employee record is already deleted!";
            }
        }else {
            return "You don't have privileges to do this operation!" ;
        }
    }



    @PostMapping
    public String addEmployee(@RequestBody Employee employee){
//        Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting logged user's username. That particular user be the added user.
        User loggedUser = userDao.findUserByUsername(authentication.getName());

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Employee");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("insert")) {
            try {
                employee.setEmployee_no(employeeDao.nextEmpNo());
                employee.setAdded_date(LocalDateTime.now());
                employee.setAdded_user(loggedUser);
                employeeDao.save(employee);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        } else {
            return "You don't have privileges to do this operation!";
        }
    }



    //    update guardian record
    @PutMapping
    public String updateEmployee(@RequestBody Employee employee){

        //Authentication object by Spring Security
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

//        getting privilege object
        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Employee");

//        check that particular user has got certain privilege
        if (userPrivileges != null && userPrivileges.get("update")) {
            Employee extEmployee = employeeDao.getReferenceById(employee.getId());

            if (extEmployee != null) {

                try {
                    employee.setLast_update(LocalDateTime.now());
                    employeeDao.save(employee);
                    return "0";
                } catch (Exception e) {
                    return "Error! Can't update this employee record now! Please try again!" + e.getMessage();
                }
            } else {
                return "The Employee does not exist!";
            }
        }
        return "You don't have privileges to do this operation! ";
    }
}
