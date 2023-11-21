package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name = "student_registration_has_subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRegistrationHasSubjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_registration_id", referencedColumnName = "id")
    private StudentRegistration student_registration_id;

    @ManyToOne
    @JoinColumn(name = "subjects_id", referencedColumnName = "id")
    private Subjects subjects_id;

    @Column(name = "term_1_result")
    private String term_1_result;

    @Column(name = "term_2_result")
    private String term_2_result;

    @Column(name = "term_3_result")
    private String term_3_result;


}
