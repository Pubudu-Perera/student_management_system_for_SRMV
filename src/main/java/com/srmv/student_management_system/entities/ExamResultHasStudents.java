package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
@Entity
@Table(name = "student_has_exam_results")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamResultHasStudents implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "marks")
    private Integer marks;

    @Column(name = "grade")
    private String grade;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "exam_results_id", referencedColumnName = "id")
    private ExamResults exam_results_id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student_id;


}
