package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "teacher_has_subjects")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherHasSubjects implements Serializable {

    @Id
    @ManyToOne
    @JoinColumn(name = "teacher_id", referencedColumnName = "id")
    private Teacher teacher_id;

    @Id
    @ManyToOne
    @JoinColumn(name = "subjects_id", referencedColumnName = "id")
    private Subjects subjects_id;



}
