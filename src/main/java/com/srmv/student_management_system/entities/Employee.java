package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "employee")
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  //null values of employee object won't return to the front end
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "employee_no")
    private String employee_no;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "name_with_initials")
    private String name_with_initials;

    @Column(name = "calling_name")
    private String calling_name;

    @Column(name = "nic")
    private String nic;

    @Column(name = "birth_date")
    private LocalDate birth_date;

    @Column(name = "gender")
    private String gender;

    @Column(name = "permanent_address")
    private String permanent_address;

    @Column(name = "current_address")
    private String current_address;

    @Column(name = "mobile")
    private String mobile;

    @Column(name = "landline")
    private String landline;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "telegram")
    private String telegram;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "recruitment_date")
    private LocalDate recruitment_date;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @Column(name = "employee_status")
    private Boolean employee_status;

    @Column(name = "employee_photo")
    private Byte[] employee_photo;

    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id")
    private Designation designation_id;

    @ManyToOne
    @JoinColumn(name = "civil_status_id", referencedColumnName = "id")
    private Civil_status civil_status_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id" )
    private User added_user;



//    customized constructor for fetching data to employee table
    public Employee(Integer id, String employee_no,String name_with_initials, String calling_name, Designation designation_id, String nic, String mobile, String email){
        this.id = id;
        this.employee_no = employee_no;
        this.name_with_initials = name_with_initials;
        this.calling_name = calling_name;
        this.designation_id = designation_id;
        this.nic = nic;
        this.mobile = mobile;
        this.email = email;
    }

//   customized constructor for fetching data to employee select field in user form
    public Employee(Integer id, String calling_name){
        this.id = id;
        this.calling_name = calling_name;
    }

//    teachers list
    public Employee(Integer id, String name_with_initials,String calling_name, String nic, String mobile, Designation designation_id){
        this.id = id;
        this.name_with_initials = name_with_initials;
        this.calling_name = calling_name;
        this.nic = nic;
        this.mobile = mobile;
        this.designation_id = designation_id;
    }
}
