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
@Entity //indicates this is an entity class
@Table(name = "guardian")  //specify which table in the database to be referenced
@Data
@AllArgsConstructor
@NoArgsConstructor

//JSON null values won't be displayed
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Guardian {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "name_with_initials")
   private String name_with_initials;

    @Column(name = "nic")
   private String nic;

    @Column(name = "date_of_birth")
   private LocalDate date_of_birth;

    @Column(name = "gender")
   private String gender;

    @Column(name = "employement_status")
   private String employement_status;

    @Column(name = "occupation")
   private String occupation;

    @Column(name = "mobile")
   private String mobile;

    @Column(name = "landline")
   private String landline;

    @Column(name = "email")
   private String email;

    @Column(name = "permanent_address")
    private String permanent_address;

    @Column(name = "current_address")
    private String current_address;

    @Column(name = "whatsapp")
    private String whatsapp;

    @Column(name = "telegram")
    private String telegram;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @ManyToOne
    @JoinColumn(name = "guardian_status_id", referencedColumnName = "id")
    private GuardianStatus guardian_status_id;

    @ManyToOne
    @JoinColumn(name = "relationship_id", referencedColumnName = "id")
    private Relationship relationship_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private User added_user;

    public Guardian(Integer id,String name_with_initials, String mobile, String permanent_address,Relationship relationship_id, GuardianStatus guardian_status_id){
        this.id = id;
        this.name_with_initials = name_with_initials;
        this.mobile = mobile;
        this.permanent_address = permanent_address;
        this.relationship_id = relationship_id;
        this.guardian_status_id = guardian_status_id;
    }

    public Guardian(Integer id, String full_name){
        this.id = id;
        this.full_name = full_name;
    }
}
