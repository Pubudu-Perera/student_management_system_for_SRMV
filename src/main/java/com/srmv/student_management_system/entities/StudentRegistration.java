package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "student_registration")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "term_1_average")
    private BigDecimal term_1_average;

    @Column(name = "term_2_average")
    private BigDecimal term_2_average;

    @Column(name = "term_3_average")
    private BigDecimal term_3_average;

    @Column(name = "rank_1")
    private Integer rank_1;

    @Column(name = "rank_2")
    private Integer rank_2;

    @Column(name = "rank_3")
    private Integer rank_3;

    @ManyToOne
    @JoinColumn(name = "classroom_id", referencedColumnName = "id")
    private Classroom classroom_id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student_id;

    @ManyToOne
    @JoinColumn(name = "student_registration_status_id", referencedColumnName = "id")
    private StudentRegistrationStatus student_registration_status_id;

    @Column(name = "total_fees")
    private BigDecimal total_fees;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private User added_user;

    @ManyToOne
    @JoinColumn(name = "academic_year_id", referencedColumnName = "id")
    private AcademicYear academic_year_id;

    @ManyToOne
    @JoinColumn(name = "grade_id", referencedColumnName = "id")
    private Grade grade_id;

    @ManyToMany
    @JoinTable(name = "student_registration_has_subjects", joinColumns = @JoinColumn(name = "student_registration_id"), inverseJoinColumns = @JoinColumn(name = "subjects_id"))
    private Set<Subjects> subjects;

    public StudentRegistration(BigDecimal total_fees){
        this.total_fees = total_fees;
    }

}
