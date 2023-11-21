package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_has_subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamHasSubjects {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "end")
    private LocalDateTime end;

    @Column(name = "start")
    private LocalDateTime start;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "exam_id", referencedColumnName = "id")
    private Exam exam_id;

    @ManyToOne
    @JoinColumn(name = "subjects_id", referencedColumnName = "id")
    private Subjects subjects_id;

    @ManyToOne
    @JoinColumn(name = "paper_type_id", referencedColumnName = "id")
    private PaperType paper_type_id;
}
