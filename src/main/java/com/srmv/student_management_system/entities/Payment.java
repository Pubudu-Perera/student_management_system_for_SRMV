package com.srmv.student_management_system.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "student_payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "bill_number")
    private String bill_number;

    @Column(name = "total_amount")
    private BigDecimal total_amount;

    @Column(name = "paid_amount")
    private BigDecimal paid_amount;

    @Column(name = "balance_amount")
    private BigDecimal balance_amount;

    @ManyToOne
    @JoinColumn(name = "student_registration_id", referencedColumnName = "id")
    private StudentRegistration student_registration_id;

    @ManyToOne
    @JoinColumn(name = "added_user", referencedColumnName = "id" )
    private User added_user;

    @Column(name = "added_date")
    private LocalDateTime added_date;


}
