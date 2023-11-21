package com.srmv.student_management_system.controllers;

import com.srmv.student_management_system.entities.Payment;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.PaymentRepository;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/payment")
public class PaymentController {

    @Autowired
    PaymentRepository paymentDao;

    @Autowired
    private UserRepository userDao;

    @Autowired
    private PrivilegeController privilegeController;



    @GetMapping
    public ModelAndView paymentUI(){
        ModelAndView paymentUI = new ModelAndView();
        paymentUI.setViewName("payment.html");
        return paymentUI;
    }



    @GetMapping(value = "/list")
    public List<Payment> paymentList(){
        return paymentDao.findAll();
    }



    @PostMapping
    public String addPayment(@RequestBody Payment payment){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        User loggedUser = userDao.findUserByUsername(authentication.getName());

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Payment");

        if (userPrivileges != null && userPrivileges.get("insert")) {

            try {
                payment.setAdded_date(LocalDateTime.now());
                payment.setBill_number(paymentDao.nextBillNumber());
                payment.setAdded_user(loggedUser);
                paymentDao.save(payment);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation!";
        }
    }




    @DeleteMapping
    public String deletePayment(@RequestBody Payment payment){

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        HashMap<String,Boolean> userPrivileges = privilegeController.getPrivilegeOfUser(authentication.getName(),"Payment");

        if (userPrivileges != null && userPrivileges.get("delete")) {

            try {
                paymentDao.delete(payment);
                return "0";
            } catch (Exception e) {
                return e.getMessage();
            }
        }else {
            return "You don't have privileges to do this operation!";
        }
    }

}
