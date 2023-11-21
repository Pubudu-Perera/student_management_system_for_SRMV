package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "event")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "event_status_id", referencedColumnName = "id")
    private EventStatus event_status_id;

    @ManyToOne
    @JoinColumn(name = "event_sub_category_id", referencedColumnName = "id")
    private EventSubCategory event_sub_category_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id" )
    private User added_user;


    public Event(Integer id, String name){
        this.id = id;
        this.name = name;
    }

}
