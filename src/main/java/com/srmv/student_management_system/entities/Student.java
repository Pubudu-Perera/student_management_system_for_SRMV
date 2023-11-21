package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "student")
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)  //null values of employee object won't return to the front end

public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "registration_no")
    private String registration_no;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "name_with_initials")
    private String name_with_initials;

    @Column(name = "calling_name")
    private String calling_name;

    @Column(name = "nic")
    private String nic;

    @Column(name = "date_of_birth")
    private LocalDate date_of_birth;

    @Column(name = "gender")
    private String gender;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "permanent_address")
    private String permanent_address;

    @Column(name = "current_address")
    private String current_address;

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @Column(name = "student_status")
    private Boolean student_status;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id" )
    private User added_user;

    @ManyToOne
    @JoinColumn(name = "race_id", referencedColumnName = "id")
    private Race race_id;

    @ManyToOne
    @JoinColumn(name = "religion_id", referencedColumnName = "id")
    private Religion religion_id;

    @ManyToOne
    @JoinColumn(name = "guardian_id", referencedColumnName = "id")
    private Guardian guardian_id;



    public Student(Integer id,String registration_no,String full_name, String gender, Guardian guardian_id, Boolean student_status){
        this.id = id;
        this.registration_no = registration_no;
        this.full_name = full_name;
        this.gender = gender;
        this.guardian_id = guardian_id;
        this.student_status = student_status;
    }

    public Student(Integer id, String registration_no, String full_name, String name_with_initials){
        this.id = id;
        this.registration_no = registration_no;
        this.full_name = full_name;
        this.name_with_initials = name_with_initials;
    }
}
