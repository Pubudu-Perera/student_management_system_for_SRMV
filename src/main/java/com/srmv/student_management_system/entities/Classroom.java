package com.srmv.student_management_system.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "classroom")
@Data
@AllArgsConstructor
@NoArgsConstructor

//JSON null values won't be displayed
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Classroom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "grades_id", referencedColumnName = "id")
    private Grade grade_id;

    @ManyToOne
    @JoinColumn(name = "medium_id", referencedColumnName = "id")
    private Medium medium_id;

    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private Teacher teacher_id;

    @ManyToOne
    @JoinColumn(name = "academic_year_id", referencedColumnName = "id")
    private AcademicYear academic_year_id;

    @ManyToOne
    @JoinColumn(name = "classroom_status_id", referencedColumnName = "id")
    private ClassroomStatus classroom_status_id;

    @ManyToOne
    @JoinColumn(name = "class_name_id", referencedColumnName = "id")
    private ClassName class_name_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id")
    private User added_user;

    @Column(name = "classroom_name")
    private String classroom_name;

    @Column(name = "added_date")
    private LocalDateTime added_date;

    @Column(name = "last_update")
    private LocalDateTime last_update;

    @Column(name = "deleted_date")
    private LocalDateTime deleted_date;


    public Classroom(Integer id, String classroom_name, AcademicYear academic_year_id, ClassroomStatus classroom_status_id){
        this.id = id;
        this.classroom_name = classroom_name;
        this.academic_year_id = academic_year_id;
        this.classroom_status_id = classroom_status_id;

    }


    public Classroom(Integer id, String classroom_name,Grade grade_id){
        this.id = id;
        this.classroom_name = classroom_name;
        this.grade_id = grade_id;
    }

}
