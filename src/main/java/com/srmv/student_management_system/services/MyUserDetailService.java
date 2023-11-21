package com.srmv.student_management_system.services;

import com.srmv.student_management_system.entities.UserRole;
import com.srmv.student_management_system.entities.User;
import com.srmv.student_management_system.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MyUserDetailService implements UserDetailsService {

    @Autowired
    private UserRepository userDao;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User loggedUser = userDao.findUserByUsername(username);

        Set<GrantedAuthority> roleSet = new HashSet<>();
        for (UserRole role : loggedUser.getRoles()){
            roleSet.add(new SimpleGrantedAuthority(role.getName()));
        }

        List<GrantedAuthority> authorities = new ArrayList<>(roleSet);

        return new org.springframework.security.core.userdetails.User(loggedUser.getUsername(),loggedUser.getPassword(),loggedUser.getUser_status(),true,true,true,authorities);
    }
}
