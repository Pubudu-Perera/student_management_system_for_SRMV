package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam_results")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ExamResults {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "average_mark")
    private Double average_mark;

    @Column(name = "total_mark")
    private Integer total_mark;

    @Column(name = "total_students")
    private Integer total_students;

    @ManyToOne
    @JoinColumn(name = "exam_id", referencedColumnName = "id")
    private Exam exam_id;

    @ManyToOne
    @JoinColumn(name = "classroom_id", referencedColumnName = "id")
    private Classroom classroom_id;

    @ManyToOne
    @JoinColumn(name = "subjects_id",referencedColumnName = "id")
    private Subjects subjects_id;

    @ManyToOne
    @JoinColumn(name = "exam_results_status_id",referencedColumnName = "id")
    private ExamResultsStatus exam_results_status_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private User added_user;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;

    @OneToMany(mappedBy = "exam_results_id")
    private List<ExamResultHasStudents> examResultHasStudentsList;

}
