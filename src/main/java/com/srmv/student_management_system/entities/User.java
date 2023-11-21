package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Data
@Table(name = "user")
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "username")
    private String username;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "photo")
    private String photo;

    @Column(name = "photo_path")
    private String photo_path;

    @Column(name = "hint")
    private String hint;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @Column(name = "user_status")
    private Boolean user_status;

    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    private Employee employee_id;

    @ManyToMany
    @JoinTable(name = "user_has_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "roles_id"))
    private Set<UserRole> roles;

    //    User constructor for filtered values we want to show in the front-end table
    //    Don't forget to add parameter order while they assign to the properties (username e-mail case)
    public User(Integer id,String username,String email, Boolean user_status, Employee employee_id ){
        this.id = id;
        this.username = username;
        this.email = email;
        this.user_status = user_status;
        this.employee_id = employee_id;
    }
}
