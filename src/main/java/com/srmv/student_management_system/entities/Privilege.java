package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "privilege")
@AllArgsConstructor
@NoArgsConstructor
public class Privilege {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "select_permit")
    private Boolean select_permit;

    @Column(name = "update_permit")
    private Boolean update_permit;

    @Column(name = "insert_permit")
    private Boolean insert_permit;

    @Column(name = "delete_permit")
    private Boolean delete_permit;

    @ManyToOne
    @JoinColumn(name = "roles_id", referencedColumnName = "id")
    private UserRole roles_id;

    @ManyToOne
    @JoinColumn(name = "module_id", referencedColumnName = "id")
    private Module module_id;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;
}
