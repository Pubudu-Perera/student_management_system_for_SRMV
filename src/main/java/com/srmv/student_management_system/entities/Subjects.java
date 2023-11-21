package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Subjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "subject_code")
    private String subject_code;

    @ManyToOne
    @JoinColumn(name = "subject_group_id", referencedColumnName = "id")
    private SubjectGroup subject_group_id;

    public Subjects(Integer id, String name, String subject_code){
        this.id = id;
        this.name = name;
        this.subject_code = subject_code;
    }
}
